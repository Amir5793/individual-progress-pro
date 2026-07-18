"use client";

/* ---------------------------------------------------------- */
/* DATE UTILITIES                                              */
/* ---------------------------------------------------------- */

export function getTodayString() {
    return new Date().toISOString().split("T")[0];
}

export function getYesterdayString() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
}

/* ---------------------------------------------------------- */
/* TODAY STATUS                                                */
/* ---------------------------------------------------------- */

export function getTodayStatus(completions = []) {
    const todayStr = getTodayString();
    const entry = completions.find(c => c.date === todayStr);
    return entry ? entry.status : null;
}

/* ---------------------------------------------------------- */
/* HABIT STATUS (for backward compat)                         */
/* ---------------------------------------------------------- */

export function getHabitStatus(habit) {
    return getTodayStatus(habit.completions) || "pending";
}

/* ---------------------------------------------------------- */
/* STREAK CALCULATION (counts completed + minimum)             */
/* ---------------------------------------------------------- */

export function computeNewStreak(completions = [], newStatus) {
    if (newStatus === "failed") return 0;

    const yesterdayStr = getYesterdayString();
    const yesterdayEntry = completions.find(c => c.date === yesterdayStr);
    const yesterdayStatus = yesterdayEntry ? yesterdayEntry.status : null;

    if (yesterdayStatus === "completed" || yesterdayStatus === "minimum") {
        const currentStreak = calculateStreak(completions);
        return currentStreak + 1;
    }

    return 1;
}

import { calculateStreak } from "@/lib/habits/streak";

/* ---------------------------------------------------------- */
/* COMPLETIONS ENGINE                                          */
/* ---------------------------------------------------------- */

export function buildUpdatedCompletions(completions = [], newStatus) {
    const todayStr = getTodayString();
    const existing = completions.find(c => c.date === todayStr);

    if (existing) {
        return completions.map(c =>
            c.date === todayStr ? { ...c, status: newStatus } : c
        );
    }

    return [...completions, { date: todayStr, status: newStatus }];
}

/* ---------------------------------------------------------- */
/* PROGRESS STATS                                              */
/* ---------------------------------------------------------- */

export function getCompletionStats(completions = []) {
    const total = completions.length;
    const idealCount = completions.filter(c => c.status === "completed").length;
    const minimumCount = completions.filter(c => c.status === "minimum").length;
    const failedCount = completions.filter(c => c.status === "failed").length;
    const successCount = idealCount + minimumCount;

    return {
        total,
        idealCount,
        minimumCount,
        failedCount,
        successCount,
        successRate: total > 0 ? Math.round((successCount / total) * 100) : 0,
    };
}

/* ---------------------------------------------------------- */
/* PROGRESS LABEL                                              */
/* ---------------------------------------------------------- */

export function getProgressLabel(status) {
    switch (status) {
        case "completed":
            return "Ideal";
        case "minimum":
            return "Minimum";
        case "failed":
            return "Missed";
        default:
            return "Not yet marked";
    }
}

/* ---------------------------------------------------------- */
/* PREFERRED TIME                                              */
/* ---------------------------------------------------------- */

export function formatPreferredTime(time) {
    if (!time) return "";
    return time.charAt(0).toUpperCase() + time.slice(1);
}
