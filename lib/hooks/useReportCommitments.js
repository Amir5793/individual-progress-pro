"use client";

import { useMemo } from "react";
import { useCommitments } from "@/lib/store/CommitmentContext";
import { getDraftByWeek } from "@/lib/services/draftService";

function weekKeyFromDate(d) {
    return d.toISOString().split("T")[0];
}

function isInWeek(item, weekStart, weekEnd) {
    if (!item.createdAt) return false;
    const created = new Date(item.createdAt);
    return created >= weekStart && created < weekEnd;
}

export default function useReportCommitments(weekStart, weekEnd) {
    const { commitments, loading } = useCommitments();

    const merged = useMemo(() => {
        const weekKey = weekKeyFromDate(weekStart);
        const draft = getDraftByWeek(weekKey);

        const draftItems = draft
            ? [...(draft.goals || []), ...(draft.habits || [])]
            : [];

        const liveItems = commitments.filter(c => isInWeek(c, weekStart, weekEnd));

        const liveIds = new Set(liveItems.map(c => c.id));

        const draftOnly = draftItems.filter(d => !liveIds.has(d.id));

        return [...liveItems, ...draftOnly];
    }, [commitments, weekStart, weekEnd]);

    return { commitments: merged, loading };
}
