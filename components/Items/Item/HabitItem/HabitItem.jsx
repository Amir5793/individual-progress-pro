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
    MoreHorizontal, Pencil, Trash2,
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
import { useTranslation } from "@/lib/i18n/localeContext";

export default function HabitItem({
                                       item, onStatusChange, onEdit, onDelete, onMore, onClick
                                   }) {

    const t = useTranslation();

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
                            {t('habititem.become', {identity})}
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
                    {t('habititem.streak', {count: streak})}
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
                    {t('habititem.status_missed')}
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
                    {t('habititem.status_minimum')}
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
                    {t('habititem.status_ideal')}
                </StatusButton>
            </StatusButtonGroup>

            {/* ---------------- CONTEXT: TRIGGER & FALLBACK ---------------- */}
            {(trigger || fallbackPlan) && (
                <ContextSection>
                    {trigger && (
                        <ContextRow>
                            <ContextLabel>
                                <Clock size={13}/>
                                {t('habititem.trigger_label')}
                            </ContextLabel>
                            <ContextText>{trigger}</ContextText>
                        </ContextRow>
                    )}
                    {fallbackPlan && (
                        <ContextRow $variant="fallback">
                            <ContextLabel>
                                <AlertCircle size={13}/>
                                {t('habititem.fallback_label')}
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
                        <ContextLabel>{t('habititem.minimum_action')}</ContextLabel>
                        <ActionText>{minimumAction}</ActionText>
                    </div>
                </TargetItem>
                <TargetItem $variant="ideal">
                    <TargetBadge $variant="ideal">IDEAL</TargetBadge>
                    <div>
                        <ContextLabel>{t('habititem.target_label')}</ContextLabel>
                        <ActionText>{target || t('habititem.no_target')}</ActionText>
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
                    {t('habititem.consistency', {consistency})}
                    {stats.total > 0 && (
                        <span className="stats-detail">
                            {" "}· {stats.idealCount} {t('habititem.ideal_count')} · {stats.minimumCount} {t('habititem.min_count')}
                        </span>
                    )}
                </Consistency>
                <Actions>
                    <ActionButton
                        as="button"
                        $color={color}
                        aria-label={t('habititem.edit')}
                        data-tooltip={t('habititem.edit')}
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
                        aria-label={t('habititem.delete')}
                        data-tooltip={t('habititem.delete')}
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(item);
                        }}
                    >
                        <Trash2 size={16}/>
                    </ActionButton>
                    <IconButton
                        as="button"
                        aria-label={t('habititem.more')}
                        data-tooltip={t('habititem.more')}
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
