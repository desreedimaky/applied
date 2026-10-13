import { useParams } from "react-router";

export default function ApplicationDetailPage() {
  const { id } = useParams();

  return (
    <main>
      <h1>Application Details</h1>
      <p>Application ID: {id}</p>
    </main>
  );
}
