import { useState } from "react";

function SearchBar({ onSearch, onLocation }) {
  const [city, setCity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!city) return;
    onSearch(city);
    setCity("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md">
      <input
        type="text"
        placeholder="Enter city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="
        flex-1 p-3 rounded-lg outline-none
        backdrop-blur-lg bg-white/20 dark:bg-white/10
        border border-white/30
        text-black dark:text-white
        placeholder-gray-600 dark:placeholder-gray-300
        "
      />

      <button
        type="button"
        onClick={onLocation}
        className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
      >
        📍
      </button>

      <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
        Search
      </button>
    </form>
  );
}

export default SearchBar;