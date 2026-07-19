"use client";

import React, { useMemo, useCallback } from "react";
import {
    Card,
    Header,
    LeftSection,
    CategoryIconWrapper,
    TitleSection,
    Identity,
    HabitName,
    StatusButtonGroup,
    StatusButton,
    StreakBadge,
    ContextSection,
    ContextRow,
    ContextLabel,
    ContextText,
    Targets,
    TargetItem,
    TargetBadge,
    TrackerSection,
    TrackerRow,
    TrackerDay,
    Footer,
    Consistency,
    Actions,
    IconButton,
    ActionButton,
    ActionText,
} from "./HabitItem.styles";

import {
    CalendarDays, MoreHorizontal, Pencil, Trash2,
    Flame, Zap, Target, AlertCircle, Clock,
} from "lucide-react";

import {
    getTodayStatus,
    getCompletionStats,
    buildUpdatedCompletions,
    computeNewStreak,
} from "./helpers";
import { getConsistency } from "@/lib/habits/consistency";
import { getWeekTracker } from "@/lib/habits/tracker";
import { calculateStreak } from "@/lib/habits/streak";
import { getCategoryConfig } from "@/constants/categories";

export default function HabitItem({
                                       item, onStatusChange, onEdit, onDelete, onMore, onClick
                                   }) {

    const {
        identity, title, category, minimumAction, target,
        trigger, fallbackPlan, completions = [],
    } = item;

    const { icon: CategoryIcon, color } = getCategoryConfig(category);
    const todayStatus = getTodayStatus(completions);
    const tracker = useMemo(() => getWeekTracker(completions), [completions]);
    const consistency = useMemo(() => getConsistency(completions), [completions]);
    const streak = useMemo(() => calculateStreak(completions), [completions]);
    const stats = useMemo(() => getCompletionStats(completions), [completions]);

    const handleStatusSelect = useCallback((newStatus) => {
        const updatedCompletions = buildUpdatedCompletions(completions, newStatus);
        const newStreak = computeNewStreak(completions, newStatus);
        onStatusChange?.(item, newStatus, updatedCompletions, newStreak);
    }, [completions, item, onStatusChange]);

    return (
        <Card onClick={() => onClick?.(item)}>

            {/* ---------------- HEADER ---------------- */}
            <Header>
                <LeftSection>
                    <CategoryIconWrapper $color={color}>
                        <CategoryIcon size={22}/>
                    </CategoryIconWrapper>
                    <TitleSection>
                        <Identity>
                            Become a {identity}
                        </Identity>
                        <HabitName>
                            {title}
                        </HabitName>
                    </TitleSection>
                </LeftSection>
            </Header>

            {/* ---------------- STREAK ---------------- */}
            {streak > 0 && (
                <StreakBadge $color={color}>
                    <Flame size={16}/>
                    {streak}-day streak
                </StreakBadge>
            )}

            {/* ---------------- THREE-TIER STATUS BUTTONS ---------------- */}
            <StatusButtonGroup>
                <StatusButton
                    $active={todayStatus === "failed"}
                    $variant="failed"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleStatusSelect("failed");
                    }}
                >
                    <span className="status-icon">✕</span>
                    Missed
                </StatusButton>

                <StatusButton
                    $active={todayStatus === "minimum"}
                    $variant="minimum"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleStatusSelect("minimum");
                    }}
                >
                    <Zap size={14}/>
                    Minimum
                </StatusButton>

                <StatusButton
                    $active={todayStatus === "completed"}
                    $variant="ideal"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleStatusSelect("completed");
                    }}
                >
                    <Target size={14}/>
                    Ideal
                </StatusButton>
            </StatusButtonGroup>

            {/* ---------------- CONTEXT: TRIGGER & FALLBACK ---------------- */}
            {(trigger || fallbackPlan) && (
                <ContextSection>
                    {trigger && (
                        <ContextRow>
                            <ContextLabel>
                                <Clock size={13}/>
                                Trigger
                            </ContextLabel>
                            <ContextText>{trigger}</ContextText>
                        </ContextRow>
                    )}
                    {fallbackPlan && (
                        <ContextRow $variant="fallback">
                            <ContextLabel>
                                <AlertCircle size={13}/>
                                Fallback
                            </ContextLabel>
                            <ContextText>{fallbackPlan}</ContextText>
                        </ContextRow>
                    )}
                </ContextSection>
            )}

            {/* ---------------- TARGETS ---------------- */}
            <Targets>
                <TargetItem $variant="minimum">
                    <TargetBadge $variant="minimum">MIN</TargetBadge>
                    <div>
                        <ContextLabel>Minimum Action</ContextLabel>
                        <ActionText>{minimumAction}</ActionText>
                    </div>
                </TargetItem>
                <TargetItem $variant="ideal">
                    <TargetBadge $variant="ideal">IDEAL</TargetBadge>
                    <div>
                        <ContextLabel>Target</ContextLabel>
                        <ActionText>{target || "No target set"}</ActionText>
                    </div>
                </TargetItem>
            </Targets>

            {/* ---------------- WEEK TRACKER ---------------- */}
            <TrackerSection>
                <TrackerRow>
                    {tracker.map(day => (
                        <TrackerDay
                            key={day.day}
                            $state={day.state}
                            $color={color}
                            aria-label={`${day.label}: ${day.state}`}
                        >
                            {day.label}
                        </TrackerDay>
                    ))}
                </TrackerRow>
            </TrackerSection>

            {/* ---------------- FOOTER ---------------- */}
            <Footer>
                <Consistency>
                    {consistency}% consistency
                    {stats.total > 0 && (
                        <span className="stats-detail">
                            {" "}· {stats.idealCount} ideal · {stats.minimumCount} min
                        </span>
                    )}
                </Consistency>
                <Actions>
                    <ActionButton
                        as="button"
                        $color={color}
                        aria-label="Edit habit"
                        data-tooltip="Edit habit"
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
                        aria-label="Delete habit"
                        data-tooltip="Delete habit"
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
    );
}
