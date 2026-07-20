import React, { useState, useEffect } from "react";
import { useCommitments } from "@/lib/store/CommitmentContext";
import { clearAllCommitments } from "@/lib/services/commitmentService";
import { useTranslation } from "@/lib/i18n/localeContext";
import styled from "styled-components";

const GREETING_RANGES = [
  { from: 5, to: 12, key: 0 },
  { from: 12, to: 17, key: 1 },
  { from: 17, to: 21, key: 2 },
  { from: 21, to: 24, key: 3 },
  { from: 0, to: 5, key: 3 },
];

function getGreetingIndex() {
  const hour = new Date().getHours();
  const match = GREETING_RANGES.find((g) => hour >= g.from && hour < g.to);
  return match ? match.key : null;
}

export default function Header() {
  const t = useTranslation();
  const { commitments, dispatch, refresh } = useCommitments();
  const [greeting, setGreeting] = useState("");
  const [motivation, setMotivation] = useState("");

  useEffect(() => {
    const idx = getGreetingIndex();
    setGreeting(idx !== null ? t(`header.greeting.${idx}`) : t("header.greeting.fallback"));
    const motIdx = Math.floor(Math.random() * 10);
    setMotivation(t(`header.motivation.${motIdx}`));
  }, []);

  const handleClearAll = () => {
    if (!commitments.length) return;
    const confirmed = window.confirm(t("header.delete_all_confirm"));
    if (!confirmed) return;
    clearAllCommitments();
    dispatch({ type: "COMMITMENTS_LOADED", payload: [] });
  };

  return (
    <StyledWrapper>
      <header className="header">
        <div className="greeting-block">
          <div className="greeting-title">
            {greeting}, {t("header.achiever")} {"\u{1F44B}"}
          </div>
          <div className="greeting-sub">&quot;{motivation}&quot;</div>
        </div>
        <div className="header-actions">
          <button
            type="button"
            className="icon-btn delete-btn"
            onClick={handleClearAll}
            aria-label={t("header.delete_all_label")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M6.187 8h11.625l-.695 11.125A2 2 0 0 1 15.121 21H8.879a2 2 0 0 1-1.996-1.875zM19 5v2H5V5h3V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1zm-9 0h4V4h-4z"
              />
            </svg>
          </button>
        </div>
      </header>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .greeting-block .greeting-title {
    font-size: 32px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.6px;
    margin-bottom: 6px;
  }

  .greeting-block .greeting-sub {
    font-size: 13px;
    color: var(--text-secondary);
    font-style: italic;
  }

  .header-actions {
    display: flex;
    gap: 10px;
    align-items: center;
    padding-top: 4px;
  }

  .icon-btn {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: var(--btn-secondary-bg);
    border: 1px solid var(--btn-secondary-border);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--text-secondary);
    backdrop-filter: blur(8px);
    box-shadow: var(--card-shadow);
    border: none;
    transition: background 0.15s, color 0.15s;
  }

  .icon-btn:hover {
    color: var(--text-primary);
  }

  .delete-btn:hover {
    color: var(--accent-red);
  }

  .icon-btn svg {
    width: 1rem;
    height: 1rem;
  }

  @media (max-width: 768px) {
    .header {
      flex-direction: column;
      gap: 14px;
      margin-bottom: 18px;
    }

    .greeting-block .greeting-title {
      font-size: 24px;
    }

    .header-actions {
      width: 100%;
      justify-content: flex-start;
      padding-top: 0;
    }
  }
`;
