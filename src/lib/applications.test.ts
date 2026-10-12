import { describe, expect, it } from "vitest";
import type { Application } from "../types/application";
import { countByStage, daysSince, needsNudge } from "./applications";

const today = new Date("2026-10-13T12:00:00");

const sampleApplication: Application = {
  id: "1",
  company: "Example Company",
  role: "Junior Developer",
  dateSent: "2026-09-28",
  stage: "applied",
  createdAt: "2026-09-28T09:00:00",
};

describe("daysSince", () => {
  it("calculates the number of days since an application was sent", () => {
    expect(daysSince("2026-09-28", today)).toBe(15);
  });
});

describe("needsNudge", () => {
  it("returns false at exactly 14 days", () => {
    expect(
      needsNudge({ ...sampleApplication, dateSent: "2026-09-29" }, today),
    ).toBe(false);
  });

  it("returns true after more than 14 days", () => {
    expect(needsNudge(sampleApplication, today)).toBe(true);
  });

  it("returns false when the stage is not applied", () => {
    expect(
      needsNudge({ ...sampleApplication, stage: "interview" }, today),
    ).toBe(false);
  });
});

describe("countByStage", () => {
  it("counts applications in each stage", () => {
    const applications: Application[] = [
      sampleApplication,
      { ...sampleApplication, id: "2", stage: "interview" },
      { ...sampleApplication, id: "3", stage: "applied" },
    ];

    expect(countByStage(applications)).toEqual({
      wishlist: 0,
      applied: 2,
      interview: 1,
      offer: 0,
      closed: 0,
    });
  });
});
