"use client";

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
} from "./GoalItem.styles";

import {
    formatDeadline, difficultyColor, energyColor, getGoalStatus,
} from "./helpers";

import {getCategoryColor, getCategoryIcon} from "@/constants/categories";

import {
    Pencil, MoreHorizontal, Check, CalendarDays, Zap, Target,
    Trash2, ArrowUpRight, AlertCircle,
} from "lucide-react";

export default function GoalItem({
                                      item, onComplete, onEdit, onDelete, onMore, onClick,
                                  }) {
    const {
        title, mainReason, category, completionCriteria, difficulty, energy, deadline, period, completed,
        actions = [], obstacle, fallbackPlan,
    } = item;

    const CategoryIcon = getCategoryIcon(category);
    const accentColor = getCategoryColor(category);
    const status = getGoalStatus(item);

    const completedActions = actions.filter(a => a.completed).length;
    const totalActions = actions.length;
    const progressPct = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0;

    return (<Card
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
            <Checkbox
                $checked={completed}
                $color={accentColor}
                aria-label={completed ? "Mark incomplete" : "Mark complete"}
                onClick={(e) => {
                    e.stopPropagation();
                    onComplete?.(item);
                }}
            >
                {completed && <Check size={18}/>}
            </Checkbox>
        </Header>

        {/* ---------------- STATUS BAR ---------------- */}
        {totalActions > 0 && (
            <ProgressBar>
                <ProgressFill $pct={progressPct} $color={accentColor} />
            </ProgressBar>
        )}

        {/* ---------------- ACTIONS / PLAN ---------------- */}
        {totalActions > 0 && (
            <ActionsList>
                {actions.map((action, idx) => (
                    <ActionItemRow key={action.id || idx}>
                        <ActionDot $completed={action.completed} $color={accentColor} />
                        <ActionContent>
                            <ActionItemTitle $completed={action.completed}>
                                {action.title}
                            </ActionItemTitle>
                            <ActionItemMeta>
                                {action.doneWhen && <span>✅ {action.doneWhen}</span>}
                                {action.estimatedMinutes && (
                                    <ActionDuration>
                                        ⏱ {action.estimatedMinutes} min
                                    </ActionDuration>
                                )}
                                {action.difficulty && (
                                    <span>💪 {action.difficulty}</span>
                                )}
                            </ActionItemMeta>
                        </ActionContent>
                    </ActionItemRow>
                ))}
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

        {/* ---------------- IF-THEN PLAN (obstacle + fallback) ---------------- */}
        {obstacle && (
            <CompletionSection style={{ background: "rgba(255, 92, 112, 0.06)" }}>
                <CompletionLabel>
                    <AlertCircle size={15}/>
                    If-then plan
                </CompletionLabel>
                <CompletionText>
                    If <strong>{obstacle}</strong>, then{" "}
                    <strong>{fallbackPlan || "do something else"}</strong>
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
                        {completedActions}/{totalActions}
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
    </Card>);
}
