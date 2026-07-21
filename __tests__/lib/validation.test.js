import {
  validateTitle,
  validateReason,
  validateActions,
  validateCompletionCriteria,
  validateDifficulty,
  validateEnergy,
  validateDeadline,
  validateCategory,
  validateObstacle,
  validateFallbackPlan,
  validateIdentity,
  validateMinimumAction,
  validateTarget,
  validateTrigger,
  validateGoalData,
  validateStepInput,
} from "@/components/Stepper/utils/validation";

describe("validateTitle", () => {
  it("empty string is invalid", () => {
    expect(validateTitle("").valid).toBe(false);
  });

  it("<3 chars is invalid", () => {
    expect(validateTitle("ab").valid).toBe(false);
  });

  it(">80 chars is invalid", () => {
    expect(validateTitle("a".repeat(81)).valid).toBe(false);
  });

  it("valid 3-80 chars", () => {
    expect(validateTitle("My Goal").valid).toBe(true);
  });
});

describe("validateReason", () => {
  it("undefined is valid", () => {
    expect(validateReason(undefined).valid).toBe(true);
  });

  it("null is valid", () => {
    expect(validateReason(null).valid).toBe(true);
  });

  it("empty object is valid", () => {
    expect(validateReason({}).valid).toBe(true);
  });

  it("string <200 chars is valid", () => {
    expect(validateReason("a short reason").valid).toBe(true);
  });

  it("string >200 chars is invalid", () => {
    expect(validateReason("a".repeat(201)).valid).toBe(false);
  });

  it("object with valid fields is valid", () => {
    expect(validateReason({ mainReason: "because" }).valid).toBe(true);
  });
});

describe("validateActions", () => {
  it("empty array is invalid", () => {
    expect(validateActions([]).valid).toBe(false);
  });

  it("array with titleless action is invalid", () => {
    expect(validateActions([{ title: "" }]).valid).toBe(false);
  });

  it("valid array is valid", () => {
    expect(validateActions([{ title: "Do something" }])).toEqual(
      expect.objectContaining({ valid: true })
    );
  });
});

describe("validateCompletionCriteria", () => {
  it("empty is invalid", () => {
    expect(validateCompletionCriteria("").valid).toBe(false);
  });

  it("<3 chars is invalid", () => {
    expect(validateCompletionCriteria("ab").valid).toBe(false);
  });

  it(">100 chars is invalid", () => {
    expect(validateCompletionCriteria("a".repeat(101)).valid).toBe(false);
  });

  it("valid 3-100 chars", () => {
    expect(validateCompletionCriteria("Run 5k").valid).toBe(true);
  });
});

describe("validateDifficulty", () => {
  it("not in list is invalid", () => {
    expect(validateDifficulty("super").valid).toBe(false);
  });

  it("valid enum is valid", () => {
    expect(validateDifficulty("medium").valid).toBe(true);
  });
});

describe("validateEnergy", () => {
  it("not in list is invalid", () => {
    expect(validateEnergy("turbo").valid).toBe(false);
  });

  it("valid enum is valid", () => {
    expect(validateEnergy("low").valid).toBe(true);
  });
});

describe("validateDeadline", () => {
  it("null is valid", () => {
    expect(validateDeadline(null).valid).toBe(true);
  });

  it("valid Date is valid", () => {
    expect(validateDeadline(new Date("2025-12-31")).valid).toBe(true);
  });

  it("valid date string is valid", () => {
    expect(validateDeadline("2025-12-31").valid).toBe(true);
  });

  it("invalid string is invalid", () => {
    expect(validateDeadline("not-a-date").valid).toBe(false);
  });
});

describe("validateCategory", () => {
  it("empty is invalid", () => {
    expect(validateCategory("").valid).toBe(false);
  });

  it("valid string is valid", () => {
    expect(validateCategory("Health").valid).toBe(true);
  });
});

describe("validateObstacle", () => {
  it("undefined is valid", () => {
    expect(validateObstacle(undefined).valid).toBe(true);
  });

  it("null is valid", () => {
    expect(validateObstacle(null).valid).toBe(true);
  });

  it("empty string is valid", () => {
    expect(validateObstacle("").valid).toBe(true);
  });

  it("string is valid", () => {
    expect(validateObstacle("lack of motivation").valid).toBe(true);
  });
});

describe("validateFallbackPlan", () => {
  it("undefined is valid", () => {
    expect(validateFallbackPlan(undefined).valid).toBe(true);
  });

  it("string is valid", () => {
    expect(validateFallbackPlan("do something else").valid).toBe(true);
  });

  it(">200 chars is invalid", () => {
    expect(validateFallbackPlan("a".repeat(201)).valid).toBe(false);
  });
});

describe("validateIdentity", () => {
  it("empty is invalid", () => {
    expect(validateIdentity("").valid).toBe(false);
  });

  it("<3 chars is invalid", () => {
    expect(validateIdentity("ab").valid).toBe(false);
  });

  it(">60 chars is invalid", () => {
    expect(validateIdentity("a".repeat(61)).valid).toBe(false);
  });

  it("valid 3-60 chars", () => {
    expect(validateIdentity("Runner").valid).toBe(true);
  });
});

describe("validateMinimumAction", () => {
  it("empty is invalid", () => {
    expect(validateMinimumAction("").valid).toBe(false);
  });

  it(">60 chars is invalid", () => {
    expect(validateMinimumAction("a".repeat(61)).valid).toBe(false);
  });

  it("valid string", () => {
    expect(validateMinimumAction("1 pushup").valid).toBe(true);
  });
});

describe("validateTarget", () => {
  it("empty is valid (optional)", () => {
    expect(validateTarget("").valid).toBe(true);
  });

  it("undefined is valid (optional)", () => {
    expect(validateTarget(undefined).valid).toBe(true);
  });

  it("string is valid", () => {
    expect(validateTarget("Run 5k").valid).toBe(true);
  });

  it(">60 chars is invalid", () => {
    expect(validateTarget("a".repeat(61)).valid).toBe(false);
  });
});

describe("validateTrigger", () => {
  it("empty is valid (optional)", () => {
    expect(validateTrigger("").valid).toBe(true);
  });

  it("string is valid", () => {
    expect(validateTrigger("After breakfast").valid).toBe(true);
  });
});

describe("validateGoalData", () => {
  it("full valid data returns valid", () => {
    const data = {
      title: "My Goal",
      reason: {},
      actions: [{ title: "Step 1" }],
      completionCriteria: "Finish project",
      difficulty: "medium",
      energy: "low",
      deadline: null,
      category: "Health",
      obstacle: "",
      fallbackPlan: "",
    };
    expect(validateGoalData(data, "goal").valid).toBe(true);
  });

  it("missing fields return errors", () => {
    const result = validateGoalData({}, "goal");
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty("title");
  });

  it("valid habit data returns valid", () => {
    const data = {
      identity: "Runner",
      title: "Morning Jog",
      minimumAction: "1 min walk",
      target: "",
      trigger: "",
      category: "Health",
      obstacle: "",
      reason: {},
    };
    expect(validateGoalData(data, "habit").valid).toBe(true);
  });
});

describe("validateStepInput", () => {
  it("goal step 1 returns valid", () => {
    expect(validateStepInput(1, null, "goal")).toEqual(
      expect.objectContaining({ valid: true })
    );
  });

  it("goal step 2 validates title", () => {
    const result = validateStepInput(2, "", "goal");
    expect(result.valid).toBe(false);
  });

  it("goal step 3 validates reason", () => {
    const result = validateStepInput(3, { mainReason: "x".repeat(201) }, "goal");
    expect(result.valid).toBe(false);
  });

  it("goal step 4 validates completionCriteria", () => {
    const result = validateStepInput(4, "", "goal");
    expect(result.valid).toBe(false);
  });

  it("goal step 5 validates actions (goalOrTask=false)", () => {
    const result = validateStepInput(5, [], "goal", false);
    expect(result.valid).toBe(false);
  });

  it("goal step 5 validates difficulty (goalOrTask=true)", () => {
    const result = validateStepInput(5, "medium", "goal", true);
    expect(result.valid).toBe(true);
  });

  it("goal step 6 validates difficulty (goalOrTask=false)", () => {
    const result = validateStepInput(6, "hard", "goal", false);
    expect(result.valid).toBe(true);
  });

  it("goal step 6 validates energy (goalOrTask=true)", () => {
    const result = validateStepInput(6, "much", "goal", true);
    expect(result.valid).toBe(true);
  });

  it("goal step 7 validates energy (goalOrTask=false)", () => {
    const result = validateStepInput(7, "low", "goal", false);
    expect(result.valid).toBe(true);
  });

  it("goal step 7 validates deadline (goalOrTask=true)", () => {
    const result = validateStepInput(7, null, "goal", true);
    expect(result.valid).toBe(true);
  });

  it("goal step 8 validates deadline (goalOrTask=false)", () => {
    const result = validateStepInput(8, null, "goal", false);
    expect(result.valid).toBe(true);
  });

  it("goal step 8 validates category (goalOrTask=true)", () => {
    const result = validateStepInput(8, "Health", "goal", true);
    expect(result.valid).toBe(true);
  });

  it("goal step 9 validates category (goalOrTask=false)", () => {
    const result = validateStepInput(9, "Health", "goal", false);
    expect(result.valid).toBe(true);
  });

  it("goal step 9 validates obstacles (goalOrTask=true)", () => {
    const result = validateStepInput(9, { obstacle: "", fallbackPlan: "" }, "goal", true);
    expect(result.valid).toBe(true);
  });

  it("goal step 10 validates obstacles (goalOrTask=false)", () => {
    const result = validateStepInput(10, { obstacle: "", fallbackPlan: "" }, "goal", false);
    expect(result.valid).toBe(true);
  });

  it("goal step 11 returns valid", () => {
    expect(validateStepInput(11, null, "goal")).toEqual(
      expect.objectContaining({ valid: true })
    );
  });

  it("goal step 999 returns unknown step error", () => {
    const result = validateStepInput(999, null, "goal");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("stepper.validation.unknown_goal_step");
  });

  it("habit step 2 validates title", () => {
    const result = validateStepInput(2, "", "habit");
    expect(result.valid).toBe(false);
  });

  it("habit step 3 validates minimumAction", () => {
    const result = validateStepInput(3, "", "habit");
    expect(result.valid).toBe(false);
  });

  it("habit step 4 validates target", () => {
    const result = validateStepInput(4, "x".repeat(61), "habit");
    expect(result.valid).toBe(false);
  });

  it("habit step 5 validates trigger", () => {
    const result = validateStepInput(5, "trigger", "habit");
    expect(result.valid).toBe(true);
  });

  it("habit step 6 validates category", () => {
    const result = validateStepInput(6, "", "habit");
    expect(result.valid).toBe(false);
  });

  it("habit step 7 validates obstacles", () => {
    const result = validateStepInput(7, { obstacle: "", fallbackPlan: "" }, "habit");
    expect(result.valid).toBe(true);
  });

  it("habit step 8 validates reason", () => {
    const result = validateStepInput(8, "reason", "habit");
    expect(result.valid).toBe(true);
  });

  it("habit step 9 returns valid", () => {
    expect(validateStepInput(9, null, "habit")).toEqual(
      expect.objectContaining({ valid: true })
    );
  });

  it("habit step 10 returns valid", () => {
    expect(validateStepInput(10, null, "habit")).toEqual(
      expect.objectContaining({ valid: true })
    );
  });

  it("habit step 999 returns unknown step error", () => {
    const result = validateStepInput(999, null, "habit");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("stepper.validation.unknown_habit_step");
  });

  it("returns error for unknown mode", () => {
    const result = validateStepInput(1, null, "unknown");
    expect(result.valid).toBe(false);
  });
});

describe("validateReason edge cases", () => {
  it("non-string non-object non-null value is invalid", () => {
    expect(validateReason(123).valid).toBe(false);
  });

  it("array value is invalid", () => {
    expect(validateReason(["reason"]).valid).toBe(false);
  });

  it("object with non-string field is invalid", () => {
    expect(validateReason({ mainReason: 123 }).valid).toBe(false);
  });

  it("object with field >200 chars is invalid", () => {
    expect(validateReason({ nowReason: "x".repeat(201) }).valid).toBe(false);
  });

  it("object with succeedReason >200 is invalid", () => {
    expect(validateReason({ succeedReason: "x".repeat(201) }).valid).toBe(false);
  });
});

describe("validateObstacle edge cases", () => {
  it("non-string is invalid", () => {
    expect(validateObstacle(123).valid).toBe(false);
  });
});

describe("validateFallbackPlan edge cases", () => {
  it("null is valid", () => {
    expect(validateFallbackPlan(null).valid).toBe(true);
  });

  it("non-string is invalid", () => {
    expect(validateFallbackPlan(123).valid).toBe(false);
  });
});

describe("validateTarget edge cases", () => {
  it("null is valid (optional)", () => {
    expect(validateTarget(null).valid).toBe(true);
  });

  it("non-string is invalid", () => {
    expect(validateTarget(123).valid).toBe(false);
  });

  it("1 char is valid", () => {
    expect(validateTarget("x").valid).toBe(true);
  });
});

describe("validateTrigger edge cases", () => {
  it("null is valid (optional)", () => {
    expect(validateTrigger(null).valid).toBe(true);
  });

  it("non-string is invalid", () => {
    expect(validateTrigger(123).valid).toBe(false);
  });

  it("1 char is valid", () => {
    expect(validateTrigger("x").valid).toBe(true);
  });
});

describe("validateMinimumAction edge cases", () => {
  it("1 char is valid", () => {
    expect(validateMinimumAction("x").valid).toBe(true);
  });
});

describe("validateDeadline edge cases", () => {
  it("undefined is valid", () => {
    expect(validateDeadline(undefined).valid).toBe(true);
  });
});

describe("validateGoalData habit mode errors", () => {
  it("missing habit fields returns errors", () => {
    const result = validateGoalData({}, "habit");
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty("identity");
  });

  it("goalOrTask=true skips actions validation", () => {
    const data = {
      title: "Goal",
      reason: {},
      completionCriteria: "Done",
      difficulty: "medium",
      energy: "low",
      deadline: null,
      category: "Health",
      obstacle: "",
      fallbackPlan: "",
    };
    expect(validateGoalData(data, "goal", true).valid).toBe(true);
  });
});

describe("validateActions edge cases", () => {
  it("non-array is invalid", () => {
    expect(validateActions("not array").valid).toBe(false);
  });
});

describe("validateDifficulty edge cases", () => {
  it("all valid levels work", () => {
    expect(validateDifficulty("low").valid).toBe(true);
    expect(validateDifficulty("medium").valid).toBe(true);
    expect(validateDifficulty("hard").valid).toBe(true);
    expect(validateDifficulty("almost impossible").valid).toBe(true);
  });
});

describe("validateEnergy edge cases", () => {
  it("all valid levels work", () => {
    expect(validateEnergy("low").valid).toBe(true);
    expect(validateEnergy("medium").valid).toBe(true);
    expect(validateEnergy("much").valid).toBe(true);
    expect(validateEnergy("life or death").valid).toBe(true);
  });
});

describe("validateTitle edge cases", () => {
  it("null is invalid", () => {
    expect(validateTitle(null).valid).toBe(false);
  });

  it("number is invalid", () => {
    expect(validateTitle(123).valid).toBe(false);
  });

  it("exactly 3 chars is valid", () => {
    expect(validateTitle("abc").valid).toBe(true);
  });

  it("exactly 80 chars is valid", () => {
    expect(validateTitle("a".repeat(80)).valid).toBe(true);
  });
});
