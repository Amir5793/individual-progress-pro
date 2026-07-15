"use client";

import { useCallback } from "react";

import ItemsContainer from "./ItemsContainer/ItemsContainer";

import { useCommitments } from "@/lib/store/CommitmentContext";
import {
    createCommitment,
    updateCommitment,
    deleteCommitment,
    completeGoal,
    uncompleteGoal,
    updateHabitStatus,
} from "@/lib/services/commitmentService";
import {
    COMMITMENT_CREATED,
    COMMITMENT_DELETED,
    GOAL_TOGGLED,
    HABIT_STATUS_CHANGED,
} from "@/lib/store/types";

export default function ItemsManager({
                                         mode = "overview",
                                         sortBy = "priority",
                                     }) {

    const { commitments, loading, dispatch } = useCommitments();

    const handleCreate = useCallback((commitment) => {
        const updated = createCommitment(commitment);
        const created = updated.find(c => c.id === commitment.id) || commitment;
        dispatch({ type: COMMITMENT_CREATED, payload: created });
    }, [dispatch]);

    const handleEdit = useCallback((updatedItem) => {
        updateCommitment(updatedItem.id, updatedItem);
        dispatch({ type: COMMITMENT_CREATED, payload: updatedItem });
    }, [dispatch]);

    const handleComplete = useCallback((goal) => {
        const updated = goal.completed
            ? uncompleteGoal(goal.id)
            : completeGoal(goal.id);
        const toggled = updated.find(c => c.id === goal.id);
        if (toggled) {
            dispatch({
                type: GOAL_TOGGLED,
                payload: {
                    id: toggled.id,
                    completed: toggled.completed,
                    completedAt: toggled.completedAt,
                },
            });
        }
    }, [dispatch]);

    const handleStatusChange = useCallback((habit, status, completions, streak) => {
        const updated = updateHabitStatus(habit.id, status, completions, streak);
        dispatch({
            type: HABIT_STATUS_CHANGED,
            payload: { id: habit.id, status, completions, streak },
        });
    }, [dispatch]);

    const handleDelete = useCallback((item) => {
        deleteCommitment(item.id);
        dispatch({ type: COMMITMENT_DELETED, payload: item.id });
    }, [dispatch]);

    const handleItemClick = useCallback((item) => {
        console.log(item);
    }, []);

    const handleMore = useCallback((item) => {
        console.log("More:", item);
    }, []);

    return (
        <ItemsContainer
            mode={mode}
            commitments={commitments}
            loading={loading}
            sortBy={sortBy}
            onItemClick={handleItemClick}
            onCreate={handleCreate}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onComplete={handleComplete}
            onStatusChange={handleStatusChange}
            onMore={handleMore}
        />
    );
}
