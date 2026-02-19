function Forecast({ data, unit }) {
  const getDay = (date) =>
    new Date(date).toLocaleDateString("en-US", { weekday: "short" });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 w-full max-w-3xl">
      {data.slice(0, 7).map((day, index) => (
        <div
          key={index}
          className="
          backdrop-blur-lg bg-white/20 dark:bg-white/10
          border border-white/30
          p-4 rounded-xl shadow text-center
          "
        >
          <p className="font-semibold text-sm">{getDay(day.dt_txt)}</p>

          <img
            src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
            alt="icon"
            className="mx-auto"
          />

          <p className="font-bold text-lg">
            {Math.round(day.main.temp)}°{unit === "metric" ? "C" : "F"}
          </p>

          <p className="text-xs opacity-80 capitalize">
            {day.weather[0].description}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Forecast;