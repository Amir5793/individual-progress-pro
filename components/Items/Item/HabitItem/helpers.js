"use client";

export function getHabitStatus(habit) {
    if (!habit.completions || habit.completions.length === 0) return "pending";

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const todayCompletion = habit.completions.find(c => {
        const dateStr = typeof c === "string" ? c.split("T")[0] : new Date(c).toISOString().split("T")[0];
        return dateStr === todayStr;
    });

    if (!todayCompletion) return "pending";

    const status = typeof todayCompletion === "object" ? todayCompletion.status : "completed";
    return status;
}

export function getProgressLabel(status) {
    switch (status) {
        case "completed":
            return "Mark as done";
        case "progress":
            return "Continue habit";
        default:
            return "Start habit";
    }
}

export function formatPreferredTime(time) {
    if (!time) return "";
    return time.charAt(0).toUpperCase() + time.slice(1);
}
