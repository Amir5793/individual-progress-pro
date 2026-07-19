// GoalItem.jsx
"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
    Card,
    Header,
    LeftSection,
    CategoryIconWrapper,
    TitleSection,
    Title,
    Reason,
    Checkbox,
    CompletionSection,
    CompletionLabel,
    CompletionText,
    Footer,
    ChipGroup,
    Chip,
    Actions,
    IconButton,
    ProgressBar,
    ProgressFill,
    ActionButton,
    ActionsList,
    ActionItemRow,
    ActionDot,
    ActionContent,
    ActionItemTitle,
    ActionItemMeta,
    ActionDuration,
    NextStepLabel,

    // NEW DETAILED MODAL COMPONENTS
    ModalOverlay,
    ModalCard,
    ModalHeader,
    ModalHeaderRow,
    ModalTitle,
    ModalTeaser,
    CloseXBtn,
    ModalBodyScroll,
    ModalFooterButtons,
    PriorityAlertBanner
} from "./GoalItem.styles";

import {
    formatDeadline, difficultyColor, energyColor, getGoalStatus,
} from "./helpers";

import { getCategoryConfig } from "@/constants/categories";

import {
    Pencil, MoreHorizontal, Check, CalendarDays, Zap, Target,
    Trash2, ArrowUpRight, AlertCircle, PlayCircle
} from "lucide-react";

export default function GoalItem({
                                     item,
                                     onComplete,
                                     onEdit,
                                     onDelete,
                                     onMore,
                                     onClick,
                                     onActionComplete,
                                 }) {
    const [showRoadmap, setShowRoadmap] = useState(false);

    const {
        title, mainReason, category, completionCriteria, difficulty, energy, deadline, period, completed,
        actions = [], obstacle, fallbackPlan,
    } = item;

    const { icon: CategoryIcon, color: accentColor } = getCategoryConfig(category);
    const status = getGoalStatus(item);

    const completedActions = useMemo(() => actions.filter(a => a.completed).length, [actions]);
    const totalActions = actions.length;
    const progressPct = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0;

    const nextActionIndex = useMemo(() => actions.findIndex(a => !a.completed), [actions]);
    const nextAction = nextActionIndex !== -1 ? actions[nextActionIndex] : null;

    const hasUncompletedHighPriorityAction = useMemo(
        () => actions.some(a => a.priority?.toLowerCase() === "high" && !a.completed),
        [actions]
    );

    const handleCheckboxComplete = useCallback((e) => {
        e.stopPropagation();
        if (hasUncompletedHighPriorityAction && !completed) {
            setShowRoadmap(true);
            return;
        }
        onComplete?.(item);
    }, [hasUncompletedHighPriorityAction, completed, onComplete, item]);

    return (
        <>
            <Card
                $completed={completed}
                onClick={() => onClick?.(item)}
            >
                {/* ---------------- HEADER ---------------- */}
                <Header>
                    <LeftSection>
                        <CategoryIconWrapper $color={accentColor}>
                            <CategoryIcon size={22}/>
                        </CategoryIconWrapper>
                        <TitleSection>
                            <Title $completed={completed}>
                                {title}
                            </Title>
                            {mainReason && (
                                <Reason>
                                    {mainReason}
                                </Reason>
                            )}
                        </TitleSection>
                    </LeftSection>

                    {/* Guarded Checkbox */}
                    <Checkbox
                        $checked={completed}
                        $color={hasUncompletedHighPriorityAction && !completed ? "var(--accent-red, #ff5c70)" : accentColor}
                        $disabled={hasUncompletedHighPriorityAction && !completed}
                        aria-label={completed ? "Mark incomplete" : "Mark complete"}
                        onClick={handleCheckboxComplete}
                        title={hasUncompletedHighPriorityAction && !completed ? "Complete high priority actions first" : ""}
                    >
                        {completed ? (
                            <Check size={18}/>
                        ) : hasUncompletedHighPriorityAction ? (
                            <AlertCircle size={18} style={{ color: "var(--accent-red, #ff5c70)" }} />
                        ) : null}
                    </Checkbox>
                </Header>

                {/* ---------------- STATUS BAR ---------------- */}
                {totalActions > 0 && (
                    <ProgressBar>
                        <ProgressFill $pct={progressPct} $color={accentColor} />
                    </ProgressBar>
                )}

                {/* ---------------- ACTIONS / PLAN (PROGRESSIVE DISCLOSURE) ---------------- */}
                {totalActions > 0 && !completed && (
                    <ActionsList>
                        {nextAction ? (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <NextStepLabel $color={accentColor}>
                                        <PlayCircle size={13} />
                                        Next Focus Step
                                    </NextStepLabel>

                                    {/* FEATURE 2.1: Open modal trigger */}
                                    <button
                                        type="button"
                                        className="roadmap-link-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowRoadmap(true);
                                        }}
                                    >
                                        Show all actions ({actions.length})
                                    </button>
                                </div>

                                <ActionItemRow
                                    key={nextAction.id || nextActionIndex}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onActionComplete?.(item, nextAction.id || nextActionIndex);
                                    }}
                                >
                                    <ActionDot $completed={false} $color={accentColor} />
                                    <ActionContent>
                                        <ActionItemTitle $completed={false}>
                                            {nextAction.title}
                                            {nextAction.priority === "high" && (
                                                <span className="pill-alert">HIGH</span>
                                            )}
                                        </ActionItemTitle>
                                        <ActionItemMeta>
                                            {nextAction.doneWhen && <span>🎯 {nextAction.doneWhen}</span>}
                                            {nextAction.estimatedMinutes && (
                                                <ActionDuration>
                                                    ⏱ {nextAction.estimatedMinutes} min
                                                </ActionDuration>
                                            )}
                                            {nextAction.difficulty && (
                                                <span>💪 {nextAction.difficulty}</span>
                                            )}
                                        </ActionItemMeta>
                                    </ActionContent>
                                    <IconButton
                                        className="check-action-subtle"
                                        aria-label="Validate active action step"
                                        style={{ opacity: 0.5 }}
                                    >
                                        <Check size={14} />
                                    </IconButton>
                                </ActionItemRow>
                            </>
                        ) : (
                            <div className="all-actions-done-teaser">
                                ✓ All scheduled plan milestones executed. Ready for validation!
                            </div>
                        )}
                    </ActionsList>
                )}

                {/* ---------------- COMPLETION CRITERIA ---------------- */}
                <CompletionSection>
                    <CompletionLabel>
                        <Target size={15}/>
                        Done when
                    </CompletionLabel>
                    <CompletionText>
                        {completionCriteria}
                    </CompletionText>
                </CompletionSection>

                {/* ---------------- IF-THEN PLAN ---------------- */}
                {obstacle && !completed && (
                    <CompletionSection style={{ background: "rgba(255, 92, 112, 0.04)", borderLeft: "2.5px solid var(--accent-red, #ff5c70)" }}>
                        <CompletionLabel style={{ color: "var(--accent-red, #ff5c70)" }}>
                            <AlertCircle size={15}/>
                            If-Then Guard Plan
                        </CompletionLabel>
                        <CompletionText>
                            If <strong>{obstacle}</strong>, then{" "}
                            <strong style={{ color: "var(--text-primary)" }}>{fallbackPlan || "execute backup procedure"}</strong>
                        </CompletionText>
                    </CompletionSection>
                )}

                {/* ---------------- FOOTER ---------------- */}
                <Footer>
                    <ChipGroup>
                        <Chip $color={difficultyColor(difficulty)}>
                            {difficulty}
                        </Chip>
                        <Chip $color={energyColor(energy)}>
                            <Zap size={14}/>
                            {energy} Focus
                        </Chip>
                        <Chip>
                            {period}
                        </Chip>
                        {totalActions > 0 && (
                            <Chip>
                                <ArrowUpRight size={14}/>
                                {completedActions}/{totalActions} Steps
                            </Chip>
                        )}
                        {deadline && (
                            <Chip $color={status === "Overdue" ? "var(--accent-red)" : undefined}>
                                <CalendarDays size={14}/>
                                {formatDeadline(deadline)}
                            </Chip>
                        )}
                    </ChipGroup>
                    <Actions>
                        <ActionButton
                            as="button"
                            $color={accentColor}
                            aria-label="Edit goal"
                            data-tooltip="Edit goal"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit?.(item);
                            }}
                        >
                            <Pencil size={16}/>
                        </ActionButton>
                        <ActionButton
                            as="button"
                            $color="var(--accent-red)"
                            aria-label="Delete goal"
                            data-tooltip="Delete goal"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete?.(item);
                            }}
                        >
                            <Trash2 size={16}/>
                        </ActionButton>
                        <IconButton
                            as="button"
                            aria-label="More options"
                            data-tooltip="More options"
                            onClick={(e) => {
                                e.stopPropagation();
                                onMore?.(item);
                            }}
                        >
                            <MoreHorizontal size={18}/>
                        </IconButton>
                    </Actions>
                </Footer>
            </Card>

            {/* ---------------- FEATURE 2.1: ACTION ROADMAP PLAN MODAL ---------------- */}
            {showRoadmap && (
                <ModalOverlay onClick={() => setShowRoadmap(false)}>
                    <ModalCard onClick={(e) => e.stopPropagation()}>
                        <ModalHeader>
                            <ModalHeaderRow>
                                <div>
                                    <ModalTitle>Goal Action Blueprint</ModalTitle>
                                    <ModalTeaser>{title}</ModalTeaser>
                                </div>
                                <CloseXBtn onClick={() => setShowRoadmap(false)}>✕</CloseXBtn>
                            </ModalHeaderRow>
                        </ModalHeader>

                        {/* If completion is blocked, show a diagnostic coaching warning banner */}
                        {hasUncompletedHighPriorityAction && !completed && (
                            <PriorityAlertBanner>
                                <AlertCircle size={16} />
                                <div>
                                    <strong>Completion Blocked</strong>
                                    <p>Finish high-priority action steps before completing this goal.</p>
                                </div>
                            </PriorityAlertBanner>
                        )}

                        <ModalBodyScroll>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {actions.map((act, idx) => {
                                    const isCurrent = idx === nextActionIndex;
                                    const isDone = act.completed;

                                    return (
                                        <ActionItemRow
                                            key={act.id || idx}
                                            $isDone={isDone}
                                            $isCurrent={isCurrent}
                                            style={{ cursor: isDone ? 'default' : 'pointer' }}
                                            onClick={(e) => {
                                                if (isDone) return;
                                                e.stopPropagation();
                                                onActionComplete?.(item, act.id || idx);
                                            }}
                                        >
                                            <ActionDot $completed={isDone} $color={accentColor} />
                                            <ActionContent>
                                                <ActionItemTitle $completed={isDone}>
                                                    {act.title}
                                                    {act.priority === "high" && (
                                                        <span className="pill-alert">HIGH</span>
                                                    )}
                                                </ActionItemTitle>
                                                <ActionItemMeta>
                                                    {act.doneWhen && <span>🎯 {act.doneWhen}</span>}
                                                    {act.estimatedMinutes && <span>⏱ {act.estimatedMinutes} min</span>}
                                                    {act.difficulty && <span>💪 {act.difficulty}</span>}
                                                </ActionItemMeta>
                                            </ActionContent>
                                            {isDone && <Check size={16} style={{ color: accentColor }} />}
                                        </ActionItemRow>
                                    );
                                })}
                            </div>
                        </ModalBodyScroll>

                        <ModalFooterButtons>
                            <button className="confirm-close-btn" onClick={() => setShowRoadmap(false)}>
                                Return to Dashboard
                            </button>
                        </ModalFooterButtons>
                    </ModalCard>
                </ModalOverlay>
            )}
        </>
    );
}
