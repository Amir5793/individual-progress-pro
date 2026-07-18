
/* ==========================================================
   CONSISTENCY (counts both "completed" and "minimum" as success)
========================================================== */

export function getConsistency(completions = []) {

    if (!completions.length) return 0;

    const successCount = completions.filter(
        item => item.status === "completed" || item.status === "minimum"
    ).length;

    return Math.round((successCount / completions.length) * 100);

}
