jest.mock("@/backend/local_storage/local_storage_api", () => ({
  get: jest.fn(),
  put: jest.fn(),
}));

import { get, put } from "@/backend/local_storage/local_storage_api";
import {
  getCommitments,
  getGoals,
  getHabits,
  getCommitmentById,
  createCommitment,
  updateCommitment,
  patchCommitment,
  deleteCommitment,
  completeGoal,
  uncompleteGoal,
  updateHabitStatus,
  toggleActionComplete,
} from "@/lib/services/commitmentService";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("getCommitments", () => {
  it("returns array from storage", () => {
    get.mockReturnValue({ success: true, data: [{ id: "1" }] });
    expect(getCommitments()).toEqual([{ id: "1" }]);
  });

  it("returns [] if data is not array", () => {
    get.mockReturnValue({ success: true, data: { foo: "bar" } });
    expect(getCommitments()).toEqual([]);
  });

  it("returns [] on failure", () => {
    get.mockReturnValue({ success: false, error: "not found" });
    expect(getCommitments()).toEqual([]);
  });
});

describe("getGoals", () => {
  it("filters by type goal", () => {
    get.mockReturnValue({
      success: true,
      data: [
        { id: "1", type: "goal" },
        { id: "2", type: "habit" },
      ],
    });
    expect(getGoals()).toEqual([{ id: "1", type: "goal" }]);
  });
});

describe("getHabits", () => {
  it("filters by type habit", () => {
    get.mockReturnValue({
      success: true,
      data: [
        { id: "1", type: "goal" },
        { id: "2", type: "habit" },
      ],
    });
    expect(getHabits()).toEqual([{ id: "2", type: "habit" }]);
  });
});

describe("getCommitmentById", () => {
  it("finds by id", () => {
    get.mockReturnValue({
      success: true,
      data: [{ id: "abc" }, { id: "def" }],
    });
    expect(getCommitmentById("def")).toEqual({ id: "def" });
  });

  it("returns undefined if not found", () => {
    get.mockReturnValue({ success: true, data: [{ id: "abc" }] });
    expect(getCommitmentById("xyz")).toBeUndefined();
  });
});

describe("createCommitment", () => {
  it("appends and saves", () => {
    get.mockReturnValue({ success: true, data: [{ id: "1" }] });
    put.mockReturnValue({ success: true });
    const result = createCommitment({ id: "2" });
    expect(put).toHaveBeenCalledWith("commitments", expect.arrayContaining([expect.objectContaining({ id: "1" }), expect.objectContaining({ id: "2" })]));
    expect(result).toEqual(expect.arrayContaining([expect.objectContaining({ id: "2" })]));
  });
});

describe("updateCommitment", () => {
  it("updates matching by id", () => {
    get.mockReturnValue({ success: true, data: [{ id: "1", title: "old" }, { id: "2" }] });
    put.mockReturnValue({ success: true });
    const result = updateCommitment("1", { id: "1", title: "new" });
    expect(result[0].title).toBe("new");
  });
});

describe("patchCommitment", () => {
  it("merges values into matching commitment", () => {
    get.mockReturnValue({ success: true, data: [{ id: "1", a: 1, b: 2 }] });
    put.mockReturnValue({ success: true });
    const result = patchCommitment("1", { b: 99 });
    expect(result[0]).toEqual({ id: "1", a: 1, b: 99 });
  });
});

describe("deleteCommitment", () => {
  it("filters out by id", () => {
    get.mockReturnValue({ success: true, data: [{ id: "1" }, { id: "2" }] });
    put.mockReturnValue({ success: true });
    const result = deleteCommitment("1");
    expect(result).toEqual([{ id: "2" }]);
  });
});

describe("completeGoal", () => {
  it("sets completed true and completedAt", () => {
    get.mockReturnValue({ success: true, data: [{ id: "g1", completed: false }] });
    put.mockReturnValue({ success: true });
    const result = completeGoal("g1");
    expect(result[0].completed).toBe(true);
    expect(result[0].completedAt).toBeDefined();
  });
});

describe("uncompleteGoal", () => {
  it("sets completed false and completedAt null", () => {
    get.mockReturnValue({ success: true, data: [{ id: "g1", completed: true, completedAt: "2024-01-01" }] });
    put.mockReturnValue({ success: true });
    const result = uncompleteGoal("g1");
    expect(result[0].completed).toBe(false);
    expect(result[0].completedAt).toBeNull();
  });
});

describe("updateHabitStatus", () => {
  it("patches status, completions, streak", () => {
    get.mockReturnValue({ success: true, data: [{ id: "h1" }] });
    put.mockReturnValue({ success: true });
    const completions = [{ date: "2024-01-01", status: "completed" }];
    const result = updateHabitStatus("h1", "completed", completions, 5);
    expect(result[0].status).toBe("completed");
    expect(result[0].completions).toEqual(completions);
    expect(result[0].streak).toBe(5);
  });
});

describe("toggleActionComplete", () => {
  it("toggles by action index", () => {
    get.mockReturnValue({
      success: true,
      data: [{ id: "g1", actions: [{ id: "a1", completed: false }] }],
    });
    put.mockReturnValue({ success: true });
    const result = toggleActionComplete("g1", 0);
    expect(result[0].actions[0].completed).toBe(true);
    expect(result[0].actions[0].completedAt).toBeDefined();
  });

  it("toggles by action id string", () => {
    get.mockReturnValue({
      success: true,
      data: [{ id: "g1", actions: [{ id: "a1", completed: false }] }],
    });
    put.mockReturnValue({ success: true });
    const result = toggleActionComplete("g1", "a1");
    expect(result[0].actions[0].completed).toBe(true);
  });

  it("returns unchanged if goal not found", () => {
    get.mockReturnValue({ success: true, data: [{ id: "other", actions: [] }] });
    put.mockReturnValue({ success: true });
    const result = toggleActionComplete("g1", 0);
    expect(result[0].id).toBe("other");
  });

  it("returns unchanged if action index out of range", () => {
    get.mockReturnValue({
      success: true,
      data: [{ id: "g1", actions: [{ id: "a1", completed: false }] }],
    });
    put.mockReturnValue({ success: true });
    const result = toggleActionComplete("g1", 5);
    expect(result[0].actions[0].completed).toBe(false);
  });
});
