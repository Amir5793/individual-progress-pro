"use client";

import styled from "styled-components";

/* ==========================================================
   PAGE WRAPPER
   ========================================================== */

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

/* ==========================================================
   WEEK NAVIGATION
   ========================================================== */

export const NavBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--card);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-card);
  padding: 10px 16px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.25);
  margin-bottom: 20px;
`;

export const NavBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  border: none;
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-secondary);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-primary);
  }
`;

export const WeekLabel = styled.span`
  flex: 1;
  text-align: center;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
`;

export const TodayBtn = styled.button`
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  border: none;
  background: rgba(123, 97, 255, 0.15);
  color: var(--accent-purple);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  flex-shrink: 0;

  &:hover {
    background: rgba(123, 97, 255, 0.25);
  }
`;

/* ==========================================================
   WEEK HEADER (status + actions)
   ========================================================== */

export const HeaderBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  border-radius: var(--radius-pill);
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: capitalize;
  background: ${({ $variant }) => {
    switch ($variant) {
      case "published":
        return "rgba(46, 212, 122, 0.15)";
      case "draft":
        return "rgba(244, 197, 66, 0.15)";
      case "pending-approval":
        return "rgba(79, 141, 255, 0.15)";
      default:
        return "rgba(255, 255, 255, 0.06)";
    }
  }};
  color: ${({ $variant }) => {
    switch ($variant) {
      case "published":
        return "var(--accent-green)";
      case "draft":
        return "var(--accent-yellow)";
      case "pending-approval":
        return "var(--accent-blue)";
      default:
        return "var(--text-secondary)";
    }
  }};
`;

export const ActionRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const ActionBtn = styled.button`
  padding: 8px 16px;
  border-radius: var(--radius-pill);
  border: none;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;

  background: ${({ $primary }) =>
    $primary ? "var(--accent-purple)" : "rgba(255, 255, 255, 0.06)"};
  color: ${({ $primary }) =>
    $primary ? "#fff" : "var(--text-secondary)"};

  &:hover {
    background: ${({ $primary }) =>
      $primary ? "rgba(123, 97, 255, 0.85)" : "rgba(255, 255, 255, 0.1)"};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

/* ==========================================================
   ITEM LIST
   ========================================================== */

export const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

/* ==========================================================
   REPORT ITEM
   ========================================================== */

export const ItemCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--card);
  border: 1px solid var(--card-border);
  border-radius: 14px;
  padding: 14px 16px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.15);
  transition: border-color 0.15s;

  &:hover {
    border-color: rgba(255, 255, 255, 0.12);
  }
`;

export const CategoryDot = styled.span`
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: ${({ $color }) => $color || "var(--text-muted)"}20;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${({ $color }) => $color || "var(--text-muted)"};
`;

export const ItemTitle = styled.span`
  flex: 1;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary);
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: var(--radius-pill);
  font-size: 0.72rem;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;

  background: ${({ $variant }) => {
    switch ($variant) {
      case "done":
        return "rgba(46, 212, 122, 0.12)";
      case "pending":
        return "rgba(255, 255, 255, 0.06)";
      case "minimum":
        return "rgba(244, 197, 66, 0.12)";
      case "failed":
        return "rgba(255, 92, 112, 0.12)";
      case "streak":
        return "rgba(244, 197, 66, 0.12)";
      default:
        return "rgba(255, 255, 255, 0.06)";
    }
  }};
  color: ${({ $variant }) => {
    switch ($variant) {
      case "done":
        return "var(--accent-green)";
      case "pending":
        return "var(--text-secondary)";
      case "minimum":
        return "var(--accent-yellow)";
      case "failed":
        return "var(--accent-red)";
      case "streak":
        return "var(--accent-yellow)";
      default:
        return "var(--text-muted)";
    }
  }};
`;

/* ==========================================================
   EMPTY STATE
   ========================================================== */

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 48px 20px;
  text-align: center;
  border: 2px dashed rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-card);
  background: rgba(255, 255, 255, 0.02);
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
  max-width: 300px;
`;

/* ==========================================================
   CONFIRM DIALOG
   ========================================================== */

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

export const DialogCard = styled.div`
  background: var(--card);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-card);
  padding: 24px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
`;

export const DialogTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
`;

export const DialogText = styled.p`
  font-size: 0.88rem;
  color: var(--text-secondary);
  margin-bottom: 20px;
  line-height: 1.5;
`;

export const DialogActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

export const DialogBtn = styled.button`
  padding: 8px 18px;
  border-radius: var(--radius-pill);
  border: none;
  font-size: 0.84rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;

  background: ${({ $variant }) => {
    switch ($variant) {
      case "save":
        return "var(--accent-purple)";
      case "danger":
        return "rgba(255, 92, 112, 0.15)";
      default:
        return "rgba(255, 255, 255, 0.06)";
    }
  }};
  color: ${({ $variant }) => {
    switch ($variant) {
      case "save":
        return "#fff";
      case "danger":
        return "var(--accent-red)";
      default:
        return "var(--text-secondary)";
    }
  }};

  &:hover {
    opacity: 0.85;
  }
`;

/* ==========================================================
   TOAST
   ========================================================== */

export const Toast = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 12px 20px;
  border-radius: var(--radius-pill);
  font-size: 0.84rem;
  font-weight: 600;
  z-index: 1100;
  animation: toastIn 0.3s ease, toastOut 0.3s ease 2.7s forwards;
  background: ${({ $variant }) =>
    $variant === "error" ? "rgba(255, 92, 112, 0.9)" : "rgba(46, 212, 122, 0.9)"};
  color: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);

  @keyframes toastIn {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes toastOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;
