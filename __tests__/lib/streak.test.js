import { calculateStreak } from "@/lib/habits/streak";

describe("calculateStreak", () => {
  it("returns 0 for empty completions", () => {
    expect(calculateStreak([])).toBe(0);
  });

  it("returns 0 when no completed today", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split("T")[0];
    expect(calculateStreak([{ date: dateStr, status: "completed" }])).toBe(0);
  });

  it("returns 1 for single day completed today", () => {
    const today = new Date().toISOString().split("T")[0];
    expect(calculateStreak([{ date: today, status: "completed" }])).toBe(1);
  });

  it("returns correct count for multiple consecutive days", () => {
    const today = new Date();
    const completions = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      completions.push({
        date: d.toISOString().split("T")[0],
        status: "completed",
      });
    }
    expect(calculateStreak(completions)).toBe(5);
  });

  it("returns count up to break in streak", () => {
    const today = new Date();
    const completions = [];
    for (let i = 0; i < 3; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      completions.push({
        date: d.toISOString().split("T")[0],
        status: "completed",
      });
    }
    completions.push({
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5)
        .toISOString()
        .split("T")[0],
      status: "completed",
    });
    expect(calculateStreak(completions)).toBe(3);
  });

  it("counts minimum status toward streak", () => {
    const today = new Date().toISOString().split("T")[0];
    expect(calculateStreak([{ date: today, status: "minimum" }])).toBe(1);
  });
});
