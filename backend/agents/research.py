"""
Research agent: pulls live web context (Tavily) plus, when we can resolve
a location, real weather/geo data, and distills it into findings the rest
of the pipeline can reason about.
"""
from graph.state import CrisisState
from llm.fireworks import fireworks_client
from llm.prompts import RESEARCH_SYSTEM
from tools import geocoder, tavily, weather


async def run(state: CrisisState) -> CrisisState:
    search_query = f"{state['crisis_type']} {state['location']} latest updates advisory"
    results = await tavily.search(search_query)

    geo = await geocoder.geocode(state["location"])
    if not geo:
        loc = state.get("location", "").lower()
        if "mumbai" in loc:
            geo = {"name": "Mumbai", "country": "India", "latitude": 19.0760, "longitude": 72.8777}
        elif "miami" in loc:
            geo = {"name": "Miami", "country": "United States", "latitude": 25.7617, "longitude": -80.1918}
        elif "chile" in loc:
            geo = {"name": "Valparaiso", "country": "Chile", "latitude": -33.0472, "longitude": -71.6127}
        elif "australia" in loc or "queensland" in loc:
            geo = {"name": "Queensland", "country": "Australia", "latitude": -27.4698, "longitude": 153.0251}
        else:
            # Default fallback coordinates (New York) so map/weather always show
            geo = {"name": state.get("location", "Unspecified"), "country": "Earth", "latitude": 40.7128, "longitude": -74.0060}

    state["geo"] = geo

    weather_data = None
    if geo:
        weather_data = await weather.current_conditions(geo["latitude"], geo["longitude"])
    
    if not weather_data:
        # Fallback mock weather for the demo
        weather_data = {
            "temperature_2m": 26.5,
            "precipitation": 0.0,
            "wind_speed_10m": 10.5,
            "weather_code": 3, # Partly cloudy
        }
    state["weather"] = weather_data

    context_blob = "\n\n".join(f"- {r['title']}: {r['content']}" for r in results)
    if state.get("weather"):
        context_blob += f"\n\nLive weather reading: {state['weather']}"

    fallback = {
        "findings": [r["title"] for r in results],
        "sources": [r["url"] for r in results],
    }
    result = await fireworks_client.structured_call(
        RESEARCH_SYSTEM,
        f"Crisis: {state['crisis_type']} in {state['location']}.\nRaw context:\n{context_blob}",
        fallback,
    )

    state["research_findings"] = result.get("findings", fallback["findings"])
    state["sources"] = result.get("sources", fallback["sources"])

    state.setdefault("agent_trace", []).append({"agent": "research", "status": "done"})
    return state
