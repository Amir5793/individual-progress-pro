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
    Actions,
    IconButton,
} from "./HabitItem.styles";

import {
    CalendarDays, Check, MoreHorizontal, Pencil, Play, Pause,
} from "lucide-react";

import {
    getHabitStatus
} from "./helpers";
import {getConsistency} from "@/lib/habits/consistency"
import {getWeekTracker} from "@/lib/habits/tracker"
import {getCategoryColor, getCategoryIcon} from "@/constants/categories"

export default function HabitItem({
                                      item, onStatusChange, onEdit, onMore, onClick
                                  }) {

    const {
        identity, title, category, minimumAction, target, completions,
    } = item;

    const color = getCategoryColor(category);
    const CategoryIcon = getCategoryIcon(category);

    const status = getHabitStatus(item);

    const tracker = getWeekTracker(completions);

    const consistency = getConsistency(completions);

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

        {/* ---------------- WEEK ---------------- */}

        <TrackerSection>

            <TrackerRow>

                {tracker.map(day => (

                    <TrackerDay
                        key={day.day}
                        $state={day.state}
                        $color={color}
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

                <IconButton
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit?.(item);
                    }}
                >
                    <Pencil size={18}/>
                </IconButton>

                <IconButton
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