"use client";

/* ---------------------------------------------------------- */
/* DIFFICULTY COLORS */
/* ---------------------------------------------------------- */

const difficultyMap = {
    easy: "var(--accent-green)",

    medium: "var(--accent-yellow)",

    hard: "var(--accent-red)",
};

export function difficultyColor(level) {
    return difficultyMap[level?.toLowerCase()] || "rgba(255,255,255,.08)";
}

/* ---------------------------------------------------------- */
/* ENERGY COLORS */
/* ---------------------------------------------------------- */

const energyMap = {
    low: "#5BC0EB",

    medium: "#8B5CF6",

    high: "#F97316",
};

export function energyColor(level) {
    return energyMap[level?.toLowerCase()] || "rgba(255,255,255,.08)";
}

/* ---------------------------------------------------------- */
/* DEADLINE */
/* ---------------------------------------------------------- */

export function formatDeadline(date) {
    if (!date) return "";

    const deadline = new Date(date);

    const today = new Date();

    const difference =
        Math.ceil(
            (deadline.getTime() - today.getTime()) /
            (1000 * 60 * 60 * 24)
        );

    if (difference === 0) return "Today";

    if (difference === 1) return "Tomorrow";

    if (difference === -1) return "Yesterday";

    if (difference < 0)
        return `${Math.abs(difference)} days overdue`;

    if (difference <= 7)
        return `In ${difference} days`;

    return deadline.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
    });
}

/* ---------------------------------------------------------- */
/* STATUS */
/* ---------------------------------------------------------- */

export function getGoalStatus(goal) {
    if (goal.completed) return "Completed";

    if (!goal.deadline) return "Active";

    const today = new Date();

    const deadline = new Date(goal.deadline);

    if (deadline < today) return "Overdue";

    return "Pending";
}

/* ---------------------------------------------------------- */
/* OPTIONAL */
/* Estimated focus badge */
/* ---------------------------------------------------------- */

export function getFocusLabel(energy) {
    switch (energy?.toLowerCase()) {
        case "high":
            return "Deep Focus";

        case "medium":
            return "Normal Focus";

        case "low":
            return "Light Focus";

        default:
            return "Focus";
    }
}

