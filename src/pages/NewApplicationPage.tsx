import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useApplications } from "../hooks/useApplications";
import type { Stage } from "../types/application";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

interface ApplicationFormData {
  company: string;
  role: string;
  link: string;
  dateSent: string;
  stage: Stage;
  notes: string;
}

export default function NewApplicationPage() {
  const navigate = useNavigate();
  const { addApplication, saving, error } = useApplications();

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    defaultValues: {
      company: "",
      role: "",
      link: "",
      dateSent: new Date().toISOString().slice(0, 10),
      stage: "wishlist",
      notes: "",
    },
  });

  useEffect(() => {
    setFocus("company");
  }, [setFocus]);

  async function onSubmit(data: ApplicationFormData) {
    const application = {
      id: crypto.randomUUID(),
      company: data.company.trim(),
      role: data.role.trim(),
      ...(data.link.trim() ? { link: data.link.trim() } : {}),
      dateSent: data.dateSent,
      stage: data.stage,
      ...(data.notes.trim() ? { notes: data.notes.trim() } : {}),
      createdAt: new Date().toISOString(),
    };

    await addApplication(application);
    navigate("/");
  }

  const fieldClass =
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <main className="mx-auto w-full max-w-3xl p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <Button asChild variant="ghost" className="mb-4 -ml-3">
          <Link to="/">← Back to applications</Link>
        </Button>

        <p className="text-sm font-medium text-primary">JOB SEARCH</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Add Application
        </h1>
        <p className="mt-2 text-muted-foreground">
          Enter the details of the job you want to track.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job details</CardTitle>
          <CardDescription>Fields marked with * are required.</CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <p
              role="alert"
              className="mb-5 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
            >
              {error}
            </p>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label htmlFor="company">Company name *</Label>
              <Input
                id="company"
                {...register("company", {
                  required: "Company name is required.",
                  minLength: {
                    value: 2,
                    message: "Company name must contain at least 2 characters.",
                  },
                  validate: (value) =>
                    value.trim().length >= 2 ||
                    "Company name must contain at least 2 non-space characters.",
                })}
                aria-invalid={!!errors.company}
                aria-describedby={errors.company ? "company-error" : undefined}
                className={errors.company ? "border-destructive" : ""}
              />
              {errors.company && (
                <p
                  id="company-error"
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {errors.company.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Job title *</Label>
              <Input
                id="role"
                {...register("role", {
                  required: "Job title is required.",
                  minLength: {
                    value: 2,
                    message: "Job title must contain at least 2 characters.",
                  },
                  validate: (value) =>
                    value.trim().length >= 2 ||
                    "Job title must contain at least 2 non-space characters.",
                })}
                aria-invalid={!!errors.role}
                aria-describedby={errors.role ? "role-error" : undefined}
                className={errors.role ? "border-destructive" : ""}
              />
              {errors.role && (
                <p
                  id="role-error"
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {errors.role.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">Job posting URL</Label>
              <Input
                id="link"
                type="url"
                placeholder="https://example.com/job"
                {...register("link", {
                  validate: (value) => {
                    if (!value.trim()) return true;
                    try {
                      const url = new URL(value);
                      return (
                        ["http:", "https:"].includes(url.protocol) ||
                        "URL must start with http:// or https://."
                      );
                    } catch {
                      return "Please enter a valid URL.";
                    }
                  },
                })}
                aria-invalid={!!errors.link}
                aria-describedby={errors.link ? "link-error" : undefined}
                className={errors.link ? "border-destructive" : ""}
              />
              {errors.link && (
                <p
                  id="link-error"
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {errors.link.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dateSent">Date applied *</Label>
                <Input
                  id="dateSent"
                  type="date"
                  {...register("dateSent", {
                    required: "Date applied is required.",
                    validate: (value) =>
                      value <= new Date().toISOString().slice(0, 10) ||
                      "Date applied cannot be in the future.",
                  })}
                  aria-invalid={!!errors.dateSent}
                  aria-describedby={
                    errors.dateSent ? "dateSent-error" : undefined
                  }
                  className={errors.dateSent ? "border-destructive" : ""}
                />
                {errors.dateSent && (
                  <p
                    id="dateSent-error"
                    role="alert"
                    className="text-sm text-destructive"
                  >
                    {errors.dateSent.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stage">Application stage *</Label>
                <select
                  id="stage"
                  {...register("stage")}
                  className={fieldClass}
                >
                  <option value="wishlist">Wishlist</option>
                  <option value="applied">Applied</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                rows={4}
                placeholder="Add interview details, contact information, or reminders..."
                {...register("notes")}
                className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
              <Button asChild type="button" variant="outline">
                <Link to="/">Cancel</Link>
              </Button>

              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Application"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
