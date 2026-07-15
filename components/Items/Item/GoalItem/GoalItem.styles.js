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
} from "../shared/index";

// ---------- Override shared components with GoalItem-specific values ----------
export const Card = styled(BaseCard).attrs({ $gap: "18px" })``;

export const LeftSection = styled(BaseLeftSection).attrs({
  $minWidth: "0",
})``;

export const TitleSection = styled(BaseTitleSection).attrs({
  $gap: "6px",
  $minWidth: "0",
  $flex: "1",
})``;

export const Footer = styled(BaseFooter).attrs({
  $gap: "20px",
  $wrap: "wrap",
})``;

export const Actions = styled(BaseActions).attrs({
  $align: "center",
})``;

// ---------- Re-export identical components ----------
export { Header, CategoryIconWrapper, IconButton };

// ---------- UNIQUE components (only in GoalItem) ----------
export const Title = styled.h3`
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${({ $completed }) =>
      $completed &&
      css`
      text-decoration: line-through;
      opacity: 0.75;
    `}
`;

export const Reason = styled.p`
  color: var(--text-secondary);
  font-size: 0.93rem;
  line-height: 1.45;
`;

export const Checkbox = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: 2px solid ${({ $color }) => $color};
  background: ${({ $checked, $color }) =>
      $checked ? $color : "transparent"};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s ease;
  flex-shrink: 0;

  &:hover {
    transform: scale(1.08);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const CompletionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.035);
`;

export const CompletionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
  font-size: 0.82rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;

  svg {
    width: 15px;
    height: 15px;
  }
`;

export const CompletionText = styled.div`
  color: var(--text-primary);
  font-size: 0.97rem;
  line-height: 1.45;
`;

export const ChipGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  flex: 1;
`;

export const Chip = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  border-radius: 999px;
  background: ${({ $color }) => $color || "rgba(255,255,255,.06)"};
  color: white;
  font-size: 0.82rem;
  font-weight: 600;
  white-space: nowrap;

  svg {
    width: 14px;
    height: 14px;
  }
`;