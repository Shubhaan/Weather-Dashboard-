import { useEffect, useState } from "react";

function DarkModeToggle() {
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="absolute top-6 right-6 px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 transition"
    >
      {dark ? "☀ Light" : "🌙 Dark"}
    </button>
  );
}

export default DarkModeToggle;