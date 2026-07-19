"use client";

import styled from "styled-components";

/* ==========================================================
   CHARTS SECTION
   ========================================================== */

export const ChartsSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

export const ChartsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

/* ==========================================================
   CHART CARD
   ========================================================== */

export const ChartCard = styled.div`
  background: var(--card);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-card);
  padding: 20px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ChartTitle = styled.h3`
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
`;

export const ChartDesc = styled.p`
  font-size: 0.78rem;
  color: var(--text-secondary);
  margin: 0 0 8px 0;
  line-height: 1.45;
`;

export const CanvasWrap = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: ${({ $aspect }) => $aspect || "16 / 9"};
  min-height: 220px;

  canvas {
    width: 100% !important;
    height: 100% !important;
  }
`;

export const EmptyChart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 180px;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.82rem;
`;
