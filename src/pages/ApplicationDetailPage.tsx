import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { getApplicationById, updateApplication } from "../api/applications";
import { useApplications } from "../hooks/useApplications";
import type { Application, Stage } from "../types/application";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";

const stages: { value: Stage; label: string }[] = [
  { value: "wishlist", label: "Wishlist" },
  { value: "applied", label: "Applied" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "closed", label: "Closed" },
];

function stageStyle(stage: Stage) {
  const styles: Record<Stage, string> = {
    wishlist:
      "border-slate-300 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
    applied:
      "border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200",
    interview:
      "border-violet-200 bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-200",
    offer:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200",
    closed:
      "border-rose-200 bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-200",
  };

  return styles[stage];
}

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
  const [updating, setUpdating] = useState(false);

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
      <main className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
        <p role="status" className="text-muted-foreground">
          Loading application...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-4xl space-y-4 p-4 sm:p-6 lg:p-8">
        <p role="alert" className="text-destructive">
          {error}
        </p>
        <Button asChild variant="outline">
          <Link to="/">Back to Applications</Link>
        </Button>
      </main>
    );
  }

  if (!application) {
    return (
      <main className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
        <Card>
          <CardContent className="space-y-3 py-10 text-center">
            <h1 className="text-2xl font-bold">Application Not Found</h1>
            <p className="text-muted-foreground">
              This application may have been removed or the link may be
              incorrect.
            </p>
            <Button asChild className="mt-2">
              <Link to="/">Back to Applications</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 p-4 sm:p-6 lg:p-8">
      <Button asChild variant="ghost" className="-ml-3">
        <Link to="/">← Back to Applications</Link>
      </Button>

      <section className="space-y-2">
        <p className="text-sm font-medium text-primary">APPLICATION DETAILS</p>
        <h1 className="break-words text-3xl font-bold tracking-tight sm:text-4xl">
          {application.company}
        </h1>
        <p className="break-words text-lg text-muted-foreground">
          {application.role}
        </p>
      </section>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Application information</CardTitle>
            <Badge variant="outline" className={stageStyle(application.stage)}>
              {application.stage.charAt(0).toUpperCase() +
                application.stage.slice(1)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Company</p>
              <p className="break-words font-medium">{application.company}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="break-words font-medium">{application.role}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Date sent</p>
              <p className="font-medium">{application.dateSent}</p>
            </div>

            {application.link && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Job posting</p>
                <a
                  href={application.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all font-medium text-primary underline underline-offset-4"
                >
                  View job posting ↗
                </a>
              </div>
            )}
          </div>

          {application.notes && (
            <div className="space-y-2 border-t pt-4">
              <h2 className="font-semibold">Notes</h2>
              <p className="whitespace-pre-wrap break-words text-sm text-muted-foreground">
                {application.notes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {deleteError && (
        <p role="alert" className="text-sm text-destructive">
          {deleteError}
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Manage application</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          {!editing ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                className="w-full sm:w-auto"
                onClick={() => {
                  setEditStage(application.stage);
                  setEditNotes(application.notes ?? "");
                  setUpdateError("");
                  setEditing(true);
                }}
              >
                Edit Application
              </Button>

              <Button
                variant="destructive"
                className="w-full sm:w-auto"
                disabled={saving}
                onClick={async () => {
                  if (
                    id &&
                    window.confirm(
                      "Are you sure you want to delete this application?",
                    )
                  ) {
                    await removeApplication(id);
                    navigate("/");
                  }
                }}
              >
                {saving ? "Deleting..." : "Delete Application"}
              </Button>
            </div>
          ) : (
            <form
              className="space-y-5"
              onSubmit={async (event) => {
                event.preventDefault();
                setUpdateError("");
                setUpdating(true);

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
                } finally {
                  setUpdating(false);
                }
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="edit-stage">Application stage</Label>
                <select
                  id="edit-stage"
                  value={editStage}
                  onChange={(event) =>
                    setEditStage(event.target.value as Stage)
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {stages.map((stage) => (
                    <option key={stage.value} value={stage.value}>
                      {stage.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <textarea
                  id="edit-notes"
                  value={editNotes}
                  onChange={(event) => setEditNotes(event.target.value)}
                  rows={4}
                  placeholder="Add interview details, follow-up reminders, or other notes..."
                  className="flex w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              {updateError && (
                <p role="alert" className="text-sm text-destructive">
                  {updateError}
                </p>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="submit"
                  disabled={updating}
                  className="w-full sm:w-auto"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  disabled={updating}
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setEditing(false);
                    setUpdateError("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
