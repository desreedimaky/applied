import { Link, NavLink } from "react-router";

export default function Header() {
  return (
    <header>
      <nav aria-label="Main navigation">
        <Link to="/">Applied</Link>

        <NavLink to="/">Applications</NavLink>

        <NavLink to="/new">Add Application</NavLink>
      </nav>
    </header>
  );
}
