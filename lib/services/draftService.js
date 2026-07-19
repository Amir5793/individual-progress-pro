import { get, put } from "../../backend/local_storage/local_storage_api";

const STORAGE_KEY = "report-drafts";

/* -------------------------------------------------------------------------- */
/* READ                                                                       */
/* -------------------------------------------------------------------------- */

export function getDrafts() {

    const result = get(STORAGE_KEY);

    if (!result.success) {
        return [];
    }

    return Array.isArray(result.data)
        ? result.data
        : [];

}

export function getDraftByWeek(weekKey) {

    return getDrafts().find(d => d.weekKey === weekKey) || null;

}

/* -------------------------------------------------------------------------- */
/* SAVE (upsert by weekKey)                                                   */
/* -------------------------------------------------------------------------- */

export function saveDraft(weekKey, goals, habits) {

    const drafts = getDrafts();
    const now = new Date().toISOString();

    const existing = drafts.findIndex(d => d.weekKey === weekKey);

    const draft = {
        weekKey,
        savedAt: now,
        status: "draft",
        goals: goals.map(g => ({ ...g })),
        habits: habits.map(h => ({ ...h })),
    };

    if (existing >= 0) {
        drafts[existing] = draft;
    } else {
        drafts.push(draft);
    }

    put(STORAGE_KEY, drafts);

    return draft;

}

/* -------------------------------------------------------------------------- */
/* DELETE                                                                     */
/* -------------------------------------------------------------------------- */

export function deleteDraft(weekKey) {

    const drafts = getDrafts().filter(d => d.weekKey !== weekKey);

    put(STORAGE_KEY, drafts);

    return drafts;

}
