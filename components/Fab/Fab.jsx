// Fab.jsx
"use client";
import React, { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "@/lib/i18n/localeContext";

export default function Fab({ givenMode, onLaunchCreator }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const t = useTranslation();

    const handleFabClick = () => {
        setIsExpanded(!isExpanded);
    };

    const handleOptionClick = (selectedMode) => {
        if (onLaunchCreator) {
            onLaunchCreator(selectedMode);
        }
        setIsExpanded(false);
    };

    return (
        <StyledWrapper className="fab-container">
            <button
                type="button"
                className={`fab ${isExpanded ? "fab-expanded" : ""}`}
                aria-label={isExpanded ? t('fab.close') : t('fab.open')}
                onClick={givenMode === "goal" || givenMode === "habit" ? () => handleOptionClick(givenMode) : handleFabClick}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    {!isExpanded ? (
                        <g fill="none">
                            <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                            <path fill="currentColor" d="M10.5 20a1.5 1.5 0 0 0 3 0v-6.5H20a1.5 1.5 0 0 0 0-3h-6.5V4a1.5 1.5 0 0 0-3 0v6.5H4a1.5 1.5 0 0 0 0 3h6.5z" />
                        </g>
                    ) : (
                        <g fill="none">
                            <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                            <path fill="currentColor" d="M12 13.414l5.657 5.657a1 1 0 0 0 1.414-1.414L13.414 12l5.657-5.657a1 1 0 0 0-1.414-1.414L12 10.586 6.343 4.929A1 1 0 0 0 4.93 6.343L10.586 12l-5.657 5.657a1 1 0 1 0 1.414 1.414L12 13.414z" />
                        </g>
                    )}
                </svg>
            </button>

            {isExpanded && (
                <button
                    type="button"
                    className="fab-option fab-option-left"
                    aria-label={t('fab.create_goal')}
                    onClick={() => handleOptionClick("goal")}
                >
                    <span>{t('fab.goal')}</span>
                </button>
            )}
            {isExpanded && (
                <button
                    type="button"
                    className="fab-option fab-option-top"
                    aria-label={t('fab.create_habit')}
                    onClick={() => handleOptionClick("habit")}
                >
                    <span>{t('fab.habit')}</span>
                </button>
            )}
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  /* Main FAB */
  .fab {
    position: fixed;
    bottom: calc(24px + env(safe-area-inset-bottom));
    right: clamp(16px, 4vw, 40px);
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-purple) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 8px 28px var(--fab-glow);
    z-index: 10;
    animation: fabPop 0.2s ease, glowPulse 2.5s infinite ease-in-out;
    border: none;
  }

  .fab:hover {
    transform: scale(1.05);
  }

  .fab svg {
    width: 80%;
    color: var(--text-on-accent);
    transition: 0.3s ease;
  }

  .fab-option {
    position: fixed;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-purple) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 8px 24px var(--fab-glow);
    z-index: 9;
    transition: all 0.2s ease;
    color: var(--text-on-accent);
    font-size: 14px;
    font-weight: 500;
    user-select: none;
    border: none;
  }

  .fab-option:hover {
    transform: scale(1.1);
    box-shadow: 0 8px 32px var(--fab-glow-pulse);
  }

  .fab-option-left {
    bottom: calc(24px + env(safe-area-inset-bottom));
    right: clamp(88px, 4vw + 72px, 112px);
    animation: slideLeft 1s ease forwards;
  }

  .fab-option-top {
    bottom: calc(96px + env(safe-area-inset-bottom));
    right: clamp(16px, 4vw, 40px);
    animation: slideTop 1s ease forwards;
  }

  @keyframes fabPop {
    0% { transform: scale(1); }
    40% { transform: scale(0.9); }
    70% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }

  @keyframes slideLeft {
    0% { opacity: 0; transform: scale(0.4); right: 0px; }
    100% { opacity: 1; transform: scale(1) translate(-16px, 0); right: clamp(88px, 4vw + 72px, 112px); }
  }

  @keyframes slideTop {
    0% { opacity: 0; transform: scale(0.4); bottom: 0; }
    100% { opacity: 1; transform: scale(1) translate(0, -16px); bottom: calc(96px + env(safe-area-inset-bottom)); }
  }

  @keyframes glowPulse {
    0% { box-shadow: 0 8px 28px var(--fab-glow); }
    50% { box-shadow: 0 8px 48px var(--fab-glow-pulse); }
    100% { box-shadow: 0 8px 28px var(--fab-glow); }
  }

  @media (max-width: 640px) {
    .fab {
      width: 52px;
      height: 52px;
    }

    .fab-option {
      width: 46px;
      height: 46px;
      font-size: 13px;
    }
  }
`;
