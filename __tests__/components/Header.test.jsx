import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "@/components/Header/Header";
import { useCommitments } from "@/lib/store/CommitmentContext";
import { clearAllCommitments } from "@/lib/services/commitmentService";

jest.mock("@/lib/store/CommitmentContext");
jest.mock("@/lib/services/commitmentService");

describe("Header", () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useCommitments.mockReturnValue({
      commitments: [],
      dispatch: mockDispatch,
      refresh: jest.fn(),
    });
    clearAllCommitments.mockReturnValue([]);
  });

  it("renders a time-based greeting", () => {
    render(<Header />);
    const title = screen.getByText(/^(Good (morning|afternoon|evening|night)|Hello there), Achiever/i);
    expect(title).toBeTruthy();
  });

  it("renders a motivation quote", () => {
    render(<Header />);
    const sub = screen.getByText(/^".*"$/);
    expect(sub).toBeTruthy();
    expect(sub.textContent.length).toBeGreaterThan(2);
  });

  it("has a delete button", () => {
    render(<Header />);
    const btn = screen.getByRole("button", { name: /delete all/i });
    expect(btn).toBeTruthy();
  });

  it("does nothing on delete click when no commitments", () => {
    render(<Header />);
    const btn = screen.getByRole("button", { name: /delete all/i });
    fireEvent.click(btn);
    expect(clearAllCommitments).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("asks for confirmation then clears on confirm", () => {
    useCommitments.mockReturnValue({
      commitments: [{ id: "g1" }, { id: "h1" }],
      dispatch: mockDispatch,
      refresh: jest.fn(),
    });
    window.confirm = jest.fn(() => true);

    render(<Header />);
    const btn = screen.getByRole("button", { name: /delete all/i });
    fireEvent.click(btn);

    expect(window.confirm).toHaveBeenCalledWith(
      "Delete all goals and habits? This cannot be undone."
    );
    expect(clearAllCommitments).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "COMMITMENTS_LOADED",
      payload: [],
    });
  });

  it("does not clear when user cancels confirmation", () => {
    useCommitments.mockReturnValue({
      commitments: [{ id: "g1" }],
      dispatch: mockDispatch,
      refresh: jest.fn(),
    });
    window.confirm = jest.fn(() => false);

    render(<Header />);
    const btn = screen.getByRole("button", { name: /delete all/i });
    fireEvent.click(btn);

    expect(clearAllCommitments).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
