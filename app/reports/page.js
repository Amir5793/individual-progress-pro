"use client";

import React, { useState, useCallback, useMemo } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import WeekNavigation from "@/components/WeeklyReport/WeekNavigation";
import ReportsCharts from "@/components/Reports/ReportsCharts";
import WeeklyReport from "@/components/WeeklyReport/WeeklyReport";

export default function Reports() {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const getWeekStart = useCallback((date) => {
    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const weekStart = useMemo(() => getWeekStart(currentDate), [currentDate, getWeekStart]);
  const weekEnd = useMemo(() => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    return d;
  }, [weekStart]);

  const handlePrev = useCallback(() => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  }, [currentDate]);

  const handleNext = useCallback(() => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  }, [currentDate]);

  const handleToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const handleJump = useCallback(() => {
    const input = document.createElement("input");
    input.type = "date";
    input.value = currentDate.toISOString().split("T")[0];
    input.addEventListener("change", (e) => {
      if (e.target.value) {
        setCurrentDate(new Date(e.target.value + "T00:00:00"));
      }
    });
    input.click();
  }, [currentDate]);

  return (
    <div className="export-wrapper">
      <div className="app-wrapper">
        <Sidebar />
        <main className="main-area">
          <WeekNavigation
            weekStart={weekStart}
            onPrev={handlePrev}
            onNext={handleNext}
            onToday={handleToday}
            onJump={handleJump}
          />

          <ReportsCharts
            weekStart={weekStart}
            weekEnd={weekEnd}
          />

          <WeeklyReport
            weekStart={weekStart}
            weekEnd={weekEnd}
            currentDate={currentDate}
            onPrev={handlePrev}
            onNext={handleNext}
            onToday={handleToday}
            onJump={handleJump}
          />
        </main>
      </div>
    </div>
  );
}
