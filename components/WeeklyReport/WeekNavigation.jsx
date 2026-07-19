"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NavBar, NavBtn, WeekLabel, TodayBtn } from "./WeeklyReport.styles";

export default function WeekNavigation({
  weekStart,
  onPrev,
  onNext,
  onToday,
  onJump,
}) {
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const fmt = (d) =>
    d.toLocaleDateString(undefined, { month: "short", day: "numeric" });

  const fmtFallback = (d) => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${months[d.getMonth()]} ${d.getDate()}`;
  };

  const formatWeek = mounted ? fmt : fmtFallback;

  const isCurrentWeek = (() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    return weekStart.getTime() === startOfWeek.getTime();
  })();

  return (
    <NavBar>
      <NavBtn onClick={onPrev} aria-label="Previous week">
        <ChevronLeft size={18} />
      </NavBtn>

      <WeekLabel onClick={onJump} style={{ cursor: "pointer" }}>
        {formatWeek(weekStart)} – {formatWeek(weekEnd)}, {weekStart.getFullYear()}
      </WeekLabel>

      {!isCurrentWeek && (
        <TodayBtn onClick={onToday}>Today</TodayBtn>
      )}

      <NavBtn onClick={onNext} aria-label="Next week">
        <ChevronRight size={18} />
      </NavBtn>
    </NavBar>
  );
}
