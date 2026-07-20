"use client";

import React, { useMemo, useState, useCallback } from "react";
import { useTranslation, useLocale } from "@/lib/i18n/localeContext";
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
  const t = useTranslation();
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
            <EmptyTitle>{t('dashboard.empty.title')}</EmptyTitle>
            <EmptyDesc>
              {t('dashboard.empty.desc')}
            </EmptyDesc>
            <CtaRow>
              <PrimaryCta
                type="button"
                onClick={() => onLaunchCreator?.("goal")}
                aria-label={t('dashboard.checklist.first_goal')}
              >
                <Target size={16} />
                {t('dashboard.new_goal')}
              </PrimaryCta>
              <SecondaryCta
                type="button"
                onClick={() => onLaunchCreator?.("habit")}
                aria-label={t('dashboard.checklist.first_habit')}
              >
                <Repeat size={16} />
                {t('dashboard.new_habit')}
              </SecondaryCta>
            </CtaRow>
            <Checklist>
              <ChecklistItem $done={hasGoal}>
                <CheckCircle $done={hasGoal}>{hasGoal ? "✓" : ""}</CheckCircle>
                {t('dashboard.checklist.first_goal')}
              </ChecklistItem>
              <ChecklistItem $done={hasHabit}>
                <CheckCircle $done={hasHabit}>{hasHabit ? "✓" : ""}</CheckCircle>
                {t('dashboard.checklist.first_habit')}
              </ChecklistItem>
            </Checklist>
          </EmptySlate>
        </Card>

        {showWelcome && (
          <WelcomeOverlay role="dialog" aria-label="Welcome">
            <WelcomeCard>
              <WelcomeTitle>{t('dashboard.welcome.title')}</WelcomeTitle>
              <WelcomeDesc>
                {t('dashboard.welcome.desc')}
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
                  {t('dashboard.welcome.create_goal')}
                </PrimaryCta>
                <SecondaryCta
                  type="button"
                  onClick={() => {
                    dismissWelcome();
                    onLaunchCreator?.("habit");
                  }}
                >
                  <Repeat size={16} />
                  {t('dashboard.welcome.create_habit')}
                </SecondaryCta>
                <SecondaryCta type="button" onClick={loadSampleData}>
                  {t('dashboard.welcome.load_sample')}
                </SecondaryCta>
                <SecondaryCta type="button" onClick={dismissWelcome}>
                  {t('dashboard.welcome.later')}
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
            {t('dashboard.no_goal')}{" "}
            <SummaryLink href="/goals">{t('dashboard.create_one')}</SummaryLink>
          </SummaryText>
        ) : undoneGoalsCount === 0 ? (
          <SummaryText>
            {t('dashboard.all_goal_done')}{" "}
            <SummaryLink href="/goals">{t('dashboard.see_goals')}</SummaryLink>
          </SummaryText>
        ) : (
          <SummaryText>
            {t('dashboard.you_have')} <b>{undoneGoalsCount}</b>{" "}
            {undoneGoalsCount !== 1
              ? t('dashboard.undone_goals')
              : t('dashboard.undone_goal')}
            {undoneActionsCount > 0 &&
              `, ${t('dashboard.actions_to_do', { count: undoneActionsCount })}`}
            {goalBuckets.high > 0 &&
              `, ${t('dashboard.in_high_priority', { count: goalBuckets.high })}`}
            {goalBuckets.medium > 0 &&
              `, ${t('dashboard.in_medium_priority', { count: goalBuckets.medium })}`}
            {goalBuckets.low > 0 &&
              `, ${t('dashboard.in_low_priority', { count: goalBuckets.low })}`}
            .{" "}
            <SummaryLink href="/goals">{t('dashboard.see_goals')}</SummaryLink>
          </SummaryText>
        )}
      </Card>

      <Card>
        {habits.length === 0 ? (
          <SummaryText>
            {t('dashboard.no_habit')}{" "}
            <SummaryLink href="/habits">{t('dashboard.create_one')}</SummaryLink>
          </SummaryText>
        ) : undoneHabitsCount === 0 ? (
          <SummaryText>
            {t('dashboard.all_habit_done')}{" "}
            <SummaryLink href="/habits">{t('dashboard.see_habits')}</SummaryLink>
          </SummaryText>
        ) : (
          <SummaryText>
            {t('dashboard.you_have')} <b>{undoneHabitsCount}</b>{" "}
            {undoneHabitsCount !== 1
              ? t('dashboard.undone_habits')
              : t('dashboard.undone_habit')}.{" "}
            <SummaryLink href="/habits">{t('dashboard.see_habits')}</SummaryLink>
          </SummaryText>
        )}
      </Card>

      <HelpButton
        type="button"
        onClick={() => setShowHelp(true)}
        aria-label={t('dashboard.help_label')}
      >
        <HelpCircle size={18} />
      </HelpButton>

      {showHelp && (
        <QuickStartOverlay role="dialog" aria-label={t('dashboard.help_label')}>
          <QuickStartCard>
            <QuickStartTitle>{t('dashboard.help_title')}</QuickStartTitle>
            <QuickStartStep>
              <StepNumber>1</StepNumber>
              <StepContent>
                <StepLabel>{t('dashboard.step1_label')}</StepLabel>
                <StepDesc>
                  {t('dashboard.step1_desc')}
                </StepDesc>
              </StepContent>
            </QuickStartStep>
            <QuickStartStep>
              <StepNumber>2</StepNumber>
              <StepContent>
                <StepLabel>{t('dashboard.step2_label')}</StepLabel>
                <StepDesc>
                  {t('dashboard.step2_desc')}
                </StepDesc>
              </StepContent>
            </QuickStartStep>
            <QuickStartStep>
              <StepNumber>3</StepNumber>
              <StepContent>
                <StepLabel>{t('dashboard.step3_label')}</StepLabel>
                <StepDesc>
                  {t('dashboard.step3_desc')}
                </StepDesc>
              </StepContent>
            </QuickStartStep>
            <QuickStartStep>
              <StepNumber>4</StepNumber>
              <StepContent>
                <StepLabel>{t('dashboard.step4_label')}</StepLabel>
                <StepDesc>
                  {t('dashboard.step4_desc')}
                </StepDesc>
              </StepContent>
            </QuickStartStep>
            <SecondaryCta
              type="button"
              onClick={() => setShowHelp(false)}
              style={{ marginTop: 16, width: "100%", justifyContent: "center" }}
            >
              {t('dashboard.got_it')}
            </SecondaryCta>
          </QuickStartCard>
        </QuickStartOverlay>
      )}
    </>
  );
}
