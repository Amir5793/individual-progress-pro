import { getWeekTracker } from "@/lib/habits/tracker";

describe("getWeekTracker", () => {
  it("returns 7 days", () => {
    expect(getWeekTracker()).toHaveLength(7);
  });

  it("labels are M T W T F S S", () => {
    const result = getWeekTracker();
    expect(result.map((d) => d.label)).toEqual(["M", "T", "W", "T", "F", "S", "S"]);
  });

  it("matching completions get correct status", () => {
    const today = new Date();
    const start = new Date(today);
    const day = start.getDay();
    const diff = day === 0 ? 6 : day - 1;
    start.setDate(start.getDate() - diff);
    const dateStr = start.toISOString().split("T")[0];

    const completions = [{ date: dateStr, status: "completed" }];
    const result = getWeekTracker(completions);
    expect(result[0].state).toBe("completed");
  });

  it("no completions all show pending", () => {
    const result = getWeekTracker([]);
    expect(result.every((d) => d.state === "pending")).toBe(true);
  });
});
