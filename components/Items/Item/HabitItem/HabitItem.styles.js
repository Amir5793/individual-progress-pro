"use client";

import styled, { css } from "styled-components";

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

export const Card = styled(BaseCard).attrs({ $gap: "16px" })`
  @media (max-width: 640px) {
    padding: 14px;
  }
`;

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
})`
  gap: 4px;
`;

export { Header, CategoryIconWrapper, IconButton };

export const Identity = styled.div`
  color: var(--text-secondary);
  font-size: 0.88rem;
  font-weight: 500;
  font-style: italic;
`;

export const HabitName = styled.h3`
  color: var(--text-primary);
  font-size: 1.15rem;
  font-weight: 700;
`;

/* ---------------------------------------------------------- */
/* THREE-TIER STATUS BUTTONS                                   */
/* ---------------------------------------------------------- */

export const StatusButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

export const StatusButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 8px;
  border-radius: 10px;
  border: 1.5px solid transparent;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.82rem;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-muted);

  @media (max-width: 480px) {
    padding: 8px 4px;
    font-size: 0.75rem;
  }

  .status-icon {
    font-size: 0.9rem;
    font-weight: 800;
  }

  /* --- FAILED variant --- */
  ${({ $variant, $active }) => $variant === "failed" && css`
    ${$active ? css`
      background: rgba(244, 63, 94, 0.12);
      border-color: rgba(244, 63, 94, 0.4);
      color: var(--accent-red, #f43f5e);
      box-shadow: 0 0 12px rgba(244, 63, 94, 0.1);
    ` : css`
      &:hover {
        background: rgba(244, 63, 94, 0.06);
        border-color: rgba(244, 63, 94, 0.15);
        color: var(--accent-red, #f43f5e);
      }
    `}
  `}

  /* --- MINIMUM variant --- */
  ${({ $variant, $active }) => $variant === "minimum" && css`
    ${$active ? css`
      background: rgba(245, 158, 11, 0.12);
      border-color: rgba(245, 158, 11, 0.4);
      color: #f59e0b;
      box-shadow: 0 0 12px rgba(245, 158, 11, 0.1);
    ` : css`
      &:hover {
        background: rgba(245, 158, 11, 0.06);
        border-color: rgba(245, 158, 11, 0.15);
        color: #f59e0b;
      }
    `}
  `}

  /* --- IDEAL variant --- */
  ${({ $variant, $active }) => $variant === "ideal" && css`
    ${$active ? css`
      background: rgba(16, 185, 129, 0.12);
      border-color: rgba(16, 185, 129, 0.4);
      color: #10b981;
      box-shadow: 0 0 12px rgba(16, 185, 129, 0.1);
    ` : css`
      &:hover {
        background: rgba(16, 185, 129, 0.06);
        border-color: rgba(16, 185, 129, 0.15);
        color: #10b981;
      }
    `}
  `}

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.97);
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

/* ---------------------------------------------------------- */
/* STREAK BADGE                                                */
/* ---------------------------------------------------------- */

export const StreakBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 999px;
  background: ${({ $color }) => $color}22;
  color: ${({ $color }) => $color};
  font-size: 0.85rem;
  font-weight: 700;
  align-self: flex-start;

  svg {
    width: 16px;
    height: 16px;
  }
`;

/* ---------------------------------------------------------- */
/* CONTEXT SECTION (TRIGGER + FALLBACK)                        */
/* ---------------------------------------------------------- */

export const ContextSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ContextRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.04);

  ${({ $variant }) => $variant === "fallback" && css`
    background: rgba(244, 63, 94, 0.03);
    border-color: rgba(244, 63, 94, 0.08);
  `}
`;

export const ContextLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  svg {
    width: 13px;
    height: 13px;
  }
`;

export const ContextText = styled.div`
  color: var(--text-primary);
  font-size: 0.92rem;
  font-weight: 500;
`;

/* ---------------------------------------------------------- */
/* TARGETS (MINIMUM + IDEAL)                                   */
/* ---------------------------------------------------------- */

export const Targets = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const TargetItem = styled.div`
  padding: 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.04);
  display: flex;
  flex-direction: column;
  gap: 8px;

  ${({ $variant }) => $variant === "minimum" && css`
    border-left: 3px solid rgba(245, 158, 11, 0.4);
  `}

  ${({ $variant }) => $variant === "ideal" && css`
    border-left: 3px solid rgba(16, 185, 129, 0.4);
  `}
`;

export const TargetBadge = styled.span`
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  padding: 2px 8px;
  border-radius: 4px;
  width: fit-content;

  ${({ $variant }) => $variant === "minimum" && css`
    background: rgba(245, 158, 11, 0.1);
    color: #f59e0b;
    border: 1px solid rgba(245, 158, 11, 0.2);
  `}

  ${({ $variant }) => $variant === "ideal" && css`
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
    border: 1px solid rgba(16, 185, 129, 0.2);
  `}
`;

export const ActionText = styled.div`
  color: var(--text-primary);
  font-size: 0.92rem;
  font-weight: 500;
`;

/* ---------------------------------------------------------- */
/* WEEK TRACKER                                                */
/* ---------------------------------------------------------- */

export const TrackerSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const TrackerRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 6px;
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

  @media (max-width: 480px) {
    width: 30px;
    height: 30px;
    font-size: 0.72rem;
  }

  ${({ $state, $color }) => {
    switch ($state) {
        case "completed":
            return css`
          background: ${$color};
          color: white;
          box-shadow: 0 0 8px ${$color}44;
        `;
        case "minimum":
            return css`
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
          border: 1.5px solid rgba(245, 158, 11, 0.4);
        `;
        case "failed":
            return css`
          background: rgba(244, 63, 94, 0.1);
          color: var(--accent-red, #f43f5e);
          border: 1.5px solid rgba(244, 63, 94, 0.2);
        `;
        default:
            return css`
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-muted);
        `;
    }
}}
`;

/* ---------------------------------------------------------- */
/* FOOTER                                                      */
/* ---------------------------------------------------------- */

export const Consistency = styled.div`
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.88rem;

  .stats-detail {
    color: var(--text-muted);
    font-weight: 400;
    font-size: 0.82rem;
  }
`;

export const ActionButton = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: ${({ $color }) => $color || "var(--text-secondary)"};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.15s ease;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    transform: scale(1.1);
  }

  &[data-tooltip]:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    padding: 4px 10px;
    border-radius: 6px;
    background: rgba(0, 0, 0, 0.85);
    color: white;
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
    pointer-events: none;
    z-index: 10;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;
