import type { Application, Stage } from "../types/application";

export function daysSince(dateSent: string, today: Date = new Date()): number {
  const sentDate = new Date(`${dateSent}T00:00:00`);
  const currentDate = new Date(today);

  sentDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);

  const difference = currentDate.getTime() - sentDate.getTime();

  return Math.floor(difference / (1000 * 60 * 60 * 24));
}

export function needsNudge(
  application: Application,
  today: Date = new Date(),
): boolean {
  return (
    application.stage === "applied" &&
    daysSince(application.dateSent, today) > 14
  );
}

export function countByStage(
  applications: Application[],
): Record<Stage, number> {
  const counts: Record<Stage, number> = {
    wishlist: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    closed: 0,
  };

  for (const application of applications) {
    counts[application.stage]++;
  }

  return counts;
}
