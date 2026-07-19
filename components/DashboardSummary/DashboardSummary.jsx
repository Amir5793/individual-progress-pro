"use client";

import React, { useMemo } from "react";
import { useCommitments } from "@/lib/store/CommitmentContext";
import { priorityScore } from "@/lib/items/sorting";
import { getTodayStatus } from "@/components/Items/Item/HabitItem/helpers";
import { Inbox } from "lucide-react";
import {
  Card,
  SummaryText,
  SummaryLink,
  EmptySlate,
  EmptyIcon,
  EmptyTitle,
  EmptyDesc,
} from "./DashboardSummary.styles";

function goalPriorityBucket(score) {
  if (score >= 60) return "high";
  if (score >= 30) return "medium";
  return "low";
}

function isUndoneHabit(habit) {
  const status = getTodayStatus(habit.completions || []);
  return status === null || status === "failed";
}

function isUndoneGoal(goal) {
  return !goal.completed;
}

function countUndoneActions(goals) {
  return goals.reduce((sum, g) => {
    if (!g.actions || !g.actions.length) return sum;
    return sum + g.actions.filter((a) => !a.completed).length;
  }, 0);
}

export default function DashboardSummary() {
  const { commitments, loading } = useCommitments();

  const goals = useMemo(
    () => commitments.filter((c) => c.type === "goal"),
    [commitments]
  );

  const habits = useMemo(
    () => commitments.filter((c) => c.type === "habit"),
    [commitments]
  );

  const goalBuckets = useMemo(() => {
    const buckets = { low: 0, medium: 0, high: 0 };
    goals.filter(isUndoneGoal).forEach((g) => {
      const bucket = goalPriorityBucket(priorityScore(g));
      buckets[bucket]++;
    });
    return buckets;
  }, [goals]);

  const undoneGoalsCount = useMemo(
    () => goals.filter(isUndoneGoal).length,
    [goals]
  );

  const undoneActionsCount = useMemo(
    () => countUndoneActions(goals),
    [goals]
  );

  const undoneHabitsCount = useMemo(
    () => habits.filter(isUndoneHabit).length,
    [habits]
  );

  if (loading) return null;

  if (commitments.length === 0) {
    return (
      <Card>
        <EmptySlate>
          <EmptyIcon>
            <Inbox size={28} />
          </EmptyIcon>
          <EmptyTitle>No commitments yet</EmptyTitle>
          <EmptyDesc>
            Create your first goal or habit to see your dashboard summary here.
          </EmptyDesc>
        </EmptySlate>
      </Card>
    );
  }

  return (
    <>
      <Card>
        {goals.length === 0 ? (
          <SummaryText>
            No goals yet.{" "}
            <SummaryLink href="/goals">Create one →</SummaryLink>
          </SummaryText>
        ) : undoneGoalsCount === 0 ? (
          <SummaryText>
            All goals completed. Great work!{" "}
            <SummaryLink href="/goals">See goals →</SummaryLink>
          </SummaryText>
        ) : (
          <SummaryText>
            You have <b>{undoneGoalsCount}</b> undone goal
            {undoneGoalsCount !== 1 ? "s" : ""}
            {undoneActionsCount > 0 &&
              `, ${undoneActionsCount} action${
                undoneActionsCount !== 1 ? "s" : ""
              } to do`}
            {goalBuckets.high > 0 &&
              `, ${goalBuckets.high} in high priority`}
            {goalBuckets.medium > 0 &&
              `, ${goalBuckets.medium} in medium priority`}
            {goalBuckets.low > 0 &&
              `, ${goalBuckets.low} in low priority`}
            .{" "}
            <SummaryLink href="/goals">See goals →</SummaryLink>
          </SummaryText>
        )}
      </Card>

      <Card>
        {habits.length === 0 ? (
          <SummaryText>
            No habits yet.{" "}
            <SummaryLink href="/habits">Create one →</SummaryLink>
          </SummaryText>
        ) : undoneHabitsCount === 0 ? (
          <SummaryText>
            All habits done today. Keep it up!{" "}
            <SummaryLink href="/habits">See habits →</SummaryLink>
          </SummaryText>
        ) : (
          <SummaryText>
            You have <b>{undoneHabitsCount}</b> undone habit
            {undoneHabitsCount !== 1 ? "s" : ""}.{" "}
            <SummaryLink href="/habits">See habits →</SummaryLink>
          </SummaryText>
        )}
      </Card>
    </>
  );
}
