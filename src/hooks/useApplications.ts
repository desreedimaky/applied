import { useCallback, useEffect, useState } from "react";
import {
  addApplication as addApplicationApi,
  deleteApplication as deleteApplicationApi,
  getApplications,
  updateApplication as updateApplicationApi,
} from "../api/applications";
import type { Application } from "../types/application";

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getApplications();
      setApplications(data);
    } catch {
      setError("Could not load applications. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialApplications() {
      try {
        const data = await getApplications();

        if (!cancelled) {
          setApplications(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load applications.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadInitialApplications();

    return () => {
      cancelled = true;
    };
  }, []);

  const addApplication = async (application: Application) => {
    setSaving(true);
    setError(null);

    try {
      await addApplicationApi(application);
      await reload();
    } catch {
      setError("Could not add the application. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const updateApplication = async (application: Application) => {
    setSaving(true);
    setError(null);

    try {
      await updateApplicationApi(application);
      await reload();
    } catch {
      setError("Could not update the application. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const removeApplication = async (id: string) => {
    setSaving(true);
    setError(null);

    try {
      await deleteApplicationApi(id);
      await reload();
    } catch {
      setError("Could not delete the application. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return {
    applications,
    loading,
    error,
    saving,
    addApplication,
    updateApplication,
    removeApplication,
    reload,
  };
}
