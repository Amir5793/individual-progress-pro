import {Input} from "@/components/fundamentals/Input/Input";
import {CheckBox} from "@/components/fundamentals/CheckBox/CheckBox";
import DatePicker from "@/components/Calendar/DatePicker";
import {Step} from "@/components/Stepper/Stepper";
import React from "react";

export const DeadlineOrObstacle = ({
                                     mode, deadline, showCalendar,
                                     handleTimeSelection, handleDatePick,
                                     obstacle, fallbackPlan,
                                     handleFieldChange, errors
                                 }) => {
    return (
        <Step>
            <h1>{mode === "goal" ? "When would you like to finish?" : "What might stop you? And your backup plan"}</h1>
            {mode === "goal" ? (<>
                <div className="date-picker-container">
                    <div className="date-picker-checkbox-container">
                        {["No deadline", "tomorrow", "this week", "pick a date"].map((option) => {
                            let checked = false;
                            if (option === "No deadline" && deadline === null) checked = true; else if (option === "tomorrow") {
                                const tomorrow = new Date();
                                tomorrow.setDate(tomorrow.getDate() + 1);
                                if (deadline && deadline.toDateString() === tomorrow.toDateString()) checked = true;
                            } else if (option === "this week") {
                                const today = new Date();
                                const day = today.getDay();
                                const diff = day === 0 ? 0 : 7 - day;
                                const sunday = new Date(today);
                                sunday.setDate(today.getDate() + diff);
                                if (deadline && deadline.toDateString() === sunday.toDateString()) checked = true;
                            } else if (option === "pick a date") {
                                checked = showCalendar;
                            }
                            return (<CheckBox
                                key={option}
                                name="time"
                                value={option}
                                checked={checked}
                                func={() => handleTimeSelection(option)}
                            />);
                        })}
                    </div>
                    <div>
                        {showCalendar && (<DatePicker
                            selectedDate={deadline}
                            onDateSelect={handleDatePick}
                        />)}
                    </div>
                </div>
                {errors.deadline && <div className="error">{errors.deadline}</div>}
            </>) : (<>
                <div>
                    <h2>What might stop you? (optional)</h2>
                    <Input
                        placeholder="e.g. Too tired"
                        value={obstacle}
                        onValueChange={(val) => handleFieldChange("obstacle", val)}
                    />
                    {errors.obstacle && <div className="error">{errors.obstacle}</div>}
                </div>
                <div>
                    <h2>Your backup plan (optional)</h2>
                    <Input
                        placeholder="e.g. If tired, do just 1 km"
                        value={fallbackPlan}
                        onValueChange={(val) => handleFieldChange("fallbackPlan", val)}
                    />
                    {errors.fallbackPlan && <div className="error">{errors.fallbackPlan}</div>}
                </div>
            </>)}
        </Step>
    )
}
