"use client";
import React, {useState} from "react";
import "./StepperCaller.css";
import Stepper from "./Stepper";
import {datumHandler} from "./utils/datumHandler";
import {validateStepInput, validateGoalData} from "@/components/Stepper/utils/validation";
import {localStorageHandler} from "@/backend/local_storage/loacl_storage_api";
import {CommitmentProvider, useCommitments} from "@/lib/store/CommitmentContext";
import {COMMITMENT_CREATED} from "@/lib/store/types";
import {GoalOrTask} from "@/components/Stepper/steps/GoalOrTask/GoalOrTask";
import {Name} from "@/components/Stepper/steps/Name/Name";
import {Reason} from "@/components/Stepper/steps/Reason/Reason";
import {MinimumAction} from "@/components/Stepper/steps/MinimumAction/MinimumAction";
import {Plan} from "@/components/Stepper/steps/Plan/Plan";
import {DifficultyOrTarget} from "@/components/Stepper/steps/DifficultyOrTarget/DifficultyOrTarget";
import {EnergyOrTrigger} from "@/components/Stepper/steps/EnergyOrTrigger/EnergyOrTrigger";
import {DeadlineOrObstacle} from "@/components/Stepper/steps/DeadlineOrObstacle/DeadlineOrObstacle";
import {CategoryOrReason} from "@/components/Stepper/steps/CategoryOrReason/CategoryOrReason";
import {Obstacles} from "@/components/Stepper/steps/Obstacles/Obstacles";
import {Review} from "@/components/Stepper/steps/Review/Review";

export const StepperCaller = ({mode, datum, handleCloseModal, onCommitmentCreated}) => {
    const { dispatch, refresh } = useCommitments();
    // ---------- Datum copy state (the full object) ----------
    const [datumCopy, setDatumCopy] = useState(datum);

    // ---------- UI state ----------
    const [showCalendar, setShowCalendar] = useState(false);
    const [errors, setErrors] = useState({});

    // ---------- Individual field states ----------
    const [isAchieveAbleInOneAction, setIsAchieveAbleInOneAction] = useState(false);
    const [title, setTitle] = useState(datum.title || "");
    const [reason, setReason] = useState(datum.reason?.mainReason || "");
    const [reasonNow, setReasonNow] = useState(datum.reason.nowReason || "");
    const [reasonSucceed, setReasonSucceed] = useState(datum.reason.succeedReason || "");
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

    const [actions, setActions] = useState(datum.actions || []);
    const [editingIndex, setEditingIndex] = useState(null); // null means not editing
    const [isEditing, setIsEditing] = useState(false);

    // New action form
    const [newAction, setNewAction] = useState({
        title: "",
        doneWhen: "",
        estimatedMinutes: 30,
        difficulty: "medium",
        resources: [],
        dependsOn: [],
        completed: false,
        completedAt: null
    });
    const [showAddForm, setShowAddForm] = useState(false);


    // ---------- Save (Add or Update) ----------
    const saveAction = () => {
        if (!newAction.title.trim()) {
            setErrors((prev) => ({...prev, plan: "Action title is required"}));
            return;
        }

        if (isEditing) {
            // Update existing
            const updated = [...actions];
            updated[editingIndex] = {...updated[editingIndex], ...newAction};
            setActions(updated);
            setDatumCopy((prev) => ({...prev, actions: updated}));
        } else {
            // Add new
            const actionToAdd = {...newAction, id: Date.now().toString(36)};
            setActions((prev) => [...prev, actionToAdd]);
            setDatumCopy((prev) => ({...prev, actions: [...prev.actions || [], actionToAdd]}));
        }

        // Reset and close
        setShowAddForm(false);
        setIsEditing(false);
        setEditingIndex(null);
        setNewAction({
            title: "",
            doneWhen: "",
            estimatedMinutes: 30,
            difficulty: "medium",
            resources: [],
            dependsOn: [],
            completed: false,
            completedAt: null,
        });
        clearError("plan");
    };

    // ---------- Edit ----------
    const startEdit = (index) => {
        const action = actions[index];
        setNewAction({...action});
        setEditingIndex(index);
        setIsEditing(true);
        setShowAddForm(true);
    };

    // ---------- Delete ----------
    const deleteAction = (index) => {
        const updated = actions.filter((_, i) => i !== index);
        setActions(updated);
        setDatumCopy((prev) => ({...prev, actions: updated}));
        if (editingIndex === index) {
            setEditingIndex(null);
            setIsEditing(false);
        }
    };

    // ---------- Cancel ----------
    const cancelModal = () => {
        setShowAddForm(false);
        setIsEditing(false);
        setEditingIndex(null);
        setNewAction({
            title: "",
            doneWhen: "",
            estimatedMinutes: 30,
            difficulty: "medium",
            resources: [],
            dependsOn: [],
            completed: false,
            completedAt: null,
        });
        clearError("plan");
    };


    // ---------- Helper to clear errors ----------
    const clearError = (field) => {
        setErrors((prev) => ({...prev, [field]: undefined}));
    };

    // ---------- Wrapper for datumHandler ----------
    const handleFieldChange = (key, value, reasonMode = "main") => {
        datumHandler(
            key,
            value,
            setDatumCopy,
            mode,
            reasonMode,
            setErrors,
            setTitle,
            setReason,
            setReasonNow,
            setReasonSucceed,
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
    const handleGoalOrTask = (option) => {
        if (option === "Yes") {
            setIsAchieveAbleInOneAction(true)
            setActions([])
            setDatumCopy((prev) => ({...prev, actions: []}))
        } else if (option === "No") {
            setIsAchieveAbleInOneAction(false)
        }
    }

    // ---------- Dynamic step→field/value mapping ----------
    // The rendered <Step> children are conditionally included, so actual
    // step numbers depend on mode and isAchieveAbleInOneAction.  We build
    // the mapping at call-time so it always matches the real DOM order.
    const buildStepMap = () => {
        if (mode === "goal") {
            const map = [];
            map.push({field: "_goalOrTask", getValue: () => isAchieveAbleInOneAction});   // step 1
            map.push({field: "title",        getValue: () => title});                      // step 2
            map.push({field: "reason",       getValue: () => ({mainReason: reason, nowReason: reasonNow, succeedReason: reasonSucceed})}); // step 3
            map.push({field: "completionCriteria", getValue: () => completionCriteria});   // step 4
            if (!isAchieveAbleInOneAction) {
                map.push({field: "plan", getValue: () => actions});                        // step 5 (conditional)
            }
            map.push({field: "difficulty",   getValue: () => difficulty});                  // next step
            map.push({field: "energy",       getValue: () => energy});
            map.push({field: "deadline",     getValue: () => deadline});
            map.push({field: "category",     getValue: () => category});
            map.push({field: "obstacle",     getValue: () => ({obstacle, fallbackPlan})});
            map.push({field: "review",       getValue: () => null});                       // last step
            return map;
        } else {
            return [
                {field: "identity",       getValue: () => identity},
                {field: "title",          getValue: () => title},
                {field: "minimumAction",  getValue: () => minimumAction},
                {field: "target",         getValue: () => target},
                {field: "trigger",        getValue: () => trigger},
                {field: "obstacle",       getValue: () => obstacle},
                {field: "reason",         getValue: () => reasonNow},
                {field: "review",         getValue: () => null},
            ];
        }
    };

    // ---------- Field name mapping ----------
    const getFieldNameForStep = (step) => {
        const map = buildStepMap();
        const entry = map[step - 1]; // 1-indexed → 0-indexed
        return entry ? entry.field : "general";
    };

    // ---------- Validation ----------
    const validateAndMove = (previousStep, nextStep) => {
        if (nextStep < previousStep) return true;

        const map = buildStepMap();
        const entry = map[previousStep - 1]; // 1-indexed → 0-indexed
        const value = entry ? entry.getValue() : null;

        console.log(`validateAndMove: step ${previousStep}, value:`, value);

        const result = validateStepInput(previousStep, value, mode, isAchieveAbleInOneAction);
        console.log("Validation result:", result);

        if (!result.valid) {
            if (result.errors) {
                setErrors(result.errors);
            } else if (result.error) {
                const fieldName = getFieldNameForStep(previousStep);
                setErrors({[fieldName]: result.error});
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
        const validationResult = validateGoalData(datumCopy, mode, isAchieveAbleInOneAction);
        if (!validationResult.valid) {
            console.error("Validation failed:", validationResult.errors);
            // Show errors to the user (you can replace with a nicer UI)
            alert("Please fix the following errors:\n" + Object.values(validationResult.errors).join("\n"));
            return; // Stop saving
        }

        // 2. Generate an ID (if not already present)
        const id = datumCopy.id || crypto.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

        // 3. Prepare the commitment object (fill missing fields)
        const commitment = {
            ...datumCopy,
            id,
            createdAt: datumCopy.createdAt ? (typeof datumCopy.createdAt === 'string' ? datumCopy.createdAt : datumCopy.createdAt.toISOString()) : new Date().toISOString(),
            period: datumCopy.period || 'daily',
            deadline: datumCopy.deadline ? (typeof datumCopy.deadline === 'string' ? datumCopy.deadline : datumCopy.deadline.toISOString()) : null,
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
            refresh();
            handleCloseModal?.();
        } else {
            console.error('❌ Failed to save goal:', saveResult.error);
            alert('Failed to save: ' + saveResult.error);
        }
    };


    // ---------- Render ----------
    return (<Stepper
        disableStepIndicators={true}
        initialStep={1}
        onStepChange={(prevStep, nextStep) => validateAndMove(prevStep, nextStep)}
        onFinalStepCompleted={handleFinalStepCompleted}
        backButtonText="Previous"
        nextButtonText="Next"
        handleCloseModal={handleCloseModal}
    >

        {mode === "goal" && (<GoalOrTask isAchieveAbleInOneAction={isAchieveAbleInOneAction}
                                         handleGoalOrTask={handleGoalOrTask}></GoalOrTask>)}

        <Name mode={mode} errors={errors} handleFieldChange={handleFieldChange} identity={identity}
              title={title}></Name>

        <Reason mode={mode} reason={reason} reasonNow={reasonNow} reasonSucceed={reasonSucceed}
                title={title} handleFieldChange={handleFieldChange} errors={errors}></Reason>

        <MinimumAction mode={mode} completionCriteria={completionCriteria} minimumAction={minimumAction}
                       handleFieldChange={handleFieldChange} errors={errors}></MinimumAction>

        {mode === "goal" && !isAchieveAbleInOneAction && (
            <Plan title={title} actions={actions} errors={errors}
                  startEdit={startEdit} deleteAction={deleteAction}
                  setIsEditing={setIsEditing} setEditingIndex={setEditingIndex}
                  setNewAction={setNewAction} setShowAddForm={setShowAddForm}
                  showAddForm={showAddForm} isEditing={isEditing}
                  newAction={newAction} saveAction={saveAction}
                  cancelModal={cancelModal}></Plan>
        )}

        <DifficultyOrTarget mode={mode} difficulty={difficulty} target={target}
                            handleFieldChange={handleFieldChange} errors={errors}></DifficultyOrTarget>

        <EnergyOrTrigger mode={mode} energy={energy} trigger={trigger}
                         handleFieldChange={handleFieldChange} errors={errors}></EnergyOrTrigger>

        <DeadlineOrObstacle mode={mode} deadline={deadline} showCalendar={showCalendar}
                            handleTimeSelection={handleTimeSelection} handleDatePick={handleDatePick}
                            obstacle={obstacle} fallbackPlan={fallbackPlan}
                            handleFieldChange={handleFieldChange} errors={errors}></DeadlineOrObstacle>

        <CategoryOrReason mode={mode} category={category} reason={reason}
                          handleFieldChange={handleFieldChange} errors={errors}></CategoryOrReason>

        {mode === "goal" && (
            <Obstacles obstacle={obstacle} fallbackPlan={fallbackPlan}
                       handleFieldChange={handleFieldChange} errors={errors}></Obstacles>
        )}

        <Review mode={mode} title={title} reasonNow={reasonNow} actions={actions}
                completionCriteria={completionCriteria} difficulty={difficulty} energy={energy}
                deadline={deadline} category={category} obstacle={obstacle}
                fallbackPlan={fallbackPlan} identity={identity} minimumAction={minimumAction}
                target={target} trigger={trigger}></Review>
    </Stepper>);
};