// Plan.js
import { Input } from "@/components/fundamentals/Input/Input";
import { CheckBox } from "@/components/fundamentals/CheckBox/CheckBox";
import { Step } from "@/components/Stepper/Stepper";
import React, { useState, useEffect } from "react";
import styled from "styled-components";

const ActionCard = ({
                        action,
                        onEdit,
                        onDelete,
                        onDragStart,
                        onDragOver,
                        onDrop,
                        onDragEnd,
                        isDragging,
                        isDragOver,
                        draggedOverIndex,
                        currentIndex
                    }) => {
    const priority = action.priority || "medium";
    const displayNum = action.order || (currentIndex + 1);

    // Compute interactive movement shift offsets dynamically
    let shiftClass = "";
    if (isDragOver && draggedOverIndex !== null && draggedOverIndex !== currentIndex) {
        shiftClass = currentIndex > draggedOverIndex ? "shift-down" : "shift-up";
    }

    return (
        <div
            className={`action-card priority-${priority} ${isDragging ? "dragging" : ""} ${shiftClass}`}
            draggable
            onDragStart={(e) => onDragStart(e, currentIndex)}
            onDragOver={(e) => onDragOver(e, currentIndex)}
            onDrop={(e) => onDrop(e, currentIndex)}
            onDragEnd={onDragEnd}
        >
            <div className="drag-handle" title="Hold and drag to reschedule step sequential order">
                ⋮⋮
            </div>

            <div className="action-index-badge">{displayNum}</div>

            <div className="action-content">
                <div className="action-header">
                    <div className="action-title-group">
                        <h3>{action.title || "Untitled Action"}</h3>
                        <span className={`priority-pill priority-${priority}`}>
                            {priority.toUpperCase()}
                        </span>
                    </div>
                    <div className="action-controls">
                        <button
                            type="button"
                            onClick={() => onEdit(currentIndex)}
                            aria-label="Edit action"
                            className="control-btn edit-btn"
                        >
                            ✏️
                        </button>
                        <button
                            type="button"
                            onClick={() => onDelete(currentIndex)}
                            aria-label="Delete action"
                            className="control-btn delete-btn"
                        >
                            🗑️
                        </button>
                    </div>
                </div>
                <div className="action-details">
                    <span className="detail-pill success-criteria">
                        <span className="pill-icon">🎯</span> {action.doneWhen || "No success criteria"}
                    </span>
                    <span className="detail-pill pill-meta">
                        <span>⏱ {action.estimatedMinutes} min</span>
                        <span className="meta-separator">•</span>
                        <span>💪 {action.difficulty}</span>
                        {action.resources && action.resources.length > 0 && (
                            <>
                                <span className="meta-separator">•</span>
                                <span>📦 {action.resources.join(', ')}</span>
                            </>
                        )}
                    </span>
                </div>
            </div>
        </div>
    );
};

export const Plan = ({
                         title, actions = [], errors,
                         startEdit, deleteAction,
                         setIsEditing, setEditingIndex, setNewAction, setShowAddForm,
                         showAddForm, isEditing, newAction,
                         saveAction, cancelModal,
                         onReorder
                     }) => {
    const [showAllModal, setShowAllModal] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);

    // Synchronize sequential order fields
    useEffect(() => {
        const hasUnorderedActions = actions.some((act, idx) => act.order !== idx + 1);
        if (hasUnorderedActions && actions.length > 0) {
            const fixedActions = actions.map((act, idx) => ({
                ...act,
                order: idx + 1
            }));
            onReorder(fixedActions);
        }
    }, [actions, onReorder]);

    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = "move";
        e.currentTarget.classList.add('original-dragging');
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (dragOverIndex !== index) {
            setDragOverIndex(index);
        }
    };

    const handleDrop = (e, targetIndex) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === targetIndex) return;

        const workingActions = [...actions];
        const [draggedItem] = workingActions.splice(draggedIndex, 1);
        workingActions.splice(targetIndex, 0, draggedItem);

        const updatedWithSequencedNum = workingActions.map((action, idx) => ({
            ...action,
            order: idx + 1
        }));

        if (onReorder) {
            onReorder(updatedWithSequencedNum);
        }

        cleanupDragStates();
    };

    const cleanupDragStates = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
        document.querySelectorAll('.action-card').forEach(el => {
            el.classList.remove('original-dragging');
        });
    };

    return (
        <StyledWrapper>
            <Step>
                <div className="step-header">
                    <h1>Let&apos;s make this achievable.</h1>
                    <p className="subtitle">
                        Break your goal into actions. Imagine you&apos;re explaining this to a friend. What would they do first? What after that?
                    </p>
                </div>

                <div className="roadmap-container">
                    <div className="roadmap-goal">
                        <div className="roadmap-goal-header">
                            <strong>Active Goal Plan</strong>
                            {actions.length > 0 && (
                                <button
                                    type="button"
                                    className="text-link-btn"
                                    onClick={() => setShowAllModal(true)}
                                >
                                    👁️ Show all actions ({actions.length})
                                </button>
                            )}
                        </div>
                        <p>{title || "Your goal"}</p>
                    </div>

                    <div className="action-list">
                        {actions.length === 0 ? (
                            <div className="empty-actions-state">
                                <span className="empty-icon">🧭</span>
                                <p>No steps planned yet. Build momentum by defining your first action.</p>
                            </div>
                        ) : (
                            actions.map((action, idx) => (
                                <ActionCard
                                    key={action.id || `action-${idx}`}
                                    action={action}
                                    currentIndex={idx}
                                    onEdit={startEdit}
                                    onDelete={deleteAction}
                                    onDragStart={handleDragStart}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    onDragEnd={cleanupDragStates}
                                    isDragging={draggedIndex === idx}
                                    isDragOver={dragOverIndex === idx}
                                    draggedOverIndex={draggedIndex}
                                />
                            ))
                        )}
                    </div>

                    <button
                        type="button"
                        className="add-action-btn"
                        onClick={() => {
                            setIsEditing(false);
                            setEditingIndex(null);
                            setNewAction({
                                title: "",
                                doneWhen: "",
                                estimatedMinutes: 30,
                                difficulty: "medium",
                                priority: "medium",
                                order: actions.length + 1,
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

                    {errors.plan && <div className="error-message-banner">{errors.plan}</div>}
                </div>

                {showAllModal && (
                    <div className="modal-overlay modal-fadeIn" onClick={() => setShowAllModal(false)}>
                        <div className="modal-card modal-card-large modal-slideUp" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <div className="modal-header-row">
                                    <div>
                                        <h4>All Actions Roadmap ({actions.length})</h4>
                                        <p className="modal-teaser">Complete prioritised action list sorted by chronological execution order.</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="close-x-btn"
                                        onClick={() => setShowAllModal(false)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>

                            <div className="modal-body-scroll large-modal-list">
                                {actions.map((action, idx) => (
                                    <ActionCard
                                        key={`modal-${action.id || idx}`}
                                        action={action}
                                        currentIndex={idx}
                                        onEdit={(index) => {
                                            startEdit(index);
                                            setShowAllModal(false);
                                        }}
                                        onDelete={deleteAction}
                                        onDragStart={handleDragStart}
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                        onDragEnd={cleanupDragStates}
                                        isDragging={draggedIndex === idx}
                                        isDragOver={dragOverIndex === idx}
                                        draggedOverIndex={draggedIndex}
                                    />
                                ))}
                            </div>

                            <div className="add-action-buttons">
                                <button
                                    type="button"
                                    className="action-cancel-btn"
                                    onClick={() => setShowAllModal(false)}
                                    style={{ width: '100%' }}
                                >
                                    Close View
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showAddForm && (
                    <div className="modal-overlay modal-fadeIn" onClick={cancelModal}>
                        <div className="modal-card modal-slideUp" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h4>{isEditing ? "Precision Edit Plan Step" : "Add Action Step"}</h4>
                                <p className="modal-teaser">Define a focused, isolated milestone with low initiation friction.</p>
                            </div>

                            <div className="modal-body-scroll">
                                <div className="form-group">
                                    <label className="input-label">Action Target</label>
                                    <Input
                                        placeholder="What is the immediate thing to do?"
                                        value={newAction.title}
                                        onValueChange={(val) => setNewAction({ ...newAction, title: val })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="input-label">Clear Criteria of Completion</label>
                                    <Input
                                        placeholder="What physical evidence proves this step is completed?"
                                        value={newAction.doneWhen}
                                        onValueChange={(val) => setNewAction({ ...newAction, doneWhen: val })}
                                    />
                                </div>

                                <div className="action-fields-row">
                                    <div className="form-group row-flex">
                                        <label className="input-label">Time Allocation</label>
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
                                    </div>

                                    <div className="form-group row-flex">
                                        <label className="input-label">Cognitive Cost</label>
                                        <select
                                            value={newAction.difficulty}
                                            onChange={(e) => setNewAction({ ...newAction, difficulty: e.target.value })}
                                        >
                                            <option value="easy">Easy</option>
                                            <option value="medium">Medium</option>
                                            <option value="hard">Hard</option>
                                        </select>
                                    </div>

                                    <div className="form-group row-flex">
                                        <label className="input-label">Priority Tier</label>
                                        <select
                                            value={newAction.priority || "medium"}
                                            onChange={(e) => setNewAction({ ...newAction, priority: e.target.value })}
                                        >
                                            <option value="low">Low Priority</option>
                                            <option value="medium">Medium Priority</option>
                                            <option value="high">High Priority</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="input-label">Identified Constraints / Resources</label>
                                    <div className="resources-checkboxes">
                                        {['Computer', 'Internet', 'Book', 'Money', 'Someone Else', 'Nothing'].map((res) => {
                                            const isChecked = Array.isArray(newAction.resources) && newAction.resources.includes(res);
                                            return (
                                                <CheckBox
                                                    key={res}
                                                    type="checkbox" // Explicitly parsed here to allow multiple choices
                                                    name="new-resources"
                                                    value={res}
                                                    checked={isChecked}
                                                    func={() => {
                                                        const newResources = isChecked
                                                            ? newAction.resources.filter(r => r !== res)
                                                            : [...newAction.resources, res];
                                                        setNewAction({ ...newAction, resources: newResources });
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="add-action-buttons">
                                <button
                                    type="button"
                                    className="action-save-btn"
                                    onClick={saveAction}
                                >
                                    {isEditing ? "Update Plan Step" : "Integrate Step"}
                                </button>
                                <button
                                    type="button"
                                    className="action-cancel-btn"
                                    onClick={cancelModal}
                                >
                                    Cancel
                                </button>
                            </div>

                            {errors.plan && <div className="error-message-banner">{errors.plan}</div>}
                        </div>
                    </div>
                )}
            </Step>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
  /* Root transitions setup */
  --cozy-bezier: cubic-bezier(0.16, 1, 0.3, 1);
  --cozy-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);

  .step-header {
    margin-bottom: 2rem;
  }

  h1 {
    font-size: 1.750rem;
    font-weight: 500;
    letter-spacing: -0.02em;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  .subtitle {
    color: var(--text-muted);
    font-size: 0.950rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    font-weight: 400;
  }

  .roadmap-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
  }

  .roadmap-goal {
    border-bottom: 1px solid var(--panel-border, rgba(255, 255, 255, 0.08));
    padding-bottom: 1.25rem;
  }

  .roadmap-goal strong {
    display: block;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    margin-bottom: 0.5rem;
  }

  .roadmap-goal p {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 500;
    color: var(--text-primary);
    letter-spacing: -0.01em;
  }

  .roadmap-goal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 0.25rem;
  }

  .text-link-btn {
    background: rgba(124, 58, 237, 0.04);
    border: 1px solid rgba(124, 58, 237, 0.15);
    cursor: pointer;
    color: var(--interactive-hover, #7b61ff);
    font-size: 0.8rem;
    font-weight: 600;
    padding: 6px 12px;
    border-radius: 99px;
    transition: all 0.25s var(--cozy-bezier);
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .text-link-btn:hover {
    background: rgba(124, 58, 237, 0.1);
    color: #fff;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.15);
  }

  .action-list {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    max-height: 20vh;
    overflow-y: auto;
    padding-right: 0.5rem;
  }

  /* Cozy customized scrollbars */
  .action-list::-webkit-scrollbar {
    width: 5px;
  }

  .action-list::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.12);
    border-radius: 99px;
    transition: background 0.2s;
  }

  .action-list::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.25);
  }

  .empty-actions-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 3.5rem 1.5rem;
    border: 1px dashed rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.015);
    text-align: center;
    backdrop-filter: blur(4px);
  }

  .empty-icon {
    font-size: 2rem;
    opacity: 0.7;
    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
  }

  .empty-actions-state p {
    color: var(--text-muted);
    font-size: 0.9rem;
    margin: 0;
    max-width: 290px;
    line-height: 1.5;
  }

  .add-action-btn {
    background: rgba(124, 58, 237, 0.02);
    border: 1px dashed rgba(124, 58, 237, 0.35);
    border-radius: 12px;
    color: var(--interactive-hover, #7b61ff);
    padding: 1rem;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s var(--cozy-bezier);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .add-action-btn:hover {
    background: rgba(124, 58, 237, 0.08);
    border-color: var(--interactive-hover, #7b61ff);
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(124, 58, 237, 0.1);
  }

  .add-action-btn:active {
    transform: translateY(0);
  }

  .error-message-banner {
    color: var(--accent-red, #ff5c70);
    font-size: 0.85rem;
    background: rgba(255, 92, 112, 0.08);
    border: 1px solid rgba(255, 92, 112, 0.2);
    border-radius: 10px;
    padding: 10px 14px;
    margin-top: 0.5rem;
    font-weight: 500;
    backdrop-filter: blur(4px);
  }

  /* ---------- Action Card ---------- */
  .action-card {
    background: rgba(255, 255, 255, 0.025);
    border: 1px solid var(--panel-border, rgba(255, 255, 255, 0.06));
    border-radius: 12px;
    padding: 1rem 1.25rem;
    display: flex;
    align-items: flex-start;
    gap: 1.15rem;
    position: relative;
    will-change: transform, opacity, background-color;
    transform: translate3d(0, 0, 0);
    transition: transform 0.4s var(--cozy-bezier),
    opacity 0.3s ease,
    background-color 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.3s ease;
    animation: cardScaleIn 0.35s var(--cozy-bezier) forwards;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .action-card:hover {
    background: rgba(255, 255, 255, 0.045);
    border-color: rgba(255, 255, 255, 0.12);
    transform: translateY(-2px) translate3d(0, 0, 0);
    box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.3);
  }

  .action-card.dragging {
    opacity: 0.4;
    border: 1px dashed var(--interactive-hover, #7b61ff) !important;
    background: rgba(124, 58, 237, 0.04) !important;
    transform: scale(0.97) translate3d(0, 0, 0);
    box-shadow: none;
  }

  .action-card.drag-over {
    border-color: var(--interactive-hover, #7b61ff) !important;
    background: rgba(124, 58, 237, 0.06) !important;
    transform: translateY(2px) translate3d(0, 0, 0);
  }

  .action-card.dragging * {
    pointer-events: none;
  }

  .action-card.original-dragging {
    cursor: grabbing !important;
    opacity: 0.15 !important;
    transform: scale3d(0.96, 0.96, 1) !important;
    border-style: dashed !important;
    border-color: var(--interactive-hover, #7b61ff) !important;
    box-shadow: none !important;
  }

  .action-card.shift-down {
    transform: translate3d(0, 24px, 0);
    border-color: rgba(124, 58, 237, 0.35);
    background: rgba(124, 58, 237, 0.03);
  }

  .action-card.shift-up {
    transform: translate3d(0, -24px, 0);
    border-color: rgba(124, 58, 237, 0.35);
    background: rgba(124, 58, 237, 0.03);
  }

  .action-card.priority-high {
    border-left: 3px solid var(--accent-red, #ff5c70);
  }

  .action-card.priority-medium {
    border-left: 3px solid var(--accent-yellow, #f4c542);
  }

  .action-card.priority-low {
    border-left: 3px solid var(--text-muted, rgba(240, 242, 250, 0.35));
  }
  
  option{
    background-color: var(--accent-purple);
  }

  .drag-handle {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    font-size: 1.25rem;
    letter-spacing: -1px;
    cursor: grab;
    user-select: none;
    padding: 0 4px;
    margin-top: 0.05rem;
    transition: color 0.2s;
    opacity: 0.5;
  }

  .action-card:hover .drag-handle {
    opacity: 1;
    color: var(--text-primary);
  }

  .drag-handle:active {
    cursor: grabbing;
  }

  .action-index-badge {
    background: rgba(124, 58, 237, 0.1);
    color: var(--interactive-hover, #7b61ff);
    min-width: 26px;
    height: 26px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 700;
    margin-top: 0.05rem;
    transition: all 0.3s var(--cozy-bezier);
    border: 1px solid rgba(124, 58, 237, 0.15);
  }

  .action-card:hover .action-index-badge {
    transform: scale(1.1);
    background: var(--interactive-hover, #7b61ff);
    color: #fff;
    border-color: var(--interactive-hover, #7b61ff);
  }

  .action-content {
    flex: 1;
    min-width: 0;
  }

  .action-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.5rem;
  }

  .action-header h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: -0.01em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .action-title-group {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    min-width: 0;
    flex: 1;
  }

  .priority-pill {
    font-size: 0.625rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    padding: 2px 8px;
    border-radius: 6px;
    display: inline-block;
  }

  .priority-pill.priority-high {
    background: rgba(255, 92, 112, 0.08);
    color: var(--accent-red, #ff5c70);
    border: 1px solid rgba(255, 92, 112, 0.18);
  }

  .priority-pill.priority-medium {
    background: rgba(244, 197, 66, 0.08);
    color: var(--accent-yellow, #f4c542);
    border: 1px solid rgba(244, 197, 66, 0.18);
  }

  .priority-pill.priority-low {
    background: rgba(255, 255, 255, 0.04);
    color: var(--text-muted);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .action-controls {
    display: flex;
    gap: 0.35rem;
  }

  .control-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    font-size: 0.85rem;
    border-radius: 8px;
    transition: all 0.2s var(--cozy-bezier);
    opacity: 0.45;
    height: 28px;
    width: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .control-btn:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.06);
  }

  .control-btn.delete-btn:hover {
    background: rgba(255, 92, 112, 0.1);
    color: var(--accent-red, #ff5c70);
  }

  .action-details {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-top: 0.6rem;
  }

  .detail-pill {
    font-size: 0.78rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-weight: 500;
  }

  .success-criteria {
    color: var(--text-secondary, rgba(240, 242, 250, 0.55));
  }

  .success-criteria .pill-icon {
    font-size: 0.9rem;
  }

  .pill-meta {
    color: var(--text-muted);
    font-size: 0.75rem;
  }

  .meta-separator {
    color: rgba(255, 255, 255, 0.06);
    margin: 0 2px;
  }

  /* ---------- Modal Overlays & Cards ---------- */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(4, 5, 8, 0.5);
    backdrop-filter: blur(14px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1.5rem;
  }

  .modal-overlay.modal-fadeIn {
    animation: overlayFadeIn 0.35s var(--cozy-bezier) forwards;
  }

  .modal-card {
    background: var(--card, #1a2138);
    border: 1px solid var(--card-border, rgba(255, 255, 255, 0.07));
    border-radius: 20px;
    padding: 2rem;
    width: 100%;
    max-width: 520px;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    box-shadow: 0 30px 70px -15px rgba(0, 0, 0, 0.8);
    position: relative;
    overflow: hidden;
  }

  .modal-card.modal-slideUp {
    animation: cardSlideUp 0.45s var(--cozy-bezier) forwards;
  }

  .modal-card.modal-card-large {
    max-width: var(--show-all-modal-max-width, 680px) !important;
    height: 75vh;
    max-height: 75vh;
  }

  .modal-header {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    border-bottom: 2px solid rgba(255, 255, 255, 0.04);
    padding-bottom: 1rem;
    flex-shrink: 0;
  }

  .modal-header h4 {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
    letter-spacing: -0.015em;
  }

  .modal-header-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
  }

  .modal-teaser {
    font-size: 0.85rem;
    color: var(--text-secondary);
    line-height: 1.45;
  }

  .close-x-btn {
    background: transparent;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 1.15rem;
    padding: 6px;
    border-radius: 50%;
    transition: all 0.2s var(--cozy-bezier);
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    width: 30px;
  }

  .close-x-btn:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.06);
  }

  .modal-body-scroll {
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1.35rem;
    padding-right: 0.5rem;
    flex: 1;
    min-height: 0;
  }

  .modal-body-scroll::-webkit-scrollbar {
    width: 4px;
  }

  .modal-body-scroll::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 99px;
  }

  .large-modal-list {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    flex: 1;
    padding-right: 0.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .row-flex {
    flex: 1;
    min-width: 130px;
  }

  .input-label {
    color: var(--text-secondary);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-weight: 700;
  }

  .action-fields-row {
    display: flex;
    gap: 1.25rem;
    flex-wrap: wrap;
  }

  .action-fields-row select {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    padding: 0.75rem 1rem;
    color: #fff;
    font-size: 0.9rem;
    outline: none;
    cursor: pointer;
    transition: all 0.2s var(--cozy-bezier);
    width: 100%;
  }

  .action-fields-row select:focus {
    border-color: var(--interactive-hover, #7b61ff);
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
  }

  .resources-checkboxes {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin-top: 0.25rem;
  }

  .add-action-buttons {
    display: flex;
    gap: 0.85rem;
    border-top: 1px solid rgba(255, 255, 255, 0.04);
    padding-top: 1.25rem;
    margin-top: 0.5rem;
    flex-shrink: 0;
  }

  .action-save-btn {
    background: var(--interactive-hover, #7b61ff);
    color: #fff;
    border: none;
    font-weight: 600;
    font-size: 0.9rem;
    padding: 0.8rem 1.6rem;
    border-radius: 12px;
    cursor: pointer;
    flex: 2;
    transition: all 0.2s var(--cozy-bezier);
    box-shadow: 0 4px 15px rgba(124, 58, 237, 0.25);
  }

  .action-save-btn:hover {
    background: rgba(124, 58, 237, 0.9);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(124, 58, 237, 0.35);
  }

  .action-save-btn:active {
    transform: translateY(0);
  }

  .action-cancel-btn {
    background: rgba(255, 255, 255, 0.035);
    color: var(--text-secondary);
    border: 1px solid rgba(255, 255, 255, 0.08);
    font-weight: 600;
    font-size: 0.9rem;
    padding: 0.8rem 1.6rem;
    border-radius: 12px;
    cursor: pointer;
    flex: 1;
    transition: all 0.2s var(--cozy-bezier);
  }

  .action-cancel-btn:hover {
    background: rgba(255, 255, 255, 0.08);
    color: var(--text-primary);
    border-color: rgba(255, 255, 255, 0.15);
  }

  @keyframes cardScaleIn {
    from {
      opacity: 0;
      transform: scale3d(0.96, 0.96, 1) translate3d(0, 12px, 0);
    }
    to {
      opacity: 1;
      transform: scale3d(1, 1, 1) translate3d(0, 0, 0);
    }
  }

  @keyframes overlayFadeIn {
    from {
      background: rgba(0, 0, 0, 0);
      backdrop-filter: blur(0px);
    }
    to {
      background: rgba(4, 5, 8, 0.75);
      backdrop-filter: blur(14px);
    }
  }

  @keyframes cardSlideUp {
    from {
      opacity: 0;
      transform: scale3d(0.95, 0.95, 1) translate3d(0, 24px, 0);
    }
    to {
      opacity: 1;
      transform: scale3d(1, 1, 1) translate3d(0, 0, 0);
    }
  }
`;
