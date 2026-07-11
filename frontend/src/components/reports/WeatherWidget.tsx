import React from "react";

interface WeatherData {
  temperature_2m: number;
  precipitation: number;
  wind_speed_10m: number;
  weather_code: number;
  time?: string;
}

const getWeatherDescription = (code: number) => {
  if (code === 0) return { label: "Clear sky", icon: "☀️" };
  if (code >= 1 && code <= 3) return { label: "Partly cloudy", icon: "🌤️" };
  if (code >= 45 && code <= 48) return { label: "Foggy", icon: "🌫️" };
  if (code >= 51 && code <= 55) return { label: "Drizzle", icon: "🌧️" };
  if (code >= 61 && code <= 65) return { label: "Rainy", icon: "🌧️" };
  if (code >= 71 && code <= 77) return { label: "Snowy", icon: "❄️" };
  if (code >= 80 && code <= 82) return { label: "Rain showers", icon: "🌦️" };
  if (code >= 95 && code <= 99) return { label: "Thunderstorm", icon: "⛈️" };
  return { label: "Unknown weather", icon: "🌡️" };
};

export default function WeatherWidget({ weather }: { weather: WeatherData }) {
  const { label, icon } = getWeatherDescription(weather.weather_code);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex items-center gap-3">
        <div className="text-3xl p-2 bg-base-900 rounded-lg border border-base-600 flex items-center justify-center w-12 h-12">
          {icon}
        </div>
        <div>
          <p className="text-xs text-ink-muted">Conditions</p>
          <p className="text-sm font-semibold text-ink">{label}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-xl font-bold p-2 bg-base-900 rounded-lg border border-base-600 flex items-center justify-center w-12 h-12 text-ink">
          {weather.temperature_2m}°C
        </div>
        <div>
          <p className="text-xs text-ink-muted">Temperature</p>
          <p className="text-sm font-semibold text-ink">Current Reading</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-2xl p-2 bg-base-900 rounded-lg border border-base-600 flex items-center justify-center w-12 h-12">
          💨
        </div>
        <div>
          <p className="text-xs text-ink-muted">Wind Speed</p>
          <p className="text-sm font-semibold text-ink">{weather.wind_speed_10m} km/h</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-2xl p-2 bg-base-900 rounded-lg border border-base-600 flex items-center justify-center w-12 h-12">
          💧
        </div>
        <div>
          <p className="text-xs text-ink-muted">Precipitation</p>
          <p className="text-sm font-semibold text-ink">{weather.precipitation} mm</p>
        </div>
      </div>
    </div>
  );
}
