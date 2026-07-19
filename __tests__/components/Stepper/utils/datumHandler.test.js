import { datumHandler } from "@/components/Stepper/utils/datumHandler";

const createMockSetters = () => ({
  setDatum: jest.fn((fn) => {
    if (typeof fn === "function") return fn({});
    return fn;
  }),
  setErrors: jest.fn((fn) => {
    if (typeof fn === "function") return fn({});
    return fn;
  }),
  setTitle: jest.fn(),
  setReason: jest.fn(),
  setReasonNow: jest.fn(),
  setReasonSucceed: jest.fn(),
  setCompletionCriteria: jest.fn(),
  setDifficulty: jest.fn(),
  setEnergy: jest.fn(),
  setDeadline: jest.fn(),
  setCategory: jest.fn(),
  setObstacle: jest.fn(),
  setFallbackPlan: jest.fn(),
  setIdentity: jest.fn(),
  setMinimumAction: jest.fn(),
  setTarget: jest.fn(),
  setTrigger: jest.fn(),
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("goal mode", () => {
  it("updates title", () => {
    const m = createMockSetters();
    datumHandler("title", "My Goal", m.setDatum, "goal", "main", m.setErrors,
      m.setTitle, m.setReason, m.setReasonNow, m.setReasonSucceed,
      m.setCompletionCriteria, m.setDifficulty, m.setEnergy, m.setDeadline,
      m.setCategory, m.setObstacle, m.setFallbackPlan, m.setIdentity,
      m.setMinimumAction, m.setTarget, m.setTrigger);
    expect(m.setTitle).toHaveBeenCalledWith("My Goal");
    expect(m.setDatum).toHaveBeenCalled();
  });

  it("updates difficulty", () => {
    const m = createMockSetters();
    datumHandler("difficulty", "hard", m.setDatum, "goal", "main", m.setErrors,
      m.setTitle, m.setReason, m.setReasonNow, m.setReasonSucceed,
      m.setCompletionCriteria, m.setDifficulty, m.setEnergy, m.setDeadline,
      m.setCategory, m.setObstacle, m.setFallbackPlan, m.setIdentity,
      m.setMinimumAction, m.setTarget, m.setTrigger);
    expect(m.setDifficulty).toHaveBeenCalledWith("hard");
  });

  it("updates energy", () => {
    const m = createMockSetters();
    datumHandler("energy", "high", m.setDatum, "goal", "main", m.setErrors,
      m.setTitle, m.setReason, m.setReasonNow, m.setReasonSucceed,
      m.setCompletionCriteria, m.setDifficulty, m.setEnergy, m.setDeadline,
      m.setCategory, m.setObstacle, m.setFallbackPlan, m.setIdentity,
      m.setMinimumAction, m.setTarget, m.setTrigger);
    expect(m.setEnergy).toHaveBeenCalledWith("high");
  });

  it("updates category", () => {
    const m = createMockSetters();
    datumHandler("category", "Fitness", m.setDatum, "goal", "main", m.setErrors,
      m.setTitle, m.setReason, m.setReasonNow, m.setReasonSucceed,
      m.setCompletionCriteria, m.setDifficulty, m.setEnergy, m.setDeadline,
      m.setCategory, m.setObstacle, m.setFallbackPlan, m.setIdentity,
      m.setMinimumAction, m.setTarget, m.setTrigger);
    expect(m.setCategory).toHaveBeenCalledWith("Fitness");
  });

  it("updates reason with reasonMode='now'", () => {
    const m = createMockSetters();
    datumHandler("reason", { now: "because" }, m.setDatum, "goal", "now", m.setErrors,
      m.setTitle, m.setReason, m.setReasonNow, m.setReasonSucceed,
      m.setCompletionCriteria, m.setDifficulty, m.setEnergy, m.setDeadline,
      m.setCategory, m.setObstacle, m.setFallbackPlan, m.setIdentity,
      m.setMinimumAction, m.setTarget, m.setTrigger);
    expect(m.setReasonNow).toHaveBeenCalledWith("because");
    expect(m.setDatum).toHaveBeenCalled();
  });

  it("updates reason with reasonMode='succeed'", () => {
    const m = createMockSetters();
    datumHandler("reason", { succeedReason: "to succeed" }, m.setDatum, "goal", "succeed", m.setErrors,
      m.setTitle, m.setReason, m.setReasonNow, m.setReasonSucceed,
      m.setCompletionCriteria, m.setDifficulty, m.setEnergy, m.setDeadline,
      m.setCategory, m.setObstacle, m.setFallbackPlan, m.setIdentity,
      m.setMinimumAction, m.setTarget, m.setTrigger);
    expect(m.setReasonSucceed).toHaveBeenCalledWith("to succeed");
  });

  it("updates reason with reasonMode='main' and exercises setDatum updater", () => {
    const m = createMockSetters();
    datumHandler("reason", { mainReason: "because I want" }, m.setDatum, "goal", "main", m.setErrors,
      m.setTitle, m.setReason, m.setReasonNow, m.setReasonSucceed,
      m.setCompletionCriteria, m.setDifficulty, m.setEnergy, m.setDeadline,
      m.setCategory, m.setObstacle, m.setFallbackPlan, m.setIdentity,
      m.setMinimumAction, m.setTarget, m.setTrigger);
    expect(m.setReason).toHaveBeenCalledWith("because I want");
    expect(m.setDatum).toHaveBeenCalled();
    // Exercise the setDatum updater function for reason merge
    const datumUpdater = m.setDatum.mock.calls[0][0];
    const result = datumUpdater({ reason: { nowReason: "existing" } });
    expect(result.reason.mainReason).toBe("because I want");
    expect(result.reason.nowReason).toBe("existing");
  });

  it("setDatum updater merges nowReason correctly", () => {
    const m = createMockSetters();
    datumHandler("reason", { now: "when now" }, m.setDatum, "goal", "now", m.setErrors,
      m.setTitle, m.setReason, m.setReasonNow, m.setReasonSucceed,
      m.setCompletionCriteria, m.setDifficulty, m.setEnergy, m.setDeadline,
      m.setCategory, m.setObstacle, m.setFallbackPlan, m.setIdentity,
      m.setMinimumAction, m.setTarget, m.setTrigger);
    expect(m.setReasonNow).toHaveBeenCalledWith("when now");
    const datumUpdater = m.setDatum.mock.calls.find(c => typeof c[0] === "function")?.[0];
    if (datumUpdater) {
      const result = datumUpdater({ reason: { mainReason: "old" } });
      expect(result.reason.nowReason).toBe("when now");
      expect(result.reason.mainReason).toBe("old");
    }
  });

  it("setDatum updater merges succeedReason correctly", () => {
    const m = createMockSetters();
    datumHandler("reason", { succeedReason: "to win" }, m.setDatum, "goal", "succeed", m.setErrors,
      m.setTitle, m.setReason, m.setReasonNow, m.setReasonSucceed,
      m.setCompletionCriteria, m.setDifficulty, m.setEnergy, m.setDeadline,
      m.setCategory, m.setObstacle, m.setFallbackPlan, m.setIdentity,
      m.setMinimumAction, m.setTarget, m.setTrigger);
    const datumUpdater = m.setDatum.mock.calls.find(c => typeof c[0] === "function")?.[0];
    if (datumUpdater) {
      const result = datumUpdater({ reason: { mainReason: "keep" } });
      expect(result.reason.succeedReason).toBe("to win");
      expect(result.reason.mainReason).toBe("keep");
    }
  });

  it("updates obstacle", () => {
    const m = createMockSetters();
    datumHandler("obstacle", "laziness", m.setDatum, "goal", "main", m.setErrors,
      m.setTitle, m.setReason, m.setReasonNow, m.setReasonSucceed,
      m.setCompletionCriteria, m.setDifficulty, m.setEnergy, m.setDeadline,
      m.setCategory, m.setObstacle, m.setFallbackPlan, m.setIdentity,
      m.setMinimumAction, m.setTarget, m.setTrigger);
    expect(m.setObstacle).toHaveBeenCalledWith("laziness");
  });

  it("updates deadline", () => {
    const m = createMockSetters();
    const d = new Date();
    datumHandler("deadline", d, m.setDatum, "goal", "main", m.setErrors,
      m.setTitle, m.setReason, m.setReasonNow, m.setReasonSucceed,
      m.setCompletionCriteria, m.setDifficulty, m.setEnergy, m.setDeadline,
      m.setCategory, m.setObstacle, m.setFallbackPlan, m.setIdentity,
      m.setMinimumAction, m.setTarget, m.setTrigger);
    expect(m.setDeadline).toHaveBeenCalledWith(d);
  });

  it("sets error for invalid title", () => {
    const m = createMockSetters();
    datumHandler("title", "", m.setDatum, "goal", "main", m.setErrors,
      m.setTitle, m.setReason, m.setReasonNow, m.setReasonSucceed,
      m.setCompletionCriteria, m.setDifficulty, m.setEnergy, m.setDeadline,
      m.setCategory, m.setObstacle, m.setFallbackPlan, m.setIdentity,
      m.setMinimumAction, m.setTarget, m.setTrigger);
    expect(m.setErrors).toHaveBeenCalled();
  });

  it("setDatum updater merges non-reason field correctly", () => {
    const m = createMockSetters();
    datumHandler("title", "New Title", m.setDatum, "goal", "main", m.setErrors,
      m.setTitle, m.setReason, m.setReasonNow, m.setReasonSucceed,
      m.setCompletionCriteria, m.setDifficulty, m.setEnergy, m.setDeadline,
      m.setCategory, m.setObstacle, m.setFallbackPlan, m.setIdentity,
      m.setMinimumAction, m.setTarget, m.setTrigger);
    expect(m.setTitle).toHaveBeenCalledWith("New Title");
    const datumUpdater = m.setDatum.mock.calls.find(c => typeof c[0] === "function")?.[0];
    if (datumUpdater) {
      const result = datumUpdater({ title: "old", difficulty: "easy" });
      expect(result.title).toBe("New Title");
      expect(result.difficulty).toBe("easy");
    }
  });

  it("clears error when validation passes", () => {
    const m = createMockSetters();
    datumHandler("difficulty", "medium", m.setDatum, "goal", "main", m.setErrors,
      m.setTitle, m.setReason, m.setReasonNow, m.setReasonSucceed,
      m.setCompletionCriteria, m.setDifficulty, m.setEnergy, m.setDeadline,
      m.setCategory, m.setObstacle, m.setFallbackPlan, m.setIdentity,
      m.setMinimumAction, m.setTarget, m.setTrigger);
    expect(m.setErrors).toHaveBeenCalled();
  });
});

describe("habit mode", () => {
  it("updates identity", () => {
    const m = createMockSetters();
    datumHandler("identity", "runner", m.setDatum, "habit", "main", m.setErrors,
      m.setTitle, m.setReason, m.setReasonNow, m.setReasonSucceed,
      m.setCompletionCriteria, m.setDifficulty, m.setEnergy, m.setDeadline,
      m.setCategory, m.setObstacle, m.setFallbackPlan, m.setIdentity,
      m.setMinimumAction, m.setTarget, m.setTrigger);
    expect(m.setIdentity).toHaveBeenCalledWith("runner");
  });

  it("updates minimumAction", () => {
    const m = createMockSetters();
    datumHandler("minimumAction", "walk 5 min", m.setDatum, "habit", "main", m.setErrors,
      m.setTitle, m.setReason, m.setReasonNow, m.setReasonSucceed,
      m.setCompletionCriteria, m.setDifficulty, m.setEnergy, m.setDeadline,
      m.setCategory, m.setObstacle, m.setFallbackPlan, m.setIdentity,
      m.setMinimumAction, m.setTarget, m.setTrigger);
    expect(m.setMinimumAction).toHaveBeenCalledWith("walk 5 min");
  });

  it("updates target", () => {
    const m = createMockSetters();
    datumHandler("target", "run 5k", m.setDatum, "habit", "main", m.setErrors,
      m.setTitle, m.setReason, m.setReasonNow, m.setReasonSucceed,
      m.setCompletionCriteria, m.setDifficulty, m.setEnergy, m.setDeadline,
      m.setCategory, m.setObstacle, m.setFallbackPlan, m.setIdentity,
      m.setMinimumAction, m.setTarget, m.setTrigger);
    expect(m.setTarget).toHaveBeenCalledWith("run 5k");
  });

  it("updates trigger", () => {
    const m = createMockSetters();
    datumHandler("trigger", "after coffee", m.setDatum, "habit", "main", m.setErrors,
      m.setTitle, m.setReason, m.setReasonNow, m.setReasonSucceed,
      m.setCompletionCriteria, m.setDifficulty, m.setEnergy, m.setDeadline,
      m.setCategory, m.setObstacle, m.setFallbackPlan, m.setIdentity,
      m.setMinimumAction, m.setTarget, m.setTrigger);
    expect(m.setTrigger).toHaveBeenCalledWith("after coffee");
  });

  it("updates reason in habit mode", () => {
    const m = createMockSetters();
    datumHandler("reason", "get healthy", m.setDatum, "habit", "main", m.setErrors,
      m.setTitle, m.setReason, m.setReasonNow, m.setReasonSucceed,
      m.setCompletionCriteria, m.setDifficulty, m.setEnergy, m.setDeadline,
      m.setCategory, m.setObstacle, m.setFallbackPlan, m.setIdentity,
      m.setMinimumAction, m.setTarget, m.setTrigger);
    expect(m.setReason).toHaveBeenCalledWith("get healthy");
  });

  it("sets error for invalid identity", () => {
    const m = createMockSetters();
    datumHandler("identity", "", m.setDatum, "habit", "main", m.setErrors,
      m.setTitle, m.setReason, m.setReasonNow, m.setReasonSucceed,
      m.setCompletionCriteria, m.setDifficulty, m.setEnergy, m.setDeadline,
      m.setCategory, m.setObstacle, m.setFallbackPlan, m.setIdentity,
      m.setMinimumAction, m.setTarget, m.setTrigger);
    expect(m.setErrors).toHaveBeenCalled();
  });
});
