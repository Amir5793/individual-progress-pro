"use client";

import React, { useRef, useEffect, useMemo, useCallback } from "react";
import Script from "next/script";
import { useCommitments } from "@/lib/store/CommitmentContext";
import {
  ChartsSection,
  ChartsRow,
  ChartCard,
  ChartTitle,
  ChartDesc,
  CanvasWrap,
  EmptyChart,
} from "./ReportsCharts.styles";

const CATEGORY_COLORS = {
  Learning: "#6c5ce7",
  Coding: "#4f8dff",
  Career: "#4f8dff",
  Health: "#2ed47a",
  Fitness: "#2ed47a",
  Finance: "#f4c542",
  Personal: "#ff5c70",
  Reading: "#6c5ce7",
  Knowledge: "#a855f7",
  Programming: "#38bdf8",
};

const FALLBACK_COLORS = [
  "#6c5ce7", "#4f8dff", "#2ed47a", "#f4c542",
  "#ff5c70", "#a855f7", "#38bdf8", "#f97316",
  "#ec4899", "#14b8a6",
];

function getColorForCategory(cat, idx) {
  return CATEGORY_COLORS[cat] || FALLBACK_COLORS[idx % FALLBACK_COLORS.length];
}

function getCssVar(name) {
  if (typeof window === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* ==========================================================
   DATA HOOKS — scoped to chosen week
   ========================================================== */

function useCategoryData(commitments, weekStart, weekEnd) {
  return useMemo(() => {
    const inWeek = commitments.filter((c) => {
      if (!c.createdAt) return false;
      const created = new Date(c.createdAt);
      return created >= weekStart && created < weekEnd;
    });

    const goals = inWeek.filter((c) => c.type === "goal");
    const habits = inWeek.filter((c) => c.type === "habit");

    const goalCounts = {};
    goals.forEach((g) => {
      const cat = g.category || "Uncategorized";
      goalCounts[cat] = (goalCounts[cat] || 0) + 1;
    });

    const habitCounts = {};
    habits.forEach((h) => {
      const cat = h.category || "Uncategorized";
      habitCounts[cat] = (habitCounts[cat] || 0) + 1;
    });

    return { goalCounts, habitCounts };
  }, [commitments, weekStart, weekEnd]);
}

function useDailyProgress(commitments, weekStart, weekEnd) {
  return useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const dayStart = new Date(weekStart);
      dayStart.setDate(dayStart.getDate() + i);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      let ideal = 0;
      let minimum = 0;
      let missed = 0;

      commitments.forEach((c) => {
        if (c.type !== "habit") return;
        (c.completions || []).forEach((comp) => {
          const cd = new Date(comp.date);
          if (cd >= dayStart && cd < dayEnd) {
            if (comp.status === "completed") ideal++;
            else if (comp.status === "minimum") minimum++;
            else if (comp.status === "failed") missed++;
          }
        });
      });

      const totalHabits = commitments.filter((c) => c.type === "habit").length;
      const idealPct = totalHabits > 0 ? Math.round((ideal / totalHabits) * 100) : 0;
      const minimumPct = totalHabits > 0 ? Math.round((minimum / totalHabits) * 100) : 0;
      const missedPct = totalHabits > 0 ? Math.round((missed / totalHabits) * 100) : 0;

      const totalActions = commitments
        .filter((c) => c.type === "goal")
        .reduce((sum, g) => sum + (g.actions?.length || 0), 0);
      const completedActions = commitments
        .filter((c) => c.type === "goal")
        .reduce((sum, g) => sum + (g.actions?.filter((a) => a.completed).length || 0), 0);
      const goalRate = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0;

      const dayLabel = DAY_NAMES[dayStart.getDay()];

      days.push({ label: dayLabel, ideal: idealPct, minimum: minimumPct, missed: missedPct, goalRate });
    }

    return days;
  }, [commitments, weekStart]);
}

/* ==========================================================
   PIE CHART
   ========================================================== */

function PieChart({ counts, title, description }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const labels = useMemo(() => Object.keys(counts), [counts]);
  const data = useMemo(() => Object.values(counts), [counts]);
  const colors = useMemo(
    () => labels.map((l, i) => getColorForCategory(l, i)),
    [labels]
  );

  const renderChart = useCallback(() => {
    if (!canvasRef.current || !window.Chart) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new window.Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: colors,
            borderColor: getCssVar("--chart-border"),
            borderWidth: 2,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "55%",
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: getCssVar("--text-secondary") || "rgba(240, 242, 250, 0.7)",
              font: { size: 11, weight: "500" },
              padding: 12,
              usePointStyle: true,
              pointStyleWidth: 8,
            },
          },
          tooltip: {
            backgroundColor: getCssVar("--chart-tooltip-bg") || "rgba(14, 19, 35, 0.95)",
            titleColor: getCssVar("--text-primary") || "#f0f2fa",
            bodyColor: getCssVar("--text-secondary") || "rgba(240, 242, 250, 0.8)",
            borderColor: getCssVar("--btn-secondary-border") || "rgba(255,255,255,0.08)",
            borderWidth: 1,
            cornerRadius: 10,
            padding: 10,
            callbacks: {
              label: (ctx) => {
                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                const pct = total > 0 ? Math.round((ctx.parsed / total) * 100) : 0;
                return ` ${ctx.label}: ${ctx.parsed} (${pct}%)`;
              },
            },
          },
        },
      },
    });
  }, [labels, data, colors]);

  useEffect(() => {
    if (window.Chart) {
      renderChart();
    }
    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [renderChart]);

  const handleScriptLoad = useCallback(() => {
    renderChart();
  }, [renderChart]);

  const isEmpty = labels.length === 0;

  return (
    <ChartCard>
      <ChartTitle>{title}</ChartTitle>
      <ChartDesc>{description}</ChartDesc>
      {isEmpty ? (
        <EmptyChart>No items this week</EmptyChart>
      ) : (
        <CanvasWrap $aspect="4 / 3">
          <canvas ref={canvasRef} />
        </CanvasWrap>
      )}
      <Script
        src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js"
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      />
    </ChartCard>
  );
}

/* ==========================================================
   BAR / LINE CHART (Daily Progress for chosen week)
   ========================================================== */

function ProgressChart({ days, title, description }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const labels = useMemo(() => days.map((d) => d.label), [days]);

  const renderChart = useCallback(() => {
    if (!canvasRef.current || !window.Chart) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new window.Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Ideal",
            data: days.map((d) => d.ideal),
            backgroundColor: "rgba(46, 212, 122, 0.75)",
            borderRadius: 3,
            barPercentage: 0.8,
            categoryPercentage: 0.7,
          },
          {
            label: "Minimum",
            data: days.map((d) => d.minimum),
            backgroundColor: "rgba(244, 197, 66, 0.75)",
            borderRadius: 3,
            barPercentage: 0.8,
            categoryPercentage: 0.7,
          },
          {
            label: "Missed",
            data: days.map((d) => d.missed),
            backgroundColor: "rgba(255, 92, 112, 0.75)",
            borderRadius: 3,
            barPercentage: 0.8,
            categoryPercentage: 0.7,
          },
          {
            label: "Goal %",
            data: days.map((d) => d.goalRate),
            type: "line",
            borderColor: "#6c5ce7",
            backgroundColor: "rgba(108, 92, 231, 0.1)",
            pointBackgroundColor: "#6c5ce7",
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.35,
            fill: true,
            yAxisID: "y1",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        scales: {
          x: {
            grid: { color: getCssVar("--chart-grid") || "rgba(255,255,255,0.04)" },
            ticks: {
              color: getCssVar("--text-secondary") || "rgba(240, 242, 250, 0.6)",
              font: { size: 11, weight: "500" },
            },
          },
          y: {
            beginAtZero: true,
            max: 100,
            grid: { color: getCssVar("--chart-grid") || "rgba(255,255,255,0.04)" },
            ticks: {
              color: getCssVar("--text-secondary") || "rgba(240, 242, 250, 0.5)",
              font: { size: 10 },
              stepSize: 25,
              callback: (v) => v + "%",
            },
            title: {
              display: true,
              text: "Habits",
              color: getCssVar("--text-muted") || "rgba(240, 242, 250, 0.4)",
              font: { size: 10 },
            },
          },
          y1: {
            position: "right",
            beginAtZero: true,
            max: 100,
            grid: { drawOnChartArea: false },
            ticks: {
              color: getCssVar("--accent-purple") || "rgba(108, 92, 231, 0.7)",
              font: { size: 10 },
              callback: (v) => v + "%",
            },
            title: {
              display: true,
              text: "Goal %",
              color: getCssVar("--accent-purple") || "rgba(108, 92, 231, 0.5)",
              font: { size: 10 },
            },
          },
        },
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: getCssVar("--text-secondary") || "rgba(240, 242, 250, 0.7)",
              font: { size: 11, weight: "500" },
              padding: 12,
              usePointStyle: true,
              pointStyleWidth: 8,
            },
          },
          tooltip: {
            backgroundColor: getCssVar("--chart-tooltip-bg") || "rgba(14, 19, 35, 0.95)",
            titleColor: getCssVar("--text-primary") || "#f0f2fa",
            bodyColor: getCssVar("--text-secondary") || "rgba(240, 242, 250, 0.8)",
            borderColor: getCssVar("--btn-secondary-border") || "rgba(255,255,255,0.08)",
            borderWidth: 1,
            cornerRadius: 10,
            padding: 10,
          },
        },
      },
    });
  }, [labels, days]);

  useEffect(() => {
    if (window.Chart) {
      renderChart();
    }
    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [renderChart]);

  const handleScriptLoad = useCallback(() => {
    renderChart();
  }, [renderChart]);

  return (
    <ChartCard>
      <ChartTitle>{title}</ChartTitle>
      <ChartDesc>{description}</ChartDesc>
      <CanvasWrap $aspect="2 / 1">
        <canvas ref={canvasRef} />
      </CanvasWrap>
      <Script
        src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js"
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      />
    </ChartCard>
  );
}

/* ==========================================================
   MAIN EXPORT
   ========================================================== */

export default function ReportsCharts({ weekStart, weekEnd }) {
  const { commitments } = useCommitments();
  const { goalCounts, habitCounts } = useCategoryData(commitments, weekStart, weekEnd);
  const days = useDailyProgress(commitments, weekStart, weekEnd);

  return (
    <ChartsSection>
      <ChartsRow>
        <PieChart
          counts={goalCounts}
          title="Goal Categories"
          description="Categories of goals created this week. Larger slices indicate more goals in that area."
        />
        <PieChart
          counts={habitCounts}
          title="Habit Categories"
          description="Categories of habits created this week. Shows which areas of life you are building routines in."
        />
      </ChartsRow>

      <ProgressChart
        days={days}
        title="Weekly Progress Overview"
        description="Habit completion rate per day this week (ideal, minimum, missed as % of total habits). The line shows goal action completion rate."
      />
    </ChartsSection>
  );
}
