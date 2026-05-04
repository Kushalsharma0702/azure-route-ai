"""
app.core.exceptions — Domain-specific exception hierarchy.

FastAPI exception handlers (in main.py) map these to HTTP responses.
This keeps business logic free of HTTP concerns.
"""

from typing import Any, Optional


class AppException(Exception):
    """Base exception for all application errors."""

    def __init__(
        self,
        message: str = "An unexpected error occurred",
        status_code: int = 500,
        detail: Optional[Any] = None,
    ):
        self.message = message
        self.status_code = status_code
        self.detail = detail
        super().__init__(message)


class NotFoundError(AppException):
    """Resource not found (404)."""

    def __init__(self, resource: str = "Resource", identifier: Any = None):
        msg = f"{resource} not found"
        if identifier:
            msg = f"{resource} with id '{identifier}' not found"
        super().__init__(message=msg, status_code=404)


class AuthenticationError(AppException):
    """Authentication failed (401)."""

    def __init__(self, message: str = "Invalid credentials"):
        super().__init__(message=message, status_code=401)


class AuthorizationError(AppException):
    """Insufficient permissions (403)."""

    def __init__(self, message: str = "Insufficient permissions"):
        super().__init__(message=message, status_code=403)


class ValidationError(AppException):
    """Business validation failure (422)."""

    def __init__(self, message: str = "Validation failed", detail: Any = None):
        super().__init__(message=message, status_code=422, detail=detail)


class ConflictError(AppException):
    """Resource already exists (409)."""

    def __init__(self, message: str = "Resource already exists"):
        super().__init__(message=message, status_code=409)


class RateLimitError(AppException):
    """Too many requests (429)."""

    def __init__(self, message: str = "Rate limit exceeded. Please try again later."):
        super().__init__(message=message, status_code=429)


class ExternalServiceError(AppException):
    """External API call failed (502)."""

    def __init__(self, service: str, message: str = "External service unavailable"):
        super().__init__(
            message=f"{service}: {message}",
            status_code=502,
            detail={"service": service},
        )


class PaymentError(AppException):
    """Payment processing error (402)."""

    def __init__(self, message: str = "Payment processing failed", detail: Any = None):
        super().__init__(message=message, status_code=402, detail=detail)
