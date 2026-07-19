import { wizardReducer, initialWizardState } from "@/lib/store/wizardReducer";
import {
  WIZARD_SET_FIELD,
  WIZARD_NEXT_STEP,
  WIZARD_PREV_STEP,
  WIZARD_RESET,
} from "@/lib/store/types";

describe("wizardReducer", () => {
  it("WIZARD_SET_FIELD sets field in data and clears error", () => {
    const state = {
      ...initialWizardState,
      errors: { title: "previous error" },
    };
    const result = wizardReducer(state, {
      type: WIZARD_SET_FIELD,
      field: "title",
      value: "My Goal",
    });
    expect(result.data.title).toBe("My Goal");
    expect(result.errors.title).toBeUndefined();
  });

  it("WIZARD_NEXT_STEP increments step", () => {
    const state = { ...initialWizardState, step: 1 };
    const result = wizardReducer(state, { type: WIZARD_NEXT_STEP });
    expect(result.step).toBe(2);
  });

  it("WIZARD_PREV_STEP decrements step (min 1)", () => {
    const state = { ...initialWizardState, step: 2 };
    const result = wizardReducer(state, { type: WIZARD_PREV_STEP });
    expect(result.step).toBe(1);
  });

  it("WIZARD_PREV_STEP does not go below 1", () => {
    const state = { ...initialWizardState, step: 1 };
    const result = wizardReducer(state, { type: WIZARD_PREV_STEP });
    expect(result.step).toBe(1);
  });

  it("WIZARD_RESET resets to initial with mode", () => {
    const state = {
      ...initialWizardState,
      step: 5,
      mode: "goal",
      data: { title: "old" },
    };
    const result = wizardReducer(state, {
      type: WIZARD_RESET,
      mode: "habit",
    });
    expect(result.step).toBe(1);
    expect(result.mode).toBe("habit");
    expect(result.data).toHaveProperty("identity");
    expect(result.data).toHaveProperty("type", "habit");
  });

  it("default returns state unchanged", () => {
    const state = { ...initialWizardState };
    const result = wizardReducer(state, { type: "UNKNOWN" });
    expect(result).toBe(state);
  });
});
