"use client";

import React from "react";
import { Inbox } from "lucide-react";
import { useTranslation } from "@/lib/i18n/localeContext";
import { EmptyState, EmptyIcon, EmptyTitle, EmptyDesc } from "./WeeklyReport.styles";

export default function EmptyWeek() {
  const t = useTranslation();

  return (
    <EmptyState>
      <EmptyIcon>
        <Inbox size={28} />
      </EmptyIcon>
      <EmptyTitle>{t('report.no_items_title')}</EmptyTitle>
      <EmptyDesc>
        {t('report.no_items_desc')}
      </EmptyDesc>
    </EmptyState>
  );
}
