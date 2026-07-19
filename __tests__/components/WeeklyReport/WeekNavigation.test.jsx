import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import WeekNavigation from "@/components/WeeklyReport/WeekNavigation";

function makeDate(str) {
  const d = new Date(str + "T00:00:00");
  d.setDate(d.getDate() - d.getDay());
  return d;
}

describe("WeekNavigation", () => {
  it("renders week date range", () => {
    const weekStart = makeDate("2026-07-20");
    render(
      <WeekNavigation
        weekStart={weekStart}
        onPrev={() => {}}
        onNext={() => {}}
        onToday={() => {}}
        onJump={() => {}}
      />
    );
    expect(screen.getByText(/2026/)).toBeTruthy();
  });

  it("calls onPrev when prev button clicked", () => {
    const onPrev = jest.fn();
    render(
      <WeekNavigation
        weekStart={makeDate("2026-07-20")}
        onPrev={onPrev}
        onNext={() => {}}
        onToday={() => {}}
        onJump={() => {}}
      />
    );
    fireEvent.click(screen.getByLabelText("Previous week"));
    expect(onPrev).toHaveBeenCalledTimes(1);
  });

  it("calls onNext when next button clicked", () => {
    const onNext = jest.fn();
    render(
      <WeekNavigation
        weekStart={makeDate("2026-07-20")}
        onPrev={() => {}}
        onNext={onNext}
        onToday={() => {}}
        onJump={() => {}}
      />
    );
    fireEvent.click(screen.getByLabelText("Next week"));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it("shows Today button when not current week", () => {
    render(
      <WeekNavigation
        weekStart={makeDate("2026-01-01")}
        onPrev={() => {}}
        onNext={() => {}}
        onToday={() => {}}
        onJump={() => {}}
      />
    );
    expect(screen.getByText("Today")).toBeTruthy();
  });

  it("calls onToday when Today button clicked", () => {
    const onToday = jest.fn();
    render(
      <WeekNavigation
        weekStart={makeDate("2026-01-01")}
        onPrev={() => {}}
        onNext={() => {}}
        onToday={onToday}
        onJump={() => {}}
      />
    );
    fireEvent.click(screen.getByText("Today"));
    expect(onToday).toHaveBeenCalledTimes(1);
  });
});
