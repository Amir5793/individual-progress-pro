
/* ==========================================================
   CONSISTENCY
========================================================== */

export function getConsistency(completions = []) {

    if (!completions.length) return 0;

    const completed = completions.filter(item => item.status === "completed").length;

    return Math.round((completed / completions.length) * 100);

}
