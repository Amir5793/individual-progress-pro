import { sortItems } from "@/lib/items/sorting";

describe("sortItems", () => {
  it("returns empty array for empty input", () => {
    expect(sortItems([], "priority")).toEqual([]);
  });

  it("returns the same single item", () => {
    const item = { title: "A", createdAt: "2024-01-01" };
    expect(sortItems([item], "priority")).toEqual([item]);
  });

  it("default sort is priority", () => {
    const items = [
      { title: "A", difficulty: "easy", energy: "low", deadline: null },
      { title: "B", difficulty: "hard", energy: "high", deadline: null },
    ];
    const result = sortItems(items);
    expect(result[0].title).toBe("B");
  });

  describe("sortBy created", () => {
    it("sorts by createdAt descending", () => {
      const items = [
        { title: "A", createdAt: "2024-01-01" },
        { title: "B", createdAt: "2024-06-01" },
        { title: "C", createdAt: "2024-03-01" },
      ];
      const result = sortItems(items, "created");
      expect(result.map((i) => i.title)).toEqual(["B", "C", "A"]);
    });
  });

  describe("sortBy deadline", () => {
    it("sorts by deadline ascending, nulls last", () => {
      const items = [
        { title: "A", deadline: "2024-06-01" },
        { title: "B", deadline: null },
        { title: "C", deadline: "2024-01-01" },
      ];
      const result = sortItems(items, "deadline");
      expect(result.map((i) => i.title)).toEqual(["C", "A", "B"]);
    });
  });

  describe("sortBy title", () => {
    it("sorts alphabetically", () => {
      const items = [
        { title: "Cherry" },
        { title: "Apple" },
        { title: "Banana" },
      ];
      const result = sortItems(items, "title");
      expect(result.map((i) => i.title)).toEqual(["Apple", "Banana", "Cherry"]);
    });
  });

  describe("sortBy completed", () => {
    it("sorts incomplete first", () => {
      const items = [
        { title: "A", completed: true },
        { title: "B", completed: false },
        { title: "C", completed: false },
      ];
      const result = sortItems(items, "completed");
      expect(result[0].completed).toBe(false);
      expect(result[2].completed).toBe(true);
    });
  });

  describe("sortBy priority", () => {
    it("overdue gets highest priority", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const items = [
        { title: "A", deadline: yesterday.toISOString(), difficulty: "easy", energy: "low" },
        { title: "B", deadline: null, difficulty: "easy", energy: "low" },
      ];
      const result = sortItems(items, "priority");
      expect(result[0].title).toBe("A");
    });

    it("deadline within 1 day gets 80 points", () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(23, 59, 59);
      const inTenDays = new Date();
      inTenDays.setDate(inTenDays.getDate() + 10);
      const a = { title: "Soon", deadline: tomorrow.toISOString(), difficulty: "easy", energy: "low" };
      const b = { title: "Far", deadline: inTenDays.toISOString(), difficulty: "easy", energy: "low" };
      const result = sortItems([a, b], "priority");
      expect(result[0].title).toBe("Soon");
    });

    it("deadline 1-3 days gets 60 points", () => {
      const inTwoDays = new Date();
      inTwoDays.setDate(inTwoDays.getDate() + 2);
      const inTenDays = new Date();
      inTenDays.setDate(inTenDays.getDate() + 10);
      const a = { title: "Soonish", deadline: inTwoDays.toISOString(), difficulty: "easy", energy: "low" };
      const b = { title: "Far", deadline: inTenDays.toISOString(), difficulty: "easy", energy: "low" };
      const result = sortItems([a, b], "priority");
      expect(result[0].title).toBe("Soonish");
    });

    it("deadline 4-7 days gets 40 points", () => {
      const inFiveDays = new Date();
      inFiveDays.setDate(inFiveDays.getDate() + 5);
      const inTenDays = new Date();
      inTenDays.setDate(inTenDays.getDate() + 10);
      const a = { title: "Weekish", deadline: inFiveDays.toISOString(), difficulty: "easy", energy: "low" };
      const b = { title: "Far", deadline: inTenDays.toISOString(), difficulty: "easy", energy: "low" };
      const result = sortItems([a, b], "priority");
      expect(result[0].title).toBe("Weekish");
    });

    it("deadline >7 days gets 0 deadline points", () => {
      const inTenDays = new Date();
      inTenDays.setDate(inTenDays.getDate() + 10);
      const inTwentyDays = new Date();
      inTwentyDays.setDate(inTwentyDays.getDate() + 20);
      const a = { title: "Far", deadline: inTenDays.toISOString(), difficulty: "easy", energy: "low" };
      const b = { title: "VeryFar", deadline: inTwentyDays.toISOString(), difficulty: "easy", energy: "low" };
      const result = sortItems([a, b], "priority");
      expect(result[0].title).toBe("Far");
    });

    it("no deadline gets 0 deadline points", () => {
      const inFiveDays = new Date();
      inFiveDays.setDate(inFiveDays.getDate() + 5);
      const a = { title: "No DL", deadline: null, difficulty: "easy", energy: "low" };
      const b = { title: "Has DL", deadline: inFiveDays.toISOString(), difficulty: "easy", energy: "low" };
      const result = sortItems([a, b], "priority");
      expect(result[0].title).toBe("Has DL");
    });

    it("difficulty easy gives 10 points", () => {
      const a = { title: "A", difficulty: "easy", energy: "low", deadline: null };
      const b = { title: "B", difficulty: "hard", energy: "low", deadline: null };
      const result = sortItems([a, b], "priority");
      expect(result[0].title).toBe("B");
    });

    it("difficulty medium gives 20 points", () => {
      const a = { title: "Easy", difficulty: "easy", energy: "low", deadline: null };
      const b = { title: "Medium", difficulty: "medium", energy: "low", deadline: null };
      const result = sortItems([a, b], "priority");
      expect(result[0].title).toBe("Medium");
    });

    it("energy high gives 15 points", () => {
      const a = { title: "A", difficulty: "easy", energy: "low", deadline: null };
      const b = { title: "B", difficulty: "easy", energy: "high", deadline: null };
      const result = sortItems([a, b], "priority");
      expect(result[0].title).toBe("B");
    });

    it("energy medium gives 10 points", () => {
      const a = { title: "Low", difficulty: "easy", energy: "low", deadline: null };
      const b = { title: "Med", difficulty: "easy", energy: "medium", deadline: null };
      const result = sortItems([a, b], "priority");
      expect(result[0].title).toBe("Med");
    });

    it("item with no deadline gets score 0 for deadline portion", () => {
      const noDl = { title: "No DL", difficulty: "easy", energy: "low", deadline: null };
      const withDl = { title: "DL", difficulty: "easy", energy: "low", deadline: new Date().toISOString() };
      const result = sortItems([noDl, withDl], "priority");
      expect(result[0].title).toBe("DL");
    });

    it("unknown difficulty and energy give 0", () => {
      const a = { title: "X", difficulty: "unknown", energy: "unknown", deadline: null };
      const b = { title: "Y", difficulty: "hard", energy: "high", deadline: null };
      const result = sortItems([a, b], "priority");
      expect(result[0].title).toBe("Y");
    });
  });

  describe("sortBy deadline", () => {
    it("both null deadlines", () => {
      const items = [
        { title: "A", deadline: null },
        { title: "B", deadline: null },
      ];
      const result = sortItems(items, "deadline");
      expect(result).toHaveLength(2);
    });
  });

  describe("sortBy completed", () => {
    it("both completed", () => {
      const items = [
        { title: "A", completed: true },
        { title: "B", completed: true },
      ];
      const result = sortItems(items, "completed");
      expect(result).toHaveLength(2);
    });
  });
});
