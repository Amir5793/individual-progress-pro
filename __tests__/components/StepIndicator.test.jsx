import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

const StepIndicator = ({ step, currentStep, onClickStep, disableStepIndicators }) => {
  const status = currentStep === step ? "active" : currentStep < step ? "inactive" : "complete";

  const handleClick = () => {
    if (step !== currentStep && !disableStepIndicators) onClickStep(step);
  };

  return (
    <div onClick={handleClick} data-testid={`step-${step}`} data-status={status}>
      {status === "complete" && <span data-testid="checkmark">✓</span>}
      {status === "active" && <div data-testid="active-dot" />}
      {status === "inactive" && <span data-testid="step-number">{step}</span>}
    </div>
  );
};

describe("StepIndicator", () => {
  it("renders step number for inactive step", () => {
    render(<StepIndicator step={2} currentStep={1} onClickStep={() => {}} />);
    expect(screen.getByTestId("step-number")).toBeTruthy();
    expect(screen.getByText("2")).toBeTruthy();
  });

  it("renders active dot for current step", () => {
    render(<StepIndicator step={1} currentStep={1} onClickStep={() => {}} />);
    expect(screen.getByTestId("active-dot")).toBeTruthy();
  });

  it("renders checkmark for completed step", () => {
    render(<StepIndicator step={1} currentStep={2} onClickStep={() => {}} />);
    expect(screen.getByTestId("checkmark")).toBeTruthy();
  });

  it("onClickStep fires when clicking inactive step", () => {
    const onClick = jest.fn();
    render(<StepIndicator step={2} currentStep={1} onClickStep={onClick} />);
    fireEvent.click(screen.getByTestId("step-2"));
    expect(onClick).toHaveBeenCalledWith(2);
  });
});
