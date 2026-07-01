import React from "react";
import "@/components/Progress/Progress.css";

export default function Progress() {
  return (
    <div>
      {" "}
      <div className="progress-section">
        {/* <!-- Circular Progress --> */}
        <div className="circular-progress-wrap">
          <svg width="76" height="76" viewBox="0 0 76 76">
            <circle
              cx="38"
              cy="38"
              r="31"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
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
          <div className="progress-sub">Keep going! You're doing great.</div>
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
    </div>
  );
}
