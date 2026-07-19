"use client";
import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from "react";
import { getCommitments } from "@/lib/services/commitmentService";
import { commitmentReducer, initialState } from "./commitmentReducer";
import {
    COMMITMENTS_LOADED,
    COMMITMENT_CREATED,
    COMMITMENT_DELETED,
    GOAL_TOGGLED,
    HABIT_STATUS_CHANGED,
} from "./types";

const CommitmentContext = createContext(null);

export function CommitmentProvider({ children }) {
    const [state, dispatch] = useReducer(commitmentReducer, initialState);

    const refresh = useCallback(() => {
        const data = getCommitments();
        dispatch({ type: COMMITMENTS_LOADED, payload: data });
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const value = useMemo(() => ({
        commitments: state.commitments,
        loading: state.loading,
        dispatch,
        refresh,
    }), [state.commitments, state.loading, dispatch, refresh]);

    return (
        <CommitmentContext.Provider value={value}>
            {children}
        </CommitmentContext.Provider>
    );
}

export function useCommitments() {
    const ctx = useContext(CommitmentContext);
    if (!ctx) {
        throw new Error("useCommitments must be used within a CommitmentProvider");
    }
    return ctx;
}
