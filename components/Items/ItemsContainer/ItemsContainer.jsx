"use client";

import ItemRenderer from "../ItemRendered/ItemRenderer";

import {
    Container,
    Grid,
    Column,
    ColumnTitle,
    EmptyState,
} from "./ItemsContainer.styles";

import { sortItems } from "@/lib/items/sorting";

export default function ItemsContainer({
                                           mode = "overview",

                                           commitments = [],

                                           sortBy = "priority",

                                           loading = false,

                                           onItemClick,
                                           onComplete,
                                           onStatusChange,
                                           onEdit,
                                           onDelete,
                                           onMore,
                                           onActionComplete,
                                       }) {

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

    const goals = sortItems(

        commitments.filter(
            item => item.type === "goal"
        ),

        sortBy

    );

    const habits = sortItems(

        commitments.filter(
            item => item.type === "habit"
        ),

        sortBy

    );

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

                    Habits

                </ColumnTitle>

                {renderItems(
                    habits,
                    "No habits yet."
                )}

            </Column>

            <Column>

                <ColumnTitle>

                    Goals

                </ColumnTitle>

                {renderItems(
                    goals,
                    "No goals yet."
                )}

            </Column>

        </Grid>

    );

}