import { Link, NavLink } from "react-router";
import { useTheme } from "../context/ThemeContext";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b bg-background text-foreground">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 p-4"
      >
        <Link to="/" className="text-xl font-bold">
          Applied
        </Link>

        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <NavLink to="/" className="text-sm font-medium hover:text-primary">
            Applications
          </NavLink>

          <NavLink to="/new" className="text-sm font-medium hover:text-primary">
            Add Application
          </NavLink>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {theme === "light" ? "🌙 Dark mode" : "☀️ Light mode"}
          </button>
        </div>
      </nav>
    </header>
  );
}
