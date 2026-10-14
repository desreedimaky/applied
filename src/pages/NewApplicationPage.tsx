import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useApplications } from "../hooks/useApplications";
import type { Stage } from "../types/application";

export default function NewApplicationPage() {
  const navigate = useNavigate();
  const { addApplication, saving, error } = useApplications();

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [link, setLink] = useState("");
  const [dateSent, setDateSent] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [stage, setStage] = useState<Stage>("wishlist");
  const [notes, setNotes] = useState("");
  const [validationError, setValidationError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError("");

    if (company.trim().length < 2) {
      setValidationError("Company name must contain at least 2 characters.");
      return;
    }

    if (role.trim().length < 2) {
      setValidationError("Job title must contain at least 2 characters.");
      return;
    }

    if (dateSent > new Date().toISOString().slice(0, 10)) {
      setValidationError("Date sent cannot be in the future.");
      return;
    }

    if (link.trim()) {
      try {
        const parsedLink = new URL(link);
        if (!["http:", "https:"].includes(parsedLink.protocol)) {
          throw new Error("Invalid URL");
        }
      } catch {
        setValidationError(
          "Please enter a valid URL starting with https:// or http://.",
        );
        return;
      }
    }

    const application = {
      id: crypto.randomUUID(),
      company: company.trim(),
      role: role.trim(),
      ...(link.trim() ? { link: link.trim() } : {}),
      dateSent,
      stage,
      ...(notes.trim() ? { notes: notes.trim() } : {}),
      createdAt: new Date().toISOString(),
    };

    await addApplication(application);
    navigate("/");
  }

  return (
    <main>
      <h1>Add Application</h1>
      <p>Enter the details of the job you want to track.</p>

      {validationError && <p role="alert">{validationError}</p>}
      {error && <p role="alert">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="company">Company name *</label>
          <input
            id="company"
            name="company"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="role">Job title *</label>
          <input
            id="role"
            name="role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="link">Job posting URL</label>
          <input
            id="link"
            name="link"
            type="url"
            value={link}
            onChange={(event) => setLink(event.target.value)}
            placeholder="https://example.com/job"
          />
        </div>

        <div>
          <label htmlFor="dateSent">Date applied *</label>
          <input
            id="dateSent"
            name="dateSent"
            type="date"
            value={dateSent}
            onChange={(event) => setDateSent(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="stage">Application stage *</label>
          <select
            id="stage"
            name="stage"
            value={stage}
            onChange={(event) => setStage(event.target.value as Stage)}
          >
            <option value="wishlist">Wishlist</option>
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div>
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={4}
          />
        </div>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Application"}
        </button>

        <Link to="/">Cancel</Link>
      </form>
    </main>
  );
}
