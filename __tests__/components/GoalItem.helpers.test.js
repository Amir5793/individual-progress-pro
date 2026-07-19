import {
  difficultyColor,
  energyColor,
  formatDeadline,
  getGoalStatus,
  getFocusLabel,
} from "@/components/Items/Item/GoalItem/helpers";

describe("difficultyColor", () => {
  it("maps easy to green", () => {
    expect(difficultyColor("easy")).toBe("var(--accent-green)");
  });

  it("maps medium to yellow", () => {
    expect(difficultyColor("medium")).toBe("var(--accent-yellow)");
  });

  it("maps hard to red", () => {
    expect(difficultyColor("hard")).toBe("var(--accent-red)");
  });

  it("returns default for unknown", () => {
    expect(difficultyColor("unknown")).toBe("rgba(255,255,255,.08)");
  });
});

describe("energyColor", () => {
  it("maps low to blue", () => {
    expect(energyColor("low")).toBe("#5BC0EB");
  });

  it("maps medium to purple", () => {
    expect(energyColor("medium")).toBe("#8B5CF6");
  });

  it("maps high to orange", () => {
    expect(energyColor("high")).toBe("#F97316");
  });

  it("returns default for unknown", () => {
    expect(energyColor("turbo")).toBe("rgba(255,255,255,.08)");
  });
});

describe("formatDeadline", () => {
  it("null returns empty string", () => {
    expect(formatDeadline(null)).toBe("");
  });

  it("today returns Today", () => {
    const today = new Date();
    expect(formatDeadline(today)).toBe("Today");
  });

  it("tomorrow returns Tomorrow", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(formatDeadline(tomorrow)).toBe("Tomorrow");
  });

  it("yesterday returns Yesterday", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(formatDeadline(yesterday)).toBe("Yesterday");
  });

  it(">7 days returns formatted date", () => {
    const future = new Date();
    future.setDate(future.getDate() + 10);
    const result = formatDeadline(future);
    expect(result).not.toContain("Today");
    expect(result).not.toContain("Tomorrow");
  });

  it("overdue returns X days overdue", () => {
    const past = new Date();
    past.setDate(past.getDate() - 3);
    expect(formatDeadline(past)).toBe("3 days overdue");
  });
});

describe("getGoalStatus", () => {
  it("completed returns Completed", () => {
    expect(getGoalStatus({ completed: true })).toBe("Completed");
  });

  it("no deadline returns Active", () => {
    expect(getGoalStatus({ completed: false, deadline: null })).toBe("Active");
  });

  it("past deadline returns Overdue", () => {
    const past = new Date();
    past.setDate(past.getDate() - 1);
    expect(getGoalStatus({ completed: false, deadline: past })).toBe("Overdue");
  });

  it("future deadline returns Pending", () => {
    const future = new Date();
    future.setDate(future.getDate() + 5);
    expect(getGoalStatus({ completed: false, deadline: future })).toBe("Pending");
  });
});

describe("getFocusLabel", () => {
  it("high returns Deep Focus", () => {
    expect(getFocusLabel("high")).toBe("Deep Focus");
  });

  it("medium returns Normal Focus", () => {
    expect(getFocusLabel("medium")).toBe("Normal Focus");
  });

  it("low returns Light Focus", () => {
    expect(getFocusLabel("low")).toBe("Light Focus");
  });

  it("unknown returns Focus", () => {
    expect(getFocusLabel("unknown")).toBe("Focus");
  });
});
