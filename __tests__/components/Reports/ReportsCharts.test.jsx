import React from "react";
import { render, screen } from "@testing-library/react";
import ReportsCharts from "@/components/Reports/ReportsCharts";
import { useCommitments } from "@/lib/store/CommitmentContext";
import { LocaleProvider } from "@/lib/i18n/localeContext";

jest.mock("@/lib/store/CommitmentContext");

function makeWeekRange() {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - start.getDay());
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  return { weekStart: start, weekEnd: end };
}

function renderWithCtx(commitments = [], overrides = {}) {
  useCommitments.mockReturnValue({ commitments, loading: false });
  const { weekStart, weekEnd } = makeWeekRange();
  return render(
    <LocaleProvider><ReportsCharts weekStart={weekStart} weekEnd={weekEnd} {...overrides} /></LocaleProvider>
  );
}

describe("ReportsCharts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.Chart = undefined;
  });

  it("renders chart section with all three chart cards", () => {
    renderWithCtx([]);
    expect(screen.getByText("Goal Categories")).toBeTruthy();
    expect(screen.getByText("Habit Categories")).toBeTruthy();
    expect(screen.getByText("Weekly Progress Overview")).toBeTruthy();
  });

  it("renders chart descriptions", () => {
    renderWithCtx([]);
    expect(screen.getByText(/Categories of goals created this week/)).toBeTruthy();
    expect(screen.getByText(/Categories of habits created this week/)).toBeTruthy();
    expect(screen.getByText(/Habit completion rate per day this week/)).toBeTruthy();
  });

  it("shows empty state for pie charts when no data", () => {
    renderWithCtx([]);
    const empties = screen.getAllByText("No items this week");
    expect(empties.length).toBe(2);
  });

  it("renders canvas elements when data exists in the chosen week", () => {
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
    const { container } = renderWithCtx(items);
    const canvases = container.querySelectorAll("canvas");
    expect(canvases.length).toBe(3);
  });

  it("hides pie chart canvas when items fall outside chosen week", () => {
    const oldDate = "2020-01-01T00:00:00.000Z";
    const items = [
      {
        id: "g1",
        type: "goal",
        title: "Old Goal",
        category: "Coding",
        completed: false,
        actions: [],
        createdAt: oldDate,
      },
    ];
    renderWithCtx(items);
    const empties = screen.getAllByText("No items this week");
    expect(empties.length).toBe(2);
  });

  it("creates Chart instances when Chart.js is loaded", () => {
    const instances = [];
    window.Chart = jest.fn(() => {
      const inst = { destroy: jest.fn() };
      instances.push(inst);
      return inst;
    });

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

    expect(window.Chart).toHaveBeenCalled();
    expect(instances.length).toBe(3);
  });

  it("destroys previous chart instances when data changes", () => {
    const instances = [];
    window.Chart = jest.fn(() => {
      const inst = { destroy: jest.fn() };
      instances.push(inst);
      return inst;
    });

    const now = new Date().toISOString();
    const items1 = [
      {
        id: "g1",
        type: "goal",
        title: "Goal A",
        category: "Health",
        completed: false,
        actions: [],
        createdAt: now,
      },
      {
        id: "h1",
        type: "habit",
        title: "Habit A",
        category: "Fitness",
        completions: [],
        streak: 0,
        createdAt: now,
      },
    ];
    const { rerender } = renderWithCtx(items1);
    const initialCount = instances.length;
    expect(initialCount).toBe(3);

    const items2 = [
      {
        id: "g2",
        type: "goal",
        title: "Goal B",
        category: "Coding",
        completed: true,
        actions: [],
        createdAt: now,
      },
    ];
    const { weekStart, weekEnd } = makeWeekRange();
    useCommitments.mockReturnValue({ commitments: items2, loading: false });
    rerender(<LocaleProvider><ReportsCharts weekStart={weekStart} weekEnd={weekEnd} /></LocaleProvider>);

    const destroyedCount = instances.filter((i) => i.destroy.mock.calls.length > 0).length;
    expect(destroyedCount).toBeGreaterThan(0);
  });

  it("groups goals by category correctly within chosen week", () => {
    window.Chart = jest.fn(() => ({ destroy: jest.fn() }));

    const now = new Date().toISOString();
    const items = [
      {
        id: "g1", type: "goal", title: "A", category: "Coding",
        completed: false, actions: [], createdAt: now,
      },
      {
        id: "g2", type: "goal", title: "B", category: "Coding",
        completed: false, actions: [], createdAt: now,
      },
      {
        id: "g3", type: "goal", title: "C", category: "Health",
        completed: false, actions: [], createdAt: now,
      },
    ];
    renderWithCtx(items);

    const chartCall = window.Chart.mock.calls.find(
      (c) => c[1].data.labels && c[1].data.labels.includes("Coding")
    );
    expect(chartCall).toBeTruthy();
    expect(chartCall[1].data.labels).toEqual(["Coding", "Health"]);
    expect(chartCall[1].data.datasets[0].data).toEqual([2, 1]);
  });

  it("groups habits by category correctly within chosen week", () => {
    window.Chart = jest.fn(() => ({ destroy: jest.fn() }));

    const now = new Date().toISOString();
    const items = [
      {
        id: "h1", type: "habit", title: "A", category: "Reading",
        completions: [], streak: 0, createdAt: now,
      },
      {
        id: "h2", type: "habit", title: "B", category: "Fitness",
        completions: [], streak: 0, createdAt: now,
      },
      {
        id: "h3", type: "habit", title: "C", category: "Fitness",
        completions: [], streak: 0, createdAt: now,
      },
    ];
    renderWithCtx(items);

    const chartCall = window.Chart.mock.calls.find(
      (c) => c[1].data.labels && c[1].data.labels.includes("Fitness")
    );
    expect(chartCall).toBeTruthy();
    expect(chartCall[1].data.labels).toEqual(["Reading", "Fitness"]);
    expect(chartCall[1].data.datasets[0].data).toEqual([1, 2]);
  });

  it("computes daily habit completion percentages within chosen week", () => {
    window.Chart = jest.fn(() => ({ destroy: jest.fn() }));

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const items = [
      {
        id: "h1", type: "habit", title: "Meditate", category: "Health",
        completions: [{ date: todayStr, status: "completed" }],
        streak: 1,
        createdAt: new Date().toISOString(),
      },
    ];
    renderWithCtx(items);

    const progressChart = window.Chart.mock.calls.find(
      (c) => c[1].data.datasets && c[1].data.datasets.length === 4
    );
    expect(progressChart).toBeTruthy();

    const idealData = progressChart[1].data.datasets[0].data;
    const hasNonZero = idealData.some((v) => v > 0);
    expect(hasNonZero).toBe(true);
  });

  it("renders 7 day labels on progress chart", () => {
    window.Chart = jest.fn(() => ({ destroy: jest.fn() }));

    renderWithCtx([]);

    const progressChart = window.Chart.mock.calls.find(
      (c) => c[1].data.datasets && c[1].data.datasets.length === 4
    );
    expect(progressChart).toBeTruthy();
    expect(progressChart[1].data.labels).toEqual(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
  });
});
