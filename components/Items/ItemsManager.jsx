// ItemsManager.jsx
"use client";
import React, { useCallback } from "react";
import ItemsContainer from "./ItemsContainer/ItemsContainer";
import { useCommitments } from "@/lib/store/CommitmentContext";
import {
    deleteCommitment,
    completeGoal,
    uncompleteGoal,
    updateHabitStatus,
    toggleActionComplete,
} from "@/lib/services/commitmentService";
import {
    COMMITMENT_DELETED,
    GOAL_TOGGLED,
    HABIT_STATUS_CHANGED,
    COMMITMENT_UPDATED // Ensure this type matches exactly
} from "@/lib/store/types";

const handleItemClick = (item) => { /* reserved for future navigation */ };
const handleMore = (item) => { /* reserved for future context menu */ };

export default function ItemsManager({
                                         mode = "overview",
                                         sortBy = "priority",
                                         goalLimit,
                                         habitLimit,
                                         onEditOverride // Callback passed down from page.js
                                     }) {
    const { commitments, loading, dispatch } = useCommitments();

    const handleEdit = useCallback((item) => {
        if (onEditOverride) {
            onEditOverride(item);
        }
    }, [onEditOverride]);

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
        updateHabitStatus(habit.id, status, completions, streak);
        dispatch({
            type: HABIT_STATUS_CHANGED,
            payload: { id: habit.id, status, completions, streak },
        });
    }, [dispatch]);

    const handleDelete = useCallback((item) => {
        deleteCommitment(item.id);
        dispatch({ type: COMMITMENT_DELETED, payload: item.id });
    }, [dispatch]);

    const handleActionComplete = useCallback((goal, actionIdOrIndex) => {
        const updated = toggleActionComplete(goal.id, actionIdOrIndex);
        const patched = updated.find(c => c.id === goal.id);
        if (patched) {
            dispatch({
                type: COMMITMENT_UPDATED,
                payload: patched,
            });
        }
    }, [dispatch]);

    return (
        <ItemsContainer
            mode={mode}
            commitments={commitments}
            loading={loading}
            sortBy={sortBy}
            goalLimit={goalLimit}
            habitLimit={habitLimit}
            onItemClick={handleItemClick}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onComplete={handleComplete}
            onStatusChange={handleStatusChange}
            onActionComplete={handleActionComplete}
            onMore={handleMore}
        />
    );
}