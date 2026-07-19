import {
    get,
    post,
    put,
    patch,
    del,
} from "../../backend/local_storage/local_storage_api";

const STORAGE_KEY = "habits";

/* -------------------------------- */
/* READ */
/* -------------------------------- */

export function getHabits() {

    const result = get(STORAGE_KEY);

    if (!result.success)
        return [];

    return result.data;

}

/* -------------------------------- */
/* CREATE */
/* -------------------------------- */

export function createHabit(habit) {

    const habits = getHabits();

    return put(
        STORAGE_KEY,
        [...habits, habit]
    );

}

/* -------------------------------- */
/* UPDATE */
/* -------------------------------- */

export function updateHabit(id, updatedHabit) {

    const habits = getHabits();

    const updated = habits.map(habit =>
        habit.id === id
            ? updatedHabit
            : habit
    );

    return put(
        STORAGE_KEY,
        updated
    );

}

/* -------------------------------- */
/* PATCH */
/* -------------------------------- */

export function patchHabit(id, values) {

    const habits = getHabits();

    const updated = habits.map(habit => {

        if (habit.id !== id)
            return habit;

        return {
            ...habit,
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

export function deleteHabit(id) {

    const habits = getHabits();

    const filtered = habits.filter(
        habit => habit.id !== id
    );

    return put(
        STORAGE_KEY,
        filtered
    );

}