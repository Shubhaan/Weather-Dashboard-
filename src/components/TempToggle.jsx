function TempToggle({ unit, setUnit }) {
  return (
    <div className="flex gap-2 mt-4">
      <button
        onClick={() => setUnit("metric")}
        className={`px-4 py-1 rounded ${
          unit === "metric"
            ? "bg-blue-600 text-white"
            : "bg-gray-300 dark:bg-gray-700"
        }`}
      >
        °C
      </button>

      <button
        onClick={() => setUnit("imperial")}
        className={`px-4 py-1 rounded ${
          unit === "imperial"
            ? "bg-blue-600 text-white"
            : "bg-gray-300 dark:bg-gray-700"
        }`}
      >
        °F
      </button>
    </div>
  );
}

export default TempToggle;