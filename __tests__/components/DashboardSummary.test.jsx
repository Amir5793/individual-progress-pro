import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import DashboardSummary from "@/components/DashboardSummary/DashboardSummary";
import { useCommitments } from "@/lib/store/CommitmentContext";
import { createCommitment } from "@/lib/services/commitmentService";

jest.mock("@/lib/store/CommitmentContext");
jest.mock("@/lib/services/commitmentService", () => ({
  createCommitment: jest.fn((item) => ({
    ...item,
    id: item.id || "sample-1",
    createdAt: Date.now(),
  })),
}));
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

function renderWithCtx(commitments, loading = false, props = {}) {
  useCommitments.mockReturnValue({
    commitments,
    loading,
    dispatch: jest.fn(),
  });
  return render(<DashboardSummary {...props} />);
}

describe("DashboardSummary", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("renders nothing while loading", () => {
    const { container } = renderWithCtx([], true);
    expect(container.innerHTML).toBe("");
  });

  it("renders empty state when no commitments", () => {
    renderWithCtx([]);
    expect(
      screen.getByText("Welcome to your progress tracker")
    ).toBeTruthy();
    expect(
      screen.getByText(
        "Create your first goal or habit to start tracking your progress."
      )
    ).toBeTruthy();
  });

  it("renders CTA buttons in empty state", () => {
    renderWithCtx([]);
    expect(screen.getByLabelText("Create your first goal")).toBeTruthy();
    expect(screen.getByLabelText("Create your first habit")).toBeTruthy();
  });

  it("calls onLaunchCreator when CTA buttons clicked", () => {
    const onLaunch = jest.fn();
    renderWithCtx([], false, { onLaunchCreator: onLaunch });

    fireEvent.click(screen.getByLabelText("Create your first goal"));
    expect(onLaunch).toHaveBeenCalledWith("goal");

    fireEvent.click(screen.getByLabelText("Create your first habit"));
    expect(onLaunch).toHaveBeenCalledWith("habit");
  });

  it("shows progress checklist in empty state", () => {
    renderWithCtx([]);
    expect(screen.getAllByText("Create your first goal").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Create your first habit").length).toBeGreaterThanOrEqual(1);
  });

  it("marks checklist items as done when commitments exist", () => {
    const items = [makeGoal({ id: "g1" }), makeHabit({ id: "h1" })];
    renderWithCtx(items);
    expect(screen.getByText(/undone goal/)).toBeTruthy();
  });

  it("shows welcome overlay on first visit with no commitments", () => {
    renderWithCtx([]);
    expect(screen.getByRole("dialog", { name: "Welcome" })).toBeTruthy();
    expect(screen.getByText("Welcome aboard!")).toBeTruthy();
  });

  it("does not show welcome overlay if previously seen", () => {
    localStorage.setItem("onboarding-welcome-seen", "1");
    renderWithCtx([]);
    expect(screen.queryByRole("dialog", { name: "Welcome" })).toBeNull();
  });

  it("dismisses welcome overlay when 'I'll do it later' clicked", () => {
    renderWithCtx([]);
    const laterBtn = screen.getByText("I'll do it later");
    fireEvent.click(laterBtn);
    expect(screen.queryByRole("dialog", { name: "Welcome" })).toBeNull();
    expect(localStorage.getItem("onboarding-welcome-seen")).toBe("1");
  });

  it("loads sample data from welcome overlay", () => {
    const dispatch = jest.fn();
    useCommitments.mockReturnValue({ commitments: [], loading: false, dispatch });
    render(<DashboardSummary />);

    fireEvent.click(screen.getByText("Load sample data"));
    expect(createCommitment).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalled();
    expect(screen.queryByRole("dialog", { name: "Welcome" })).toBeNull();
  });

  it("shows help button when commitments exist", () => {
    const items = [makeGoal({ id: "g1" })];
    renderWithCtx(items);
    expect(
      screen.getByRole("button", { name: "Quick start guide" })
    ).toBeTruthy();
  });

  it("opens quick-start guide when help button clicked", () => {
    const items = [makeGoal({ id: "g1" })];
    renderWithCtx(items);
    fireEvent.click(screen.getByRole("button", { name: "Quick start guide" }));
    expect(
      screen.getByRole("dialog", { name: "Quick start guide" })
    ).toBeTruthy();
    expect(screen.getByText("Quick Start Guide")).toBeTruthy();
  });

  it("closes quick-start guide when 'Got it' clicked", () => {
    const items = [makeGoal({ id: "g1" })];
    renderWithCtx(items);
    fireEvent.click(screen.getByRole("button", { name: "Quick start guide" }));
    fireEvent.click(screen.getByText("Got it"));
    expect(
      screen.queryByRole("dialog", { name: "Quick start guide" })
    ).toBeNull();
  });

  it("shows quick-start steps", () => {
    const items = [makeGoal({ id: "g1" })];
    renderWithCtx(items);
    fireEvent.click(screen.getByRole("button", { name: "Quick start guide" }));
    expect(screen.getByText("Set a goal")).toBeTruthy();
    expect(screen.getByText("Build a habit")).toBeTruthy();
    expect(screen.getByText("Track daily")).toBeTruthy();
    expect(screen.getByText("Review reports")).toBeTruthy();
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

  it("shows 'no goals yet' and 'no habits yet' messages", () => {
    const habits = [makeHabit({ id: "h1", completions: [] })];
    renderWithCtx(habits);
    expect(screen.getByText(/No goals yet/)).toBeTruthy();

    const goals = [makeGoal({ id: "g1" })];
    renderWithCtx(goals);
    expect(screen.getByText(/No habits yet/)).toBeTruthy();
  });
});
