import { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "./components/SearchBar";
import DarkModeToggle from "./components/DarkModeToggle";
import Forecast from "./components/Forecast";
import TempToggle from "./components/TempToggle";

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState("metric");
  const [lastCity, setLastCity] = useState("");
  const [bgClass, setBgClass] = useState("");

  // ⭐ DEBUG LINE (temporary)
  console.log("ENV KEY:", import.meta.env.VITE_API_KEY);

  const getBackground = (condition) => {
    if (!condition) return "from-blue-300 via-sky-200 to-white";

    condition = condition.toLowerCase();

    if (condition.includes("clear"))
      return "from-yellow-300 via-orange-200 to-blue-200";
    if (condition.includes("rain"))
      return "from-blue-700 via-blue-500 to-gray-400";
    if (condition.includes("cloud"))
      return "from-gray-400 via-gray-300 to-blue-200";
    if (condition.includes("snow"))
      return "from-blue-200 via-white to-gray-200";
    if (condition.includes("thunder"))
      return "from-gray-900 via-gray-700 to-gray-500";

    return "from-blue-300 via-sky-200 to-white";
  };

  const fetchWeatherByCity = async (cityName) => {
    try {
      setError("");
      setWeather(null);
      setForecast([]);
      setLoading(true);

      localStorage.setItem("lastCity", cityName);
      setLastCity(cityName);

      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${import.meta.env.VITE_API_KEY}&units=${unit}`
      );

      setWeather(weatherResponse.data);
      setBgClass(getBackground(weatherResponse.data.weather[0].main));

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${import.meta.env.VITE_API_KEY}&units=${unit}`
      );

      const dailyData = forecastResponse.data.list.filter(
        (item, index) => index % 8 === 0
      );

      setForecast(dailyData);
    } catch (err) {
      console.error("API ERROR:", err);
      setError("City not found or forecast unavailable");
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      setError("");
      setLoading(true);

      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_API_KEY}&units=${unit}`
      );

      setWeather(weatherResponse.data);
      setLastCity(weatherResponse.data.name);
      setBgClass(getBackground(weatherResponse.data.weather[0].main));

      localStorage.setItem("lastCity", weatherResponse.data.name);

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_API_KEY}&units=${unit}`
      );

      const dailyData = forecastResponse.data.list.filter(
        (item, index) => index % 8 === 0
      );

      setForecast(dailyData);
    } catch (err) {
      console.error("LOCATION API ERROR:", err);
      setError("Location weather unavailable");
    } finally {
      setLoading(false);
    }
  };

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) =>
        fetchWeatherByCoords(
          position.coords.latitude,
          position.coords.longitude
        ),
      () => setError("Location permission denied")
    );
  };

  useEffect(() => {
    const savedCity = localStorage.getItem("lastCity");
    if (savedCity) {
      setLastCity(savedCity);
      fetchWeatherByCity(savedCity);
    } else {
      fetchWeatherByCity("Mumbai");
    }
  }, [unit]);

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${bgClass} dark:from-gray-900 dark:via-gray-800 dark:to-black text-black dark:text-white flex flex-col items-center p-10 gap-6 relative transition-all duration-700`}
    >
      <DarkModeToggle />

      <h1 className="text-4xl font-bold">Weather Dashboard 🌦</h1>

      {lastCity && (
        <p className="text-sm opacity-70">
          Last searched: <span className="font-semibold">{lastCity}</span>
        </p>
      )}

      <SearchBar
        onSearch={fetchWeatherByCity}
        onLocation={handleLocationClick}
      />

      <TempToggle unit={unit} setUnit={setUnit} />

      {loading && (
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mt-6"></div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {weather && !loading && (
        <div className="backdrop-blur-lg bg-white/20 dark:bg-white/10 border border-white/30 shadow-xl p-8 rounded-2xl text-center w-80 mt-6">
          <h2 className="text-2xl font-bold">{weather.name}</h2>

          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather icon"
            className="mx-auto"
          />

          <p className="text-4xl font-bold">
            {weather.main.temp}°{unit === "metric" ? "C" : "F"}
          </p>

          <p className="capitalize opacity-80">
            {weather.weather[0].description}
          </p>

          <p className="mt-2 text-sm">
            💧 Humidity: {weather.main.humidity}%
          </p>
        </div>
      )}

      {forecast.length > 0 && <Forecast data={forecast} unit={unit} />}
    </div>
  );
}

export default App;