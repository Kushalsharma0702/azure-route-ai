"""
app.ai.llm_adapter — Multi-provider LLM client with circuit breaker.

Supports OpenAI, Mistral, and Anthropic with a unified interface.
Each provider is wrapped in its own async method so failures in one
provider don't affect others.

The adapter implements:
1. Provider selection (primary → fallback chain)
2. Circuit breaker pattern (skip providers that are consistently failing)
3. Rate tracking per provider
4. Structured response format

Design decision: Sync SDK calls are wrapped in asyncio.to_thread()
to avoid blocking the event loop. This is simpler and more reliable
than using unstable async SDK versions.
"""

import asyncio
import logging
import os
import time
from typing import Optional, Dict, Any, List
from dataclasses import dataclass, field

from app.core import settings

logger = logging.getLogger("llm_adapter")


@dataclass
class LLMResponse:
    """Unified response from any LLM provider."""
    text: str
    provider: str
    model: str
    tokens_used: Optional[int] = None
    latency_ms: Optional[float] = None
    error: Optional[str] = None

    @property
    def is_error(self) -> bool:
        return self.error is not None

    def to_dict(self) -> dict:
        return {
            "text": self.text,
            "provider": self.provider,
            "model": self.model,
            "tokens_used": self.tokens_used,
            "latency_ms": self.latency_ms,
            "error": self.error,
        }


@dataclass
class CircuitState:
    """Tracks failures per provider for circuit breaker logic."""
    failure_count: int = 0
    last_failure: float = 0.0
    is_open: bool = False
    cooldown_seconds: float = 60.0  # Wait this long before retrying a failed provider

    def record_failure(self):
        self.failure_count += 1
        self.last_failure = time.time()
        if self.failure_count >= 3:
            self.is_open = True
            logger.warning("Circuit breaker OPEN (failures=%d)", self.failure_count)

    def record_success(self):
        self.failure_count = 0
        self.is_open = False

    @property
    def should_skip(self) -> bool:
        if not self.is_open:
            return False
        # Allow retry after cooldown
        if time.time() - self.last_failure > self.cooldown_seconds:
            return False
        return True


class LLMAdapter:
    """
    Multi-provider LLM adapter with fallback chain.

    Provider priority: primary → secondary → tertiary
    If the primary provider fails 3 times, the circuit breaker opens
    and requests are routed to the next provider automatically.
    """

    # Circuit breaker state per provider
    _circuits: Dict[str, CircuitState] = {}

    # Provider priority order
    PROVIDER_ORDER = ["mistral", "openai", "anthropic"]

    @classmethod
    def _get_circuit(cls, provider: str) -> CircuitState:
        if provider not in cls._circuits:
            cls._circuits[provider] = CircuitState()
        return cls._circuits[provider]

    @classmethod
    async def call(
        cls,
        prompt: str,
        system_prompt: Optional[str] = None,
        provider: Optional[str] = None,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
    ) -> LLMResponse:
        """
        Call an LLM provider with automatic fallback.

        If no provider is specified, uses the configured primary provider
        and falls back to alternatives on failure.
        """
        temp = temperature or settings.LLM_TEMPERATURE
        tokens = max_tokens or settings.LLM_MAX_TOKENS
        sys_prompt = system_prompt or (
            "You are a helpful, concise travel assistant. "
            "Reply naturally and adapt tone to the user's input."
        )

        # Build provider order: specified provider first, then fallbacks
        if provider:
            providers = [provider] + [p for p in cls.PROVIDER_ORDER if p != provider]
        else:
            primary = settings.LLM_PRIMARY_PROVIDER
            providers = [primary] + [p for p in cls.PROVIDER_ORDER if p != primary]

        last_error = None
        for prov in providers:
            circuit = cls._get_circuit(prov)
            if circuit.should_skip:
                logger.info("Skipping provider=%s (circuit breaker open)", prov)
                continue

            start = time.time()
            try:
                result = await cls._call_provider(
                    prov, prompt, sys_prompt, temp, tokens,
                )
                latency = (time.time() - start) * 1000

                if result.is_error:
                    circuit.record_failure()
                    last_error = result.error
                    logger.warning("Provider %s error: %s", prov, result.error)
                    continue

                circuit.record_success()
                result.latency_ms = round(latency, 1)
                logger.info(
                    "LLM call success: provider=%s model=%s latency=%.0fms",
                    result.provider, result.model, latency,
                )
                return result

            except Exception as e:
                circuit.record_failure()
                last_error = str(e)
                logger.exception("Provider %s failed", prov)
                continue

        # All providers failed
        return LLMResponse(
            text="",
            provider="none",
            model="none",
            error=f"All LLM providers failed. Last error: {last_error}",
        )

    @classmethod
    async def _call_provider(
        cls,
        provider: str,
        prompt: str,
        system_prompt: str,
        temperature: float,
        max_tokens: int,
    ) -> LLMResponse:
        """Dispatch to the correct provider-specific method."""
        handlers = {
            "mistral": cls._call_mistral,
            "openai": cls._call_openai,
            "anthropic": cls._call_anthropic,
        }
        handler = handlers.get(provider)
        if not handler:
            return LLMResponse(text="", provider=provider, model="unknown", error=f"Unknown provider: {provider}")
        return await handler(prompt, system_prompt, temperature, max_tokens)

    @classmethod
    async def _call_mistral(
        cls, prompt: str, system_prompt: str, temperature: float, max_tokens: int,
    ) -> LLMResponse:
        """Call Mistral AI API."""
        api_key = settings.MISTRAL_API_KEY
        if not api_key:
            return LLMResponse(text="", provider="mistral", model="", error="MISTRAL_API_KEY not set")

        try:
            from mistralai import Mistral
        except ImportError:
            return LLMResponse(text="", provider="mistral", model="", error="mistralai package not installed")

        model = settings.MISTRAL_MODEL
        client = Mistral(api_key=api_key)

        def _sync_call():
            return client.chat.complete(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt},
                ],
                temperature=temperature,
                max_tokens=max_tokens,
            )

        response = await asyncio.to_thread(_sync_call)
        content = ""
        tokens = None

        if hasattr(response, "choices") and response.choices:
            content = response.choices[0].message.content or ""
        if hasattr(response, "usage") and response.usage:
            tokens = getattr(response.usage, "total_tokens", None)

        return LLMResponse(text=content, provider="mistral", model=model, tokens_used=tokens)

    @classmethod
    async def _call_openai(
        cls, prompt: str, system_prompt: str, temperature: float, max_tokens: int,
    ) -> LLMResponse:
        """Call OpenAI API."""
        api_key = settings.OPENAI_API_KEY
        if not api_key:
            return LLMResponse(text="", provider="openai", model="", error="OPENAI_API_KEY not set")

        try:
            from openai import OpenAI
        except ImportError:
            return LLMResponse(text="", provider="openai", model="", error="openai package not installed")

        model = settings.OPENAI_MODEL
        client = OpenAI(api_key=api_key)

        def _sync_call():
            return client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt},
                ],
                temperature=temperature,
                max_tokens=max_tokens,
            )

        response = await asyncio.to_thread(_sync_call)
        content = response.choices[0].message.content or "" if response.choices else ""
        tokens = getattr(response.usage, "total_tokens", None) if response.usage else None

        return LLMResponse(text=content, provider="openai", model=model, tokens_used=tokens)

    @classmethod
    async def _call_anthropic(
        cls, prompt: str, system_prompt: str, temperature: float, max_tokens: int,
    ) -> LLMResponse:
        """Call Anthropic Claude API."""
        api_key = settings.ANTHROPIC_API_KEY
        if not api_key:
            return LLMResponse(text="", provider="anthropic", model="", error="ANTHROPIC_API_KEY not set")

        try:
            from anthropic import Anthropic
        except ImportError:
            return LLMResponse(text="", provider="anthropic", model="", error="anthropic package not installed")

        model = settings.ANTHROPIC_MODEL
        client = Anthropic(api_key=api_key)

        def _sync_call():
            return client.messages.create(
                model=model,
                system=system_prompt,
                messages=[{"role": "user", "content": prompt}],
                temperature=temperature,
                max_tokens=max_tokens,
            )

        response = await asyncio.to_thread(_sync_call)
        content = ""
        tokens = None

        if hasattr(response, "content") and response.content:
            content = response.content[0].text if response.content else ""
        if hasattr(response, "usage"):
            tokens = getattr(response.usage, "input_tokens", 0) + getattr(response.usage, "output_tokens", 0)

        return LLMResponse(text=content, provider="anthropic", model=model, tokens_used=tokens)
