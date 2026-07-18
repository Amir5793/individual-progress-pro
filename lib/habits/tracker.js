
/* ==========================================================
   WEEK TRACKER (three states: completed, minimum, failed, pending)
========================================================== */

const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

export function getWeekTracker(completions = []) {

    const today = new Date();

    const start = new Date(today);

    const day = start.getDay();

    const diff = day === 0 ? 6 : day - 1;

    start.setDate(start.getDate() - diff);

    return weekDays.map((label, index) => {

        const current = new Date(start);

        current.setDate(start.getDate() + index);

        const dateStr = current.toISOString().split("T")[0];

        const match = completions.find(item => item.date === dateStr);

        return {

            label,

            day: current.toISOString(),

            state: match?.status || "pending",

        };

    });

}
