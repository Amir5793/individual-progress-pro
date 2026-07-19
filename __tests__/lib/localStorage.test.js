import { localStorageHandler } from "@/backend/local_storage/local_storage_api";

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

describe("localStorageHandler", () => {
  describe("GET", () => {
    it("returns 404 for nonexistent key", () => {
      const result = localStorageHandler("GET", "nonexistent");
      expect(result.success).toBe(false);
      expect(result.status).toBe(404);
    });

    it("returns data for existing key", () => {
      localStorage.setItem("test-key", JSON.stringify({ foo: "bar" }));
      const result = localStorageHandler("GET", "test-key");
      expect(result.success).toBe(true);
      expect(result.data).toEqual({ foo: "bar" });
      expect(result.status).toBe(200);
    });

    it("returns all items when no key provided", () => {
      localStorage.setItem("a", "1");
      localStorage.setItem("b", "2");
      const result = localStorageHandler("GET", undefined);
      expect(result.success).toBe(true);
      expect(Object.keys(result.data)).toHaveLength(2);
    });
  });

  describe("POST", () => {
    it("creates new item", () => {
      const result = localStorageHandler("POST", "new", { val: 1 });
      expect(result.success).toBe(true);
      expect(result.status).toBe(201);
      expect(localStorage.getItem("new")).toBe(JSON.stringify({ val: 1 }));
    });

    it("returns 409 for duplicate", () => {
      localStorage.setItem("existing", "data");
      const result = localStorageHandler("POST", "existing", "new data");
      expect(result.success).toBe(false);
      expect(result.status).toBe(409);
    });

    it("returns 400 when no key", () => {
      const result = localStorageHandler("POST", "", "data");
      expect(result.success).toBe(false);
      expect(result.status).toBe(400);
    });
  });

  describe("PUT", () => {
    it("overwrites existing", () => {
      localStorage.setItem("key", "old");
      const result = localStorageHandler("PUT", "key", "new");
      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(localStorage.getItem("key")).toBe("new");
    });
  });

  describe("PATCH", () => {
    it("merges objects", () => {
      localStorage.setItem("obj", JSON.stringify({ a: 1, b: 2 }));
      const result = localStorageHandler("PATCH", "obj", { b: 99 });
      expect(result.success).toBe(true);
      expect(result.data).toEqual({ a: 1, b: 99 });
    });

    it("returns 404 for nonexistent", () => {
      const result = localStorageHandler("PATCH", "nope", { x: 1 });
      expect(result.success).toBe(false);
      expect(result.status).toBe(404);
    });
  });

  describe("DELETE", () => {
    it("removes item", () => {
      localStorage.setItem("del-me", "value");
      const result = localStorageHandler("DELETE", "del-me");
      expect(result.success).toBe(true);
      expect(localStorage.getItem("del-me")).toBeNull();
    });

    it("returns 404 for nonexistent", () => {
      const result = localStorageHandler("DELETE", "nope");
      expect(result.success).toBe(false);
      expect(result.status).toBe(404);
    });
  });

  describe("invalid method", () => {
    it("returns 400", () => {
      const result = localStorageHandler("INVALID", "key");
      expect(result.success).toBe(false);
      expect(result.status).toBe(400);
    });
  });

  describe("validation", () => {
    it("passes validation on POST", () => {
      const validation = () => true;
      const result = localStorageHandler("POST", "ok", "val", validation);
      expect(result.success).toBe(true);
    });

    it("fails validation on POST", () => {
      const validation = () => ({ valid: false, error: "bad" });
      const result = localStorageHandler("POST", "fail", "val", validation);
      expect(result.success).toBe(false);
      expect(result.error).toBe("bad");
    });

    it("returns 400 when validation is not a function", () => {
      const result = localStorageHandler("POST", "key", "val", "not-a-function");
      expect(result.success).toBe(false);
      expect(result.status).toBe(400);
      expect(result.error).toBe("Validation must be a function.");
    });

    it("fails validation with boolean false on PUT", () => {
      const validation = () => false;
      const result = localStorageHandler("PUT", "key", "val", validation);
      expect(result.success).toBe(false);
      expect(result.status).toBe(400);
    });
  });

  describe("GET all with non-JSON values", () => {
    it("returns raw string when JSON.parse fails for get-all", () => {
      localStorage.setItem("json-key", JSON.stringify({ a: 1 }));
      localStorage.setItem("raw-key", "not-json");
      const result = localStorageHandler("GET", undefined);
      expect(result.success).toBe(true);
      expect(result.data["json-key"]).toEqual({ a: 1 });
      expect(result.data["raw-key"]).toBe("not-json");
    });

    it("returns raw string when JSON.parse fails for single GET", () => {
      localStorage.setItem("raw-key", "just a string");
      const result = localStorageHandler("GET", "raw-key");
      expect(result.success).toBe(true);
      expect(result.data).toBe("just a string");
    });
  });

  describe("PATCH edge cases", () => {
    it("returns 400 for non-JSON existing value", () => {
      localStorage.setItem("patch-key", "not-json-at-all");
      const result = localStorageHandler("PATCH", "patch-key", { a: 1 });
      expect(result.success).toBe(false);
      expect(result.status).toBe(400);
      expect(result.error).toContain("non");
    });

    it("returns 400 for array value", () => {
      localStorage.setItem("arr-key", JSON.stringify([1, 2, 3]));
      const result = localStorageHandler("PATCH", "arr-key", { b: 2 });
      expect(result.success).toBe(false);
      expect(result.status).toBe(400);
      expect(result.error).toContain("plain objects");
    });

    it("returns 400 for primitive value", () => {
      localStorage.setItem("num-key", JSON.stringify(42));
      const result = localStorageHandler("PATCH", "num-key", { b: 2 });
      expect(result.success).toBe(false);
      expect(result.status).toBe(400);
    });
  });

  describe("error handling", () => {
    it("returns 500 when localStorage throws", () => {
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new Error("Quota exceeded");
      });
      const result = localStorageHandler("POST", "key", "val");
      expect(result.success).toBe(false);
      expect(result.status).toBe(500);
      expect(result.error).toBe("Quota exceeded");
      localStorage.setItem = originalSetItem;
    });
  });
});
