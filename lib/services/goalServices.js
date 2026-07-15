import {
    get,
    post,
    put,
    patch,
    del,
} from "@/backend/local_storage/loacl_storage_api";

const STORAGE_KEY = "goals";

/* -------------------------------- */
/* READ */
/* -------------------------------- */

export function getGoals() {

    const result = get(STORAGE_KEY);

    if (!result.success)
        return [];

    return result.data;

}

/* -------------------------------- */
/* CREATE */
/* -------------------------------- */

export function createGoal(goal) {

    const goals = getGoals();

    return put(
        STORAGE_KEY,
        [...goals, goal]
    );

}

/* -------------------------------- */
/* UPDATE */
/* -------------------------------- */

export function updateGoal(id, updatedGoal) {

    const goals = getGoals();

    const updated = goals.map(goal =>
        goal.id === id
            ? updatedGoal
            : goal
    );

    return put(
        STORAGE_KEY,
        updated
    );

}

/* -------------------------------- */
/* PATCH */
/* -------------------------------- */

export function patchGoal(id, values) {

    const goals = getGoals();

    const updated = goals.map(goal => {

        if (goal.id !== id)
            return goal;

        return {
            ...goal,
            ...values,
        };

    });

    return put(
        STORAGE_KEY,
        updated
    );

}

/* -------------------------------- */
/* DELETE */
/* -------------------------------- */

export function deleteGoal(id) {

    const goals = getGoals();

    const filtered = goals.filter(
        goal => goal.id !== id
    );

    return put(
        STORAGE_KEY,
        filtered
    );

}