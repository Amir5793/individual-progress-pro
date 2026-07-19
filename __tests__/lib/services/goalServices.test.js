jest.mock("@/backend/local_storage/local_storage_api", () => ({
  get: jest.fn(),
  put: jest.fn(),
}));

import { get, put } from "@/backend/local_storage/local_storage_api";
import {
  getGoals,
  createGoal,
  updateGoal,
  patchGoal,
  deleteGoal,
} from "@/lib/services/goalServices";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("getGoals", () => {
  it("returns data from storage", () => {
    get.mockReturnValue({ success: true, data: [{ id: "1" }] });
    expect(getGoals()).toEqual([{ id: "1" }]);
  });

  it("returns [] on failure", () => {
    get.mockReturnValue({ success: false });
    expect(getGoals()).toEqual([]);
  });
});

describe("createGoal", () => {
  it("appends to existing goals", () => {
    get.mockReturnValue({ success: true, data: [{ id: "1" }] });
    put.mockReturnValue({ success: true });
    createGoal({ id: "2" });
    expect(put).toHaveBeenCalledWith("goals", [
      { id: "1" },
      { id: "2" },
    ]);
  });
});

describe("updateGoal", () => {
  it("replaces matching goal", () => {
    get.mockReturnValue({ success: true, data: [{ id: "1", title: "old" }, { id: "2" }] });
    put.mockReturnValue({ success: true });
    updateGoal("1", { id: "1", title: "new" });
    expect(put).toHaveBeenCalledWith("goals", [
      { id: "1", title: "new" },
      { id: "2" },
    ]);
  });
});

describe("patchGoal", () => {
  it("merges values into matching goal", () => {
    get.mockReturnValue({ success: true, data: [{ id: "1", a: 1 }] });
    put.mockReturnValue({ success: true });
    patchGoal("1", { b: 2 });
    expect(put).toHaveBeenCalledWith("goals", [
      { id: "1", a: 1, b: 2 },
    ]);
  });
});

describe("deleteGoal", () => {
  it("filters out by id", () => {
    get.mockReturnValue({ success: true, data: [{ id: "1" }, { id: "2" }] });
    put.mockReturnValue({ success: true });
    deleteGoal("1");
    expect(put).toHaveBeenCalledWith("goals", [{ id: "2" }]);
  });
});
