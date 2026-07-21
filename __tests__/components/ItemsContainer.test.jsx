import React from "react";
import { render, screen } from "@testing-library/react";
import ItemsContainer from "@/components/Items/ItemsContainer/ItemsContainer";
import { LocaleProvider } from "@/lib/i18n/localeContext";

jest.mock("@/components/Items/ItemRendered/ItemRenderer", () => {
  return function MockItemRenderer(props) {
    return <div data-testid="item-renderer">{props.item.title}</div>;
  };
});

describe("ItemsContainer", () => {
  it("shows loading state", () => {
    render(<LocaleProvider><ItemsContainer loading={true} /></LocaleProvider>);
    expect(screen.getByText("Loading...")).toBeTruthy();
  });

  it("shows empty state for goals mode with no goals", () => {
    render(<LocaleProvider><ItemsContainer mode="goal" commitments={[]} /></LocaleProvider>);
    expect(screen.getByText("No goals yet.")).toBeTruthy();
  });

  it("shows empty state for habits mode with no habits", () => {
    render(<LocaleProvider><ItemsContainer mode="habit" commitments={[]} /></LocaleProvider>);
    expect(screen.getByText("No habits yet.")).toBeTruthy();
  });

  it("shows goals in goal mode", () => {
    const goals = [{ id: "1", type: "goal", title: "Goal 1" }];
    render(<LocaleProvider><ItemsContainer mode="goal" commitments={goals} /></LocaleProvider>);
    expect(screen.getByText("Goal 1")).toBeTruthy();
  });

  it("shows habits in habit mode", () => {
    const habits = [{ id: "1", type: "habit", title: "Habit 1" }];
    render(<LocaleProvider><ItemsContainer mode="habit" commitments={habits} /></LocaleProvider>);
    expect(screen.getByText("Habit 1")).toBeTruthy();
  });

  it("shows both columns in overview mode", () => {
    const commitments = [
      { id: "1", type: "goal", title: "Goal 1" },
      { id: "2", type: "habit", title: "Habit 1" },
    ];
    render(<LocaleProvider><ItemsContainer mode="overview" commitments={commitments} /></LocaleProvider>);
    expect(screen.getByText("Goal 1")).toBeTruthy();
    expect(screen.getByText("Habit 1")).toBeTruthy();
  });
});
