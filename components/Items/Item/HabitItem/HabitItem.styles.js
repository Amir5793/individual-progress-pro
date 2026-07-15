"use client";

import styled, { css } from "styled-components";

// ---------- Import shared base components ----------
import {
    Card as BaseCard,
    LeftSection as BaseLeftSection,
    TitleSection as BaseTitleSection,
    Footer as BaseFooter,
    Actions as BaseActions,
    Header,
    CategoryIconWrapper,
    IconButton,
} from "../shared";

// ---------- Override shared components with HabitItem-specific values ----------
export const Card = styled(BaseCard).attrs({ $gap: "20px" })``;

export const LeftSection = styled(BaseLeftSection).attrs({
    $minWidth: "auto",
})``;

export const TitleSection = styled(BaseTitleSection).attrs({
    $gap: "5px",
})``;

export const Footer = styled(BaseFooter).attrs({
    $gap: "0",
    $wrap: "nowrap",
})``;

export const Actions = styled(BaseActions).attrs({
    $align: "stretch",
})``;

// ---------- Re-export identical components ----------
export { Header, CategoryIconWrapper, IconButton };

// ---------- UNIQUE components (only in HabitItem) ----------
export const Identity = styled.div`
  color: var(--text-secondary);
  font-size: 0.88rem;
  font-weight: 500;
`;

export const HabitName = styled.h3`
  color: var(--text-primary);
  font-size: 1.15rem;
  font-weight: 700;
`;

export const StatusButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 10px 16px;

  border-radius: 999px;

  border: none;

  cursor: pointer;

  font-weight: 600;

  transition: 0.18s ease;

  color: white;

  ${({ $status, $color }) => {
    switch ($status) {
        case "completed":
            return css`
          background: ${$color};
        `;
        case "progress":
            return css`
          background: rgba(255, 255, 255, 0.08);
          border: 2px solid ${$color};
        `;
        default:
            return css`
          background: transparent;
          border: 2px solid ${$color};
        `;
    }
}}

  &:hover {
    transform: scale(1.03);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const ActionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SectionLabel = styled.div`
  color: var(--text-muted);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const ActionText = styled.div`
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 500;
`;

export const Targets = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

export const TargetItem = styled.div`
  padding: 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const TrackerSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const TrackerRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
`;

export const TrackerDay = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.78rem;
  font-weight: 700;
  transition: 0.18s ease;

  ${({ $state, $color }) => {
    switch ($state) {
        case "completed":
            return css`
          background: ${$color};
          color: white;
        `;
        case "progress":
            return css`
          border: 2px solid ${$color};
          background: rgba(255, 255, 255, 0.05);
          color: white;
        `;
        default:
            return css`
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-muted);
        `;
    }
}}
`;

export const Consistency = styled.div`
  color: var(--text-secondary);
  font-weight: 600;
`;