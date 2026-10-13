import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <main>
      <h1>Page Not Found</h1>
      <p>Sorry, the page you're looking for doesn't exist.</p>
      <Link to="/">Back to Applications</Link>
    </main>
  );
}
