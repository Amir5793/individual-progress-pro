import React from "react";
import { render, screen, act } from "@testing-library/react";
import { CommitmentProvider, useCommitments } from "@/lib/store/CommitmentContext";

jest.mock("@/lib/services/commitmentService", () => ({
  getCommitments: jest.fn(() => []),
}));

function TestConsumer() {
  const { commitments, loading, refresh } = useCommitments();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="count">{commitments.length}</span>
      <button data-testid="refresh" onClick={refresh}>Refresh</button>
    </div>
  );
}

describe("CommitmentProvider", () => {
  it("provides context values", async () => {
    await act(async () => {
      render(
        <CommitmentProvider>
          <TestConsumer />
        </CommitmentProvider>
      );
    });
    expect(screen.getByTestId("loading")).toHaveTextContent("false");
    expect(screen.getByTestId("count")).toHaveTextContent("0");
  });

  it("refresh reloads commitments", async () => {
    await act(async () => {
      render(
        <CommitmentProvider>
          <TestConsumer />
        </CommitmentProvider>
      );
    });
    await act(async () => {
      screen.getByTestId("refresh").click();
    });
    expect(screen.getByTestId("count")).toHaveTextContent("0");
  });
});

function ThrowingConsumer() {
  useCommitments();
  return null;
}

describe("useCommitments", () => {
  it("throws when used outside provider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<ThrowingConsumer />)).toThrow(
      "useCommitments must be used within a CommitmentProvider"
    );
    spy.mockRestore();
  });
});
