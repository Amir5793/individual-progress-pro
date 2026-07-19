"use client";

/* ==========================================================
   SORT BY CREATED DATE
========================================================== */

function sortByCreated(items) {
    return [...items].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
}

/* ==========================================================
   SORT BY DEADLINE
========================================================== */

function sortByDeadline(items) {
    return [...items].sort((a, b) => {

        if (!a.deadline) return 1;
        if (!b.deadline) return -1;

        return new Date(a.deadline) - new Date(b.deadline);

    });
}

/* ==========================================================
   SORT BY TITLE
========================================================== */

function sortByTitle(items) {
    return [...items].sort((a, b) =>
        a.title.localeCompare(b.title)
    );
}

/* ==========================================================
   SORT BY COMPLETION
========================================================== */

function sortByCompletion(items) {

    return [...items].sort((a, b) => {

        if (a.completed === b.completed)
            return 0;

        return a.completed ? 1 : -1;

    });

}

/* ==========================================================
   DIFFICULTY SCORE
========================================================== */

const difficultyWeight = {
    easy: 1,
    medium: 2,
    hard: 3,
};

/* ==========================================================
   ENERGY SCORE
========================================================== */

const energyWeight = {
    low: 1,
    medium: 2,
    high: 3,
};

/* ==========================================================
   PRIORITY
========================================================== */

export function priorityScore(item) {

    let score = 0;

    /* ---------- Deadline ---------- */

    if (item.deadline) {

        const diff =
            (new Date(item.deadline) - new Date()) /
            86400000;

        if (diff < 0)
            score += 100;

        else if (diff <= 1)
            score += 80;

        else if (diff <= 3)
            score += 60;

        else if (diff <= 7)
            score += 40;

    }

    /* ---------- Difficulty ---------- */

    score +=
        (difficultyWeight[item.difficulty] || 0) * 10;

    /* ---------- Energy ---------- */

    score +=
        (energyWeight[item.energy] || 0) * 5;

    return score;

}

function sortByPriority(items) {

    return [...items].sort(
        (a, b) => priorityScore(b) - priorityScore(a)
    );

}

/* ==========================================================
   MAIN SORT
========================================================== */

export function sortItems(
    items = [],
    sortBy = "priority"
) {

    switch (sortBy) {

        case "created":
            return sortByCreated(items);

        case "deadline":
            return sortByDeadline(items);

        case "title":
            return sortByTitle(items);

        case "completed":
            return sortByCompletion(items);

        case "priority":
        default:
            return sortByPriority(items);

    }

}