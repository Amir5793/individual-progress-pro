jest.mock("@/backend/local_storage/local_storage_api", () => ({
  get: jest.fn(),
  put: jest.fn(),
}));

import { get, put } from "@/backend/local_storage/local_storage_api";
import {
  getHabits,
  createHabit,
  updateHabit,
  patchHabit,
  deleteHabit,
} from "@/lib/services/habitServices";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("getHabits", () => {
  it("returns data from storage", () => {
    get.mockReturnValue({ success: true, data: [{ id: "1" }] });
    expect(getHabits()).toEqual([{ id: "1" }]);
  });

  it("returns [] on failure", () => {
    get.mockReturnValue({ success: false });
    expect(getHabits()).toEqual([]);
  });
});

describe("createHabit", () => {
  it("appends to existing habits", () => {
    get.mockReturnValue({ success: true, data: [{ id: "1" }] });
    put.mockReturnValue({ success: true });
    createHabit({ id: "2" });
    expect(put).toHaveBeenCalledWith("habits", [{ id: "1" }, { id: "2" }]);
  });
});

describe("updateHabit", () => {
  it("replaces matching habit", () => {
    get.mockReturnValue({ success: true, data: [{ id: "1", title: "old" }, { id: "2" }] });
    put.mockReturnValue({ success: true });
    updateHabit("1", { id: "1", title: "new" });
    expect(put).toHaveBeenCalledWith("habits", [
      { id: "1", title: "new" },
      { id: "2" },
    ]);
  });
});

describe("patchHabit", () => {
  it("merges values into matching habit", () => {
    get.mockReturnValue({ success: true, data: [{ id: "1", a: 1 }] });
    put.mockReturnValue({ success: true });
    patchHabit("1", { b: 2 });
    expect(put).toHaveBeenCalledWith("habits", [{ id: "1", a: 1, b: 2 }]);
  });
});

describe("deleteHabit", () => {
  it("filters out by id", () => {
    get.mockReturnValue({ success: true, data: [{ id: "1" }, { id: "2" }] });
    put.mockReturnValue({ success: true });
    deleteHabit("1");
    expect(put).toHaveBeenCalledWith("habits", [{ id: "2" }]);
  });
});
