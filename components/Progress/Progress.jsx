import React from "react";
import styled from "styled-components";

export default function Progress() {
  return (
    <StyledWrapper>
      <div className="progress-section">
        {/* <!-- Circular Progress --> */}
        <div className="circular-progress-wrap">
          <svg width="76" height="76" viewBox="0 0 76 76">
            <circle
              cx="38"
              cy="38"
              r="31"
              fill="none"
              stroke="var(--track-bg)"
              strokeWidth="7"
            ></circle>
            <circle
              cx="38"
              cy="38"
              r="31"
              fill="none"
              stroke="url(#prog-gradient)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray="194.8"
              strokeDashoffset="54.5"
            ></circle>
            <defs>
              <linearGradient
                id="prog-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#4F8DFF"></stop>
                <stop offset="100%" stopColor="#7B61FF"></stop>
              </linearGradient>
            </defs>
          </svg>
          <div className="circular-label">72%</div>
        </div>

        {/* <!-- Bar Progress --> */}
        <div className="progress-center">
          <div className="progress-title">Weekly Progress</div>
          <div className="progress-sub">Keep going! You&apos;re doing great.</div>
          <div className="progress-bar-wrap">
            <div className="progress-bar-track">
              <div className="progress-bar-fill"></div>
            </div>
            <div className="progress-count">13 / 18</div>
          </div>
        </div>

        {/* <!-- Analytics button --> */}
        <div className="analytics-btn" data-media-type="banani-button">
          <div>
            <button icon="lucide:bar-chart-3"></button>
          </div>
          View Analytics
          <div>
            <button icon="lucide:arrow-right"></button>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .progress-section {
    background: var(--card);
    border-radius: var(--radius-card);
    border: 1px solid var(--card-border);
    display: flex;
    align-items: center;
    gap: 32px;
    padding: 18px 28px;
    box-shadow: var(--card-shadow);
    width: 100%;
  }

  .circular-progress-wrap {
    position: relative;
    width: 76px;
    height: 76px;
    flex-shrink: 0;
  }

  .circular-progress-wrap svg {
    transform: rotate(-90deg);
  }

  .circular-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 15px;
    font-weight: 700;
    color: var(--text-primary);
  }

  .progress-center {
    flex: 1;
    min-width: 0;
  }

  .progress-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 3px;
  }

  .progress-sub {
    font-size: 12px;
    color: var(--text-primary);
    margin-bottom: 10px;
  }

  .progress-bar-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .progress-bar-track {
    flex: 1;
    height: 7px;
    background: var(--track-bg);
    border-radius: 50px;
    overflow: hidden;
  }

  .progress-bar-fill {
    height: 100%;
    border-radius: 50px;
    background: linear-gradient(90deg, var(--accent-blue), var(--accent-purple));
    width: 72%;
  }

  .progress-count {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
  }

  .analytics-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 11px 20px;
    background: var(--btn-secondary-bg);
    border: 1px solid var(--btn-secondary-border);
    border-radius: var(--radius-card);
    color: var(--text-primary);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    .progress-section {
      flex-wrap: wrap;
      gap: 18px;
      padding: 16px 18px;
    }

    .progress-bar-wrap {
      flex-wrap: wrap;
    }

    .analytics-btn {
      width: 100%;
      justify-content: center;
    }
  }
`;
