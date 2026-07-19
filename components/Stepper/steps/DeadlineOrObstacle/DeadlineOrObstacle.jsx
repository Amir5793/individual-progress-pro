import {Input} from "@/components/fundamentals/Input/Input";
import {CheckBox} from "@/components/fundamentals/CheckBox/CheckBox";
import DatePicker from "@/components/Calendar/DatePicker";
import {Step} from "@/components/Stepper/Stepper";
import React, {useState} from "react";
import styled from "styled-components";

const HABIT_BARRIER_SUGGESTIONS = [
    "Fatigue after work",
    "Unexpected distractions",
    "Lack of motivation",
    "Forgotten cue",
    "Feeling overwhelmed"
];

export const DeadlineOrObstacle = ({
                                       mode, deadline, showCalendar,
                                       handleTimeSelection, handleDatePick,
                                       obstacle, fallbackPlan,
                                       handleFieldChange, errors
                                   }) => {
    const [obstacleSubStep, setObstacleSubStep] = useState(1);

    if (mode === "habit") {
        return (
            <StyledWrapper>
                <Step>
                    <div className="step-header">
                        <h1>Safeguard your habit.</h1>
                        <p className="obstacle-subtitle">
                            Habits break when friction appears unprepared. Let&apos;s build a safety net so you never lose momentum.
                        </p>
                    </div>

                    <div className="obstacles-framework sub-stepper-viewport">
                        {obstacleSubStep === 1 && (
                            <div className="condition-node if-node animate-slideIn">
                                <div className="node-edge-badge error-badge">IF</div>
                                <div className="node-content">
                                    <h2 className="section-label">I face this obstacle (optional)</h2>
                                    <Input
                                        autoFocus
                                        placeholder="e.g. Too tired after work, forgot to do it..."
                                        value={obstacle}
                                        onValueChange={(val) => handleFieldChange("obstacle", val)}
                                    />
                                    {errors.obstacle && <div className="error-message-banner">{errors.obstacle}</div>}

                                    <div className="suggestions-wrapper">
                                        <span className="suggestions-label">Common barriers:</span>
                                        <div className="suggestions-chips-group">
                                            {HABIT_BARRIER_SUGGESTIONS.map((suggestion) => (
                                                <button
                                                    key={suggestion}
                                                    type="button"
                                                    className={`suggestion-chip ${obstacle === suggestion ? 'active' : ''}`}
                                                    onClick={() => handleFieldChange("obstacle", suggestion)}
                                                >
                                                    {suggestion}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="sub-navigation-trigger"
                                        onClick={() => setObstacleSubStep(2)}
                                    >
                                        Define Backup Response ➔
                                    </button>
                                </div>
                            </div>
                        )}

                        {obstacleSubStep === 2 && (
                            <div className="condition-node then-node animate-slideIn">
                                <div className="node-edge-badge success-badge">THEN</div>
                                <div className="node-content">
                                    <h2 className="section-label">I will do this instead (optional)</h2>
                                    <Input
                                        autoFocus
                                        placeholder="e.g. I will do just 2 minutes of the habit"
                                        value={fallbackPlan}
                                        onValueChange={(val) => handleFieldChange("fallbackPlan", val)}
                                    />
                                    {errors.fallbackPlan && <div className="error-message-banner">{errors.fallbackPlan}</div>}

                                    <button
                                        type="button"
                                        className="sub-navigation-trigger back-trigger"
                                        onClick={() => setObstacleSubStep(1)}
                                    >
                                        ⬅ Review Obstacle
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="instagram-dots-track">
                            <button
                                type="button"
                                className={`instagram-dot ${obstacleSubStep === 1 ? 'active' : ''}`}
                                onClick={() => setObstacleSubStep(1)}
                                aria-label="View obstacle step"
                            />
                            <button
                                type="button"
                                className={`instagram-dot ${obstacleSubStep === 2 ? 'active' : ''}`}
                                onClick={() => setObstacleSubStep(2)}
                                aria-label="View backup response step"
                            />
                        </div>
                    </div>
                </Step>
            </StyledWrapper>
        );
    }

    return (
        <StyledWrapper>
            <Step>
                <h1>When would you like to finish?</h1>
                <div className="date-picker-container">
                    <div className="date-picker-checkbox-container">
                        {["No deadline", "tomorrow", "this week", "pick a date"].map((option) => {
                            let checked = false;
                            if (option === "No deadline" && deadline === null) checked = true; else if (option === "tomorrow") {
                                const tomorrow = new Date()
                                tomorrow.setDate(tomorrow.getDate() + 1);
                                if (deadline && deadline ? (deadline instanceof Date ? deadline : new Date(deadline)).toDateString() : ""
                                    === tomorrow.toDateString()) checked = true;
                            } else if (option === "this week") {
                                const today = new Date();
                                const day = today.getDay();
                                const diff = day === 0 ? 0 : 7 - day;
                                const sunday = new Date(today);
                                sunday.setDate(today.getDate() + diff);
                                if (deadline && deadline ? (deadline instanceof Date ? deadline : new Date(deadline)).toDateString() : ""
                                    === sunday.toDateString()) checked = true;
                            } else if (option === "pick a date") {
                                checked = showCalendar;
                            }
                            return (<CheckBox
                                key={option}
                                name="time"
                                value={option}
                                checked={checked}
                                func={() => handleTimeSelection(option)}
                            />);
                        })}
                    </div>
                    <div>
                        {showCalendar && (<DatePicker
                            selectedDate={deadline}
                            onDateSelect={handleDatePick}
                        />)}
                    </div>
                </div>
                {errors.deadline && <div className="error">{errors.deadline}</div>}
            </Step>
        </StyledWrapper>
    )
}

const StyledWrapper = styled.div`
  .obstacle-subtitle {
    color: var(--text-muted);
    font-size: 0.95rem;
    line-height: 1.5;
    margin-bottom: 1.5rem;
  }

  .date-picker-container {
    display: flex;
    justify-content: space-between;
  }

  .date-picker-checkbox-container {
    display: flex;
    flex-direction: column;
    height: 40vh;
    justify-content: space-between;
  }

  .error {
    color: var(--accent-red);
  }

  .obstacles-framework {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 620px;
    margin: 1.5rem auto 0 auto;
  }

  .sub-stepper-viewport {
    position: relative;
    min-height: 290px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .condition-node {
    background: rgba(255, 255, 255, 0.015);
    border: 1px solid var(--panel-border, rgba(255, 255, 255, 0.06));
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    gap: 1.25rem;
    align-items: flex-start;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .condition-node:focus-within {
    border-color: rgba(124, 58, 237, 0.3) !important;
    box-shadow: 0 4px 20px rgba(124, 58, 237, 0.02);
  }

  .node-edge-badge {
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 0.05em;
    padding: 4px 12px;
    border-radius: 6px;
    min-width: 60px;
    text-align: center;
    user-select: none;
  }

  .node-edge-badge.error-badge {
    background: rgba(244, 63, 94, 0.08);
    color: var(--accent-red, #f43f5e);
    border: 1px solid rgba(244, 63, 94, 0.15);
  }

  .node-edge-badge.success-badge {
    background: rgba(16, 185, 129, 0.08);
    color: #10b981;
    border: 1px solid rgba(16, 185, 129, 0.15);
  }

  .node-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .section-label {
    color: var(--text-muted, #94a3b8);
    font-size: 0.85rem !important;
    font-weight: 500 !important;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 0.25rem 0 !important;
  }

  .error-message-banner {
    color: var(--accent-red);
    font-size: 0.8rem;
    background: rgba(244, 63, 94, 0.06);
    border: 1px solid rgba(244, 63, 94, 0.15);
    border-radius: 8px;
    padding: 8px 12px;
    margin-top: 0.5rem;
  }

  .suggestions-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-top: 0.5rem;
  }

  .suggestions-label {
    font-size: 0.75rem;
    color: var(--text-subtle, #475569);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .suggestions-chips-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
  }

  .suggestion-chip {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid var(--panel-border, rgba(255, 255, 255, 0.06));
    color: var(--text-muted, #94a3b8);
    padding: 6px 12px;
    border-radius: 99px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .suggestion-chip:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.15);
    color: var(--text-primary, #f8fafc);
    transform: translateY(-1px);
  }

  .suggestion-chip.active {
    background: rgba(124, 58, 237, 0.08);
    border-color: var(--interactive-hover, #8b5cf6);
    color: #fff;
  }

  .sub-navigation-trigger {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.06);
    color: var(--text-primary) !important;
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    align-self: flex-end;
    margin-top: 1.25rem;
    transition: all 0.2s ease;
  }

  .sub-navigation-trigger:hover {
    background: rgba(124, 58, 237, 0.1);
    border-color: var(--interactive-hover, #8b5cf6);
    transform: translateX(2px);
  }

  .sub-navigation-trigger.back-trigger:hover {
    transform: translateX(-2px);
  }

  .instagram-dots-track {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin: 1.5rem auto 0 auto;
    padding: 8px;
  }

  .instagram-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    cursor: pointer;
    padding: 0;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .instagram-dot.active {
    background: var(--interactive-hover, #8b5cf6);
    width: 18px;
    border-radius: 4px;
  }

  .instagram-dot:hover {
    background: rgba(255, 255, 255, 0.45);
  }

  .instagram-dot.active:hover {
    background: var(--interactive-hover, #8b5cf6);
  }

  .animate-slideIn {
    animation: subStepSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes subStepSlideIn {
    from { opacity: 0; transform: translate3d(12px, 0, 0); }
    to { opacity: 1; transform: translate3d(0, 0, 0); }
  }
`;
