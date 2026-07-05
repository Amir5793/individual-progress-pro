import {validateStepInput} from "./validation.js";

// Map step number to its field name (for error display)



// ---------- Validation (called when user clicks Next) ----------

// ---------- Step 6: Deadline handlers ----------
const handleTimeSelection = (value, clearError, setShowCalendar, setDeadline,) => {
    clearError("deadline");
    const today = new Date();
    let newDeadline = null;
    switch (value) {
        case "No deadline":
            newDeadline = null;
            setShowCalendar(false);
            break;
        case "tomorrow":
            newDeadline = new Date(today);
            newDeadline.setDate(today.getDate() + 1);
            setShowCalendar(false);
            break;
        case "this week": {
            const day = today.getDay();
            const diff = day === 0 ? 0 : 7 - day;
            newDeadline = new Date(today);
            newDeadline.setDate(today.getDate() + diff);
            setShowCalendar(false);
            break;
        }
        case "pick a date":
            setShowCalendar(true);
            return; // wait for DatePicker
        default:
            return;
    }
    setDeadline(newDeadline);
};

const handleDatePick = (date, setDeadline, setShowCalendar,) => {
    setDeadline(date);
    setShowCalendar(false);
};

export {handleDatePick, handleTimeSelection}