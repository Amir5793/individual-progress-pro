"use client";

import { useMemo, useState, useEffect } from "react";
import { useCommitments } from "@/lib/store/CommitmentContext";
import { getDraftByWeek } from "@/lib/services/draftService";

function weekKeyFromDate(d) {
    return d.toISOString().split("T")[0];
}

export default function useReportCommitments(weekStart, weekEnd) {
    const { commitments, loading } = useCommitments();
    const [draftItems, setDraftItems] = useState([]);

    useEffect(() => {
        const weekKey = weekKeyFromDate(weekStart);
        const draft = getDraftByWeek(weekKey);
        setDraftItems(
            draft
                ? [...(draft.goals || []), ...(draft.habits || [])]
                : []
        );
    }, [weekStart, weekEnd]);

    const merged = useMemo(() => {
        if (commitments.length > 0) {
            return commitments;
        }

        return draftItems;
    }, [commitments, draftItems]);

    return { commitments: merged, loading };
}
