import { renderHook } from "@testing-library/react";
import useReportCommitments from "@/lib/hooks/useReportCommitments";
import { useCommitments } from "@/lib/store/CommitmentContext";
import { put } from "@/backend/local_storage/local_storage_api";

jest.mock("@/lib/store/CommitmentContext");

const DRAFTS_KEY = "report-drafts";

function makeWeek(date) {
    const d = new Date(date);
    const start = new Date(d);
    start.setDate(start.getDate() - start.getDay());
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    return { weekStart: start, weekEnd: end };
}

function writeDraft(weekKey, goals, habits) {
    const existing = JSON.parse(localStorage.getItem(DRAFTS_KEY) || "[]");
    existing.push({
        weekKey,
        savedAt: new Date().toISOString(),
        status: "draft",
        goals,
        habits,
    });
    put(DRAFTS_KEY, existing);
}

describe("useReportCommitments", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    it("returns live commitments when no draft exists", () => {
        const now = new Date().toISOString();
        const items = [
            { id: "g1", type: "goal", title: "G1", createdAt: now },
            { id: "h1", type: "habit", title: "H1", createdAt: now },
        ];
        useCommitments.mockReturnValue({ commitments: items, loading: false });

        const { weekStart, weekEnd } = makeWeek(new Date());
        const { result } = renderHook(() => useReportCommitments(weekStart, weekEnd));

        expect(result.current.commitments).toHaveLength(2);
        expect(result.current.loading).toBe(false);
    });

    it("merges draft-only items when commitment is deleted", () => {
        const now = new Date().toISOString();
        const { weekStart, weekEnd } = makeWeek(new Date());

        writeDraft(weekStart.toISOString().split("T")[0], [
            { id: "g1", type: "goal", title: "Saved Goal", createdAt: now },
            { id: "g2", type: "goal", title: "Also Saved", createdAt: now },
        ], []);

        useCommitments.mockReturnValue({
            commitments: [
                { id: "g1", type: "goal", title: "Live Goal", createdAt: now },
            ],
            loading: false,
        });

        const { result } = renderHook(() => useReportCommitments(weekStart, weekEnd));

        expect(result.current.commitments).toHaveLength(2);
        const ids = result.current.commitments.map(c => c.id);
        expect(ids).toContain("g1");
        expect(ids).toContain("g2");
    });

    it("live version wins over draft version for same id", () => {
        const now = new Date().toISOString();
        const { weekStart, weekEnd } = makeWeek(new Date());

        writeDraft(weekStart.toISOString().split("T")[0], [
            { id: "g1", type: "goal", title: "Draft Title", createdAt: now },
        ], []);

        useCommitments.mockReturnValue({
            commitments: [
                { id: "g1", type: "goal", title: "Live Title", createdAt: now },
            ],
            loading: false,
        });

        const { result } = renderHook(() => useReportCommitments(weekStart, weekEnd));

        expect(result.current.commitments).toHaveLength(1);
        expect(result.current.commitments[0].title).toBe("Live Title");
    });

    it("merges draft habits into live data", () => {
        const now = new Date().toISOString();
        const { weekStart, weekEnd } = makeWeek(new Date());

        writeDraft(weekStart.toISOString().split("T")[0], [], [
            { id: "h1", type: "habit", title: "Draft Habit", createdAt: now },
        ]);

        useCommitments.mockReturnValue({
            commitments: [
                { id: "g1", type: "goal", title: "Live Goal", createdAt: now },
            ],
            loading: false,
        });

        const { result } = renderHook(() => useReportCommitments(weekStart, weekEnd));

        expect(result.current.commitments).toHaveLength(2);
        const types = result.current.commitments.map(c => c.type);
        expect(types).toContain("goal");
        expect(types).toContain("habit");
    });

    it("filters out items outside the week range", () => {
        const { weekStart, weekEnd } = makeWeek(new Date());
        const outsideDate = "2020-01-01T00:00:00.000Z";

        useCommitments.mockReturnValue({
            commitments: [
                { id: "g1", type: "goal", title: "Old", createdAt: outsideDate },
            ],
            loading: false,
        });

        const { result } = renderHook(() => useReportCommitments(weekStart, weekEnd));

        expect(result.current.commitments).toHaveLength(0);
    });

    it("returns loading from commitments context", () => {
        useCommitments.mockReturnValue({ commitments: [], loading: true });

        const { weekStart, weekEnd } = makeWeek(new Date());
        const { result } = renderHook(() => useReportCommitments(weekStart, weekEnd));

        expect(result.current.loading).toBe(true);
    });
});
