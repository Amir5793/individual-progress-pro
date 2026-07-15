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
} from "./GoalItem.styles";

import {
    formatDeadline, difficultyColor, energyColor,
} from "./helpers";

import {getCategoryColor, getCategoryIcon} from "@/constants/categories"


import {
    Pencil, MoreHorizontal, Check, CalendarDays, Zap, Target,
} from "lucide-react";

export default function GoalItem({
                                     item, onComplete, onEdit, onMore, onClick,
                                 }) {
    const {
        title, mainReason, category, completionCriteria, difficulty, energy, deadline, period, completed,
    } = item;

    const CategoryIcon = getCategoryIcon(category);
    const accentColor = getCategoryColor(category);

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

                    <Reason>
                        {mainReason}
                    </Reason>

                </TitleSection>

            </LeftSection>

            <Checkbox
                $checked={completed}
                $color={accentColor}
                onClick={(e) => {
                    e.stopPropagation();
                    onComplete?.(item);
                }}
            >
                {completed && <Check size={18}/>}
            </Checkbox>

        </Header>

        {/* ---------------- COMPLETION ---------------- */}

        <CompletionSection>

            <CompletionLabel>

                <Target size={15}/>

                Done when

            </CompletionLabel>

            <CompletionText>

                {completionCriteria}

            </CompletionText>

        </CompletionSection>

        {/* ---------------- FOOTER ---------------- */}

        <Footer>

            <ChipGroup>

                <Chip
                    $color={difficultyColor(difficulty)}
                >
                    {difficulty}
                </Chip>

                <Chip
                    $color={energyColor(energy)}
                >
                    <Zap size={14}/>

                    {energy} Focus
                </Chip>

                <Chip>

                    {period}

                </Chip>

                {deadline && (

                    <Chip>

                        <CalendarDays size={14}/>

                        {formatDeadline(deadline)}

                    </Chip>

                )}

            </ChipGroup>

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