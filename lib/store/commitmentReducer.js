import {
    COMMITMENTS_LOADED,
    COMMITMENT_CREATED,
    COMMITMENT_UPDATED,
    COMMITMENT_DELETED,
    GOAL_TOGGLED,
    HABIT_STATUS_CHANGED,
} from "./types";

export const initialState = {
    commitments: [],
    loading: true,
};

export function commitmentReducer(state, action) {
    switch (action.type) {
        case COMMITMENTS_LOADED:
            return {
                ...state,
                commitments: action.payload,
                loading: false,
            };

        case COMMITMENT_CREATED:
            return {
                ...state,
                commitments: [...state.commitments, action.payload],
            };

        case COMMITMENT_UPDATED:
            return {
                ...state,
                commitments: state.commitments.map(c =>
                    c.id === action.payload.id ? action.payload : c
                ),
            };

        case COMMITMENT_DELETED:
            return {
                ...state,
                commitments: state.commitments.filter(
                    c => c.id !== action.payload
                ),
            };

        case GOAL_TOGGLED:
            return {
                ...state,
                commitments: state.commitments.map(c =>
                    c.id === action.payload.id
                        ? {
                            ...c,
                            completed: action.payload.completed,
                            completedAt: action.payload.completedAt,
                        }
                        : c
                ),
            };

        case HABIT_STATUS_CHANGED:
            return {
                ...state,
                commitments: state.commitments.map(c =>
                    c.id === action.payload.id
                        ? {
                            ...c,
                            status: action.payload.status,
                            completions: action.payload.completions,
                            streak: action.payload.streak,
                        }
                        : c
                ),
            };

        default:
            return state;
    }
}
