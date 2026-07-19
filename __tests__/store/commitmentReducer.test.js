import { commitmentReducer, initialState } from "@/lib/store/commitmentReducer";
import {
  COMMITMENTS_LOADED,
  COMMITMENT_CREATED,
  COMMITMENT_UPDATED,
  COMMITMENT_DELETED,
  GOAL_TOGGLED,
  HABIT_STATUS_CHANGED,
} from "@/lib/store/types";

describe("commitmentReducer", () => {
  it("COMMITMENTS_LOADED sets commitments and loading false", () => {
    const commitments = [{ id: "1" }, { id: "2" }];
    const result = commitmentReducer(initialState, {
      type: COMMITMENTS_LOADED,
      payload: commitments,
    });
    expect(result.commitments).toEqual(commitments);
    expect(result.loading).toBe(false);
  });

  it("COMMITMENT_CREATED appends commitment", () => {
    const state = { commitments: [{ id: "1" }], loading: false };
    const result = commitmentReducer(state, {
      type: COMMITMENT_CREATED,
      payload: { id: "2" },
    });
    expect(result.commitments).toHaveLength(2);
    expect(result.commitments[1].id).toBe("2");
  });

  it("COMMITMENT_UPDATED updates matching commitment", () => {
    const state = { commitments: [{ id: "1", title: "old" }], loading: false };
    const result = commitmentReducer(state, {
      type: COMMITMENT_UPDATED,
      payload: { id: "1", title: "new" },
    });
    expect(result.commitments[0].title).toBe("new");
  });

  it("COMMITMENT_DELETED removes matching commitment", () => {
    const state = {
      commitments: [{ id: "1" }, { id: "2" }],
      loading: false,
    };
    const result = commitmentReducer(state, {
      type: COMMITMENT_DELETED,
      payload: "1",
    });
    expect(result.commitments).toHaveLength(1);
    expect(result.commitments[0].id).toBe("2");
  });

  it("GOAL_TOGGLED updates completed/completedAt", () => {
    const state = {
      commitments: [{ id: "1", completed: false, completedAt: null }],
      loading: false,
    };
    const now = new Date().toISOString();
    const result = commitmentReducer(state, {
      type: GOAL_TOGGLED,
      payload: { id: "1", completed: true, completedAt: now },
    });
    expect(result.commitments[0].completed).toBe(true);
    expect(result.commitments[0].completedAt).toBe(now);
  });

  it("HABIT_STATUS_CHANGED updates status/completions/streak", () => {
    const state = {
      commitments: [{ id: "1", status: null, completions: [], streak: 0 }],
      loading: false,
    };
    const result = commitmentReducer(state, {
      type: HABIT_STATUS_CHANGED,
      payload: {
        id: "1",
        status: "completed",
        completions: [{ date: "2024-01-01", status: "completed" }],
        streak: 1,
      },
    });
    expect(result.commitments[0].status).toBe("completed");
    expect(result.commitments[0].completions).toHaveLength(1);
    expect(result.commitments[0].streak).toBe(1);
  });

  it("default returns state unchanged", () => {
    const state = { commitments: [], loading: true };
    const result = commitmentReducer(state, { type: "UNKNOWN" });
    expect(result).toBe(state);
  });

  describe("multi-item state pass-through", () => {
    it("COMMITMENT_UPDATED leaves non-matching items unchanged", () => {
      const state = {
        commitments: [
          { id: "1", title: "first" },
          { id: "2", title: "second" },
          { id: "3", title: "third" },
        ],
        loading: false,
      };
      const result = commitmentReducer(state, {
        type: COMMITMENT_UPDATED,
        payload: { id: "2", title: "updated" },
      });
      expect(result.commitments[0]).toEqual({ id: "1", title: "first" });
      expect(result.commitments[1]).toEqual({ id: "2", title: "updated" });
      expect(result.commitments[2]).toEqual({ id: "3", title: "third" });
    });

    it("COMMITMENT_DELETED leaves non-matching items unchanged", () => {
      const state = {
        commitments: [
          { id: "1", title: "first" },
          { id: "2", title: "second" },
          { id: "3", title: "third" },
        ],
        loading: false,
      };
      const result = commitmentReducer(state, {
        type: COMMITMENT_DELETED,
        payload: "2",
      });
      expect(result.commitments).toHaveLength(2);
      expect(result.commitments.find(c => c.id === "2")).toBeUndefined();
    });

    it("GOAL_TOGGLED leaves non-matching items unchanged", () => {
      const state = {
        commitments: [
          { id: "1", completed: false, completedAt: null },
          { id: "2", completed: false, completedAt: null },
        ],
        loading: false,
      };
      const result = commitmentReducer(state, {
        type: GOAL_TOGGLED,
        payload: { id: "1", completed: true, completedAt: "2024-01-01" },
      });
      expect(result.commitments[0].completed).toBe(true);
      expect(result.commitments[1].completed).toBe(false);
      expect(result.commitments[1].completedAt).toBeNull();
    });

    it("HABIT_STATUS_CHANGED leaves non-matching items unchanged", () => {
      const state = {
        commitments: [
          { id: "1", status: null, completions: [], streak: 0 },
          { id: "2", status: "completed", completions: [], streak: 1 },
        ],
        loading: false,
      };
      const result = commitmentReducer(state, {
        type: HABIT_STATUS_CHANGED,
        payload: {
          id: "1",
          status: "minimum",
          completions: [{ date: "2024-01-01", status: "minimum" }],
          streak: 0,
        },
      });
      expect(result.commitments[0].status).toBe("minimum");
      expect(result.commitments[1].status).toBe("completed");
      expect(result.commitments[1].streak).toBe(1);
    });
  });
});
