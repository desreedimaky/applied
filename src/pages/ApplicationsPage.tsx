import { useState } from "react";
import { Link } from "react-router";
import { useApplications } from "../hooks/useApplications";
import type { Stage } from "../types/application";
import { countByStage, needsNudge } from "../lib/applications";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const stages: { value: Stage | "all"; label: string }[] = [
  { value: "all", label: "All stages" },
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
      <main className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
        <p role="status" className="text-muted-foreground">
          Loading applications...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl space-y-4 p-4 sm:p-6 lg:p-8">
        <p role="alert" className="text-destructive">
          {error}
        </p>
        <Button onClick={() => void reload()}>Try again</Button>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 p-4 sm:p-6 lg:p-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-primary">
            YOUR CAREER JOURNEY
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            My Applications
          </h1>
          <p className="text-muted-foreground">
            Keep track of your job applications and next steps.
          </p>
        </div>

        <Button asChild className="w-full sm:w-auto">
          <Link to="/new">+ Add Application</Link>
        </Button>
      </section>

      <section
        aria-label="Application totals"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{applications.length}</p>
          </CardContent>
        </Card>

        {stages.slice(1).map((stage) => (
          <Card key={stage.value}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stage.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {counts[stage.value as Stage]}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Find an application</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="application-search">
              Search by company or role
            </Label>
            <Input
              id="application-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="e.g. FNB or Developer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stage-filter">Filter by stage</Label>
            <select
              id="stage-filter"
              value={selectedStage}
              onChange={(event) =>
                setSelectedStage(event.target.value as Stage | "all")
              }
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {stages.map((stage) => (
                <option key={stage.value} value={stage.value}>
                  {stage.label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <section aria-label="Job applications" className="space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-xl font-semibold">Your applications</h2>
          <p className="text-sm text-muted-foreground">
            Showing {filteredApplications.length} of {applications.length}
          </p>
        </div>

        {applications.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <h3 className="font-semibold">Start your job search</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                No applications yet. Add your first application!
              </p>
              <Button asChild className="mt-4">
                <Link to="/new">Add your first application</Link>
              </Button>
            </CardContent>
          </Card>
        ) : filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="font-medium">No matching applications</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try another search term or choose a different stage.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearch("");
                  setSelectedStage("all");
                }}
              >
                Clear filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredApplications.map((application) => (
              <Card
                key={application.id}
                className="min-w-0 transition-shadow hover:shadow-md"
              >
                <CardHeader className="space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <CardTitle className="min-w-0 break-words text-lg">
                      <Link
                        to={`/applications/${application.id}`}
                        className="hover:underline focus-visible:underline"
                      >
                        {application.company}
                      </Link>
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className={stageStyle(application.stage)}
                    >
                      {application.stage.charAt(0).toUpperCase() +
                        application.stage.slice(1)}
                    </Badge>
                  </div>
                  <p className="break-words text-sm text-muted-foreground">
                    {application.role}
                  </p>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-sm">
                    <span className="font-medium">Date sent:</span>{" "}
                    {application.dateSent}
                  </p>

                  {needsNudge(application) && (
                    <p
                      role="status"
                      className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-100"
                    >
                      Follow up: this application has been waiting more than 14
                      days.
                    </p>
                  )}

                  <Button asChild variant="outline" className="w-full">
                    <Link to={`/applications/${application.id}`}>
                      View details
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
