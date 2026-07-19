// CategoryOrReason.jsx
import { Input } from "@/components/fundamentals/Input/Input";
import { Step } from "@/components/Stepper/Stepper";
import React from "react";
import styled, { css, keyframes } from "styled-components";

const CARD_DATA = {
    Learning: {
        icon: "📚",
        desc: "Acquire skills, read deeply, synthesize new perspectives.",
        color: "#60a5fa" // Slate Blue
    },
    Career: {
        icon: "🧭",
        desc: "Professional elevation, projects, financial freedom.",
        color: "#c084fc" // Violet Pearl
    },
    Health: {
        icon: "🌱",
        desc: "Physical resilience, nutrition, restorative mechanics.",
        color: "#34d399" // Emerald Teal
    },
    Hobby: {
        icon: "🎨",
        desc: "Creative play, restorative play, presence and joy.",
        color: "#fbbf24" // Solar Amber
    },
    Personal: {
        icon: "💎",
        desc: "Internal development, core values, alignment.",
        color: "#f472b6" // Quiet Rose
    },
    Other: {
        icon: "🪐",
        desc: "Unmapped actions or multi-domain objectives.",
        color: "#94a3b8" // Steel Muted
    }
};

const CATEGORIES = ["Learning", "Career", "Health", "Hobby", "Personal", "Other"];

export const CategoryOrReason = ({ mode, category, reason, handleFieldChange, errors, view }) => {
    const isGoalMode = mode === "goal";
    const showCategory = view === "category" || (view !== "reason" && isGoalMode);

    return (
        <StyledWrapper>
            <Step>
                <HeaderGroup>
                    <StepTitle>
                        {showCategory
                            ? "Identify the sphere of life."
                            : "What is your deep incentive?"}
                    </StepTitle>
                    <StepSubtitle>
                        {showCategory
                            ? "Choose the area of investment. Categorization clarifies attention balance."
                            : "This statement is your psychological safeguard against procrastination."}
                    </StepSubtitle>
                </HeaderGroup>

                {showCategory ? (
                    <SelectionContainer>
                        <CategoryGrid>
                            {CATEGORIES.map((tag) => {
                                const isSelected = category === tag;
                                const info = CARD_DATA[tag] || { icon: "✨", desc: "", color: "#fff" };

                                return (
                                    <SphereCard
                                        key={tag}
                                        type="button"
                                        $active={isSelected}
                                        $accentColor={info.color}
                                        onClick={() => handleFieldChange("category", tag)}
                                    >
                                        <SphereHeader>
                                            <SphereIcon $active={isSelected} $accentColor={info.color}>
                                                {info.icon}
                                            </SphereIcon>
                                            <SphereTitleText>{tag}</SphereTitleText>
                                        </SphereHeader>
                                        <SphereDescription>{info.desc}</SphereDescription>
                                        <CheckedIndicator $active={isSelected} $accentColor={info.color}>
                                            ✓
                                        </CheckedIndicator>
                                    </SphereCard>
                                );
                            })}
                        </CategoryGrid>

                        {errors.category && (
                            <ErrorMessageBanner className="animate-scaleIn">
                                {errors.category}
                            </ErrorMessageBanner>
                        )}
                    </SelectionContainer>
                ) : (
                    <ReasonPortalCard>
                        <IdentityStatementLabel>
                            <IdentityIcon>🕯️</IdentityIcon> Identity Statement Prompt
                        </IdentityStatementLabel>

                        <InputContainer>
                            <Input
                                autoFocus
                                placeholder="e.g. I want to build physical strength to model health for my loved ones..."
                                value={reason}
                                onValueChange={(val) => handleFieldChange("reason", val)}
                                size="large"
                            />
                        </InputContainer>

                        <CoachHintText>
                            Focus on **who you are becoming**, rather than just the final target. Identity-based habits are statistically twice as likely to stick.
                        </CoachHintText>

                        {errors.reason && (
                            <ErrorMessageBanner className="animate-scaleIn">
                                {errors.reason}
                            </ErrorMessageBanner>
                        )}
                    </ReasonPortalCard>
                )}
            </Step>
        </StyledWrapper>
    );
};

/* ==========================================================================
   ANIMATIONS & STYLED COMPONENTS (PREMIUM DARK MODE DESIGN SYSTEM)
   ========================================================================== */
const cardScaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale3d(0.96, 0.96, 1) translate3d(0, 10px, 0);
  }
  to {
    opacity: 1;
    transform: scale3d(1, 1, 1) translate3d(0, 0, 0);
  }
`;

const StyledWrapper = styled.div`
  width: 100%;
  color: var(--text-primary);
  display: flex;
  flex-direction: column;

  .animate-scaleIn {
    animation: ${cardScaleIn} 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
`;

const HeaderGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 2rem;

  @media (max-width: 640px) {
    margin-bottom: 0;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const StepTitle = styled.h1`
  font-size: 1.85rem;
  font-weight: 500;
  letter-spacing: -0.025em;
  color: var(--text-primary);
  margin: 0;

  @media (max-width: 640px) {
    font-size: 1.3rem;
    letter-spacing: -0.02em;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const StepSubtitle = styled.p`
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.55;
  margin: 0;

  @media (max-width: 640px) {
    font-size: 0.82rem;
    line-height: 1.45;
  }

  @media (max-width: 480px) {
    font-size: 0.78rem;
  }
`;

/* ---------- Categories Grid Components (Goal Mode) ---------- */
const SelectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;

  @media (max-width: 640px) {
    gap: 0.75rem;
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); // Compact grid for cozy cards
  gap: 1rem;
  width: 100%;

  @media (max-width: 580px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

const SphereCard = styled.button`
  background: ${props => props.$active ? "var(--subtle-bg)" : "var(--subtle-bg)"};
  border: 1px solid ${props => props.$active ? props.$accentColor : "var(--card-border)"};
  border-radius: 14px;
  padding: 1.15rem;
  text-align: left;
  cursor: pointer;
  outline: none;
  position: relative;
  overflow: hidden;
  
  transition: 
    transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.25s ease,
    background-color 0.25s ease,
    box-shadow 0.3s ease;

  box-shadow: ${props => props.$active
    ? "var(--card-shadow), inset 0 0 12px var(--subtle-bg)"
    : "none"};

  &:hover {
    background: var(--subtle-bg);
    border-color: ${props => props.$active ? props.$accentColor : "var(--interactive-border)"};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0px);
  }

  @media (max-width: 640px) {
    padding: 0.85rem;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 0.7rem;
    border-radius: 10px;
  }
`;

const SphereHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 0.5rem;
`;

const SphereIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: ${props => props.$active ? "var(--btn-secondary-hover)" : "var(--btn-secondary-bg)"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: background-color 0.2s ease;
`;

const SphereTitleText = styled.span`
  color: var(--text-primary);
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: -0.01em;

  @media (max-width: 640px) {
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const SphereDescription = styled.p`
  color: var(--text-muted);
  font-size: 0.8rem;
  line-height: 1.45;
  margin: 0;
  padding-right: 1.5rem; /* Leaves visual space for checked state indicator */

  @media (max-width: 640px) {
    font-size: 0.72rem;
    line-height: 1.4;
    padding-right: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.68rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const CheckedIndicator = styled.div`
  position: absolute;
  top: 1.15rem;
  right: 1.15rem;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: ${props => props.$accentColor};
  color: var(--text-primary);
  font-weight: 900;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s;
  opacity: ${props => props.$active ? 1 : 0};
  transform: scale(${props => props.$active ? 1 : 0.6});
`;

/* ---------- Motivation Identity Panel (Habit Mode) ---------- */
const ReasonPortalCard = styled.div`
  background: var(--subtle-bg);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: var(--modal-shadow);
  animation: ${cardScaleIn} 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
`;

const IdentityStatementLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
`;

const IdentityIcon = styled.span`
  font-size: 1rem;
`;

const InputContainer = styled.div`
  width: 100%;
  
  /* Focus glow updates on custom inputs wrapper */
  .Input {
    background: transparent !important;
    border: none !important;
    border-bottom: 2px solid var(--interactive-border) !important;
    border-radius: 0 !important;
    padding: 10px 0 !important;
    font-size: 1.25rem !important;
    font-weight: 400 !important;
    letter-spacing: -0.01em !important;
    color: var(--text-primary) !important;
    transition: border-color 0.25s ease !important;
  }

  .Input:focus {
    border-bottom-color: var(--accent-purple) !important;
  }

  .Input::placeholder {
    color: var(--text-muted) !important;
  }
`;

const CoachHintText = styled.p`
  font-size: 0.825rem;
  line-height: 1.5;
  color: var(--text-muted);
  border-left: 2px solid var(--card-border);
  padding-left: 12px;
  margin: 0;

  strong {
    color: var(--text-muted);
    font-weight: 600;
  }
`;

const ErrorMessageBanner = styled.div`
  color: var(--accent-red);
  font-size: 0.8rem;
  background: rgba(244, 63, 94, 0.05);
  border: 1px solid rgba(244, 63, 94, 0.16);
  border-radius: 8px;
  padding: 10px 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
`;