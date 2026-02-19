import { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import Forecast from "./components/Forecast";
import DarkModeToggle from "./components/DarkModeToggle";
import TempToggle from "./components/TempToggle";

export default function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [city, setCity] = useState("");
  const [unit, setUnit] = useState("metric");
  const [dark, setDark] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastCity, setLastCity] = useState(localStorage.getItem("lastCity") || "");
  const [bgClass, setBgClass] = useState("bg-clear");

  /* ⭐ WEATHER → BACKGROUND */
  const getBackground = (condition) => {
    switch (condition) {
      case "Clear":
        return "bg-clear";
      case "Clouds":
        return "bg-clouds";
      case "Rain":
      case "Drizzle":
        return "bg-rain";
      case "Snow":
        return "bg-snow";
      case "Thunderstorm":
        return "bg-thunder";
      case "Mist":
      case "Fog":
      case "Haze":
        return "bg-mist";
      default:
        return "bg-clear";
    }
  };

  /* ⭐ SEARCH WEATHER */
  const fetchWeather = async (cityName) => {
    try {
      setLoading(true);
      setError("");

      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${import.meta.env.VITE_API_KEY}&units=${unit}`
      );

      setWeather(weatherRes.data);
      setBgClass(getBackground(weatherRes.data.weather[0].main));

      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${import.meta.env.VITE_API_KEY}&units=${unit}`
      );

      setForecast(forecastRes.data);

      localStorage.setItem("lastCity", cityName);
      setLastCity(cityName);
    } catch (err) {
      setError("City not found or forecast unavailable");
    } finally {
      setLoading(false);
    }
  };

  /* ⭐ AUTO LOAD LAST CITY */
  useEffect(() => {
    if (lastCity) fetchWeather(lastCity);
  }, [unit]);

  return (
    <div
      className={`min-h-screen flex flex-col items-center text-white transition-all duration-500 ${bgClass} ${
        dark ? "dark" : ""
      }`}
    >
      <div className="w-full max-w-3xl p-6">
        <DarkModeToggle dark={dark} setDark={setDark} />

        <h1 className="text-4xl font-bold text-center mb-2">
          Weather Dashboard 🌦
        </h1>

        {lastCity && (
          <p className="text-center opacity-70 mb-4">
            Last searched: {lastCity}
          </p>
        )}

        <SearchBar
          city={city}
          setCity={setCity}
          fetchWeather={fetchWeather}
        />

        <TempToggle unit={unit} setUnit={setUnit} />

        {loading && (
          <div className="flex justify-center mt-6">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}

        {error && <p className="text-center text-red-500 mt-4">{error}</p>}

        {weather && <CurrentWeather weather={weather} unit={unit} />}

        {forecast && <Forecast forecast={forecast} unit={unit} />}
      </div>
    </div>
  );
}