// Plan.js
import { Input } from "@/components/fundamentals/Input/Input";
import { CheckBox } from "@/components/fundamentals/CheckBox/CheckBox";
import { Step } from "@/components/Stepper/Stepper";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "@/lib/i18n/localeContext";

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
    const t = useTranslation();
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
            <div className="drag-handle" title={t('stepper.plan.hold_tooltip')}>
                ⋮⋮
            </div>

            <div className="action-index-badge">{displayNum}</div>

            <div className="action-content">
                <div className="action-header">
                    <div className="action-title-group">
                        <h3>{action.title || t('stepper.plan.untitled')}</h3>
                        <span className={`priority-pill priority-${priority}`}>
                            {priority.toUpperCase()}
                        </span>
                    </div>
                    <div className="action-controls">
                        <button
                            type="button"
                            onClick={() => onEdit(currentIndex)}
                            aria-label={t('stepper.plan.edit_action')}
                            className="control-btn edit-btn"
                        >
                            ✏️
                        </button>
                        <button
                            type="button"
                            onClick={() => onDelete(currentIndex)}
                            aria-label={t('stepper.plan.delete_action')}
                            className="control-btn delete-btn"
                        >
                            🗑️
                        </button>
                    </div>
                </div>
                <div className="action-details">
                    <span className="detail-pill success-criteria">
                        <span className="pill-icon">🎯</span> {action.doneWhen || t('stepper.plan.no_criteria')}
                    </span>
                    <span className="detail-pill pill-meta">
                        <span>⏱ {action.estimatedMinutes} {t('stepper.plan.min')}</span>
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
    const t = useTranslation();
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
                    <h1>{t('stepper.plan.title')}</h1>
                    <p className="subtitle">
                        {t('stepper.plan.subtitle')}
                    </p>
                </div>

                <div className="roadmap-container">
                    <div className="roadmap-goal">
                        <div className="roadmap-goal-header">
                            <strong>{t('stepper.plan.active_plan')}</strong>
                            {actions.length > 0 && (
                                <button
                                    type="button"
                                    className="text-link-btn"
                                    onClick={() => setShowAllModal(true)}
                                >
                                    👁️ {t('stepper.plan.show_all', {count: actions.length})}
                                </button>
                            )}
                        </div>
                        <p>{title || t('stepper.plan.your_goal')}</p>
                    </div>

                    <div className="action-list">
                        {actions.length === 0 ? (
                            <div className="empty-actions-state">
                                <span className="empty-icon">🧭</span>
                                <p>{t('stepper.plan.no_steps')}</p>
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
                        ＋ {t('stepper.plan.add_action')}
                    </button>

                    {errors.plan && <div className="error-message-banner">{errors.plan}</div>}
                </div>

                {showAllModal && (
                    <div className="modal-overlay modal-fadeIn" onClick={() => setShowAllModal(false)}>
                        <div className="modal-card modal-card-large modal-slideUp" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <div className="modal-header-row">
                                    <div>
                                        <h4>{t('stepper.plan.section_header', {count: actions.length})}</h4>
                                        <p className="modal-teaser">{t('stepper.plan.section_header_detail')}</p>
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
                                    {t('stepper.plan.close_view')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showAddForm && (
                    <div className="modal-overlay modal-fadeIn" onClick={cancelModal}>
                        <div className="modal-card modal-slideUp" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h4>{isEditing ? t('stepper.plan.edit_header') : t('stepper.plan.add_header')}</h4>
                                <p className="modal-teaser">{t('stepper.plan.add_subtitle')}</p>
                            </div>

                            <div className="modal-body-scroll">
                                <div className="form-group">
                                    <label className="input-label">{t('stepper.plan.action_target')}</label>
                                    <Input
                                        placeholder={t('stepper.plan.action_placeholder')}
                                        value={newAction.title}
                                        onValueChange={(val) => setNewAction({ ...newAction, title: val })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="input-label">{t('stepper.plan.criteria_label')}</label>
                                    <Input
                                        placeholder={t('stepper.plan.criteria_placeholder')}
                                        value={newAction.doneWhen}
                                        onValueChange={(val) => setNewAction({ ...newAction, doneWhen: val })}
                                    />
                                </div>

                                <div className="action-fields-row">
                                    <div className="form-group row-flex">
                                        <label className="input-label">{t('stepper.plan.time_label')}</label>
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
                                        <label className="input-label">{t('stepper.plan.cognitive_cost')}</label>
                                        <select
                                            value={newAction.difficulty}
                                            onChange={(e) => setNewAction({ ...newAction, difficulty: e.target.value })}
                                        >
                                            <option value="easy">{t('stepper.plan.easy')}</option>
                                            <option value="medium">{t('stepper.plan.medium')}</option>
                                            <option value="hard">{t('stepper.plan.hard')}</option>
                                        </select>
                                    </div>

                                    <div className="form-group row-flex">
                                        <label className="input-label">{t('stepper.plan.priority_tier')}</label>
                                        <select
                                            value={newAction.priority || "medium"}
                                            onChange={(e) => setNewAction({ ...newAction, priority: e.target.value })}
                                        >
                                            <option value="low">{t('stepper.plan.low_priority')}</option>
                                            <option value="medium">{t('stepper.plan.medium_priority')}</option>
                                            <option value="high">{t('stepper.plan.high_priority')}</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="input-label">{t('stepper.plan.resources')}</label>
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
                                    {isEditing ? t('stepper.plan.update') : t('stepper.plan.integrate')}
                                </button>
                                <button
                                    type="button"
                                    className="action-cancel-btn"
                                    onClick={cancelModal}
                                >
                                    {t('stepper.plan.cancel')}
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
  --cozy-shadow: var(--modal-shadow);

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
    border-bottom: 1px solid var(--card-border);
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
    color: var(--accent-purple);
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
    color: var(--text-primary);
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
    background: var(--scrollbar-thumb);
    border-radius: 99px;
    transition: background 0.2s;
  }

  .action-list::-webkit-scrollbar-thumb:hover {
    background: var(--scrollbar-thumb);
  }

  .empty-actions-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 3.5rem 1.5rem;
    border: 1px dashed var(--card-border);
    border-radius: 16px;
    background: var(--subtle-bg);
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
    color: var(--accent-purple);
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
    border-color: var(--accent-purple);
    color: var(--text-primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(124, 58, 237, 0.1);
  }

  .add-action-btn:active {
    transform: translateY(0);
  }

  .error-message-banner {
    color: var(--accent-red);
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
    background: var(--subtle-bg);
    border: 1px solid var(--card-border);
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
    box-shadow: var(--card-shadow);
  }

  .action-card:hover {
    background: var(--subtle-bg-hover);
    border-color: var(--interactive-border);
    transform: translateY(-2px) translate3d(0, 0, 0);
    box-shadow: var(--card-shadow);
  }

  .action-card.dragging {
    opacity: 0.4;
    border: 1px dashed var(--accent-purple) !important;
    background: rgba(124, 58, 237, 0.04) !important;
    transform: scale(0.97) translate3d(0, 0, 0);
    box-shadow: none;
  }

  .action-card.drag-over {
    border-color: var(--accent-purple) !important;
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
    border-color: var(--accent-purple) !important;
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
    border-left: 3px solid var(--accent-red);
  }

  .action-card.priority-medium {
    border-left: 3px solid var(--accent-yellow);
  }

  .action-card.priority-low {
    border-left: 3px solid var(--text-muted);
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
    color: var(--accent-purple);
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
    background: var(--accent-purple);
    color: var(--text-primary);
    border-color: var(--accent-purple);
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
    color: var(--accent-red);
    border: 1px solid rgba(255, 92, 112, 0.18);
  }

  .priority-pill.priority-medium {
    background: rgba(244, 197, 66, 0.08);
    color: var(--accent-yellow);
    border: 1px solid rgba(244, 197, 66, 0.18);
  }

  .priority-pill.priority-low {
    background: var(--subtle-bg-hover);
    color: var(--text-muted);
    border: 1px solid var(--card-border);
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
    background: var(--btn-secondary-bg);
  }

  .control-btn.delete-btn:hover {
    background: rgba(255, 92, 112, 0.1);
    color: var(--accent-red);
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
    color: var(--text-secondary);
  }

  .success-criteria .pill-icon {
    font-size: 0.9rem;
  }

  .pill-meta {
    color: var(--text-muted);
    font-size: 0.75rem;
  }

  .meta-separator {
    color: var(--text-muted);
    margin: 0 2px;
  }

  /* ---------- Modal Overlays & Cards ---------- */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--overlay-bg);
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
    background: var(--card);
    border: 1px solid var(--card-border);
    border-radius: 20px;
    padding: 2rem;
    width: 100%;
    max-width: 520px;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    box-shadow: var(--modal-shadow);
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
    border-bottom: 2px solid var(--card-border);
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
    color: var(--text-primary);
    background: var(--btn-secondary-bg);
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
    background: var(--scrollbar-thumb);
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
    background: var(--subtle-bg);
    border: 1px solid var(--card-border);
    border-radius: 12px;
    padding: 0.75rem 1rem;
    color: var(--text-primary);
    font-size: 0.9rem;
    outline: none;
    cursor: pointer;
    transition: all 0.2s var(--cozy-bezier);
    width: 100%;
  }

  .action-fields-row select:focus {
    border-color: var(--accent-purple);
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
    border-top: 1px solid var(--card-border);
    padding-top: 1.25rem;
    margin-top: 0.5rem;
    flex-shrink: 0;
  }

  .action-save-btn {
    background: var(--accent-purple);
    color: var(--text-primary);
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
    background: var(--btn-secondary-bg);
    color: var(--text-secondary);
    border: 1px solid var(--btn-secondary-border);
    font-weight: 600;
    font-size: 0.9rem;
    padding: 0.8rem 1.6rem;
    border-radius: 12px;
    cursor: pointer;
    flex: 1;
    transition: all 0.2s var(--cozy-bezier);
  }

  .action-cancel-btn:hover {
    background: var(--btn-secondary-hover);
    color: var(--text-primary);
    border-color: var(--interactive-border);
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
      background: var(--overlay-bg);
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