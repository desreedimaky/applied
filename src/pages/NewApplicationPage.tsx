import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useApplications } from "../hooks/useApplications";
import type { Stage } from "../types/application";

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

  return (
    <main>
      <h1>Add Application</h1>
      <p>Enter the details of the job you want to track.</p>

      {error && <p role="alert">{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label htmlFor="company">Company name *</label>
          <input
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
          />
          {errors.company && (
            <p id="company-error" role="alert">
              {errors.company.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="role">Job title *</label>
          <input
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
          />
          {errors.role && (
            <p id="role-error" role="alert">
              {errors.role.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="link">Job posting URL</label>
          <input
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
          />
          {errors.link && (
            <p id="link-error" role="alert">
              {errors.link.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="dateSent">Date applied *</label>
          <input
            id="dateSent"
            type="date"
            {...register("dateSent", {
              required: "Date applied is required.",
              validate: (value) =>
                value <= new Date().toISOString().slice(0, 10) ||
                "Date applied cannot be in the future.",
            })}
            aria-invalid={!!errors.dateSent}
            aria-describedby={errors.dateSent ? "dateSent-error" : undefined}
          />
          {errors.dateSent && (
            <p id="dateSent-error" role="alert">
              {errors.dateSent.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="stage">Application stage *</label>
          <select id="stage" {...register("stage")}>
            <option value="wishlist">Wishlist</option>
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div>
          <label htmlFor="notes">Notes</label>
          <textarea id="notes" rows={4} {...register("notes")} />
        </div>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Application"}
        </button>

        <Link to="/">Cancel</Link>
      </form>
    </main>
  );
}
