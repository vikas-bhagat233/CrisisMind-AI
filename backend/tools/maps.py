"""
Helper for building Leaflet-friendly map payloads (used by the frontend's
CrisisMap component). No external API key required - just structures
coordinates plus simple markers (crisis center, nearest shelters mock).
"""


def build_map_payload(latitude: float, longitude: float, crisis_type: str) -> dict:
    return {
        "center": {"lat": latitude, "lng": longitude},
        "zoom": 11,
        "markers": [
            {"lat": latitude, "lng": longitude, "label": f"Reported {crisis_type} epicenter"},
        ],
    }
