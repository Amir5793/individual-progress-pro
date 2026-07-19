import {
    get,
    put,
} from "../../backend/local_storage/local_storage_api";

const STORAGE_KEY = "commitments";

/* -------------------------------------------------------------------------- */
/* READ                                                                       */
/* -------------------------------------------------------------------------- */

export function getCommitments() {

    const result = get(STORAGE_KEY);

    if (!result.success) {
        return [];
    }

    return Array.isArray(result.data)
        ? result.data
        : [];

}

export function getGoals() {

    return getCommitments().filter(
        commitment => commitment.type === "goal"
    );

}

export function getHabits() {

    return getCommitments().filter(
        commitment => commitment.type === "habit"
    );

}

export function getCommitmentById(id) {

    return getCommitments().find(
        commitment => commitment.id === id
    );

}

/* -------------------------------------------------------------------------- */
/* CREATE                                                                     */
/* -------------------------------------------------------------------------- */

export function createCommitment(commitment) {

    const commitments = getCommitments();

    const updatedCommitments = [
        ...commitments,
        commitment,
    ];

    put(
        STORAGE_KEY,
        updatedCommitments
    );

    return updatedCommitments;

}

/* -------------------------------------------------------------------------- */
/* UPDATE                                                                     */
/* -------------------------------------------------------------------------- */

export function updateCommitment(
    id,
    updatedCommitment
) {

    const commitments = getCommitments();

    const updatedCommitments = commitments.map(commitment =>

        commitment.id === id
            ? updatedCommitment
            : commitment

    );

    put(
        STORAGE_KEY,
        updatedCommitments
    );

    return updatedCommitments;

}

/* -------------------------------------------------------------------------- */
/* PATCH                                                                      */
/* -------------------------------------------------------------------------- */

export function patchCommitment(
    id,
    values
) {

    const commitments = getCommitments();

    const updatedCommitments = commitments.map(commitment => {

        if (commitment.id !== id) {
            return commitment;
        }

        return {
            ...commitment,
            ...values,
        };

    });

    put(
        STORAGE_KEY,
        updatedCommitments
    );

    return updatedCommitments;

}

/* -------------------------------------------------------------------------- */
/* DELETE                                                                     */
/* -------------------------------------------------------------------------- */

export function deleteCommitment(id) {

    const commitments = getCommitments();

    const updatedCommitments = commitments.filter(
        commitment => commitment.id !== id
    );

    put(
        STORAGE_KEY,
        updatedCommitments
    );

    return updatedCommitments;

}

export function clearAllCommitments() {

    put(STORAGE_KEY, []);

    return [];

}

/* -------------------------------------------------------------------------- */
/* TASK HELPERS                                                               */
/* -------------------------------------------------------------------------- */

export function completeGoal(id) {

    return patchCommitment(id, {
        completed: true,
        completedAt: new Date().toISOString(),
    });

}

export function uncompleteGoal(id) {

    return patchCommitment(id, {
        completed: false,
        completedAt: null,
    });

}

/* -------------------------------------------------------------------------- */
/* HABIT HELPERS                                                              */
/* -------------------------------------------------------------------------- */

export function updateHabitStatus(
    id,
    status,
    completions = [],
    streak = 0,
) {

    return patchCommitment(id, {
        status,
        completions,
        streak,
    });

}

/* -------------------------------------------------------------------------- */
/* ACTION HELPERS (Sub-step toggles inside a goal)                            */
/* -------------------------------------------------------------------------- */

export function toggleActionComplete(goalId, actionIdOrIndex) {
    const commitments = getCommitments();

    const updatedCommitments = commitments.map(commitment => {
        if (commitment.id !== goalId) return commitment;

        const actions = [...(commitment.actions || [])];
        const idx = typeof actionIdOrIndex === "number"
            ? actionIdOrIndex
            : actions.findIndex(a => a.id === actionIdOrIndex);

        if (idx < 0 || idx >= actions.length) return commitment;

        const wasCompleted = actions[idx].completed;
        actions[idx] = {
            ...actions[idx],
            completed: !wasCompleted,
            completedAt: !wasCompleted ? new Date().toISOString() : null,
        };

        return { ...commitment, actions };
    });

    put(STORAGE_KEY, updatedCommitments);
    return updatedCommitments;
}