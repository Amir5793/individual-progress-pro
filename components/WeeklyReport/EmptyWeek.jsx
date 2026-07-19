"use client";

import React from "react";
import { Inbox } from "lucide-react";
import { EmptyState, EmptyIcon, EmptyTitle, EmptyDesc } from "./WeeklyReport.styles";

export default function EmptyWeek() {
  return (
    <EmptyState>
      <EmptyIcon>
        <Inbox size={28} />
      </EmptyIcon>
      <EmptyTitle>No items this week</EmptyTitle>
      <EmptyDesc>
        Create goals or habits to see them reflected in your weekly report.
      </EmptyDesc>
    </EmptyState>
  );
}
