import {Input} from "@/components/fundamentals/Input/Input";
import {CheckBox} from "@/components/fundamentals/CheckBox/CheckBox";
import {Step} from "@/components/Stepper/Stepper";
import React from "react";

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

export const Plan = ({
                         title, actions, errors,
                         startEdit, deleteAction,
                         setIsEditing, setEditingIndex, setNewAction, setShowAddForm,
                         showAddForm, isEditing, newAction,
                         saveAction, cancelModal
                     }) => {
    return (
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

                {errors.plan && <div className="error">{errors.plan}</div>}
            </div>

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
    )
}
