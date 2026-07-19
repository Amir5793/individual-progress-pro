"use client";
import React, { useState } from "react";
import styled from "styled-components";
import Stepper from "./Stepper";
import { datumHandler } from "./utils/datumHandler";
import { validateStepInput, validateGoalData } from "@/components/Stepper/utils/validation";
import { localStorageHandler } from "../../backend/local_storage/local_storage_api";
import { useCommitments } from "@/lib/store/CommitmentContext";

// Components for steps
import { GoalOrTask } from "@/components/Stepper/steps/GoalOrTask/GoalOrTask";
import { Name } from "@/components/Stepper/steps/Name/Name";
import { Reason } from "@/components/Stepper/steps/Reason/Reason";
import { MinimumAction } from "@/components/Stepper/steps/MinimumAction/MinimumAction";
import { Plan } from "@/components/Stepper/steps/Plan/Plan";
import { DifficultyOrTarget } from "@/components/Stepper/steps/DifficultyOrTarget/DifficultyOrTarget";
import { EnergyOrTrigger } from "@/components/Stepper/steps/EnergyOrTrigger/EnergyOrTrigger";
import { DeadlineOrObstacle } from "@/components/Stepper/steps/DeadlineOrObstacle/DeadlineOrObstacle";
import { CategoryOrReason } from "@/components/Stepper/steps/CategoryOrReason/CategoryOrReason";
import { Obstacles } from "@/components/Stepper/steps/Obstacles/Obstacles";
import { Review } from "@/components/Stepper/steps/Review/Review";

// Centralised standard blueprint for raw action creations to avoid code duplication
const INITIAL_ACTION_STATE = {
    title: "",
    doneWhen: "",
    estimatedMinutes: 30,
    difficulty: "medium",
    resources: [],
    dependsOn: [],
    completed: false,
    completedAt: null
};

const safeToISOString = (val) => {
    if (!val || val === "No deadline" || val === "pick a date") return null;
    const date = new Date(val);
    return isNaN(date.getTime()) ? null : date.toISOString();
};

let actionSequence = 0;

const createSequentialId = (prefix) => {
    actionSequence += 1;
    return `${prefix}-${actionSequence}`;
};

export const StepperCaller = ({ mode, datum, handleCloseModal, onCommitmentCreated }) => {
    const { refresh } = useCommitments();

    // ---------- Datum copy state (the full object) ----------
    const [datumCopy, setDatumCopy] = useState(datum);

    // ---------- UI state ----------
    const [showCalendar, setShowCalendar] = useState(false);
    const [errors, setErrors] = useState({});

    // ---------- Individual field states ----------
    const [isAchieveAbleInOneAction, setIsAchieveAbleInOneAction] = useState(false);
    const [title, setTitle] = useState(datum.title || "");
    const [reason, setReason] = useState(datum.reason?.mainReason || "");
    const [reasonNow, setReasonNow] = useState(datum.reason?.nowReason || "");
    const [reasonSucceed, setReasonSucceed] = useState(datum.reason?.succeedReason || "");
    const [completionCriteria, setCompletionCriteria] = useState(datum.completionCriteria || "");
    const [difficulty, setDifficulty] = useState(datum.difficulty || "");
    const [energy, setEnergy] = useState(datum.energy || "");
    const [deadline, setDeadline] = useState(datum.deadline ? new Date(datum.deadline) : null);
    const [category, setCategory] = useState(datum.category || "");
    const [obstacle, setObstacle] = useState(datum.obstacle || "");
    const [fallbackPlan, setFallbackPlan] = useState(datum.fallbackPlan || "");
    const [identity, setIdentity] = useState(datum.identity || "");
    const [minimumAction, setMinimumAction] = useState(datum.minimumAction || "");
    const [target, setTarget] = useState(datum.target || "");
    const [trigger, setTrigger] = useState(datum.trigger || "");

    // Fallback to empty array if datum.actions is undefined
    const [actions, setActions] = useState(datum.actions || []);
    const [editingIndex, setEditingIndex] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Initialize new action state cleanly using the shared blueprint
    const [newAction, setNewAction] = useState(INITIAL_ACTION_STATE);
    const [showAddForm, setShowAddForm] = useState(false);

    // ---------- Save (Add or Update) ----------
    const saveAction = () => {
        if (!newAction.title.trim()) {
            setErrors((prev) => ({ ...prev, plan: "Action title is required" }));
            return;
        }

        if (isEditing) {
            const updated = [...actions];
            updated[editingIndex] = {
                ...updated[editingIndex],
                ...newAction,
                resources: Array.isArray(newAction.resources) ? newAction.resources : []
            };
            setActions(updated);
            setDatumCopy((prev) => ({ ...prev, actions: updated }));
        } else {
            const actionToAdd = {
                ...newAction,
                id: createSequentialId("action"),
                resources: Array.isArray(newAction.resources) ? newAction.resources : []
            };
            setActions((prev) => [...prev, actionToAdd]);
            setDatumCopy((prev) => ({ ...prev, actions: [...(prev.actions || []), actionToAdd] }));
        }

        // Reset UI tracking states completely
        setShowAddForm(false);
        setIsEditing(false);
        setEditingIndex(null);
        setNewAction(INITIAL_ACTION_STATE);
        clearError("plan");
    };

    // ---------- Edit ----------
    const startEdit = (index) => {
        const action = actions[index];
        if (!action) return;

        setNewAction({
            ...INITIAL_ACTION_STATE,
            ...action,
            resources: Array.isArray(action.resources) ? action.resources : []
        });

        setEditingIndex(index);
        setIsEditing(true);
        setShowAddForm(true);
    };

    // ---------- Delete ----------
    const deleteAction = (index) => {
        const updated = actions.filter((_, i) => i !== index);
        setActions(updated);
        setDatumCopy((prev) => ({ ...prev, actions: updated }));
        if (editingIndex === index) {
            setEditingIndex(null);
            setIsEditing(false);
        }
    };

    // ---------- Cancel Modal Closure ----------
    const cancelModal = () => {
        setShowAddForm(false);
        setIsEditing(false);
        setEditingIndex(null);
        setNewAction(INITIAL_ACTION_STATE);
        clearError("plan");
    };

    // ---------- Helper to clear errors ----------
    const clearError = (field) => {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    // ---------- Wrapper for datumHandler ----------
    const handleFieldChange = (key, value, reasonMode = "main") => {
        datumHandler(
            key, value, setDatumCopy, mode, reasonMode, setErrors,
            setTitle, setReason, setReasonNow, setReasonSucceed,
            setCompletionCriteria, setDifficulty, setEnergy, setDeadline,
            setCategory, setObstacle, setFallbackPlan, setIdentity,
            setMinimumAction, setTarget, setTrigger
        );
    };

    // ---------- Date handlers ----------
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
                return;
            default:
                return;
        }

        handleFieldChange("deadline", newDeadline);
    };

    const handleDatePick = (date) => {
        handleFieldChange("deadline", date);
        // setShowCalendar(false);
    };

    const handleGoalOrTask = (option) => {
        if (option === "Yes") {
            setIsAchieveAbleInOneAction(true);
            setActions([]);
            setDatumCopy((prev) => ({ ...prev, actions: [] }));
        } else if (option === "No") {
            setIsAchieveAbleInOneAction(false);
        }
    };

    // ---------- Dynamic step alignment map ----------
    const buildStepMap = () => {
        if (mode === "goal") {
            const map = [];
            map.push({ field: "_goalOrTask", getValue: () => isAchieveAbleInOneAction });
            map.push({ field: "title", getValue: () => title });
            map.push({
                field: "reason",
                getValue: () => ({ mainReason: reason, nowReason: reasonNow, succeedReason: reasonSucceed })
            });
            map.push({ field: "completionCriteria", getValue: () => completionCriteria });
            if (!isAchieveAbleInOneAction) {
                map.push({ field: "plan", getValue: () => actions });
            }
            map.push({ field: "difficulty", getValue: () => difficulty });
            map.push({ field: "energy", getValue: () => energy });
            map.push({ field: "deadline", getValue: () => deadline });
            map.push({ field: "category", getValue: () => category });
            map.push({ field: "obstacle", getValue: () => ({ obstacle, fallbackPlan }) });
            map.push({ field: "review", getValue: () => null });
            return map;
        } else {
            return [
                { field: "identity", getValue: () => identity },
                { field: "title", getValue: () => title },
                { field: "minimumAction", getValue: () => minimumAction },
                { field: "target", getValue: () => target },
                { field: "trigger", getValue: () => trigger },
                { field: "obstacle", getValue: () => ({ obstacle, fallbackPlan }) },
                { field: "reason", getValue: () => reasonNow },
                { field: "review", getValue: () => null },
            ];
        }
    };

    const getFieldNameForStep = (step) => {
        const map = buildStepMap();
        const entry = map[step - 1];
        return entry ? entry.field : "general";
    };

    // ---------- Step Validation ----------
    const validateAndMove = (previousStep, nextStep) => {
        if (nextStep < previousStep) return true;

        const map = buildStepMap();
        const entry = map[previousStep - 1];
        const value = entry ? entry.getValue() : null;

        const result = validateStepInput(previousStep, value, mode, isAchieveAbleInOneAction);

        if (!result.valid) {
            if (result.errors) {
                setErrors(result.errors);
            } else if (result.error) {
                const fieldName = getFieldNameForStep(previousStep);
                setErrors({ [fieldName]: result.error });
            }
            return false;
        } else {
            setErrors({});
            return true;
        }
    };

    // ---------- Save Goal Payload to Database / LocalStorage ----------
    /* Inside StepperCaller.js - Update only handleFinalStepCompleted */
    // ---------- Save Goal Payload to Database / LocalStorage ----------
    const handleFinalStepCompleted = () => {
        const validationResult = validateGoalData(datumCopy, mode, isAchieveAbleInOneAction);
        if (!validationResult.valid) {
            alert("Please fix the following errors:\n" + Object.values(validationResult.errors).join("\n"));
            return;
        }

        const isEditMode = !!datumCopy.id;
        const id = datumCopy.id || crypto.randomUUID?.() || createSequentialId(mode);

        // Map safe and verified dates only to prevent serialization crashes
        const commitment = {
            ...datumCopy,
            id,
            createdAt: safeToISOString(datumCopy.createdAt) || new Date().toISOString(),
            period: datumCopy.period || 'daily',
            deadline: safeToISOString(datumCopy.deadline), // Safe conversion
            completed: datumCopy.completed ?? false,
            completedAt: safeToISOString(datumCopy.completedAt),
            completions: datumCopy.completions || [],
            streak: datumCopy.streak || 0,
        };

        const getResult = localStorageHandler('GET', 'commitments');
        let commitments = [];
        if (getResult.success) {
            if (Array.isArray(getResult.data)) {
                commitments = getResult.data;
            } else if (typeof getResult.data === 'object' && getResult.data !== null) {
                if (Array.isArray(getResult.data.commitments)) {
                    commitments = getResult.data.commitments;
                }
            }
        }

        const existingIndex = commitments.findIndex(c => c.id === commitment.id);
        if (existingIndex !== -1) {
            commitments[existingIndex] = commitment;
        } else {
            commitments.push(commitment);
        }

        const saveResult = localStorageHandler('PUT', 'commitments', commitments);

        if (saveResult.success) {
            refresh();
            handleCloseModal?.();
        } else {
            alert('Failed to save: ' + saveResult.error);
        }
    };

    // ---------- Render Layout Flow ----------
    return (
        <StyledWrapper>
            <Stepper
                disableStepIndicators={true}
                initialStep={1}
                onStepChange={(prevStep, nextStep) => validateAndMove(prevStep, nextStep)}
                onFinalStepCompleted={handleFinalStepCompleted}
                backButtonText="Previous"
                nextButtonText="Next"
                handleCloseModal={handleCloseModal}
            >
                {mode === "goal" && (
                    <GoalOrTask
                        isAchieveAbleInOneAction={isAchieveAbleInOneAction}
                        handleGoalOrTask={handleGoalOrTask}
                    />
                )}

                <Name
                    mode={mode}
                    errors={errors}
                    handleFieldChange={handleFieldChange}
                    identity={identity}
                    title={title}
                />

                <Reason
                    mode={mode}
                    reason={reason}
                    reasonNow={reasonNow}
                    reasonSucceed={reasonSucceed}
                    title={title}
                    handleFieldChange={handleFieldChange}
                    errors={errors}
                />

                <MinimumAction
                    mode={mode}
                    completionCriteria={completionCriteria}
                    minimumAction={minimumAction}
                    handleFieldChange={handleFieldChange}
                    errors={errors}
                />

                {mode === "goal" && !isAchieveAbleInOneAction && (
                    <Plan
                        title={title}
                        actions={actions}
                        errors={errors}
                        startEdit={startEdit}
                        deleteAction={deleteAction}
                        setIsEditing={setIsEditing}
                        setEditingIndex={setEditingIndex}
                        setNewAction={setNewAction}
                        setShowAddForm={setShowAddForm}
                        showAddForm={showAddForm}
                        isEditing={isEditing}
                        newAction={newAction}
                        saveAction={saveAction}
                        cancelModal={cancelModal}

                        onReorder={(newActions) => {
                            setActions(newActions);
                            setDatumCopy((prev) => ({ ...prev, actions: newActions }));
                        }}
                    />
                )}

                <DifficultyOrTarget
                    mode={mode}
                    difficulty={difficulty}
                    target={target}
                    handleFieldChange={handleFieldChange}
                    errors={errors}
                />

                <EnergyOrTrigger
                    mode={mode}
                    energy={energy}
                    trigger={trigger}
                    handleFieldChange={handleFieldChange}
                    errors={errors}
                />

                <DeadlineOrObstacle
                    mode={mode}
                    deadline={deadline}
                    showCalendar={showCalendar}
                    handleTimeSelection={handleTimeSelection}
                    handleDatePick={handleDatePick}
                    obstacle={obstacle}
                    fallbackPlan={fallbackPlan}
                    handleFieldChange={handleFieldChange}
                    errors={errors}
                />

                <CategoryOrReason
                    mode={mode}
                    category={category}
                    reason={reason}
                    handleFieldChange={handleFieldChange}
                    errors={errors}
                />

                {mode === "goal" && (
                    <Obstacles
                        obstacle={obstacle}
                        fallbackPlan={fallbackPlan}
                        handleFieldChange={handleFieldChange}
                        errors={errors}
                    />
                )}

                <Review
                    mode={mode}
                    title={title}
                    reasonNow={reasonNow}
                    actions={actions}
                    completionCriteria={completionCriteria}
                    difficulty={difficulty}
                    energy={energy}
                    deadline={deadline}
                    category={category}
                    obstacle={obstacle}
                    fallbackPlan={fallbackPlan}
                    identity={identity}
                    minimumAction={minimumAction}
                    target={target}
                    trigger={trigger}
                />
            </Stepper>
        </StyledWrapper>
    );
};

/* Scoped Caller Styling */
const StyledWrapper = styled.div`
  h1 {
    color: var(--text-primary);
    font-size: 1.8rem;
    font-weight: 500;
    letter-spacing: -0.02em;
    margin-bottom: 0.5rem;
  }

  h2 {
    color: var(--text-primary);
    margin-bottom: 1rem;
  }

  p {
    color: var(--text-primary);
    margin: 0;
  }

  ul {
    color: var(--text-primary);
  }
`;
