
/* ==========================================================
   WEEK TRACKER
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

        const match = completions.find((item) => {

            return (new Date(item.date).toDateString() === current.toDateString());

        });

        return {

            label,

            day: current.toISOString(),

            state: match?.status || "pending",

        };

    });

}
