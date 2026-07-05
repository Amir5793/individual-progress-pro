"use client";
import React, {useState} from "react";
import "./StepperCaller.css";
import Stepper, {Step} from "./Stepper";
import {Input} from "@/components/fundamentals/Input/Input";
import DatePicker from "@/components/Calendar/DatePicker";
import {CheckBox} from "@/components/fundamentals/CheckBox/CheckBox";
import {TagsCard} from "@/components/fundamentals/TagsCard/TagsCard";
import * as stepHandler from "./utils/stepHandler";
import {datumHandler} from "./utils/datumHandler";
import {validateStepInput} from "@/components/Stepper/utils/validation";

export const StepperCaller = ({mode, datum, handleCloseModal}) => {
    // ---------- Datum copy state (the full object) ----------
    const [datumCopy, setDatumCopy] = useState(datum);

    // ---------- UI state ----------
    const [showCalendar, setShowCalendar] = useState(false);
    const [errors, setErrors] = useState({});

    // ---------- Individual field states (kept for UI binding) ----------
    const [title, setTitle] = useState(datum.title || "");
    const [reason, setReason] = useState(datum.reason || "");
    const [completionCriteria, setCompletionCriteria] = useState(datum.completionCriteria || "");
    const [difficulty, setDifficulty] = useState(datum.difficulty || "");
    const [energy, setEnergy] = useState(datum.energy || "");
    const [deadline, setDeadline] = useState(datum.deadline || null);
    const [category, setCategory] = useState(datum.category || "");
    const [obstacle, setObstacle] = useState(datum.obstacle || "");
    const [fallbackPlan, setFallbackPlan] = useState(datum.fallbackPlan || "");
    const [identity, setIdentity] = useState(datum.identity || "");
    const [minimumAction, setMinimumAction] = useState(datum.minimumAction || "");
    const [target, setTarget] = useState(datum.target || "");
    const [trigger, setTrigger] = useState(datum.trigger || "");

    // ---------- Helper to clear errors ----------
    const clearError = (field) => {
        setErrors((prev) => ({...prev, [field]: undefined}));
    };

    // ---------- Wrapper for datumHandler to simplify calls ----------
    const handleFieldChange = (key, value) => {
        datumHandler(key, value, setDatumCopy, mode, setErrors, setTitle, setReason, setCompletionCriteria, setDifficulty, setEnergy, setDeadline, setCategory, setObstacle, setFallbackPlan, setIdentity, setMinimumAction, setTarget, setTrigger);
    };


    // ---------- Deadline handlers (wrapped to use datumHandler) ----------
    const handleTimeSelection = (option) => {
        stepHandler.handleTimeSelection(option, clearError, setShowCalendar, (date) => handleFieldChange("deadline", date));
    };

    const handleDatePick = (date) => {
        handleFieldChange("deadline", date);
        setShowCalendar(false);
    };

    const getFieldNameForStep = (step) => {
        const map = mode === "task" ? {
            1: "title",
            2: "reason",
            3: "completionCriteria",
            4: "difficulty",
            5: "energy",
            6: "deadline",
            7: "category",
            8: "obstacle", // fallbackPlan is separate, but we handle it via result.errors for step 8
        } : {
            1: "identity", 2: "title", 3: "minimumAction", 4: "target", 5: "trigger", 6: "obstacle", 7: "reason",
        }
        return map[step] || "general";
    };

    const validateAndMove = (previousStep, nextStep) => {
        // Gather the value(s) for the step we're leaving
        let value;

        if (mode === "task") {
            switch (previousStep) {
                case 1:
                    value = title;
                    break;
                case 2:
                    value = reason;
                    break;
                case 3:
                    value = completionCriteria;
                    break;
                case 4:
                    value = difficulty;
                    break;
                case 5:
                    value = energy;
                    break;
                case 6:
                    value = deadline;
                    break;
                case 7:
                    value = category;
                    break;
                case 8:
                    value = {obstacle, fallbackPlan};   // two fields combined
                    break;
                case 9:
                    value = null;                          // review step, no input
                    break;
                default:
                    value = null;
            }
        } else if (mode === "habit") {
            switch (previousStep) {
                case 1:
                    value = identity;
                    break;
                case 2:
                    value = title;
                    break;
                case 3:
                    value = minimumAction;
                    break;
                case 4:
                    value = target;
                    break;
                case 5:
                    value = trigger;
                    break;
                case 6:
                    value = obstacle;                      // only obstacle, no fallbackPlan
                    break;
                case 7:
                    value = reason;
                    break;
                // If you have steps 8 & 9 in habit mode, handle them here:
                // case 8: value = { ... }; break;
                // case 9: value = null; break;
                default:
                    value = null;
            }
        } else {
            value = null;
        }


        // Run validation
        const result = validateStepInput(previousStep, value, mode);
        console.log("validation result: ", result)

        if (!result.valid) {
            // Set errors
            if (result.errors) {
                // For step 8: errors.obstacle and errors.fallbackPlan
                console.log('Setting errors (multi):', result.errors);
                setErrors(result.errors);
            } else if (result.error) {
                const fieldName = getFieldNameForStep(previousStep);
                console.log('Setting error for field:', fieldName, 'message:', result.error);
                setErrors({[fieldName]: result.error});
            }
            // Prevent step change
            return false
        } else {
            // Clear all errors and allow step change
            setErrors({});
            return true
            // We'll reset changeStep to false after the stepper processes it
        }
    };

    // ---------- Render ----------
    return (<Stepper
        disableStepIndicators={true}
        initialStep={1}
        onStepChange={(prevStep, nextStep) => validateAndMove(prevStep, nextStep)}
        onFinalStepCompleted={() => console.log("All steps completed!")}
        backButtonText="Previous"
        nextButtonText="Next"
        handleCloseModal={handleCloseModal}
    >
        {/* Step 1 */}
        <Step>
            <h1>
                {mode === "task" ? "What do you want to accomplish?" : "Who do you want to become?"}
            </h1>
            <Input
                placeholder={mode === "task" ? "e.g. Finish Chapter 4 of React Course" : "e.g. A consistent runner"}
                hintTxt={mode === "task" ? "Describe the outcome you’re aiming for." : "Imagine the person you see after adopting this habit."}
                value={title}
                onValueChange={(val) => handleFieldChange(mode === "task" ? "title" : "identity", val)}
            />
            {mode === "task" && errors.title && <div className="error">{errors.title}</div>}
            {mode === "habit" && errors.identity && <div className="error">{errors.identity}</div>}
        </Step>

        {/* Step 2 */}
        <Step>
            <h1>
                {mode === "task" ? "Why is this important?" : "What action represents that person?"}
            </h1>
            <Input
                placeholder={mode === "task" ? "e.g. Needed for my portfolio to get a job" : "e.g. Run 5 km"}
                hintTxt={mode === "task" ? "Write a short reason that reminds you of your motivation." : "Describe a specific daily/weekly action."}
                value={reason}
                onValueChange={(val) => handleFieldChange(mode === "task" ? "reason" : "title", val)}
                size={mode === "task" && "large"}
            />
            {mode === "task" && errors.reason && <div className="error">{errors.reason}</div>}
            {mode === "habit" && errors.title && <div className="error">{errors.title}</div>}
        </Step>

        {/* Step 3 */}
        <Step>
            <h1>
                {mode === "task" ? "How will you know you’re done?" : "What’s the smallest version you can always do?"}
            </h1>
            <Input
                placeholder={mode === "task" ? "e.g. Pass all unit tests for FormComponent" : "e.g. Run 1 km"}
                hintTxt={mode === "task" ? "Specify a clear finish line." : "Your minimum commitment."}
                value={mode === "task" ? completionCriteria : minimumAction}
                onValueChange={(val) => handleFieldChange(mode === "task" ? "completionCriteria" : "minimumAction", val)}
            />
            {mode === "task" ? errors.completionCriteria && (
                <div className="error">{errors.completionCriteria}</div>) : errors.minimumAction && (
                <div className="error">{errors.minimumAction}</div>)}
        </Step>

        {/* Step 4 */}
        <Step>
            <h1>
                {mode === "task" ? "How difficult does it feel?" : "On a good day, what’s your ideal target?"}
            </h1>
            {mode === "task" ? (<>
                <div className="checkbox-container">
                    {["low", "medium", "hard", "almost impossible"].map((level) => (<CheckBox
                        key={level}
                        name="difficulty"
                        value={level}
                        checked={difficulty === level}
                        func={() => handleFieldChange("difficulty", level)}
                    />))}
                </div>
                {errors.difficulty && (<div className="error">{errors.difficulty}</div>)}
            </>) : (<>
                <Input
                    placeholder="e.g. 30 minutes"
                    hintTxt="Your preferred goal on a good day."
                    value={target}
                    onValueChange={(val) => handleFieldChange("target", val)}
                />
                {errors.target && <div className="error">{errors.target}</div>}
            </>)}
        </Step>

        {/* Step 5 */}
        <Step>
            <h1>
                {mode === "task" ? "How much focus will you need?" : "What will remind you to do this?"}
            </h1>
            {mode === "task" ? (<>
                <div className="checkbox-container">
                    {["low", "medium", "much", "life or death"].map((level) => (<CheckBox
                        key={level}
                        name="energy"
                        value={level}
                        checked={energy === level}
                        func={() => handleFieldChange("energy", level)}
                    />))}
                </div>
                {errors.energy && <div className="error">{errors.energy}</div>}
            </>) : (<>
                <Input
                    placeholder="e.g. After breakfast"
                    hintTxt="Link to an existing routine or time."
                    value={trigger}
                    onValueChange={(val) => handleFieldChange("trigger", val)}
                />
                {errors.trigger && <div className="error">{errors.trigger}</div>}
            </>)}
        </Step>

        {/* Step 6 */}
        <Step>
            <h1>
                {mode === "task" ? "When would you like to finish?" : "What might stop you? And your backup plan"}
            </h1>
            {mode === "task" ? (<>
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
                            onSelect={handleDatePick}
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
                    {errors.obstacle && (<div className="error">{errors.obstacle}</div>)}
                </div>
                <div>
                    <h2>Your backup plan (optional)</h2>
                    <Input
                        placeholder="e.g. If tired, do just 1 km"
                        value={fallbackPlan}
                        onValueChange={(val) => handleFieldChange("fallbackPlan", val)}
                    />
                    {errors.fallbackPlan && (<div className="error">{errors.fallbackPlan}</div>)}
                </div>
            </>)}
        </Step>

        {/* Step 7 */}
        <Step>
            <h1>
                {mode === "task" ? "Which area of life does this belong to?" : "Why does this matter? (Your reason)"}
            </h1>
            {mode === "task" ? (<>
                <div className="tags-container">
                    <TagsCard
                        tags={["Learning", "Career", "Health", "Hobby", "Personal", "Other"]}
                        selectedTag={category}
                        func={(tag) => handleFieldChange("category", tag)}
                    />
                </div>
                {errors.category && <div className="error">{errors.category}</div>}
            </>) : (<>
                <Input
                    placeholder="e.g. I want to be a healthy person for my family."
                    hintTxt="This will remind Future You of your motivation."
                    value={reason}
                    onValueChange={(val) => handleFieldChange("reason", val)}
                    size="large"
                />
                {errors.reason && <div className="error">{errors.reason}</div>}
            </>)}
        </Step>

        {/* Step 8 – only for task mode */}
        {mode === "task" && (<Step>
            <h1>Obstacles & Backup Plan</h1>
            <div>
                <h2>What might stop you? (optional)</h2>
                <Input
                    placeholder="e.g. No time, distractions..."
                    value={obstacle}
                    onValueChange={(val) => handleFieldChange("obstacle", val)}
                />
                {errors.obstacle && <div className="error">{errors.obstacle}</div>}
            </div>
            <div>
                <h2>Your backup plan (optional)</h2>
                <Input
                    placeholder="e.g. If late, study 10 min only"
                    value={fallbackPlan}
                    onValueChange={(val) => handleFieldChange("fallbackPlan", val)}
                />
                {errors.fallbackPlan && (<div className="error">{errors.fallbackPlan}</div>)}
            </div>
        </Step>)}

        {/* Step 9 – Review */}
        <Step>
            <h1>Review your commitment</h1>
            {mode === "task" ? (<ul>
                <li><strong>Goal:</strong> {title}</li>
                <li><strong>Why:</strong> {reason || "—"}</li>
                <li><strong>Success criteria:</strong> {completionCriteria}</li>
                <li><strong>Difficulty:</strong> {difficulty}</li>
                <li><strong>Energy:</strong> {energy}</li>
                <li><strong>Deadline:</strong> {deadline ? deadline.toDateString() : "No deadline"}</li>
                <li><strong>Category:</strong> {category}</li>
                <li><strong>Obstacle:</strong> {obstacle || "—"}</li>
                <li><strong>Fallback plan:</strong> {fallbackPlan || "—"}</li>
            </ul>) : (<ul>
                <li><strong>Identity:</strong> {identity}</li>
                <li><strong>Action:</strong> {title}</li>
                <li><strong>Minimum action:</strong> {minimumAction}</li>
                <li><strong>Target:</strong> {target || "—"}</li>
                <li><strong>Trigger:</strong> {trigger || "—"}</li>
                <li><strong>Obstacle:</strong> {obstacle || "—"}</li>
                <li><strong>Reason:</strong> {reason || "—"}</li>
            </ul>)}
        </Step>
    </Stepper>);
};