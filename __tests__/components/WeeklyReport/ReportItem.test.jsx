import React from "react";
import { render, screen } from "@testing-library/react";
import ReportItem from "@/components/WeeklyReport/ReportItem";
import { LocaleProvider } from "@/lib/i18n/localeContext";

describe("ReportItem", () => {
  it("renders goal with title and category", () => {
    const goal = {
      id: "g1",
      type: "goal",
      title: "Learn Rust",
      category: "Coding",
      completed: false,
      actions: [],
    };
    render(<LocaleProvider><ReportItem item={goal} /></LocaleProvider>);
    expect(screen.getByText("Learn Rust")).toBeTruthy();
    expect(screen.getByText("Active")).toBeTruthy();
  });

  it("renders goal done state", () => {
    const goal = {
      id: "g1",
      type: "goal",
      title: "Done Goal",
      category: "Health",
      completed: true,
      actions: [],
    };
    render(<LocaleProvider><ReportItem item={goal} /></LocaleProvider>);
    expect(screen.getByText("Done")).toBeTruthy();
  });

  it("renders goal actions count", () => {
    const goal = {
      id: "g1",
      type: "goal",
      title: "Goal with actions",
      category: "Learning",
      completed: false,
      actions: [
        { completed: true },
        { completed: false },
        { completed: false },
      ],
    };
    render(<LocaleProvider><ReportItem item={goal} /></LocaleProvider>);
    expect(screen.getByText("1/3 actions")).toBeTruthy();
  });

  it("renders habit with title and status", () => {
    const habit = {
      id: "h1",
      type: "habit",
      title: "Read Daily",
      category: "Reading",
      completions: [],
      streak: 0,
    };
    render(<LocaleProvider><ReportItem item={habit} /></LocaleProvider>);
    expect(screen.getByText("Read Daily")).toBeTruthy();
    expect(screen.getByText("Pending")).toBeTruthy();
  });

  it("renders habit completed status", () => {
    const today = new Date().toISOString().split("T")[0];
    const habit = {
      id: "h1",
      type: "habit",
      title: "Meditate",
      category: "Health",
      completions: [{ date: today, status: "completed" }],
      streak: 1,
    };
    render(<LocaleProvider><ReportItem item={habit} /></LocaleProvider>);
    expect(screen.getByText("Ideal")).toBeTruthy();
  });

  it("renders habit minimum status", () => {
    const today = new Date().toISOString().split("T")[0];
    const habit = {
      id: "h1",
      type: "habit",
      title: "Stretch",
      category: "Fitness",
      completions: [{ date: today, status: "minimum" }],
      streak: 1,
    };
    render(<LocaleProvider><ReportItem item={habit} /></LocaleProvider>);
    expect(screen.getByText("Minimum")).toBeTruthy();
  });

  it("renders habit failed status", () => {
    const today = new Date().toISOString().split("T")[0];
    const habit = {
      id: "h1",
      type: "habit",
      title: "Run",
      category: "Fitness",
      completions: [{ date: today, status: "failed" }],
      streak: 0,
    };
    render(<LocaleProvider><ReportItem item={habit} /></LocaleProvider>);
    expect(screen.getByText("Missed")).toBeTruthy();
  });

  it("renders habit streak", () => {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];
    const habit = {
      id: "h1",
      type: "habit",
      title: "Read",
      category: "Reading",
      completions: [
        { date: yesterday, status: "completed" },
        { date: today, status: "completed" },
      ],
      streak: 2,
    };
    render(<LocaleProvider><ReportItem item={habit} /></LocaleProvider>);
    expect(screen.getByText("2d")).toBeTruthy();
  });

  it("renders nothing for unknown type", () => {
    const { container } = render(<LocaleProvider><ReportItem item={{ type: "unknown" }} /></LocaleProvider>);
    expect(container.innerHTML).toBe("");
  });
});
