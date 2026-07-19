import {
  getDrafts,
  getDraftByWeek,
  saveDraft,
  deleteDraft,
} from "@/lib/services/draftService";

beforeEach(() => {
  localStorage.clear();
});

describe("draftService", () => {
  const goal = {
    id: "g1",
    type: "goal",
    title: "Learn Rust",
    category: "Coding",
    completed: false,
    actions: [],
    createdAt: "2026-07-14T10:00:00.000Z",
  };

  const habit = {
    id: "h1",
    type: "habit",
    title: "Read Daily",
    category: "Reading",
    completions: [],
    streak: 0,
    createdAt: "2026-07-15T10:00:00.000Z",
  };

  it("returns empty array when no drafts exist", () => {
    expect(getDrafts()).toEqual([]);
  });

  it("returns null when no draft matches weekKey", () => {
    expect(getDraftByWeek("2026-07-13")).toBeNull();
  });

  it("saves a draft and retrieves it by weekKey", () => {
    saveDraft("2026-07-13", [goal], [habit]);

    const draft = getDraftByWeek("2026-07-13");
    expect(draft).toBeTruthy();
    expect(draft.weekKey).toBe("2026-07-13");
    expect(draft.status).toBe("draft");
    expect(draft.goals).toHaveLength(1);
    expect(draft.habits).toHaveLength(1);
    expect(draft.savedAt).toBeTruthy();
  });

  it("upserts when saving same weekKey twice", () => {
    saveDraft("2026-07-13", [goal], [habit]);
    saveDraft("2026-07-13", [goal], []);

    const drafts = getDrafts();
    expect(drafts).toHaveLength(1);
    expect(drafts[0].habits).toHaveLength(0);
  });

  it("stores multiple drafts for different weeks", () => {
    saveDraft("2026-07-13", [goal], []);
    saveDraft("2026-07-06", [], [habit]);

    expect(getDrafts()).toHaveLength(2);
    expect(getDraftByWeek("2026-07-13").goals).toHaveLength(1);
    expect(getDraftByWeek("2026-07-06").habits).toHaveLength(1);
  });

  it("deletes a draft by weekKey", () => {
    saveDraft("2026-07-13", [goal], [habit]);
    saveDraft("2026-07-06", [], [habit]);

    deleteDraft("2026-07-13");

    expect(getDrafts()).toHaveLength(1);
    expect(getDraftByWeek("2026-07-13")).toBeNull();
    expect(getDraftByWeek("2026-07-06")).toBeTruthy();
  });

  it("deleting non-existent draft is a no-op", () => {
    saveDraft("2026-07-13", [goal], []);
    deleteDraft("2026-01-01");

    expect(getDrafts()).toHaveLength(1);
  });

  it("saves deep copies, not references to originals", () => {
    const items = [{ ...goal }];
    saveDraft("2026-07-13", items, []);

    items[0].title = "Mutated";
    const draft = getDraftByWeek("2026-07-13");
    expect(draft.goals[0].title).toBe("Learn Rust");
  });
});
