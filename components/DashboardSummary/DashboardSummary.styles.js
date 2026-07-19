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
    box-shadow: var(--card-shadow);
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
  background: var(--subtle-bg);
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

/* ==========================================================
   CTA BUTTONS
   ========================================================== */

export const CtaRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 6px;
`;

export const CtaButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: var(--radius-pill);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const PrimaryCta = styled(CtaButton)`
  background: linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-purple) 100%);
  color: var(--text-on-accent);
  box-shadow: 0 4px 16px var(--fab-glow);

  &:hover {
    box-shadow: 0 6px 24px var(--fab-glow-pulse);
  }
`;

export const SecondaryCta = styled(CtaButton)`
  background: var(--btn-secondary-bg);
  color: var(--text-primary);
  border: 1px solid var(--btn-secondary-border);

  &:hover {
    background: var(--btn-secondary-hover);
  }
`;

/* ==========================================================
   WELCOME OVERLAY
   ========================================================== */

export const WelcomeOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--overlay-bg);
  backdrop-filter: blur(6px);
  animation: fadeIn 0.3s ease;
`;

export const WelcomeCard = styled.div`
  background: var(--card);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-card);
  padding: 36px 32px;
  max-width: 380px;
  width: 90%;
  text-align: center;
  box-shadow: var(--modal-shadow);
  animation: slideUp 0.35s ease;
`;

export const WelcomeTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
`;

export const WelcomeDesc = styled.p`
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 24px;
`;

export const WelcomeActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

/* ==========================================================
   PROGRESS CHECKLIST
   ========================================================== */

export const Checklist = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
  width: 100%;
`;

export const ChecklistItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.82rem;
  color: ${({ $done }) => ($done ? "var(--text-muted)" : "var(--text-secondary)")};
  text-decoration: ${({ $done }) => ($done ? "line-through" : "none")};
`;

export const CheckCircle = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${({ $done }) => ($done ? "var(--accent-green)" : "var(--interactive-border)")};
  background: ${({ $done }) => ($done ? "var(--accent-green)" : "transparent")};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--text-on-accent);
  font-size: 11px;
`;

/* ==========================================================
   HELP ICON / QUICK-START
   ========================================================== */

export const HelpButton = styled.button`
  position: fixed;
  bottom: calc(88px + env(safe-area-inset-bottom));
  right: clamp(16px, 4vw, 40px);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--btn-secondary-bg);
  border: 1px solid var(--btn-secondary-border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-secondary);
  z-index: 9;
  transition: background 0.15s, color 0.15s;
  backdrop-filter: blur(8px);

  &:hover {
    color: var(--text-primary);
    background: var(--btn-secondary-hover);
  }

  @media (max-width: 768px) {
    bottom: calc(80px + env(safe-area-inset-bottom));
    width: 36px;
    height: 36px;
  }
`;

export const QuickStartOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 110;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--overlay-bg);
  backdrop-filter: blur(6px);
  animation: fadeIn 0.2s ease;
`;

export const QuickStartCard = styled.div`
  background: var(--card);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-card);
  padding: 32px 28px;
  max-width: 420px;
  width: 92%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: var(--modal-shadow);
  animation: slideUp 0.3s ease;
`;

export const QuickStartTitle = styled.h2`
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
`;

export const QuickStartStep = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const StepNumber = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-purple) 100%);
  color: var(--text-on-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
`;

export const StepContent = styled.div`
  flex: 1;
`;

export const StepLabel = styled.div`
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
`;

export const StepDesc = styled.div`
  font-size: 0.78rem;
  color: var(--text-secondary);
  line-height: 1.5;
`;

/* ==========================================================
   ANIMATIONS
   ========================================================== */

export const GlobalKeyframes = styled.div`
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
