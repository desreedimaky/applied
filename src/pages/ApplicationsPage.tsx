import { useState } from "react";
import { Link } from "react-router";
import { useApplications } from "../hooks/useApplications";
import type { Stage } from "../types/application";
import { countByStage, needsNudge } from "../lib/applications";

export default function ApplicationsPage() {
  const { applications, loading, error, reload } = useApplications();

  const [search, setSearch] = useState("");
  const [selectedStage, setSelectedStage] = useState<Stage | "all">("all");

  const counts = countByStage(applications);

  const filteredApplications = applications.filter((application) => {
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      application.company.toLowerCase().includes(searchTerm) ||
      application.role.toLowerCase().includes(searchTerm);

    const matchesStage =
      selectedStage === "all" || application.stage === selectedStage;

    return matchesSearch && matchesStage;
  });

  if (loading) {
    return (
      <main>
        <p role="status">Loading applications...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <p role="alert">{error}</p>
        <button onClick={() => void reload()}>Try again</button>
      </main>
    );
  }

  return (
    <main>
      <h1>My Applications</h1>
      <p>Track and manage your job applications here.</p>

      <Link to="/new">Add Application</Link>

      <section aria-label="Application totals">
        <p>Total applications: {applications.length}</p>
        <p>Wishlist: {counts.wishlist}</p>
        <p>Applied: {counts.applied}</p>
        <p>Interviews: {counts.interview}</p>
        <p>Offers: {counts.offer}</p>
        <p>Closed: {counts.closed}</p>
      </section>

      <section aria-label="Search and filter applications">
        <label htmlFor="application-search">Search by company or role</label>
        <input
          id="application-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="e.g. FNB or Developer"
        />

        <label htmlFor="stage-filter">Filter by stage</label>
        <select
          id="stage-filter"
          value={selectedStage}
          onChange={(event) =>
            setSelectedStage(event.target.value as Stage | "all")
          }
        >
          <option value="all">All stages</option>
          <option value="wishlist">Wishlist</option>
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="closed">Closed</option>
        </select>
      </section>

      <section aria-label="Job applications">
        {applications.length === 0 ? (
          <p>No applications yet. Add your first application!</p>
        ) : filteredApplications.length === 0 ? (
          <p>No applications match your search.</p>
        ) : (
          filteredApplications.map((application) => (
            <article key={application.id}>
              <h2>
                <Link to={`/applications/${application.id}`}>
                  {application.company}
                </Link>
              </h2>
              <p>{application.role}</p>
              <p>Stage: {application.stage}</p>
              <p>Date sent: {application.dateSent}</p>

              {needsNudge(application) && (
                <p role="status">
                  Follow up: this application has been waiting more than 14
                  days.
                </p>
              )}
            </article>
          ))
        )}
      </section>
    </main>
  );
}
