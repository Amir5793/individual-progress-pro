import {
  getTodayString,
  getYesterdayString,
  getTodayStatus,
  getHabitStatus,
  computeNewStreak,
  buildUpdatedCompletions,
  getCompletionStats,
  getProgressLabel,
  formatPreferredTime,
} from "@/components/Items/Item/HabitItem/helpers";

describe("getTodayString", () => {
  it("returns ISO date string", () => {
    const result = getTodayString();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("getYesterdayString", () => {
  it("returns yesterday ISO date", () => {
    const result = getYesterdayString();
    const expected = new Date();
    expected.setDate(expected.getDate() - 1);
    expect(result).toBe(expected.toISOString().split("T")[0]);
  });
});

describe("getTodayStatus", () => {
  it("returns null for empty completions", () => {
    expect(getTodayStatus([])).toBeNull();
  });

  it("returns status for matching date", () => {
    const today = getTodayString();
    expect(getTodayStatus([{ date: today, status: "completed" }])).toBe("completed");
  });

  it("returns null when no match", () => {
    expect(getTodayStatus([{ date: "2020-01-01", status: "completed" }])).toBeNull();
  });
});

describe("getHabitStatus", () => {
  it("returns pending when no status", () => {
    expect(getHabitStatus({ completions: [] })).toBe("pending");
  });
});

describe("computeNewStreak", () => {
  it("failed returns 0", () => {
    expect(computeNewStreak([], "failed")).toBe(0);
  });

  it("with yesterday completed returns 1", () => {
    const yesterday = getYesterdayString();
    const completions = [{ date: yesterday, status: "completed" }];
    expect(computeNewStreak(completions, "completed")).toBe(1);
  });

  it("without yesterday returns 1", () => {
    expect(computeNewStreak([], "completed")).toBe(1);
  });
});

describe("buildUpdatedCompletions", () => {
  it("adds new entry", () => {
    const result = buildUpdatedCompletions([], "completed");
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe("completed");
  });

  it("updates existing entry", () => {
    const today = getTodayString();
    const existing = [{ date: today, status: "failed" }];
    const result = buildUpdatedCompletions(existing, "completed");
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe("completed");
  });
});

describe("getCompletionStats", () => {
  it("returns correct counts and success rate", () => {
    const completions = [
      { status: "completed" },
      { status: "completed" },
      { status: "minimum" },
      { status: "failed" },
    ];
    const stats = getCompletionStats(completions);
    expect(stats.total).toBe(4);
    expect(stats.idealCount).toBe(2);
    expect(stats.minimumCount).toBe(1);
    expect(stats.failedCount).toBe(1);
    expect(stats.successCount).toBe(3);
    expect(stats.successRate).toBe(75);
  });
});

describe("getProgressLabel", () => {
  it("maps completed to Ideal", () => {
    expect(getProgressLabel("completed")).toBe("Ideal");
  });

  it("maps minimum to Minimum", () => {
    expect(getProgressLabel("minimum")).toBe("Minimum");
  });

  it("maps failed to Missed", () => {
    expect(getProgressLabel("failed")).toBe("Missed");
  });

  it("maps unknown to Not yet marked", () => {
    expect(getProgressLabel(undefined)).toBe("Not yet marked");
  });
});

describe("formatPreferredTime", () => {
  it("capitalizes first letter", () => {
    expect(formatPreferredTime("morning")).toBe("Morning");
  });

  it("empty returns empty", () => {
    expect(formatPreferredTime("")).toBe("");
  });
});
