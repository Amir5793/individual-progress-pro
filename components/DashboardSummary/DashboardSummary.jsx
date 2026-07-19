"use client";

import React, { useMemo, useState, useCallback } from "react";
import { useCommitments } from "@/lib/store/CommitmentContext";
import { priorityScore } from "@/lib/items/sorting";
import { getTodayStatus } from "@/components/Items/Item/HabitItem/helpers";
import {
  createCommitment,
} from "@/lib/services/commitmentService";
import { COMMITMENTS_LOADED } from "@/lib/store/types";
import { Inbox, HelpCircle, X, Rocket, Target, Repeat } from "lucide-react";
import {
  Card,
  SummaryText,
  SummaryLink,
  EmptySlate,
  EmptyIcon,
  EmptyTitle,
  EmptyDesc,
  CtaRow,
  PrimaryCta,
  SecondaryCta,
  WelcomeOverlay,
  WelcomeCard,
  WelcomeTitle,
  WelcomeDesc,
  WelcomeActions,
  Checklist,
  ChecklistItem,
  CheckCircle,
  HelpButton,
  QuickStartOverlay,
  QuickStartCard,
  QuickStartTitle,
  QuickStartStep,
  StepNumber,
  StepContent,
  StepLabel,
  StepDesc,
} from "./DashboardSummary.styles";

const WELCOME_SEEN_KEY = "onboarding-welcome-seen";

const SAMPLE_GOALS = [
  {
    title: "Learn React Testing",
    category: "learning",
    period: "daily",
    reason: { what: "Expand my skill set", why: "Become a better developer" },
    difficulty: "medium",
    energy: "medium",
    completionCriteria: "Complete 5 testing tutorials",
    obstacle: "Finding time",
    fallbackPlan: "Do 15 min/day instead of 30",
  },
];

const SAMPLE_HABITS = [
  {
    title: "Morning journaling",
    category: "wellness",
    period: "daily",
    reason: { what: "Build self-awareness", why: "Start the day with clarity" },
    identity: "A reflective person",
    minimumAction: "Write one sentence",
    target: "Write for 10 minutes",
    trigger: "After coffee",
    preferredTime: "morning",
    obstacle: "Rushing in the morning",
    fallbackPlan: "Write on phone during commute",
  },
];

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

export default function DashboardSummary({ onLaunchCreator }) {
  const { commitments, loading, dispatch } = useCommitments();
  const [showWelcome, setShowWelcome] = useState(() => {
    if (typeof window === "undefined") return false;
    return commitments.length === 0 && !localStorage.getItem(WELCOME_SEEN_KEY);
  });
  const [showHelp, setShowHelp] = useState(false);

  const dismissWelcome = useCallback(() => {
    localStorage.setItem(WELCOME_SEEN_KEY, "1");
    setShowWelcome(false);
  }, []);

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

  const loadSampleData = useCallback(() => {
    const all = [...SAMPLE_GOALS, ...SAMPLE_HABITS];
    const created = all.map((item) => createCommitment(item));
    dispatch({ type: COMMITMENTS_LOADED, payload: created });
    dismissWelcome();
  }, [dispatch, dismissWelcome]);

  if (loading) return null;

  if (commitments.length === 0) {
    const hasGoal = goals.length > 0;
    const hasHabit = habits.length > 0;
    const checklistDone = (hasGoal ? 1 : 0) + (hasHabit ? 1 : 0);

    return (
      <>
        <Card>
          <EmptySlate>
            <EmptyIcon>
              <Inbox size={28} />
            </EmptyIcon>
            <EmptyTitle>Welcome to your progress tracker</EmptyTitle>
            <EmptyDesc>
              Create your first goal or habit to start tracking your progress.
            </EmptyDesc>
            <CtaRow>
              <PrimaryCta
                type="button"
                onClick={() => onLaunchCreator?.("goal")}
                aria-label="Create your first goal"
              >
                <Target size={16} />
                New Goal
              </PrimaryCta>
              <SecondaryCta
                type="button"
                onClick={() => onLaunchCreator?.("habit")}
                aria-label="Create your first habit"
              >
                <Repeat size={16} />
                New Habit
              </SecondaryCta>
            </CtaRow>
            <Checklist>
              <ChecklistItem $done={hasGoal}>
                <CheckCircle $done={hasGoal}>{hasGoal ? "✓" : ""}</CheckCircle>
                Create your first goal
              </ChecklistItem>
              <ChecklistItem $done={hasHabit}>
                <CheckCircle $done={hasHabit}>{hasHabit ? "✓" : ""}</CheckCircle>
                Create your first habit
              </ChecklistItem>
            </Checklist>
          </EmptySlate>
        </Card>

        {showWelcome && (
          <WelcomeOverlay role="dialog" aria-label="Welcome">
            <WelcomeCard>
              <WelcomeTitle>Welcome aboard!</WelcomeTitle>
              <WelcomeDesc>
                Start building momentum by creating a goal or habit. You can
                also load sample data to explore the app.
              </WelcomeDesc>
              <WelcomeActions>
                <PrimaryCta
                  type="button"
                  onClick={() => {
                    dismissWelcome();
                    onLaunchCreator?.("goal");
                  }}
                >
                  <Rocket size={16} />
                  Create your first goal
                </PrimaryCta>
                <SecondaryCta
                  type="button"
                  onClick={() => {
                    dismissWelcome();
                    onLaunchCreator?.("habit");
                  }}
                >
                  <Repeat size={16} />
                  Create your first habit
                </SecondaryCta>
                <SecondaryCta type="button" onClick={loadSampleData}>
                  Load sample data
                </SecondaryCta>
                <SecondaryCta type="button" onClick={dismissWelcome}>
                  I&apos;ll do it later
                </SecondaryCta>
              </WelcomeActions>
            </WelcomeCard>
          </WelcomeOverlay>
        )}
      </>
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

      <HelpButton
        type="button"
        onClick={() => setShowHelp(true)}
        aria-label="Quick start guide"
      >
        <HelpCircle size={18} />
      </HelpButton>

      {showHelp && (
        <QuickStartOverlay role="dialog" aria-label="Quick start guide">
          <QuickStartCard>
            <QuickStartTitle>Quick Start Guide</QuickStartTitle>
            <QuickStartStep>
              <StepNumber>1</StepNumber>
              <StepContent>
                <StepLabel>Set a goal</StepLabel>
                <StepDesc>
                  Define something you want to achieve, add actions, and track
                  your progress.
                </StepDesc>
              </StepContent>
            </QuickStartStep>
            <QuickStartStep>
              <StepNumber>2</StepNumber>
              <StepContent>
                <StepLabel>Build a habit</StepLabel>
                <StepDesc>
                  Create a recurring habit with a trigger and minimum action to
                  build consistency.
                </StepDesc>
              </StepContent>
            </QuickStartStep>
            <QuickStartStep>
              <StepNumber>3</StepNumber>
              <StepContent>
                <StepLabel>Track daily</StepLabel>
                <StepDesc>
                  Mark actions complete, check off habits, and watch your
                  streaks grow.
                </StepDesc>
              </StepContent>
            </QuickStartStep>
            <QuickStartStep>
              <StepNumber>4</StepNumber>
              <StepContent>
                <StepLabel>Review reports</StepLabel>
                <StepDesc>
                  Visit the Reports page to see charts and weekly summaries of
                  your progress.
                </StepDesc>
              </StepContent>
            </QuickStartStep>
            <SecondaryCta
              type="button"
              onClick={() => setShowHelp(false)}
              style={{ marginTop: 16, width: "100%", justifyContent: "center" }}
            >
              Got it
            </SecondaryCta>
          </QuickStartCard>
        </QuickStartOverlay>
      )}
    </>
  );
}
