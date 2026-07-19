export const BASE_GOAL = {
    id: "",
    type: "goal",
    period: "daily",
    title: "",
    category: "",
    reason: {},
    completionCriteria: "",
    difficulty: "",
    energy: "",
    deadline: null,
    obstacle: "",
    fallbackPlan: "",
    completed: false,
    completedAt: null,
    createdAt: null,
    actions: [],
};

export const BASE_HABIT = {
    id: "",
    type: "habit",
    period: "daily",
    title: "",
    category: "",
    reason: {},
    identity: "",
    minimumAction: "",
    target: "",
    trigger: "",
    preferredTime: "",
    obstacle: "",
    fallbackPlan: "",
    streak: 0,
    completions: [],
    createdAt: null,
};

export function createEmptyCommitment(mode) {
    return mode === "goal" ? { ...BASE_GOAL } : { ...BASE_HABIT };
}
