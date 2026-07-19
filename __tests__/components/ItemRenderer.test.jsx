import React from "react";
import { render, screen } from "@testing-library/react";
import ItemRenderer from "@/components/Items/ItemRendered/ItemRenderer";

jest.mock("@/components/Items/Item/GoalItem/GoalItem", () => {
  return function MockGoalItem(props) {
    return <div data-testid="goal-item">{props.item.title}</div>;
  };
});

jest.mock("@/components/Items/Item/HabitItem/HabitItem", () => {
  return function MockHabitItem(props) {
    return <div data-testid="habit-item">{props.item.title}</div>;
  };
});

describe("ItemRenderer", () => {
  it("renders GoalItem for type goal", () => {
    render(<ItemRenderer item={{ type: "goal", title: "My Goal" }} />);
    expect(screen.getByTestId("goal-item")).toBeTruthy();
    expect(screen.getByText("My Goal")).toBeTruthy();
  });

  it("renders HabitItem for type habit", () => {
    render(<ItemRenderer item={{ type: "habit", title: "My Habit" }} />);
    expect(screen.getByTestId("habit-item")).toBeTruthy();
    expect(screen.getByText("My Habit")).toBeTruthy();
  });

  it("returns null for unknown type", () => {
    const { container } = render(<ItemRenderer item={{ type: "unknown", title: "X" }} />);
    expect(container.innerHTML).toBe("");
  });
});
