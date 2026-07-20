"use client";

import React, { useMemo } from "react";
import ItemRenderer from "../ItemRendered/ItemRenderer";

import {
    Container,
    Grid,
    Column,
    ColumnTitle,
    EmptyState,
} from "./ItemsContainer.styles";

import { sortItems } from "@/lib/items/sorting";
import { useTranslation } from "@/lib/i18n/localeContext";

export default function ItemsContainer({
                                           mode = "overview",

                                           commitments = [],

                                           sortBy = "priority",

                                           goalLimit = Infinity,
                                           habitLimit = Infinity,

                                           loading = false,

                                           onItemClick,
                                           onComplete,
                                           onStatusChange,
                                           onEdit,
                                           onDelete,
                                           onMore,
                                           onActionComplete,
                                       }) {

    const t = useTranslation();

    const allGoals = useMemo(() => {
        return sortItems(
            commitments.filter((item) => item.type === "goal"),
            sortBy
        );
    }, [commitments, sortBy]);

    const allHabits = useMemo(() => {
        return sortItems(
            commitments.filter((item) => item.type === "habit"),
            sortBy
        );
    }, [commitments, sortBy]);

    const isOverview = mode === "overview";
    const goals = isOverview ? allGoals.slice(0, goalLimit) : allGoals;
    const habits = isOverview ? allHabits.slice(0, habitLimit) : allHabits;

    /* -------------------------------------------------------------------------- */
    /* Loading                                                                    */
    /* -------------------------------------------------------------------------- */

    if (loading) {
        return (
            <Container>
                <EmptyState>
                    Loading...
                </EmptyState>
            </Container>
        );
    }

    /* -------------------------------------------------------------------------- */
    /* Split data                                                                  */
    /* -------------------------------------------------------------------------- */

    /* -------------------------------------------------------------------------- */
    /* Reusable renderer                                                           */
    /* -------------------------------------------------------------------------- */

    const renderItems = (items, emptyMessage) => {

        if (items.length === 0) {

            return (

                <EmptyState>

                    {emptyMessage}

                </EmptyState>

            );

        }

        return items.map(item => (

            <ItemRenderer

                key={item.id}

                item={item}

                onClick={onItemClick}

                onComplete={onComplete}

                onStatusChange={onStatusChange}

                onEdit={onEdit}

                onDelete={onDelete}

                onMore={onMore}

                onActionComplete={onActionComplete}

            />

        ));

    };

    /* -------------------------------------------------------------------------- */
    /* TASK MODE                                                                   */
    /* -------------------------------------------------------------------------- */

    if (mode === "goal") {

        return (

            <Container>

                {renderItems(
                    goals,
                    "No goals yet."
                )}

            </Container>

        );

    }

    /* -------------------------------------------------------------------------- */
    /* HABIT MODE                                                                  */
    /* -------------------------------------------------------------------------- */

    if (mode === "habit") {

        return (

            <Container>

                {renderItems(
                    habits,
                    "No habits yet."
                )}

            </Container>

        );

    }

    /* -------------------------------------------------------------------------- */
    /* OVERVIEW                                                                    */
    /* -------------------------------------------------------------------------- */

    return (

        <Grid>

            <Column>

                <ColumnTitle>

                    {t('habit.title_plural')}

                </ColumnTitle>

                {renderItems(
                    habits,
                    "No habits yet."
                )}

            </Column>

            <Column>

                <ColumnTitle>

                    {t('goal.title_plural')}

                </ColumnTitle>

                {renderItems(
                    goals,
                    "No goals yet."
                )}

            </Column>

        </Grid>

    );

}
