import { useState } from "react";
import { seedApplications } from "../data/applications";
import type { Stage } from "../types/application";
import { countByStage, needsNudge } from "../lib/applications";

export default function ApplicationsPage() {
  const [search, setSearch] = useState("");
  const [selectedStage, setSelectedStage] = useState<Stage | "all">("all");

  const counts = countByStage(seedApplications);

  const filteredApplications = seedApplications.filter((application) => {
    const matchesSearch =
      application.company.toLowerCase().includes(search.toLowerCase()) ||
      application.role.toLowerCase().includes(search.toLowerCase());

    const matchesStage =
      selectedStage === "all" || application.stage === selectedStage;

    return matchesSearch && matchesStage;
  });

  return (
    <main>
      <h1>My Applications</h1>
      <p>Track and manage your job applications here.</p>

      <section aria-label="Application totals">
        <p>Total applications: {seedApplications.length}</p>
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
        {filteredApplications.length === 0 ? (
          <p>No applications match your search.</p>
        ) : (
          filteredApplications.map((application) => (
            <article key={application.id}>
              <h2>{application.company}</h2>
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
