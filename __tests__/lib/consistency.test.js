import { getConsistency } from "@/lib/habits/consistency";

describe("getConsistency", () => {
  it("returns 0 for empty completions", () => {
    expect(getConsistency([])).toBe(0);
  });

  it("returns 100 when all completed", () => {
    const completions = [
      { date: "2024-01-01", status: "completed" },
      { date: "2024-01-02", status: "completed" },
      { date: "2024-01-03", status: "completed" },
    ];
    expect(getConsistency(completions)).toBe(100);
  });

  it("calculates correct percentage for mixed statuses", () => {
    const completions = [
      { date: "2024-01-01", status: "completed" },
      { date: "2024-01-02", status: "failed" },
      { date: "2024-01-03", status: "completed" },
    ];
    expect(getConsistency(completions)).toBe(67);
  });

  it("counts minimum as success", () => {
    const completions = [
      { date: "2024-01-01", status: "minimum" },
      { date: "2024-01-02", status: "completed" },
    ];
    expect(getConsistency(completions)).toBe(100);
  });

  it("returns 0 when all failed", () => {
    const completions = [
      { date: "2024-01-01", status: "failed" },
      { date: "2024-01-02", status: "failed" },
    ];
    expect(getConsistency(completions)).toBe(0);
  });
});
