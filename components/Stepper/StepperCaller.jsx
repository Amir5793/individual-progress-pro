"use client";
import React, {useState} from "react";
import "./StepperCaller.css";
import Stepper, {Step} from "./Stepper";
import {Input} from "@/components/fundamentals/Input/Input";
import DatePicker from "@/components/Calendar/DatePicker";
import {CheckBox} from "@/components/fundamentals/CheckBox/CheckBox";
import {TagsCard} from "@/components/fundamentals/TagsCard/TagsCard";
import {datumHandler} from "./utils/datumHandler";
import {validateStepInput, validateGoalData} from "@/components/Stepper/utils/validation";
import {localStorageHandler} from "@/backend/local_storage/loacl_storage_api";
import {GoalOrTask} from "@/components/Stepper/steps/GoalOrTask/GoalOrTask";
import {Name} from "@/components/Stepper/steps/Name/Name";

export const StepperCaller = ({mode, datum, handleCloseModal}) => {
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


    const ActionCard = ({action, index, onEdit, onDelete}) => (
        <div className="action-card">
            <div className="action-header">
                <h3>{action.title || "Untitled Action"}</h3>
                <div>
                    <button onClick={() => onEdit(index)}>✏️</button>
                    <button onClick={() => onDelete(index)}>🗑️</button>
                </div>
            </div>
            <div className="action-details">
                <span>✅ {action.doneWhen || "No success criteria"}</span>
                <span>⏱ {action.estimatedMinutes} min</span>
                <span>💪 {action.difficulty}</span>
                <span>📦 {action.resources.length ? action.resources.join(', ') : "None"}</span>
            </div>
        </div>
    );

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
        } else if (option === "No") {
            setIsAchieveAbleInOneAction(false)
        }
    }

    // ---------- Field name mapping ----------
    const getFieldNameForStep = (step) => {
        const map = mode === "goal" ? {
            2: "title",
            3: "reason",
            4: "completionCriteria",   // now matches step 4
            5: "plan",                 // now matches step 5
            6: "difficulty",
            7: "energy",
            8: "deadline",
            9: "category",
            10: "obstacle",
        } : {
            1: "identity", 2: "title", 3: "minimumAction", 4: "target", 5: "trigger", 6: "obstacle", 7: "reason",
        };
        return map[step] || "general";
    };
    // ---------- Validation ----------
    const validateAndMove = (previousStep, nextStep) => {
        if (nextStep < previousStep) return true;

        let value;

        if (mode === "goal") {
            switch (previousStep) {
                case 1:
                    value = isAchieveAbleInOneAction;
                    break;
                case 2:
                    value = title;
                    break;
                case 3:
                    value = {mainReason: reason, nowReason: reasonNow, succeedReason: reasonSucceed};
                    break;
                case 4:
                    value = completionCriteria;
                    break;   // ← step 4 = completion criteria
                case 5:
                    value = actions;
                    break;              // ← step 5 = plan
                case 6:
                    value = difficulty;
                    break;
                case 7:
                    value = energy;
                    break;
                case 8:
                    value = deadline;
                    break;
                case 9:
                    value = category;
                    break;
                case 10:
                    value = {obstacle, fallbackPlan};
                    break;
                case 11:
                    value = null;
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
                    value = obstacle;
                    break;
                case 7:
                    value = reasonNow;
                    break;
                default:
                    value = null;
            }
        } else {
            value = null;
        }

        console.log(`validateAndMove: step ${previousStep}, value:`, value);

        const result = validateStepInput(previousStep, value, mode);
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
        const validationResult = validateGoalData(datumCopy, mode);
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
            // Close the modal
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
                                         handleGoalOrTask={handleGoalOrTask()}></GoalOrTask>)}
        {/* Step 1*/}
        <Name mode={mode} errors={errors} handleFieldChange={handleFieldChange} identity={identity}
              title={title}></Name>
        {/* Step 2 */}
        <Step>
            <h1>{mode === "goal" ? "Why does this matter?" : "What action represents that person?"}</h1>

            {/* Main Reason */}
            <Input
                placeholder={mode === "goal" ? "e.g. Needed for my portfolio to get a job" : "e.g. Run 5 km"}
                hintTxt={mode === "goal" ? "Write a short reason that reminds you of your motivation." : "Describe a specific daily/weekly action."}
                value={mode === "goal" ? reason : title}   // ← main reason uses `reason` state
                onValueChange={(val) => handleFieldChange(mode === "goal" ? "reason" : "title", mode === "goal" ? {mainReason: val} : val, "main")}
            />
            {mode === "goal" && errors.reason && <div className="error">{errors.reason}</div>}
            {mode === "habit" && errors.title && <div className="error">{errors.title}</div>}

            {/* Why NOW? (only for goal) */}
            {mode === "goal" && (<>
                <h1>Why NOW?</h1>
                <Input
                    placeholder="e.g. Because I need to get hired"
                    hintTxt="Write why you need to do it now"
                    value={reasonNow}   // ← now reason state
                    onValueChange={(val) => handleFieldChange("reason", {now: val}, "now")}
                />
                {errors.reason && <div className="error">{errors.reason}</div>}
            </>)}

            {/* What changes if you succeed? (only for goal) */}
            {mode === "goal" && (<>
                <h1>What changes if you succeed?</h1>
                <Input
                    placeholder="e.g. My chance of getting hired will be better"
                    hintTxt=""
                    value={reasonSucceed}   // ← succeed reason state
                    onValueChange={(val) => handleFieldChange("reason", {succeedReason: val}, "succeed")}
                />
                {errors.reason && <div className="error">{errors.reason}</div>}
            </>)}
        </Step>
        {/* Step 3 */}
        <Step>
            <h1>{mode === "goal" ? "How will you know you’re done?" : "What’s the smallest version you can always do?"}</h1>
            <Input
                placeholder={mode === "goal" ? "e.g. Pass all unit tests for FormComponent" : "e.g. Run 1 km"}
                hintTxt={mode === "goal" ? "Specify a clear finish line." : "Your minimum commitment."}
                value={mode === "goal" ? completionCriteria : minimumAction}
                onValueChange={(val) => handleFieldChange(mode === "goal" ? "completionCriteria" : "minimumAction", val)}
            />
            {mode === "goal" && errors.completionCriteria && <div className="error">{errors.completionCriteria}</div>}
            {mode === "habit" && errors.minimumAction && <div className="error">{errors.minimumAction}</div>}
        </Step>

        {/* Step 5 – Plan (Roadmap) */}
        {mode === "goal" && (
            <Step>
                <div>
                    <h1>Let's make this achievable.</h1>
                    <p className="subtitle">
                        Break your goal into actions. Imagine you're explaining this to a friend. What would they do
                        first?
                        What after that?
                    </p></div>

                <div className="roadmap-container">
                    <div className="roadmap-goal">
                        <strong>Goal</strong>
                        <p>{title || "Your goal"}</p>
                    </div>

                    <div className="action-list">
                        {actions.map((action, index) => (
                            <ActionCard
                                key={action.id || index}
                                action={action}
                                index={index}
                                onEdit={startEdit}
                                onDelete={deleteAction}
                            />
                        ))}
                    </div>

                    <button
                        className="add-action-btn"
                        onClick={() => {
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
                            setShowAddForm(true);
                        }}
                    >
                        ＋ Add Action
                    </button>

                    {/*{actions.length > 0 && (*/}
                    {/*    <div className="plan-summary">*/}
                    {/*        /!* ... summary ... *!/*/}
                    {/*    </div>*/}
                    {/*)}*/}

                    {errors.plan && <div className="error">{errors.plan}</div>}
                </div>

                {/* MODAL (shared for Add & Edit) */}
                {showAddForm && (
                    <div className="modal-overlay" onClick={cancelModal}>
                        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                            <h4>{isEditing ? "Edit Action" : "New Action"}</h4>
                            <Input
                                placeholder="What needs to be done?"
                                value={newAction.title}
                                onValueChange={(val) => setNewAction({...newAction, title: val})}
                            />
                            <Input
                                placeholder="How will you know it's done?"
                                value={newAction.doneWhen}
                                onValueChange={(val) => setNewAction({...newAction, doneWhen: val})}
                            />
                            <div className="action-fields-row">
                                <select
                                    value={newAction.estimatedMinutes}
                                    onChange={(e) => setNewAction({
                                        ...newAction,
                                        estimatedMinutes: parseInt(e.target.value)
                                    })}
                                >
                                    <option value={5}>5 min</option>
                                    <option value={15}>15 min</option>
                                    <option value={30}>30 min</option>
                                    <option value={60}>1 hour</option>
                                    <option value={120}>2 hours</option>
                                    <option value={240}>4 hours</option>
                                    <option value={480}>8 hours</option>
                                </select>
                                <select
                                    value={newAction.difficulty}
                                    onChange={(e) => setNewAction({...newAction, difficulty: e.target.value})}
                                >
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                            <div>
                                <label>Resources needed:</label>
                                <div className="resources-checkboxes">
                                    {['Computer', 'Internet', 'Book', 'Money', 'Someone Else', 'Nothing'].map((res) => (
                                        <CheckBox
                                            key={res}
                                            name="new-resources"
                                            value={res}
                                            checked={newAction.resources}
                                            func={() => {
                                                const newResources = newAction.resources.includes(res)
                                                    ? newAction.resources.filter(r => r !== res)
                                                    : [...newAction.resources, res];
                                                setNewAction({...newAction, resources: newResources});
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="add-action-buttons">
                                <button onClick={saveAction}>{isEditing ? "Update" : "Add"}</button>
                                <button onClick={cancelModal}>Cancel</button>
                            </div>
                            {errors.plan && <div className="error">{errors.plan}</div>}
                        </div>
                    </div>
                )}
            </Step>
        )}
        {/* Step 4 */}
        <Step>
            <h1>{mode === "goal" ? "How difficult does it feel?" : "On a good day, what’s your ideal target?"}</h1>
            {mode === "goal" ? (<>
                <div className="checkbox-container">
                    {["low", "medium", "hard", "almost impossible"].map((level) => (<CheckBox
                        key={level}
                        name="difficulty"
                        value={level}
                        checked={difficulty === level}
                        func={() => handleFieldChange("difficulty", level)}
                    />))}
                </div>
                {errors.difficulty && <div className="error">{errors.difficulty}</div>}
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
            <h1>{mode === "goal" ? "How much focus will you need?" : "What will remind you to do this?"}</h1>
            {mode === "goal" ? (<>
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

        {/*Step 6 – now uses inline date handlers*/}
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

        {errors.deadline && <div className="error">{errors.deadline}</div>}

        {/* Step 7 */}
        <Step>
            <h1>{mode === "goal" ? "Which area of life does this belong to?" : "Why does this matter? (Your reason)"}</h1>
            {mode === "goal" ? (<>
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
                    value={reasonNow}
                    onValueChange={(val) => handleFieldChange("reason", val)}
                    size="large"
                />
                {errors.reason && <div className="error">{errors.reason}</div>}
            </>)}
        </Step>

        {/*Step 8 – goal only*/}
        {mode === "goal" && (<Step>
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
        </Step>)}

        {/* Step 9 – Review */}
        <Step>
            <h1>Review your commitment</h1>
            {mode === "goal" ? (
                <ul>
                    <li><strong>Goal:</strong> {title}</li>
                    <li><strong>Why:</strong> {reasonNow || "—"}</li>
                    <li><strong>Actions:</strong> {actions.length > 0 ? actions.map(a => a.title).join(', ') : "None"}
                    </li>
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
                    <li><strong>Reason:</strong> {reasonNow || "—"}</li>
                </ul>
            )}
        </Step>
    </Stepper>);
};