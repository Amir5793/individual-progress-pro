"use client";

/* ==========================================================
   HABIT STATUS
========================================================== */

export function getHabitStatus(habit) {
    if (!habit.completions?.length) return "pending";

    const today = new Date().toDateString();

    const todayCompletion = habit.completions.find((item) => new Date(item.date).toDateString() === today);

    if (!todayCompletion) return "pending";

    if (todayCompletion.status === "completed") return "completed";

    if (todayCompletion.status === "progress") return "progress";

    return "pending";
}

/* ==========================================================
   PROGRESS LABEL
========================================================== */

export function getProgressLabel(status) {

    switch (status) {

        case "completed":
            return "Done";

        case "progress":
            return "Continue";

        default:
            return "Start";

    }

}

/* ==========================================================
   OPTIONAL
========================================================== */

export function formatPreferredTime(time) {

    if (!time) return "";

    return time.charAt(0).toUpperCase() + time.slice(1);

}