"use client";

import styled from "styled-components";
import Link from "next/link";

/* ==========================================================
   CARD — mobile only, hidden on desktop
   ========================================================== */

export const Card = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    width: 100%;
    background: var(--card);
    border: 1px solid var(--card-border);
    border-radius: var(--radius-card);
    padding: 18px;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.25);
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

/* ==========================================================
   SUMMARY TEXT
   ========================================================== */

export const SummaryText = styled.p`
  font-size: 0.9rem;
  line-height: 1.65;
  color: var(--text-secondary);
  margin: 0;

  b {
    color: var(--text-primary);
    font-weight: 600;
  }
`;

export const SummaryLink = styled(Link)`
  color: var(--accent-blue);
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

/* ==========================================================
   EMPTY SLATE
   ========================================================== */

export const EmptySlate = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 36px 20px;
  text-align: center;
`;

export const EmptyIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
`;

export const EmptyTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
`;

export const EmptyDesc = styled.p`
  font-size: 0.82rem;
  color: var(--text-secondary);
  max-width: 260px;
`;
