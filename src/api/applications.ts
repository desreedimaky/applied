import { seedApplications } from "../data/applications";
import type { Application } from "../types/application";

const STORAGE_KEY = "applied-applications";

function delay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 300));
}

function readApplications(): Application[] {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored === null) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedApplications));
    return seedApplications;
  }

  return JSON.parse(stored) as Application[];
}

export async function getApplications(): Promise<Application[]> {
  await delay();
  return readApplications();
}

export async function getApplicationById(
  id: string,
): Promise<Application | undefined> {
  await delay();
  return readApplications().find((application) => application.id === id);
}

export async function addApplication(
  application: Application,
): Promise<Application> {
  await delay();

  const applications = readApplications();
  applications.unshift(application);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));

  return application;
}

export async function updateApplication(
  updatedApplication: Application,
): Promise<Application> {
  await delay();

  const applications = readApplications();
  const index = applications.findIndex(
    (application) => application.id === updatedApplication.id,
  );

  if (index === -1) {
    throw new Error("Application not found.");
  }

  applications[index] = updatedApplication;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));

  return updatedApplication;
}

export async function deleteApplication(id: string): Promise<void> {
  await delay();

  const applications = readApplications().filter(
    (application) => application.id !== id,
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
}
