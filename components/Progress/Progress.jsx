"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useCommitments } from "@/lib/store/CommitmentContext";
import { getTodayStatus } from "@/components/Items/Item/HabitItem/helpers";
import { useTranslation } from "@/lib/i18n/localeContext";
import styled from "styled-components";

const CIRCUMFERENCE = 2 * Math.PI * 31;

function computeProgress(commitments) {
  if (!commitments.length) return { total: 0, done: 0, pct: 0 };

  const total = commitments.length;
  const done = commitments.filter((c) => {
    if (c.type === "goal") {
      return c.completed === true;
    }
    if (c.type === "habit") {
      const st = getTodayStatus(c.completions || []);
      return st === "completed" || st === "minimum";
    }
    return false;
  }).length;

  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return { total, done, pct };
}

export default function Progress() {
  const t = useTranslation();
  const { commitments } = useCommitments();
  const { total, done, pct } = useMemo(
    () => computeProgress(commitments),
    [commitments]
  );

  const offset = CIRCUMFERENCE * (1 - pct / 100);

  const message =
    pct === 100
      ? t('progress.all_done')
      : pct >= 50
      ? t('progress.keep_going')
      : pct > 0
      ? t('progress.good_start')
      : t('progress.time_to_move');

  return (
    <StyledWrapper>
      <div className="progress-section">
        {/* Circular Progress */}
        <div className="circular-progress-wrap">
          <svg width="76" height="76" viewBox="0 0 76 76">
            <circle
              cx="38"
              cy="38"
              r="31"
              fill="none"
              stroke="var(--track-bg)"
              strokeWidth="7"
            />
            <circle
              cx="38"
              cy="38"
              r="31"
              fill="none"
              stroke="url(#prog-gradient)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
            />
            <defs>
              <linearGradient
                id="prog-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#4F8DFF" />
                <stop offset="100%" stopColor="#7B61FF" />
              </linearGradient>
            </defs>
          </svg>
          <div className="circular-label">{pct}%</div>
        </div>

        {/* Bar Progress */}
        <div className="progress-center">
          <div className="progress-title">{t('progress.title')}</div>
          <div className="progress-sub">{message}</div>
          <div className="progress-bar-wrap">
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="progress-count">
              {done} / {total}
            </div>
          </div>
        </div>

        {/* Analytics button */}
        <Link href="/reports" className="analytics-btn">
          <span>{t('progress.view_reports')}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .progress-section {
    background: var(--card);
    border-radius: var(--radius-card);
    border: 1px solid var(--card-border);
    display: flex;
    align-items: center;
    gap: 32px;
    padding: 18px 28px;
    box-shadow: var(--card-shadow);
    width: 100%;
  }

  .circular-progress-wrap {
    position: relative;
    width: 76px;
    height: 76px;
    flex-shrink: 0;
  }

  .circular-progress-wrap svg {
    transform: rotate(-90deg);
  }

  .circular-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 15px;
    font-weight: 700;
    color: var(--text-primary);
  }

  .progress-center {
    flex: 1;
    min-width: 0;
  }

  .progress-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 3px;
  }

  .progress-sub {
    font-size: 12px;
    color: var(--text-primary);
    margin-bottom: 10px;
  }

  .progress-bar-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .progress-bar-track {
    flex: 1;
    height: 7px;
    background: var(--track-bg);
    border-radius: 50px;
    overflow: hidden;
  }

  .progress-bar-fill {
    height: 100%;
    border-radius: 50px;
    background: linear-gradient(90deg, var(--accent-blue), var(--accent-purple));
    transition: width 0.4s ease;
  }

  .progress-count {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
  }

  .analytics-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 11px 20px;
    background: var(--btn-secondary-bg);
    border: 1px solid var(--btn-secondary-border);
    border-radius: var(--radius-card);
    color: var(--text-primary);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
    text-decoration: none;
    transition: background 0.15s, color 0.15s;

    &:hover {
      background: var(--accent-purple);
      color: var(--text-on-accent);
    }
  }

  @media (max-width: 768px) {
    .progress-section {
      flex-wrap: wrap;
      gap: 18px;
      padding: 16px 18px;
    }

    .progress-bar-wrap {
      flex-wrap: wrap;
    }

    .analytics-btn {
      width: 100%;
      justify-content: center;
    }
  }
`;
