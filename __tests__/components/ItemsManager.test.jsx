jest.mock("@/lib/store/CommitmentContext", () => ({
  useCommitments: jest.fn(),
}));

jest.mock("@/lib/services/commitmentService", () => ({
  deleteCommitment: jest.fn(() => []),
  completeGoal: jest.fn(() => [{ id: "g1", completed: true, completedAt: "2024-01-01" }]),
  uncompleteGoal: jest.fn(() => [{ id: "g1", completed: false, completedAt: null }]),
  updateHabitStatus: jest.fn(),
  toggleActionComplete: jest.fn(() => [{ id: "g1", actions: [{ id: "a1", completed: true }] }]),
}));

jest.mock("@/components/Items/ItemsContainer/ItemsContainer", () => {
  const React = require("react");
  let lastProps = {};
  const MockItemsContainer = (props) => {
    lastProps.current = props;
    return React.createElement("div", { "data-testid": "items-container" },
      props.loading ? "Loading..." : "",
      !props.loading && props.commitments?.length === 0 ? "Empty" : ""
    );
  };
  MockItemsContainer._lastProps = lastProps;
  return { __esModule: true, default: MockItemsContainer };
});

import React from "react";
import { render, screen, act } from "@testing-library/react";
import ItemsManager from "@/components/Items/ItemsManager";
import { useCommitments } from "@/lib/store/CommitmentContext";
import * as services from "@/lib/services/commitmentService";
import {
  COMMITMENT_DELETED,
  GOAL_TOGGLED,
  HABIT_STATUS_CHANGED,
  COMMITMENT_UPDATED,
} from "@/lib/store/types";

const mockDispatch = jest.fn();

const goalCommitments = [
  {
    id: "g1",
    type: "goal",
    title: "Test Goal",
    mainReason: "because",
    category: "Fitness",
    completionCriteria: "done",
    difficulty: "easy",
    energy: "low",
    deadline: new Date(Date.now() + 7 * 86400000).toISOString(),
    completed: false,
    actions: [],
    completions: [],
  },
];

const goalWithActions = [
  {
    ...goalCommitments[0],
    actions: [
      { id: "a1", title: "Step 1", completed: false },
      { id: "a2", title: "Step 2", completed: true },
    ],
  },
];

const habitCommitments = [
  {
    id: "h1",
    type: "habit",
    title: "Test Habit",
    identity: "healthy",
    category: "Health",
    minimumAction: "walk",
    completions: [],
    streak: 0,
  },
];

beforeEach(() => {
  jest.clearAllMocks();
  useCommitments.mockReturnValue({
    commitments: [],
    loading: false,
    dispatch: mockDispatch,
  });
});

describe("ItemsManager", () => {
  it("shows loading when loading", () => {
    useCommitments.mockReturnValue({
      commitments: [],
      loading: true,
      dispatch: mockDispatch,
    });
    render(<ItemsManager mode="overview" />);
    const container = screen.getByTestId("items-container");
    expect(container.textContent).toContain("Loading...");
  });

  it("shows empty states with no commitments", () => {
    render(<ItemsManager mode="overview" />);
    expect(screen.getByTestId("items-container")).toBeTruthy();
  });

  it("renders with goal commitments", () => {
    useCommitments.mockReturnValue({
      commitments: goalCommitments,
      loading: false,
      dispatch: mockDispatch,
    });
    render(<ItemsManager mode="goal" />);
    expect(screen.getByTestId("items-container")).toBeTruthy();
  });

  it("renders with habit commitments", () => {
    useCommitments.mockReturnValue({
      commitments: habitCommitments,
      loading: false,
      dispatch: mockDispatch,
    });
    render(<ItemsManager mode="habit" />);
    expect(screen.getByTestId("items-container")).toBeTruthy();
  });

  describe("callbacks", () => {
    it("handleComplete calls completeGoal and dispatches GOAL_TOGGLED", () => {
      useCommitments.mockReturnValue({
        commitments: goalCommitments,
        loading: false,
        dispatch: mockDispatch,
      });

      const ItemsContainer = require("@/components/Items/ItemsContainer/ItemsContainer").default;
      render(<ItemsManager mode="goal" />);
      const props = ItemsContainer._lastProps.current;

      act(() => {
        props.onComplete(goalCommitments[0]);
      });

      expect(services.completeGoal).toHaveBeenCalledWith("g1");
      expect(mockDispatch).toHaveBeenCalledWith({
        type: GOAL_TOGGLED,
        payload: {
          id: "g1",
          completed: true,
          completedAt: "2024-01-01",
        },
      });
    });

    it("handleComplete calls uncompleteGoal for completed goals", () => {
      const completedGoal = [{ ...goalCommitments[0], completed: true }];
      useCommitments.mockReturnValue({
        commitments: completedGoal,
        loading: false,
        dispatch: mockDispatch,
      });

      const ItemsContainer = require("@/components/Items/ItemsContainer/ItemsContainer").default;
      render(<ItemsManager mode="goal" />);
      const props = ItemsContainer._lastProps.current;

      act(() => {
        props.onComplete(completedGoal[0]);
      });

      expect(services.uncompleteGoal).toHaveBeenCalledWith("g1");
      expect(mockDispatch).toHaveBeenCalledWith({
        type: GOAL_TOGGLED,
        payload: {
          id: "g1",
          completed: false,
          completedAt: null,
        },
      });
    });

    it("handleDelete calls deleteCommitment and dispatches COMMITMENT_DELETED", () => {
      useCommitments.mockReturnValue({
        commitments: goalCommitments,
        loading: false,
        dispatch: mockDispatch,
      });

      const ItemsContainer = require("@/components/Items/ItemsContainer/ItemsContainer").default;
      render(<ItemsManager mode="goal" />);
      const props = ItemsContainer._lastProps.current;

      act(() => {
        props.onDelete(goalCommitments[0]);
      });

      expect(services.deleteCommitment).toHaveBeenCalledWith("g1");
      expect(mockDispatch).toHaveBeenCalledWith({
        type: COMMITMENT_DELETED,
        payload: "g1",
      });
    });

    it("handleStatusChange calls updateHabitStatus and dispatches HABIT_STATUS_CHANGED", () => {
      useCommitments.mockReturnValue({
        commitments: habitCommitments,
        loading: false,
        dispatch: mockDispatch,
      });

      const ItemsContainer = require("@/components/Items/ItemsContainer/ItemsContainer").default;
      render(<ItemsManager mode="habit" />);
      const props = ItemsContainer._lastProps.current;

      act(() => {
        props.onStatusChange(habitCommitments[0], "completed", [{ date: "2024-01-01", status: "completed" }], 1);
      });

      expect(services.updateHabitStatus).toHaveBeenCalledWith("h1", "completed", [{ date: "2024-01-01", status: "completed" }], 1);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: HABIT_STATUS_CHANGED,
        payload: {
          id: "h1",
          status: "completed",
          completions: [{ date: "2024-01-01", status: "completed" }],
          streak: 1,
        },
      });
    });

    it("handleActionComplete calls toggleActionComplete and dispatches COMMITMENT_UPDATED", () => {
      useCommitments.mockReturnValue({
        commitments: goalWithActions,
        loading: false,
        dispatch: mockDispatch,
      });

      const ItemsContainer = require("@/components/Items/ItemsContainer/ItemsContainer").default;
      render(<ItemsManager mode="goal" />);
      const props = ItemsContainer._lastProps.current;

      act(() => {
        props.onActionComplete(goalWithActions[0], "a1");
      });

      expect(services.toggleActionComplete).toHaveBeenCalledWith("g1", "a1");
      expect(mockDispatch).toHaveBeenCalledWith({
        type: COMMITMENT_UPDATED,
        payload: { id: "g1", actions: [{ id: "a1", completed: true }] },
      });
    });

    it("handleEdit calls onEditOverride when provided", () => {
      const mockOnEdit = jest.fn();
      useCommitments.mockReturnValue({
        commitments: goalCommitments,
        loading: false,
        dispatch: mockDispatch,
      });

      const ItemsContainer = require("@/components/Items/ItemsContainer/ItemsContainer").default;
      render(<ItemsManager mode="goal" onEditOverride={mockOnEdit} />);
      const props = ItemsContainer._lastProps.current;

      act(() => {
        props.onEdit(goalCommitments[0]);
      });

      expect(mockOnEdit).toHaveBeenCalledWith(goalCommitments[0]);
    });

    it("handleEdit does nothing when onEditOverride is not provided", () => {
      useCommitments.mockReturnValue({
        commitments: goalCommitments,
        loading: false,
        dispatch: mockDispatch,
      });

      const ItemsContainer = require("@/components/Items/ItemsContainer/ItemsContainer").default;
      render(<ItemsManager mode="goal" />);
      const props = ItemsContainer._lastProps.current;

      expect(() => {
        act(() => {
          props.onEdit(goalCommitments[0]);
        });
      }).not.toThrow();
    });

    it("onItemClick and onMore are stable references", () => {
      useCommitments.mockReturnValue({
        commitments: goalCommitments,
        loading: false,
        dispatch: mockDispatch,
      });

      const ItemsContainer = require("@/components/Items/ItemsContainer/ItemsContainer").default;
      const { rerender } = render(<ItemsManager mode="goal" />);
      const firstProps = ItemsContainer._lastProps.current;
      const firstOnItemClick = firstProps.onItemClick;
      const firstOnMore = firstProps.onMore;

      rerender(<ItemsManager mode="goal" />);
      const secondProps = ItemsContainer._lastProps.current;

      expect(secondProps.onItemClick).toBe(firstOnItemClick);
      expect(secondProps.onMore).toBe(firstOnMore);
    });
  });
});
