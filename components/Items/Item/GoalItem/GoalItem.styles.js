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
} from "../shared/index";

export const Card = styled(BaseCard).attrs({ $gap: "18px" })`
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--card-shadow-hover);
  }

  @media (max-width: 640px) {
    padding: 14px;
  }
`;

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
})`
  gap: 4px;
`;

export { Header, CategoryIconWrapper, IconButton };

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
        opacity: 0.6;
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
  color: var(--text-on-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  flex-shrink: 0;

  &:hover {
    transform: scale(1.08);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  border-radius: 4px;
  background: var(--track-bg);
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  height: 100%;
  border-radius: 4px;
  width: ${({ $pct }) => $pct}%;
  background: ${({ $color }) => $color};
  transition: width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
`;

export const CompletionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border-radius: 14px;
  background: var(--subtle-bg);
  border: 1px solid var(--card-border);
`;

export const CompletionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;

  svg {
    width: 15px;
    height: 15px;
  }
`;

export const CompletionText = styled.div`
  color: var(--text-primary);
  font-size: 0.94rem;
  line-height: 1.45;
`;

export const ChipGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  flex: 1;

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

export const Chip = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  background: ${({ $color }) => $color || "var(--subtle-bg)"};
  color: var(--text-primary);
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  border: 1px solid var(--card-border);

  svg {
    width: 14px;
    height: 14px;
  }

  @media (max-width: 480px) {
    padding: 4px 8px;
    font-size: 0.75rem;
  }
`;

export const ActionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  .all-actions-done-teaser {
    font-size: 0.85rem;
    color: var(--accent-green, #2ed47a);
    padding: 8px 12px;
    background: var(--subtle-bg);
    border-radius: 10px;
    text-align: center;
  }
`;

export const NextStepLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  color: ${({ $color }) => $color || "var(--accent-purple)"};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: -2px;
  color: ${({ $color }) => $color || "var(--accent-purple)"};
`;

export const ActionItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  background: var(--subtle-bg);
  border: 1px solid var(--card-border);
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: var(--subtle-bg-hover);
    border-color: var(--interactive-border);

    .check-action-subtle {
      opacity: 1 !important;
      color: var(--text-primary) !important;
    }
  }

  &:active {
    transform: scale(0.995);
  }
`;

export const ActionDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $completed, $color }) =>
      $completed ? $color : "rgba(255,255,255,0.15)"};
  flex-shrink: 0;
  transition: 0.2s ease;
  box-shadow: 0 0 8px ${({ $completed, $color }) =>
      $completed ? $color : "transparent"};
`;

export const ActionContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
`;

export const ActionItemTitle = styled.div`
  color: var(--text-primary);
  font-size: 0.93rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${({ $completed }) =>
      $completed &&
      css`
      text-decoration: line-through;
      opacity: 0.65;
    `}
`;

export const ActionItemMeta = styled.div`
  color: var(--text-muted);
  font-size: 0.78rem;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const ActionDuration = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
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
    background: var(--btn-secondary-bg);
    transform: scale(1.08);
  }

  &[data-tooltip]:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    padding: 6px 10px;
    border-radius: 6px;
    background: var(--tooltip-bg);
    border: 1px solid var(--btn-secondary-border);
    color: var(--text-primary);
    font-size: 0.7rem;
    font-weight: 500;
    white-space: nowrap;
    pointer-events: none;
    z-index: 10;
    box-shadow: var(--tooltip-shadow);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;
/* Append these exports to GoalItem.styles.js */


export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: var(--overlay-bg);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1.5rem;
  animation: overlayFadeIn 0.25s ease-out;

  @keyframes overlayFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export const ModalCard = styled.div`
  background: var(--card);
  border: 1px solid var(--card-border);
  border-radius: 20px;
  padding: 1.75rem;
  width: 100%;
  max-width: 520px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: var(--modal-shadow);
  animation: cardSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  @media (max-width: 480px) {
    padding: 1.25rem;
    max-width: 100%;
    max-height: 90vh;
    border-radius: 16px;
  }

  @keyframes cardSlideUp {
    from { transform: scale(0.96) translateY(16px); opacity: 0; }
    to { transform: scale(1) translateY(0); opacity: 1; }
  }
  
  .confirm-close-btn {
    background: var(--btn-secondary-bg);
    border: 1px solid var(--btn-secondary-border);
    color: var(--text-primary);
    padding: 0.75rem;
    border-radius: 10px;
    font-weight: 600;
    font-size: 0.85rem;
    cursor: pointer;
    width: 100%;
    transition: background 0.2s;
    
    &:hover {
      background: var(--btn-secondary-hover);
    }
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--card-border);
  padding-bottom: 0.75rem;
`;

export const ModalHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
`;

export const ModalTitle = styled.h4`
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
`;

export const ModalTeaser = styled.p`
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 4px 0 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CloseXBtn = styled.button`
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 1.1rem;
  padding: 4px;
  line-height: 1;
  
  &:hover {
    color: var(--accent-red);
  }
`;

export const ModalBodyScroll = styled.div`
  overflow-y: auto;
  flex: 1;
  padding-right: 0.25rem;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--scrollbar-thumb);
    border-radius: 99px;
  }
`;

export const ModalFooterButtons = styled.div`
  border-top: 1px solid var(--card-border);
  padding-top: 0.75rem;
`;

export const PriorityAlertBanner = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: rgba(255, 92, 112, 0.05);
  border: 1px solid rgba(255, 92, 112, 0.15);
  border-radius: 12px;
  padding: 12px;
  color: var(--accent-red, #ff5c70);
  font-size: 0.8rem;
  
  strong {
    display: block;
    font-weight: 600;
  }
  p {
    margin: 2px 0 0 0;
    opacity: 0.8;
  }
`;