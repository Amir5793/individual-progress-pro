
/* ==========================================================
   STREAK
========================================================== */

export function calculateStreak(completions = []) {

    if (!completions.length) return 0;

    const sorted = [...completions].sort((a, b) => new Date(b.date) - new Date(a.date));

    let streak = 0;

    let expected = new Date();

    expected.setHours(0, 0, 0, 0);

    for (const completion of sorted) {

        const date = new Date(completion.date);

        date.setHours(0, 0, 0, 0);

        if (completion.status !== "completed") break;

        const difference = (expected - date) / 86400000;

        if (difference === 0) {

            streak++;

            expected.setDate(expected.getDate() - 1);

        } else {

            break;

        }

    }

    return streak;

}
