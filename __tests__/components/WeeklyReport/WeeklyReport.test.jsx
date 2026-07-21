import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import WeeklyReport from "@/components/WeeklyReport/WeeklyReport";
import { useCommitments } from "@/lib/store/CommitmentContext";
import { saveDraft } from "@/lib/services/draftService";
import { LocaleProvider } from "@/lib/i18n/localeContext";

jest.mock("@/lib/store/CommitmentContext");
jest.mock("@/lib/services/draftService");

function makeWeekRange(date) {
  const d = new Date(date);
  const start = new Date(d);
  start.setDate(start.getDate() - start.getDay());
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  return { weekStart: start, weekEnd: end };
}

function renderWithCtx(commitments = [], loading = false) {
  useCommitments.mockReturnValue({ commitments, loading, dispatch: jest.fn() });
  const { weekStart, weekEnd } = makeWeekRange(new Date());
  const noop = jest.fn();
  return {
    ...render(
      <LocaleProvider>
        <WeeklyReport
          weekStart={weekStart}
          weekEnd={weekEnd}
          currentDate={new Date()}
          onPrev={noop}
          onNext={noop}
          onToday={noop}
          onJump={noop}
          onNavigate={noop}
        />
      </LocaleProvider>
    ),
    weekStart,
    weekEnd,
  };
}

describe("WeeklyReport", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders empty state when no commitments", () => {
    renderWithCtx([]);
    expect(screen.getByText("No items this week")).toBeTruthy();
  });

  it("renders goals and habits from context", () => {
    const now = new Date().toISOString();
    const items = [
      {
        id: "g1",
        type: "goal",
        title: "Learn Rust",
        category: "Coding",
        completed: false,
        actions: [],
        createdAt: now,
      },
      {
        id: "h1",
        type: "habit",
        title: "Read Daily",
        category: "Reading",
        completions: [],
        streak: 0,
        createdAt: now,
      },
    ];
    renderWithCtx(items);
    expect(screen.getByText("Learn Rust")).toBeTruthy();
    expect(screen.getByText("Read Daily")).toBeTruthy();
  });

  it("renders nothing while loading", () => {
    const { container } = renderWithCtx([], true);
    expect(container.innerHTML).toBe("");
  });

  it("does not render week navigation (lifted to page)", () => {
    renderWithCtx([]);
    expect(screen.queryByLabelText("Previous week")).toBeNull();
    expect(screen.queryByLabelText("Next week")).toBeNull();
  });

  it("renders action buttons", () => {
    renderWithCtx([]);
    expect(screen.getByText("Save Draft")).toBeTruthy();
    expect(screen.getByText("Export")).toBeTruthy();
    expect(screen.getByText("Publish")).toBeTruthy();
  });

  it("shows draft status", () => {
    renderWithCtx([]);
    expect(screen.getByText("draft")).toBeTruthy();
  });

  it("renders only goals when no habits", () => {
    const goals = [
      {
        id: "g1",
        type: "goal",
        title: "Only Goal",
        category: "Health",
        completed: false,
        actions: [],
        createdAt: new Date().toISOString(),
      },
    ];
    renderWithCtx(goals);
    expect(screen.getByText("Only Goal")).toBeTruthy();
    expect(screen.queryByText("No items this week")).toBeNull();
  });

  it("renders only habits when no goals", () => {
    const habits = [
      {
        id: "h1",
        type: "habit",
        title: "Only Habit",
        category: "Fitness",
        completions: [],
        streak: 0,
        createdAt: new Date().toISOString(),
      },
    ];
    renderWithCtx(habits);
    expect(screen.getByText("Only Habit")).toBeTruthy();
  });

  it("saveDraft persists week goals and habits to draftService", () => {
    saveDraft.mockReturnValue({ weekKey: "2026-07-13", status: "draft" });
    const now = new Date().toISOString();
    const items = [
      {
        id: "g1",
        type: "goal",
        title: "Learn Rust",
        category: "Coding",
        completed: false,
        actions: [],
        createdAt: now,
      },
      {
        id: "h1",
        type: "habit",
        title: "Read Daily",
        category: "Reading",
        completions: [],
        streak: 0,
        createdAt: now,
      },
    ];
    const { weekStart } = renderWithCtx(items);

    fireEvent.click(screen.getByText("Save Draft"));

    expect(saveDraft).toHaveBeenCalledTimes(1);
    const [weekKey, goals, habits] = saveDraft.mock.calls[0];
    expect(weekKey).toBe(weekStart.toISOString().split("T")[0]);
    expect(goals).toHaveLength(1);
    expect(goals[0].title).toBe("Learn Rust");
    expect(habits).toHaveLength(1);
    expect(habits[0].title).toBe("Read Daily");
  });

  it("saveDraft shows error toast when no items", () => {
    renderWithCtx([]);

    fireEvent.click(screen.getByText("Save Draft"));

    expect(saveDraft).not.toHaveBeenCalled();
    expect(screen.getByText("Nothing to save")).toBeTruthy();
  });

  it("saveDraft shows saving indicator then success toast", () => {
    jest.useFakeTimers();
    saveDraft.mockReturnValue({ weekKey: "2026-07-13", status: "draft" });
    const now = new Date().toISOString();
    renderWithCtx([
      {
        id: "g1",
        type: "goal",
        title: "Goal",
        category: "Health",
        completed: false,
        actions: [],
        createdAt: now,
      },
    ]);

    act(() => {
      fireEvent.click(screen.getByText("Save Draft"));
    });

    expect(screen.getByText("Saving\u2026")).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(screen.getByText("Draft saved")).toBeTruthy();
    jest.useRealTimers();
  });

  it("saveDraft persists to localStorage under separate key", () => {
    saveDraft.mockImplementation((weekKey, goals, habits) => {
      localStorage.setItem(
        "report-drafts",
        JSON.stringify([{ weekKey, goals, habits }])
      );
      return { weekKey, status: "draft" };
    });
    const now = new Date().toISOString();
    renderWithCtx([
      {
        id: "g1",
        type: "goal",
        title: "Goal",
        category: "Health",
        completed: false,
        actions: [],
        createdAt: now,
      },
    ]);

    fireEvent.click(screen.getByText("Save Draft"));

    const stored = JSON.parse(localStorage.getItem("report-drafts"));
    expect(stored).toHaveLength(1);
    expect(stored[0].goals[0].title).toBe("Goal");
    expect(localStorage.getItem("commitments")).toBeNull();
  });
});
