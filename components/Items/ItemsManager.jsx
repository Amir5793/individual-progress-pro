"use client";

import { useCallback, useEffect, useState } from "react";

import ItemsContainer from "./ItemsContainer/ItemsContainer";

import {
    getCommitments,
    createCommitment,
    updateCommitment,
    deleteCommitment,
    completeGoal,
    uncompleteGoal,
    updateHabitStatus,
} from "@/lib/services/commitmentService";

export default function ItemsManager({
                                         mode = "overview",
                                         sortBy = "priority",
                                     }) {

    const [commitments, setCommitments] = useState([]);
    const [loading, setLoading] = useState(true);

    /* -------------------------------------------------------------------------- */
    /* LOAD                                                                        */
    /* -------------------------------------------------------------------------- */

    const refresh = useCallback(() => {

        setCommitments(getCommitments());

    }, []);

    useEffect(() => {

        refresh();

        setLoading(false);

    }, [refresh]);

    /* -------------------------------------------------------------------------- */
    /* CREATE                                                                      */
    /* -------------------------------------------------------------------------- */

    const handleCreate = (commitment) => {

        const updated = createCommitment(commitment);

        setCommitments(updated);

    };

    /* -------------------------------------------------------------------------- */
    /* EDIT                                                                        */
    /* -------------------------------------------------------------------------- */

    const handleEdit = (updatedItem) => {

        const updated = updateCommitment(
            updatedItem.id,
            updatedItem
        );

        setCommitments(updated);

    };

    /* -------------------------------------------------------------------------- */
    /* COMPLETE TASK                                                               */
    /* -------------------------------------------------------------------------- */

    const handleComplete = (goal) => {

        let updated;

        if (goal.completed) {

            updated = uncompleteGoal(goal.id);

        } else {

            updated = completeGoal(goal.id);

        }

        setCommitments(updated);

    };

    /* -------------------------------------------------------------------------- */
    /* HABIT STATUS                                                                */
    /* -------------------------------------------------------------------------- */

    const handleStatusChange = (
        habit,
        status,
        completions,
        streak,
    ) => {

        const updated = updateHabitStatus(
            habit.id,
            status,
            completions,
            streak,
        );

        setCommitments(updated);

    };

    /* -------------------------------------------------------------------------- */
    /* DELETE                                                                      */
    /* -------------------------------------------------------------------------- */

    const handleDelete = (item) => {

        const updated = deleteCommitment(item.id);

        setCommitments(updated);

    };

    /* -------------------------------------------------------------------------- */
    /* ITEM CLICK                                                                  */
    /* -------------------------------------------------------------------------- */

    const handleItemClick = (item) => {

        console.log(item);

        // Future:
        // Open Details Drawer
        // Navigate
        // Expand Card
    };

    /* -------------------------------------------------------------------------- */
    /* MORE MENU                                                                   */
    /* -------------------------------------------------------------------------- */

    const handleMore = (item) => {

        console.log("More:", item);

        // Future:
        // Dropdown menu
        // Duplicate
        // Archive
        // Delete
    };

    /* -------------------------------------------------------------------------- */

    return (

        <ItemsContainer

            mode={mode}

            commitments={commitments}

            loading={loading}

            sortBy={sortBy}

            onItemClick={handleItemClick}

            onCreate={handleCreate}

            onEdit={handleEdit}

            onDelete={handleDelete}

            onComplete={handleComplete}

            onStatusChange={handleStatusChange}

            onMore={handleMore}

        />

    );

}