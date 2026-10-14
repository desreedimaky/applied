import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { getApplicationById } from "../api/applications";
import { useApplications } from "../hooks/useApplications";
import type { Application, Stage } from "../types/application";
import { updateApplication } from "../api/applications";

export default function ApplicationDetailPage() {
  const { id } = useParams();

  const navigate = useNavigate();
  const { removeApplication, saving, error: deleteError } = useApplications();

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editStage, setEditStage] = useState<Stage>("wishlist");
  const [editNotes, setEditNotes] = useState("");
  const [updateError, setUpdateError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadApplication() {
      setLoading(true);
      setError(null);

      try {
        if (!id) {
          throw new Error("Application ID is missing.");
        }

        const result = await getApplicationById(id);

        if (!cancelled) {
          setApplication(result ?? null);
        }
      } catch {
        if (!cancelled) {
          setError("Could not load this application. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadApplication();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main>
        <p role="status">Loading application...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <p role="alert">{error}</p>
        <Link to="/">Back to Applications</Link>
      </main>
    );
  }

  if (!application) {
    return (
      <main>
        <h1>Application Not Found</h1>
        <p>
          This application may have been removed or the link may be incorrect.
        </p>
        <Link to="/">Back to Applications</Link>
      </main>
    );
  }

  return (
    <main>
      <h1>{application.company}</h1>
      <h2>{application.role}</h2>

      <p>Stage: {application.stage}</p>
      <p>Date sent: {application.dateSent}</p>

      {application.link && (
        <p>
          Job link:{" "}
          <a href={application.link} target="_blank" rel="noreferrer">
            View job posting
          </a>
        </p>
      )}

      {application.notes && (
        <section>
          <h3>Notes</h3>
          <p>{application.notes}</p>
        </section>
      )}

      {deleteError && <p role="alert">{deleteError}</p>}

      <button
        type="button"
        disabled={saving}
        onClick={async () => {
          if (
            id &&
            window.confirm("Are you sure you want to delete this application?")
          ) {
            await removeApplication(id);
            navigate("/");
          }
        }}
      >
        {saving ? "Deleting..." : "Delete Application"}
      </button>

      <section aria-label="Edit application">
        {!editing ? (
          <button
            type="button"
            onClick={() => {
              setEditStage(application.stage);
              setEditNotes(application.notes ?? "");
              setUpdateError("");
              setEditing(true);
            }}
          >
            Edit Application
          </button>
        ) : (
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              setUpdateError("");

              try {
                const updatedApplication = {
                  ...application,
                  stage: editStage,
                  notes: editNotes.trim(),
                };

                await updateApplication(updatedApplication);
                setApplication(updatedApplication);
                setEditing(false);
              } catch {
                setUpdateError("Could not update the application.");
              }
            }}
          >
            <div>
              <label htmlFor="edit-stage">Application stage</label>
              <select
                id="edit-stage"
                value={editStage}
                onChange={(event) => setEditStage(event.target.value as Stage)}
              >
                <option value="wishlist">Wishlist</option>
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label htmlFor="edit-notes">Notes</label>
              <textarea
                id="edit-notes"
                value={editNotes}
                onChange={(event) => setEditNotes(event.target.value)}
                rows={4}
              />
            </div>

            {updateError && <p role="alert">{updateError}</p>}

            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </form>
        )}
      </section>

      <Link to="/">Back to Applications</Link>
    </main>
  );
}
