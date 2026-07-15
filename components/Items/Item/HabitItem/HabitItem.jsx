"use client";

import {
    Card,
    Header,
    LeftSection,
    CategoryIconWrapper,
    TitleSection,
    Identity,
    HabitName,
    StatusButton,
    ActionSection,
    SectionLabel,
    ActionText,
    Targets,
    TargetItem,
    TrackerSection,
    TrackerRow,
    TrackerDay,
    Footer,
    Consistency,
    StreakBadge,
    Actions,
    IconButton,
    ActionButton,
} from "./HabitItem.styles";

import {
    CalendarDays, Check, MoreHorizontal, Pencil, Trash2,
    Play, Pause, Flame,
} from "lucide-react";

import {
    getHabitStatus, getProgressLabel
} from "./helpers";
import {getConsistency} from "@/lib/habits/consistency";
import {getWeekTracker} from "@/lib/habits/tracker";
import {calculateStreak} from "@/lib/habits/streak";
import {getCategoryColor, getCategoryIcon} from "@/constants/categories";

export default function HabitItem({
                                       item, onStatusChange, onEdit, onDelete, onMore, onClick
                                   }) {

    const {
        identity, title, category, minimumAction, target, completions,
    } = item;

    const color = getCategoryColor(category);
    const CategoryIcon = getCategoryIcon(category);
    const status = getHabitStatus(item);
    const tracker = getWeekTracker(completions);
    const consistency = getConsistency(completions);
    const streak = calculateStreak(completions);

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
            <StatusButton
                $status={status}
                $color={color}
                aria-label={getProgressLabel(status)}
                onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange?.(item);
                }}
            >
                {status === "completed" && (<>
                    <Check size={18}/>
                    Done
                </>)}
                {status === "progress" && (<>
                    <Pause size={18}/>
                    Continue
                </>)}
                {status === "pending" && (<>
                    <Play size={18}/>
                    Start
                </>)}
            </StatusButton>
        </Header>

        {/* ---------------- STREAK ---------------- */}
        {streak > 0 && (
            <StreakBadge $color={color}>
                <Flame size={16}/>
                {streak}-day streak
            </StreakBadge>
        )}

        {/* ---------------- TODAY ---------------- */}
        <ActionSection>
            <SectionLabel>
                Today's Action
            </SectionLabel>
            <ActionText>
                {title}
            </ActionText>
        </ActionSection>

        {/* ---------------- TARGETS ---------------- */}
        <Targets>
            <TargetItem>
                <SectionLabel>
                    Minimum
                </SectionLabel>
                <ActionText>
                    {minimumAction}
                </ActionText>
            </TargetItem>
            <TargetItem>
                <SectionLabel>
                    Ideal
                </SectionLabel>
                <ActionText>
                    {target}
                </ActionText>
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
    </Card>);
}
