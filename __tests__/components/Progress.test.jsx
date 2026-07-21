import React from "react";
import { render, screen } from "@testing-library/react";
import Progress from "@/components/Progress/Progress";
import { useCommitments } from "@/lib/store/CommitmentContext";
import { LocaleProvider } from "@/lib/i18n/localeContext";

jest.mock("@/lib/store/CommitmentContext");

const today = new Date().toISOString().split("T")[0];

function makeGoal(id, completed = false) {
  return {
    id,
    type: "goal",
    title: `Goal ${id}`,
    completed,
    actions: [],
    category: "Learning",
    createdAt: new Date().toISOString(),
  };
}

function makeHabit(id, status = null) {
  const completions = status
    ? [{ date: today, status }]
    : [];
  return {
    id,
    type: "habit",
    title: `Habit ${id}`,
    completions,
    streak: 0,
    category: "Health",
    createdAt: new Date().toISOString(),
  };
}

describe("Progress", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useCommitments.mockReturnValue({
      commitments: [],
      loading: false,
      dispatch: jest.fn(),
      refresh: jest.fn(),
    });
  });

  it("renders 0% when no commitments", () => {
    render(<LocaleProvider><Progress /></LocaleProvider>);
    expect(screen.getByText("0%")).toBeTruthy();
    expect(screen.getByText("0 / 0")).toBeTruthy();
  });

  it("shows correct % and count for goals", () => {
    useCommitments.mockReturnValue({
      commitments: [makeGoal("g1", true), makeGoal("g2", false), makeGoal("g3", true)],
      loading: false,
      dispatch: jest.fn(),
      refresh: jest.fn(),
    });

    render(<LocaleProvider><Progress /></LocaleProvider>);
    expect(screen.getByText("67%")).toBeTruthy();
    expect(screen.getByText("2 / 3")).toBeTruthy();
  });

  it("shows correct % and count for habits", () => {
    useCommitments.mockReturnValue({
      commitments: [
        makeHabit("h1", "completed"),
        makeHabit("h2", "minimum"),
        makeHabit("h3", null),
      ],
      loading: false,
      dispatch: jest.fn(),
      refresh: jest.fn(),
    });

    render(<LocaleProvider><Progress /></LocaleProvider>);
    expect(screen.getByText("67%")).toBeTruthy();
    expect(screen.getByText("2 / 3")).toBeTruthy();
  });

  it("mixes goals and habits", () => {
    useCommitments.mockReturnValue({
      commitments: [
        makeGoal("g1", true),
        makeGoal("g2", false),
        makeHabit("h1", "completed"),
        makeHabit("h2", "failed"),
      ],
      loading: false,
      dispatch: jest.fn(),
      refresh: jest.fn(),
    });

    render(<LocaleProvider><Progress /></LocaleProvider>);
    expect(screen.getByText("50%")).toBeTruthy();
    expect(screen.getByText("2 / 4")).toBeTruthy();
  });

  it("habit with minimum status counts as done", () => {
    useCommitments.mockReturnValue({
      commitments: [makeHabit("h1", "minimum")],
      loading: false,
      dispatch: jest.fn(),
      refresh: jest.fn(),
    });

    render(<LocaleProvider><Progress /></LocaleProvider>);
    expect(screen.getByText("100%")).toBeTruthy();
    expect(screen.getByText("1 / 1")).toBeTruthy();
  });

  it("habit with failed status does not count", () => {
    useCommitments.mockReturnValue({
      commitments: [makeHabit("h1", "failed")],
      loading: false,
      dispatch: jest.fn(),
      refresh: jest.fn(),
    });

    render(<LocaleProvider><Progress /></LocaleProvider>);
    expect(screen.getByText("0%")).toBeTruthy();
    expect(screen.getByText("0 / 1")).toBeTruthy();
  });

  it("links to /reports", () => {
    render(<LocaleProvider><Progress /></LocaleProvider>);
    const link = screen.getByText("View Reports").closest("a");
    expect(link).toBeTruthy();
    expect(link.getAttribute("href")).toBe("/reports");
  });

  it("shows 100% message when all done", () => {
    useCommitments.mockReturnValue({
      commitments: [makeGoal("g1", true)],
      loading: false,
      dispatch: jest.fn(),
      refresh: jest.fn(),
    });

    render(<LocaleProvider><Progress /></LocaleProvider>);
    expect(screen.getByText("All done for today!")).toBeTruthy();
  });

  it("shows encouraging message when partially done", () => {
    useCommitments.mockReturnValue({
      commitments: [makeGoal("g1", true), makeGoal("g2", false)],
      loading: false,
      dispatch: jest.fn(),
      refresh: jest.fn(),
    });

    render(<LocaleProvider><Progress /></LocaleProvider>);
    expect(screen.getByText("Keep going! You're doing great.")).toBeTruthy();
  });

  it("shows starting message when nothing done", () => {
    useCommitments.mockReturnValue({
      commitments: [makeGoal("g1", false)],
      loading: false,
      dispatch: jest.fn(),
      refresh: jest.fn(),
    });

    render(<LocaleProvider><Progress /></LocaleProvider>);
    expect(screen.getByText("Time to get moving.")).toBeTruthy();
  });
});
