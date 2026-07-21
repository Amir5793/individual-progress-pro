import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ConfirmDialog from "@/components/WeeklyReport/ConfirmDialog";
import { LocaleProvider } from "@/lib/i18n/localeContext";

describe("ConfirmDialog", () => {
  const defaultProps = {
    title: "Unsaved changes",
    message: "You have unsaved changes.",
    onSave: jest.fn(),
    onDiscard: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it("renders title and message", () => {
    render(<LocaleProvider><ConfirmDialog {...defaultProps} /></LocaleProvider>);
    expect(screen.getByText("Unsaved changes")).toBeTruthy();
    expect(screen.getByText("You have unsaved changes.")).toBeTruthy();
  });

  it("renders Save, Discard, Cancel buttons", () => {
    render(<LocaleProvider><ConfirmDialog {...defaultProps} /></LocaleProvider>);
    expect(screen.getByText("Save")).toBeTruthy();
    expect(screen.getByText("Discard")).toBeTruthy();
    expect(screen.getByText("Cancel")).toBeTruthy();
  });

  it("calls onSave when Save clicked", () => {
    render(<LocaleProvider><ConfirmDialog {...defaultProps} /></LocaleProvider>);
    fireEvent.click(screen.getByText("Save"));
    expect(defaultProps.onSave).toHaveBeenCalledTimes(1);
  });

  it("calls onDiscard when Discard clicked", () => {
    render(<LocaleProvider><ConfirmDialog {...defaultProps} /></LocaleProvider>);
    fireEvent.click(screen.getByText("Discard"));
    expect(defaultProps.onDiscard).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when Cancel clicked", () => {
    render(<LocaleProvider><ConfirmDialog {...defaultProps} /></LocaleProvider>);
    fireEvent.click(screen.getByText("Cancel"));
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when overlay clicked", () => {
    render(<LocaleProvider><ConfirmDialog {...defaultProps} /></LocaleProvider>);
    fireEvent.click(screen.getByText("Unsaved changes").closest("div"));
    // overlay click goes through onCancel
  });
});
