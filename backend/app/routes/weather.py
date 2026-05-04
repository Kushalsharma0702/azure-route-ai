"""
app.routes.weather — Weather alerts & travel predictions.

Uses Open-Meteo (free, no API key needed) to fetch weather
and generates smart travel recommendations.
"""
from fastapi import APIRouter, Query
import httpx
import logging

router = APIRouter(prefix="/api/v1/weather", tags=["weather"])
logger = logging.getLogger(__name__)

# Indian city coordinates (expandable)
CITY_COORDS = {
    "meghalaya": (25.47, 91.87), "shillong": (25.57, 91.88), "cherrapunji": (25.30, 91.70),
    "goa": (15.49, 73.82), "panaji": (15.49, 73.82), "mumbai": (19.07, 72.87),
    "delhi": (28.61, 77.20), "new delhi": (28.61, 77.20), "jaipur": (26.91, 75.78),
    "udaipur": (24.58, 73.68), "jodhpur": (26.29, 73.01), "varanasi": (25.32, 83.01),
    "rishikesh": (30.08, 78.27), "manali": (32.24, 77.19), "shimla": (31.10, 77.17),
    "leh": (34.16, 77.58), "ladakh": (34.16, 77.58), "srinagar": (34.08, 74.79),
    "kashmir": (34.08, 74.79), "darjeeling": (27.03, 88.26), "gangtok": (27.33, 88.62),
    "sikkim": (27.33, 88.62), "ooty": (11.41, 76.69), "munnar": (10.08, 77.06),
    "kerala": (10.85, 76.27), "kochi": (9.93, 76.26), "alleppey": (9.49, 76.33),
    "coorg": (12.42, 75.74), "mysore": (12.29, 76.63), "bangalore": (12.97, 77.59),
    "chennai": (13.08, 80.27), "hyderabad": (17.38, 78.48), "kolkata": (22.57, 88.36),
    "agra": (27.17, 78.01), "lucknow": (26.84, 80.94), "amritsar": (31.63, 74.87),
    "chandigarh": (30.73, 76.77), "dehradun": (30.31, 78.03), "haridwar": (29.95, 78.16),
    "mathura": (27.49, 77.67), "vrindavan": (27.58, 77.70), "pune": (18.52, 73.85),
    "andaman": (11.67, 92.73), "port blair": (11.67, 92.73),
    "rajasthan": (26.91, 75.78), "uttarakhand": (30.08, 78.27),
}


def _get_travel_alerts(temp: float, rain_prob: int, wind: float, destination: str) -> list:
    """Generate smart travel alerts based on weather data."""
    alerts = []
    dest_lower = destination.lower()

    # Rain alerts
    if rain_prob > 60:
        alerts.append({
            "type": "warning", "icon": "🌧️",
            "title": "Heavy Rain Expected",
            "message": f"There's a {rain_prob}% chance of rain in {destination}. Pack a raincoat, waterproof bags, and an umbrella. Avoid trekking on slippery trails."
        })
    elif rain_prob > 30:
        alerts.append({
            "type": "info", "icon": "🌦️",
            "title": "Light Showers Possible",
            "message": f"About {rain_prob}% rain probability. Carry a light rain jacket just in case."
        })

    # Temperature alerts
    if temp > 38:
        alerts.append({
            "type": "warning", "icon": "🔥",
            "title": "Extreme Heat Alert",
            "message": f"Temperature is around {temp}°C. Stay hydrated, wear sunscreen (SPF 50+), light cotton clothes, and avoid outdoor activities between 12-3 PM."
        })
    elif temp > 32:
        alerts.append({
            "type": "info", "icon": "☀️",
            "title": "Hot Weather",
            "message": f"Expect {temp}°C. Carry sunglasses, a hat, and stay hydrated. Morning and evening are best for sightseeing."
        })
    elif temp < 5:
        alerts.append({
            "type": "warning", "icon": "❄️",
            "title": "Freezing Conditions",
            "message": f"Temperature is {temp}°C! Pack heavy woolens, thermals, gloves, and snow boots. Roads may be icy."
        })
    elif temp < 15:
        alerts.append({
            "type": "info", "icon": "🧥",
            "title": "Cold Weather",
            "message": f"Temperature around {temp}°C. Pack warm layers, a jacket, and warm socks."
        })

    # Wind alerts
    if wind > 40:
        alerts.append({
            "type": "warning", "icon": "💨",
            "title": "Strong Winds",
            "message": f"Wind speed around {wind} km/h. Secure loose belongings and be cautious near cliff edges."
        })

    # Destination-specific tips
    hill_stations = ["manali", "shimla", "leh", "ladakh", "darjeeling", "gangtok", "ooty", "munnar", "coorg", "srinagar"]
    beach_destinations = ["goa", "andaman", "kerala", "kochi", "alleppey", "port blair"]
    monsoon_hotspots = ["meghalaya", "shillong", "cherrapunji"]

    if any(h in dest_lower for h in hill_stations):
        alerts.append({
            "type": "tip", "icon": "⛰️",
            "title": "Hill Station Advisory",
            "message": "Carry altitude sickness medicine, warm layers for evenings, and comfortable trekking shoes. Roads may have sharp turns."
        })
    if any(b in dest_lower for b in beach_destinations):
        alerts.append({
            "type": "tip", "icon": "🏖️",
            "title": "Beach Destination Tip",
            "message": "Pack swimwear, reef-safe sunscreen, mosquito repellent, and light breathable clothes. Check tide timings before swimming."
        })
    if any(m in dest_lower for m in monsoon_hotspots):
        alerts.append({
            "type": "tip", "icon": "🌿",
            "title": "Monsoon Capital Alert",
            "message": f"{destination} is one of the wettest places on Earth! Waterproof everything — shoes, bags, electronics. Leeches are common on trails."
        })

    # Always add a general tip
    alerts.append({
        "type": "tip", "icon": "💡",
        "title": "General Travel Tip",
        "message": "Keep digital copies of your ID, hotel booking, and tickets. Download offline maps for areas with poor connectivity."
    })

    return alerts


@router.get("/alerts")
async def get_weather_alerts(destination: str = Query(..., description="Destination city or region")):
    """Get weather data and smart travel alerts for a destination."""
    dest_lower = destination.lower().strip()

    # Find coordinates
    lat, lon = None, None
    for key, coords in CITY_COORDS.items():
        if key in dest_lower or dest_lower in key:
            lat, lon = coords
            break

    if not lat:
        # Default fallback: try to use first word
        return {
            "destination": destination,
            "weather": None,
            "alerts": _get_travel_alerts(30, 20, 10, destination),
            "source": "general"
        }

    # Fetch from Open-Meteo (free, no API key needed)
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            url = (
                f"https://api.open-meteo.com/v1/forecast?"
                f"latitude={lat}&longitude={lon}"
                f"&current=temperature_2m,wind_speed_10m,relative_humidity_2m"
                f"&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max"
                f"&timezone=Asia/Kolkata&forecast_days=3"
            )
            resp = await client.get(url)
            data = resp.json()

        current = data.get("current", {})
        daily = data.get("daily", {})

        temp = current.get("temperature_2m", 30)
        wind = current.get("wind_speed_10m", 10)
        humidity = current.get("relative_humidity_2m", 50)
        rain_probs = daily.get("precipitation_probability_max", [0])
        max_rain = max(rain_probs) if rain_probs else 0
        temp_max_list = daily.get("temperature_2m_max", [temp])
        temp_min_list = daily.get("temperature_2m_min", [temp])

        weather = {
            "temperature": temp,
            "wind_speed": wind,
            "humidity": humidity,
            "rain_probability": max_rain,
            "forecast_high": max(temp_max_list) if temp_max_list else temp,
            "forecast_low": min(temp_min_list) if temp_min_list else temp,
        }

        alerts = _get_travel_alerts(temp, max_rain, wind, destination)

        return {
            "destination": destination,
            "weather": weather,
            "alerts": alerts,
            "source": "open-meteo"
        }

    except Exception as e:
        logger.error("Weather API error: %s", str(e))
        return {
            "destination": destination,
            "weather": None,
            "alerts": _get_travel_alerts(30, 20, 10, destination),
            "source": "fallback"
        }
