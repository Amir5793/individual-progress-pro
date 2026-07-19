import {
  BASE_GOAL,
  BASE_HABIT,
  createEmptyCommitment,
} from "@/lib/items/baseCommitments";

describe("BASE_GOAL", () => {
  it("has correct shape", () => {
    expect(BASE_GOAL).toEqual(
      expect.objectContaining({
        type: "goal",
        period: "daily",
        title: "",
        category: "",
        completed: false,
        completedAt: null,
        createdAt: null,
        actions: [],
      })
    );
  });
});

describe("BASE_HABIT", () => {
  it("has correct shape", () => {
    expect(BASE_HABIT).toEqual(
      expect.objectContaining({
        type: "habit",
        period: "daily",
        title: "",
        category: "",
        streak: 0,
        completions: [],
        createdAt: null,
      })
    );
  });
});

describe("createEmptyCommitment", () => {
  it("returns goal when mode is goal", () => {
    const goal = createEmptyCommitment("goal");
    expect(goal.type).toBe("goal");
    expect(goal).toEqual(expect.objectContaining(BASE_GOAL));
  });

  it("returns habit when mode is habit", () => {
    const habit = createEmptyCommitment("habit");
    expect(habit.type).toBe("habit");
    expect(habit).toEqual(expect.objectContaining(BASE_HABIT));
  });

  it("returns a copy, not the original", () => {
    const goal = createEmptyCommitment("goal");
    goal.title = "modified";
    expect(BASE_GOAL.title).toBe("");
  });
});
