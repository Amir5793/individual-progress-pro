"use client";
import React, { useState } from "react";
import "./StepperCaller.css";
import Stepper, { Step } from "./Stepper";
import { Input } from "@/components/fundamentals/Input/Input";
import DatePicker from "@/components/Calendar/DatePicker";
import { CheckBox } from "@/components/fundamentals/CheckBox/CheckBox";
import { TagsCard } from "@/components/fundamentals/TagsCard/TagsCard";
import { datumHandler } from "./utils/datumHandler";
import { validateStepInput, validateGoalData } from "@/components/Stepper/utils/validation";
import {localStorageHandler} from "@/backend/local_storage/loacl_storage_api";

export const StepperCaller = ({ mode, datum, handleCloseModal }) => {
    // ---------- Datum copy state (the full object) ----------
    const [datumCopy, setDatumCopy] = useState(datum);

    // ---------- UI state ----------
    const [showCalendar, setShowCalendar] = useState(false);
    const [errors, setErrors] = useState({});

    // ---------- Individual field states ----------
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
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    // ---------- Wrapper for datumHandler ----------
    const handleFieldChange = (key, value) => {
        datumHandler(
            key,
            value,
            setDatumCopy,
            mode,
            setErrors,
            setTitle,
            setReason,
            setCompletionCriteria,
            setDifficulty,
            setEnergy,
            setDeadline,
            setCategory,
            setObstacle,
            setFallbackPlan,
            setIdentity,
            setMinimumAction,
            setTarget,
            setTrigger
        );
    };

    // ---------- Date handlers (inline, with debug logs) ----------
    const handleTimeSelection = (option) => {
        clearError("deadline");
        const today = new Date();
        let newDeadline = null;

        switch (option) {
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

        console.log("handleTimeSelection -> newDeadline:", newDeadline);
        handleFieldChange("deadline", newDeadline);
    };

    const handleDatePick = (date) => {
        console.log("handleDatePick -> date:", date);
        handleFieldChange("deadline", date);
        setShowCalendar(false);
    };

    // ---------- Field name mapping ----------
    const getFieldNameForStep = (step) => {
        const map = mode === "task"
            ? {
                1: "title",
                2: "reason",
                3: "completionCriteria",
                4: "difficulty",
                5: "energy",
                6: "deadline",
                7: "category",
                8: "obstacle",
            }
            : {
                1: "identity",
                2: "title",
                3: "minimumAction",
                4: "target",
                5: "trigger",
                6: "obstacle",
                7: "reason",
            };
        return map[step] || "general";
    };

    // ---------- Validation ----------
    const validateAndMove = (previousStep, nextStep) => {
        // 🚀 If we're going back, skip validation entirely
        if (nextStep < previousStep) {
            // Optionally clear errors?
            // setErrors({}); // uncomment if you want to clear all errors when going back
            return true;
        }

        let value;

        if (mode === "task") {
            switch (previousStep) {
                case 1: value = title; break;
                case 2: value = reason; break;
                case 3: value = completionCriteria; break;
                case 4: value = difficulty; break;
                case 5: value = energy; break;
                case 6: value = deadline; break;
                case 7: value = category; break;
                case 8: value = { obstacle, fallbackPlan }; break;
                case 9: value = null; break;
                default: value = null;
            }
        } else if (mode === "habit") {
            switch (previousStep) {
                case 1: value = identity; break;
                case 2: value = title; break;
                case 3: value = minimumAction; break;
                case 4: value = target; break;
                case 5: value = trigger; break;
                case 6: value = obstacle; break;
                case 7: value = reason; break;
                default: value = null;
            }
        } else {
            value = null;
        }

        console.log(`validateAndMove: step ${previousStep}, value:`, value);

        const result = validateStepInput(previousStep, value, mode);
        console.log("Validation result:", result);

        if (!result.valid) {
            if (result.errors) {
                console.log("Setting multi-errors:", result.errors);
                setErrors(result.errors);
            } else if (result.error) {
                const fieldName = getFieldNameForStep(previousStep);
                console.log(`Setting error for ${fieldName}:`, result.error);
                setErrors({ [fieldName]: result.error });
            }
            return false;
        } else {
            setErrors({});
            return true;
        }
    };

    const handleFinalStepCompleted = () => {
        console.log("Final datumCopy:", datumCopy);

        // 1. Validate the new goal
        const validationResult = validateGoalData(datumCopy, mode);
        if (!validationResult.valid) {
            console.error("Validation failed:", validationResult.errors);
            // Show errors to the user (you can replace with a nicer UI)
            alert(
                "Please fix the following errors:\n" +
                Object.values(validationResult.errors).join("\n")
            );
            return; // Stop saving
        }

        // 2. Generate an ID (if not already present)
        const id = datumCopy.id || crypto.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

        // 3. Prepare the commitment object (fill missing fields)
        const commitment = {
            ...datumCopy,
            id,
            createdAt: datumCopy.createdAt ?
                (typeof datumCopy.createdAt === 'string' ? datumCopy.createdAt : datumCopy.createdAt.toISOString())
                : new Date().toISOString(),
            period: datumCopy.period || 'daily',
            deadline: datumCopy.deadline ?
                (typeof datumCopy.deadline === 'string' ? datumCopy.deadline : datumCopy.deadline.toISOString())
                : null,
            completed: datumCopy.completed ?? false,
            completedAt: datumCopy.completedAt || null,
            completions: datumCopy.completions || [],
            streak: datumCopy.streak || 0,
        };

        // 4. Get existing commitments from localStorage
        const getResult = localStorageHandler('GET', 'commitments');
        let commitments = [];
        if (getResult.success) {
            if (Array.isArray(getResult.data)) {
                commitments = getResult.data;
            } else if (typeof getResult.data === 'object' && getResult.data !== null) {
                // In case it's stored as { commitments: [...] }
                if (Array.isArray(getResult.data.commitments)) {
                    commitments = getResult.data.commitments;
                } else {
                    // If it's a single object (old format), we'll start fresh
                    console.warn('Commitments data is not an array; resetting.');
                }
            }
        } // If not found, we keep the empty array

        // 5. Add new commitment
        commitments.push(commitment);

        // 6. Save updated commitments array
        const saveResult = localStorageHandler('PUT', 'commitments', commitments);

        if (saveResult.success) {
            console.log('✅ Goal saved successfully!');
            // Close the modal
            handleCloseModal?.();
        } else {
            console.error('❌ Failed to save goal:', saveResult.error);
            alert('Failed to save: ' + saveResult.error);
        }
    };


    // ---------- Render ----------
    return (
        <Stepper
            disableStepIndicators={true}
            initialStep={1}
            onStepChange={(prevStep, nextStep) => validateAndMove(prevStep, nextStep)}
            onFinalStepCompleted={handleFinalStepCompleted}
            backButtonText="Previous"
            nextButtonText="Next"
            handleCloseModal={handleCloseModal}
        >
            {/* Step 1 - already correct */}
            <Step>
                <h1>{mode === "task" ? "What do you want to accomplish?" : "Who do you want to become?"}</h1>
                <Input
                    placeholder={mode === "task" ? "e.g. Finish Chapter 4 of React Course" : "e.g. A consistent runner"}
                    hintTxt={mode === "task" ? "Describe the outcome you’re aiming for." : "Imagine the person you see after adopting this habit."}
                    value={mode === "task" ? title : identity}
                    onValueChange={(val) => handleFieldChange(mode === "task" ? "title" : "identity", val)}
                />
                {mode === "task" && errors.title && <div className="error">{errors.title}</div>}
                {mode === "habit" && errors.identity && <div className="error">{errors.identity}</div>}
            </Step>

            {/* Step 2 */}
            <Step>
                <h1>{mode === "task" ? "Why is this important?" : "What action represents that person?"}</h1>
                <Input
                    placeholder={mode === "task" ? "e.g. Needed for my portfolio to get a job" : "e.g. Run 5 km"}
                    hintTxt={mode === "task" ? "Write a short reason that reminds you of your motivation." : "Describe a specific daily/weekly action."}
                    value={mode === "task" ? reason : title}
                    onValueChange={(val) => handleFieldChange(mode === "task" ? "reason" : "title", val)}
                    size={mode === "task" ? "large" : undefined}
                />
                {mode === "task" && errors.reason && <div className="error">{errors.reason}</div>}
                {mode === "habit" && errors.title && <div className="error">{errors.title}</div>}
            </Step>

            {/* Step 3 */}
            <Step>
                <h1>{mode === "task" ? "How will you know you’re done?" : "What’s the smallest version you can always do?"}</h1>
                <Input
                    placeholder={mode === "task" ? "e.g. Pass all unit tests for FormComponent" : "e.g. Run 1 km"}
                    hintTxt={mode === "task" ? "Specify a clear finish line." : "Your minimum commitment."}
                    value={mode === "task" ? completionCriteria : minimumAction}
                    onValueChange={(val) => handleFieldChange(mode === "task" ? "completionCriteria" : "minimumAction", val)}
                />
                {mode === "task" && errors.completionCriteria && <div className="error">{errors.completionCriteria}</div>}
                {mode === "habit" && errors.minimumAction && <div className="error">{errors.minimumAction}</div>}
            </Step>

            {/* Step 4 */}
            <Step>
                <h1>{mode === "task" ? "How difficult does it feel?" : "On a good day, what’s your ideal target?"}</h1>
                {mode === "task" ? (
                    <>
                        <div className="checkbox-container">
                            {["low", "medium", "hard", "almost impossible"].map((level) => (
                                <CheckBox
                                    key={level}
                                    name="difficulty"
                                    value={level}
                                    checked={difficulty === level}
                                    func={() => handleFieldChange("difficulty", level)}
                                />
                            ))}
                        </div>
                        {errors.difficulty && <div className="error">{errors.difficulty}</div>}
                    </>
                ) : (
                    <>
                        <Input
                            placeholder="e.g. 30 minutes"
                            hintTxt="Your preferred goal on a good day."
                            value={target}
                            onValueChange={(val) => handleFieldChange("target", val)}
                        />
                        {errors.target && <div className="error">{errors.target}</div>}
                    </>
                )}
            </Step>

            {/* Step 5 */}
            <Step>
                <h1>{mode === "task" ? "How much focus will you need?" : "What will remind you to do this?"}</h1>
                {mode === "task" ? (
                    <>
                        <div className="checkbox-container">
                            {["low", "medium", "much", "life or death"].map((level) => (
                                <CheckBox
                                    key={level}
                                    name="energy"
                                    value={level}
                                    checked={energy === level}
                                    func={() => handleFieldChange("energy", level)}
                                />
                            ))}
                        </div>
                        {errors.energy && <div className="error">{errors.energy}</div>}
                    </>
                ) : (
                    <>
                        <Input
                            placeholder="e.g. After breakfast"
                            hintTxt="Link to an existing routine or time."
                            value={trigger}
                            onValueChange={(val) => handleFieldChange("trigger", val)}
                        />
                        {errors.trigger && <div className="error">{errors.trigger}</div>}
                    </>
                )}
            </Step>

            {/* Step 6 – now uses inline date handlers */}
            <Step>
                <h1>{mode === "task" ? "When would you like to finish?" : "What might stop you? And your backup plan"}</h1>
                {mode === "task" ? (
                    <>
                        <div className="date-picker-container">
                            <div className="date-picker-checkbox-container">
                                {["No deadline", "tomorrow", "this week", "pick a date"].map((option) => {
                                    let checked = false;
                                    if (option === "No deadline" && deadline === null) checked = true;
                                    else if (option === "tomorrow") {
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
                                    return (
                                        <CheckBox
                                            key={option}
                                            name="time"
                                            value={option}
                                            checked={checked}
                                            func={() => handleTimeSelection(option)}
                                        />
                                    );
                                })}
                            </div>
                            <div>
                                {showCalendar && (
                                    <DatePicker
                                        selectedDate={deadline}
                                        onDateSelect={handleDatePick}
                                    />
                                )}
                            </div>
                        </div>
                        {errors.deadline && <div className="error">{errors.deadline}</div>}
                    </>
                ) : (
                    <>
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
                    </>
                )}
            </Step>

            {/* Step 7 */}
            <Step>
                <h1>{mode === "task" ? "Which area of life does this belong to?" : "Why does this matter? (Your reason)"}</h1>
                {mode === "task" ? (
                    <>
                        <div className="tags-container">
                            <TagsCard
                                tags={["Learning", "Career", "Health", "Hobby", "Personal", "Other"]}
                                selectedTag={category}
                                func={(tag) => handleFieldChange("category", tag)}
                            />
                        </div>
                        {errors.category && <div className="error">{errors.category}</div>}
                    </>
                ) : (
                    <>
                        <Input
                            placeholder="e.g. I want to be a healthy person for my family."
                            hintTxt="This will remind Future You of your motivation."
                            value={reason}
                            onValueChange={(val) => handleFieldChange("reason", val)}
                            size="large"
                        />
                        {errors.reason && <div className="error">{errors.reason}</div>}
                    </>
                )}
            </Step>

            {/* Step 8 – task only */}
            {mode === "task" && (
                <Step>
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
                        {errors.fallbackPlan && <div className="error">{errors.fallbackPlan}</div>}
                    </div>
                </Step>
            )}

            {/* Step 9 – Review */}
            <Step>
                <h1>Review your commitment</h1>
                {mode === "task" ? (
                    <ul>
                        <li><strong>Goal:</strong> {title}</li>
                        <li><strong>Why:</strong> {reason || "—"}</li>
                        <li><strong>Success criteria:</strong> {completionCriteria}</li>
                        <li><strong>Difficulty:</strong> {difficulty}</li>
                        <li><strong>Energy:</strong> {energy}</li>
                        <li><strong>Deadline:</strong> {deadline ? deadline.toDateString() : "No deadline"}</li>
                        <li><strong>Category:</strong> {category}</li>
                        <li><strong>Obstacle:</strong> {obstacle || "—"}</li>
                        <li><strong>Fallback plan:</strong> {fallbackPlan || "—"}</li>
                    </ul>
                ) : (
                    <ul>
                        <li><strong>Identity:</strong> {identity}</li>
                        <li><strong>Action:</strong> {title}</li>
                        <li><strong>Minimum action:</strong> {minimumAction}</li>
                        <li><strong>Target:</strong> {target || "—"}</li>
                        <li><strong>Trigger:</strong> {trigger || "—"}</li>
                        <li><strong>Obstacle:</strong> {obstacle || "—"}</li>
                        <li><strong>Reason:</strong> {reason || "—"}</li>
                    </ul>
                )}
            </Step>
        </Stepper>
    );
};