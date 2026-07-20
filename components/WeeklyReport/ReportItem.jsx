"use client";

import React from "react";
import { Flame, Check, Zap, Target, X } from "lucide-react";
import { getCategoryConfig } from "@/constants/categories";
import { calculateStreak } from "@/lib/habits/streak";
import { getTodayStatus } from "@/components/Items/Item/HabitItem/helpers";
import { useTranslation } from "@/lib/i18n/localeContext";
import {
  ItemCard,
  CategoryDot,
  ItemTitle,
  ItemMeta,
  Badge,
} from "./WeeklyReport.styles";

function GoalRow({ item }) {
  const { icon: CategoryIcon, color } = getCategoryConfig(item.category);
  const t = useTranslation();
  const actionsCount = item.actions?.length || 0;
  const doneCount = item.actions?.filter((a) => a.completed).length || 0;

  return (
    <ItemCard>
      <CategoryDot $color={color}>
        <CategoryIcon size={16} />
      </CategoryDot>
      <ItemTitle>{item.title}</ItemTitle>
      {actionsCount > 0 && (
        <Badge $variant="neutral">
          {doneCount}/{actionsCount} {t('report.items_actions')}
        </Badge>
      )}
      <Badge $variant={item.completed ? "done" : "pending"}>
        {item.completed ? <Check size={12} /> : null}
        {item.completed ? t('report.items_done') : t('report.items_active')}
      </Badge>
    </ItemCard>
  );
}

function HabitRow({ item }) {
  const { icon: CategoryIcon, color } = getCategoryConfig(item.category);
  const t = useTranslation();
  const streak = calculateStreak(item.completions || []);
  const todayStatus = getTodayStatus(item.completions || []);

  const statusConfig = {
    completed: { label: t('report.items_ideal'), icon: <Target size={12} />, variant: "done" },
    minimum: { label: t('report.items_minimum'), icon: <Zap size={12} />, variant: "minimum" },
    failed: { label: t('report.items_missed'), icon: <X size={12} />, variant: "failed" },
    null: { label: t('report.items_pending'), icon: null, variant: "pending" },
  };

  const st = statusConfig[todayStatus] || statusConfig.null;

  return (
    <ItemCard>
      <CategoryDot $color={color}>
        <CategoryIcon size={16} />
      </CategoryDot>
      <ItemTitle>{item.title}</ItemTitle>
      {streak > 0 && (
        <Badge $variant="streak">
          <Flame size={12} />
          {streak}d
        </Badge>
      )}
      <Badge $variant={st.variant}>
        {st.icon}
        {st.label}
      </Badge>
    </ItemCard>
  );
}

export default function ReportItem({ item }) {
  if (item.type === "goal") return <GoalRow item={item} />;
  if (item.type === "habit") return <HabitRow item={item} />;
  return null;
}
