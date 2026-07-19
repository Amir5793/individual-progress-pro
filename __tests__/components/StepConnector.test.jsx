import React from "react";
import { render, screen } from "@testing-library/react";

const StepConnector = ({ isComplete }) => {
  return (
    <div data-testid="step-connector" data-complete={isComplete}>
      <div data-testid="connector-inner" />
    </div>
  );
};

describe("StepConnector", () => {
  it("renders incomplete connector", () => {
    render(<StepConnector isComplete={false} />);
    expect(screen.getByTestId("step-connector").getAttribute("data-complete")).toBe("false");
  });

  it("renders complete connector", () => {
    render(<StepConnector isComplete={true} />);
    expect(screen.getByTestId("step-connector").getAttribute("data-complete")).toBe("true");
  });
});
