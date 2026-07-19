import React from "react";
import { render, screen } from "@testing-library/react";
import DashboardSummary from "@/components/DashboardSummary/DashboardSummary";
import { useCommitments } from "@/lib/store/CommitmentContext";

jest.mock("@/lib/store/CommitmentContext");
jest.mock("next/link", () => {
  const MockLink = ({ children, href, ...props }) => (
    <a href={href} data-testid="next-link" {...props}>
      {children}
    </a>
  );
  MockLink.displayName = "MockLink";
  return MockLink;
});

function makeGoal(overrides = {}) {
  return {
    id: "g1",
    type: "goal",
    title: "Learn Rust",
    category: "Learning",
    difficulty: "hard",
    energy: "high",
    deadline: null,
    completed: false,
    completedAt: null,
    actions: [],
    ...overrides,
  };
}

function makeHabit(overrides = {}) {
  return {
    id: "h1",
    type: "habit",
    title: "Read Daily",
    identity: "Be a reader",
    category: "Reading",
    completions: [],
    streak: 0,
    ...overrides,
  };
}

function renderWithCtx(commitments, loading = false) {
  useCommitments.mockReturnValue({ commitments, loading, dispatch: jest.fn() });
  return render(<DashboardSummary />);
}

describe("DashboardSummary", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing while loading", () => {
    const { container } = renderWithCtx([], true);
    expect(container.innerHTML).toBe("");
  });

  it("renders empty state when no commitments", () => {
    renderWithCtx([]);
    expect(screen.getByText("No commitments yet")).toBeTruthy();
    expect(
      screen.getByText(
        "Create your first goal or habit to see your dashboard summary here."
      )
    ).toBeTruthy();
  });

  it("renders undone goal count in summary", () => {
    const goals = [
      makeGoal({ id: "g1", completed: false }),
      makeGoal({ id: "g2", completed: false }),
    ];
    renderWithCtx(goals);

    expect(screen.getByText(/You have/)).toBeTruthy();
    expect(screen.getByText("2")).toBeTruthy();
    expect(screen.getByText(/undone goals/)).toBeTruthy();
  });

  it("renders undone habit count in summary", () => {
    const habits = [
      makeHabit({ id: "h1", completions: [] }),
      makeHabit({ id: "h2", completions: [] }),
    ];
    renderWithCtx(habits);

    expect(screen.getByText(/You have/)).toBeTruthy();
    expect(screen.getByText("2")).toBeTruthy();
    expect(screen.getByText(/undone habits/)).toBeTruthy();
  });

  it("includes action count", () => {
    const goals = [
      makeGoal({
        id: "g1",
        actions: [
          { completed: false },
          { completed: false },
          { completed: true },
        ],
      }),
    ];
    renderWithCtx(goals);

    expect(screen.getByText(/2 actions to do/)).toBeTruthy();
  });

  it("shows links to /goals and /habits", () => {
    const items = [
      makeGoal({ id: "g1" }),
      makeHabit({ id: "h1", completions: [] }),
    ];
    renderWithCtx(items);

    const links = screen.getAllByTestId("next-link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("/goals");
    expect(hrefs).toContain("/habits");
  });

  it("shows all-done messages when all items done", () => {
    const today = new Date().toISOString().split("T")[0];
    const goals = [makeGoal({ id: "g1", completed: true })];
    const habits = [
      makeHabit({
        id: "h1",
        completions: [{ date: today, status: "completed" }],
      }),
    ];
    renderWithCtx([...goals, ...habits]);

    expect(screen.getByText(/All goals completed/)).toBeTruthy();
    expect(screen.getByText(/All habits done today/)).toBeTruthy();
  });

  it("shows singular for single counts", () => {
    const goals = [makeGoal({ id: "g1" })];
    renderWithCtx(goals);

    expect(screen.getByText(/undone goal\b/)).toBeTruthy();
    expect(screen.queryByText(/undone goals/)).toBeNull();
  });

  it("renders priority buckets in summary", () => {
    const goals = [
      makeGoal({
        id: "g1",
        difficulty: "hard",
        energy: "high",
        deadline: "2026-07-20",
      }),
      makeGoal({ id: "g2", difficulty: "easy", energy: "low" }),
    ];
    renderWithCtx(goals);

    expect(screen.getByText(/in high priority/)).toBeTruthy();
    expect(screen.getByText(/in low priority/)).toBeTruthy();
  });

  it("hides desktop card elements (no Top Habits/Top Goals headings)", () => {
    const items = [
      makeGoal({ id: "g1" }),
      makeHabit({ id: "h1", completions: [] }),
    ];
    renderWithCtx(items);

    expect(screen.queryByText("Top Habits")).toBeNull();
    expect(screen.queryByText("Top Goals")).toBeNull();
  });
});
