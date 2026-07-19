import React from "react";
import { render, screen } from "@testing-library/react";
import WeeklyReport from "@/components/WeeklyReport/WeeklyReport";
import { useCommitments } from "@/lib/store/CommitmentContext";

jest.mock("@/lib/store/CommitmentContext");

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
  return render(
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
  );
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
});
