"use client";
import React, {
  useState,
  Children,
  useRef,
  useLayoutEffect,
  useEffect,
  useCallback,
  memo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { useTranslation } from "@/lib/i18n/localeContext";
import dynamic from "next/dynamic";

const Antigravity = dynamic(() => import("./Antigravity"), { ssr: false });

// Safe isomorphic layout effect to prevent SSR warnings during early NextJs parsing
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function getCssVar(name, fallback) {
  if (typeof window === "undefined") return fallback;
  return (
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
    fallback
  );
}

function useAmbientEffectsEnabled() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const evaluate = () => {
      setEnabled(window.innerWidth >= 1024 && !mediaQuery.matches);
    };

    evaluate();
    mediaQuery.addEventListener("change", evaluate);
    window.addEventListener("resize", evaluate);

    return () => {
      mediaQuery.removeEventListener("change", evaluate);
      window.removeEventListener("resize", evaluate);
    };
  }, []);

  return enabled;
}

/* ==========================================================================
   PRIMARY STEPPER PLATFORM
   ========================================================================== */
export default function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => true,
  onFinalStepCompleted = () => {},
  stepCircleContainerClassName = "",
  stepContainerClassName = "",
  contentClassName = "",
  footerClassName = "",
  backButtonProps = {},
  nextButtonProps = {},
  backButtonText,
  nextButtonText = "Continue",
  disableStepIndicators = false,
  renderStepIndicator,
  handleCloseModal,
  ...rest
}) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;
  const showAmbientEffects = useAmbientEffectsEnabled();
  const t = useTranslation();
  const effectiveBackText = backButtonText || t('stepper.back');

  const updateStep = useCallback(
    async (newStep) => {
      const result = await onStepChange(currentStep, newStep);
      const shouldChange = result !== false;

      if (shouldChange) {
        setCurrentStep(newStep);
        if (newStep > totalSteps) {
          onFinalStepCompleted();
        }
      }
    },
    [currentStep, onFinalStepCompleted, onStepChange, totalSteps],
  );

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      updateStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      setDirection(1);
      updateStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    setDirection(1);
    updateStep(totalSteps + 1);
  };

  useEffect(() => {
    if (isCompleted) return;
    const handleKeyDown = (e) => {
      if (e.key !== "Enter") return;
      const tag = e.target.tagName;
      if (tag === "TEXTAREA" || tag === "BUTTON" || tag === "SELECT") return;
      if (e.target.type === "radio" || e.target.type === "checkbox") return;
      e.preventDefault();
      if (currentStep >= totalSteps) {
        setDirection(1);
        updateStep(totalSteps + 1);
      } else {
        setDirection(1);
        updateStep(currentStep + 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, isCompleted, totalSteps, updateStep]);

  return (
    <StyledWrapper
      className="outer-container"
      {...rest}
      onClick={handleCloseModal}
    >
      {/* Background Canvas Environment */}
      {showAmbientEffects ? (
        <div className="antigravity-background-layer">
          <Antigravity
            count={120}
            magnetRadius={6}
            ringRadius={7}
            waveSpeed={0.4}
            waveAmplitude={1}
            particleSize={1.2}
            lerpSpeed={0.05}
            color={getCssVar("--stepper-particle", "#5227FF")}
            autoAnimate
            particleVariance={1}
            rotationSpeed={0}
            depthFactor={1}
            pulseSpeed={3}
            particleShape="capsule"
            fieldStrength={10}
          />
        </div>
      ) : null}

      {/* Modal Container */}
      <div
        className={`step-circle-container ${stepCircleContainerClassName}`}
        onClick={(e) => e.stopPropagation()} // Stop background events from triggering dismissals
      >
        <div className={`step-indicator-row ${stepContainerClassName}`}>
          {handleCloseModal && (
            <button
              type="button"
              className="close-x"
              onClick={handleCloseModal}
              aria-label={t('stepper.close')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          )}
          {stepsArray.map((_, index) => {
            const stepNumber = index + 1;
            const isNotLastStep = index < totalSteps - 1;
            return (
              <React.Fragment key={stepNumber}>
                {renderStepIndicator ? (
                  renderStepIndicator({
                    step: stepNumber,
                    currentStep,
                    onStepClick: (clicked) => {
                      setDirection(clicked > currentStep ? 1 : -1);
                      updateStep(clicked);
                    },
                  })
                ) : (
                  <StepIndicator
                    step={stepNumber}
                    disableStepIndicators={disableStepIndicators}
                    currentStep={currentStep}
                    onClickStep={(clicked) => {
                      setDirection(clicked > currentStep ? 1 : -1);
                      updateStep(clicked);
                    }}
                  />
                )}
                {isNotLastStep && (
                  <StepConnector isComplete={currentStep > stepNumber} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <StepContentWrapper
          isCompleted={isCompleted}
          currentStep={currentStep}
          direction={direction}
          className={`step-content-default ${contentClassName}`}
        >
          {stepsArray[currentStep - 1]}
        </StepContentWrapper>

        {!isCompleted && (
          <div className={`footer-container ${footerClassName}`}>
            <div
              className={`footer-nav ${currentStep !== 1 ? "spread" : "end"}`}
            >
              {currentStep !== 1 && (
                <button
                  onClick={handleBack}
                  className={`back-button ${currentStep === 1 ? "inactive" : ""}`}
                  {...backButtonProps}
                >
                  {effectiveBackText}
                </button>
              )}
              {!disableStepIndicators && (
                <button className="skip-button">{t('stepper.skip')}</button>
              )}
              <button
                onClick={isLastStep ? handleComplete : handleNext}
                className={isLastStep ? "complete-button" : "next-button"}
                {...nextButtonProps}
              >
                {isLastStep ? t('stepper.complete') : nextButtonText}
              </button>
            </div>
          </div>
        )}
      </div>
    </StyledWrapper>
  );
}

/* ==========================================================================
   TRANSITIONAL LAYOUT WRAPPERS (HEIGHT AND POSITION ANIMATIONS)
   ========================================================================== */
function StepContentWrapper({
  isCompleted,
  currentStep,
  direction,
  children,
  className,
}) {
  const [parentHeight, setParentHeight] = useState(0);
  const heightRef = useRef(0);

  const handleHeightReady = useCallback((h) => {
    if (h !== heightRef.current) {
      heightRef.current = h;
      setParentHeight(h);
    }
  }, []);

  return (
    <motion.div
      className={className}
      style={{ position: "relative", overflow: "hidden" }}
      animate={{ height: isCompleted ? 0 : parentHeight }}
      transition={{ type: "spring", duration: 0.4 }}
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted && (
          <SlideTransition
            key={currentStep}
            direction={direction}
            onHeightReady={handleHeightReady}
          >
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SlideTransition({ children, direction, onHeightReady }) {
  const containerRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    if (containerRef.current) {
      onHeightReady(containerRef.current.offsetHeight);
    }
  }, []);

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4 }}
      style={{ position: "absolute", left: 0, right: 0, top: 0 }}
    >
      {children}
    </motion.div>
  );
}

const stepVariants = {
  enter: (dir) => ({
    x: dir >= 0 ? "-100%" : "100%",
    opacity: 0,
  }),
  center: {
    x: "0%",
    opacity: 1,
  },
  exit: (dir) => ({
    x: dir >= 0 ? "50%" : "-50%",
    opacity: 0,
  }),
};

export function Step({ children }) {
  return <div className="step-default">{children}</div>;
}

/* ==========================================================================
   INDICATOR TRACKS & PLOTS
   ========================================================================== */
const StepIndicator = memo(function StepIndicator({
  step,
  currentStep,
  onClickStep,
  disableStepIndicators,
}) {
  const status =
    currentStep === step
      ? "active"
      : currentStep < step
        ? "inactive"
        : "complete";

  const handleClick = () => {
    if (step !== currentStep && !disableStepIndicators) onClickStep(step);
  };

  return (
    <motion.div
      onClick={handleClick}
      className="step-indicator"
      style={
        disableStepIndicators ? { pointerEvents: "none", opacity: 0.5 } : {}
      }
      animate={status}
      initial={false}
    >
      <motion.div
        variants={{
          inactive: {
            scale: 1,
            backgroundColor: "var(--btn-secondary-bg)",
            color: "var(--text-muted)",
          },
          active: {
            scale: 1,
            backgroundColor: "var(--accent-purple)",
            color: "var(--accent-purple)",
          },
          complete: {
            scale: 1,
            backgroundColor: "var(--accent-purple)",
            color: "var(--accent-blue)",
          },
        }}
        transition={{ duration: 0.3 }}
        className="step-indicator-inner"
      >
        {status === "complete" ? (
          <CheckIcon className="check-icon" />
        ) : status === "active" ? (
          <div className="active-dot" />
        ) : (
          <span className="step-number">{step}</span>
        )}
      </motion.div>
    </motion.div>
  );
});

const StepConnector = memo(function StepConnector({ isComplete }) {
  const lineVariants = {
    incomplete: { width: 0, backgroundColor: "var(--text-muted)" },
    complete: { width: "100%", backgroundColor: "var(--accent-purple)" },
  };

  return (
    <div className="step-connector">
      <motion.div
        className="step-connector-inner"
        variants={lineVariants}
        initial={false}
        animate={isComplete ? "complete" : "incomplete"}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
});

const CheckIcon = memo(function CheckIcon(props) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          delay: 0.1,
          type: "tween",
          ease: "easeOut",
          duration: 0.3,
        }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
});

/* ==========================================================================
   STYLED-COMPONENTS STRUCTURES (SCOPED VARS AND MEDIA QUERIES)
   ========================================================================== */
const StyledWrapper = styled.div`
  /* Standardise high stacking Modal overlay positioning */
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100vh;
  z-index: 1000;
  background: var(--overlay-bg);
  backdrop-filter: blur(8px);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  .antigravity-background-layer {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none; /* Allows clicks to pass through and register dismissal triggers */
    z-index: 1;
  }

  canvas {
    width: 100% !important;
    height: 100% !important;
  }

  .step-circle-container {
    position: relative; /* Centers the content card within the flex container */
    width: fit-content;
    max-width: 90vw;
    height: fit-content;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 2rem;
    box-shadow: var(--modal-shadow);
    background: linear-gradient(
      -45deg,
      var(--stepper-bg-1),
      var(--stepper-bg-2),
      var(--stepper-bg-3),
      var(--stepper-bg-4)
    );
    background-size: 400% 400%;
    /* Keep animation entries pristine and responsive */
    animation:
      modalScaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards,
      gradient 15s ease infinite;
    z-index: 2;
    overflow: visible;
  }

  .step-indicator-row {
    display: flex;
    width: 100%;
    align-items: center;
    padding: 2rem;
    margin-bottom: 2rem;
    position: relative;
  }

  .step-content-default {
    position: relative;
    overflow: hidden;
    min-height: 25vh;
    height: fit-content;
  }

  .step-default {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding-left: 2rem;
    padding-right: 2rem;
    margin-bottom: 2rem;
  }
  .error {
    font-size: 0.8rem;
  }

  .footer-container {
    padding-left: 2rem;
    padding-right: 2rem;
    padding-bottom: 2rem;
  }

  .footer-nav {
    margin-top: 2.5rem;
    display: flex;
  }

  .footer-nav.spread {
    justify-content: space-between;
  }

  .footer-nav.end {
    justify-content: flex-end;
  }

  .back-button {
    transition: all 350ms;
    border-radius: 0.25rem;
    padding: 0.25rem 0.5rem;
    color: var(--destructive);
    cursor: pointer;
    border: none;
    background: transparent;
  }

  .back-button:hover {
    color: var(--destructive-foreground);
  }

  .back-button.inactive {
    pointer-events: none;
    opacity: 0.5;
    color: var(--destructive-foreground);
  }

  .next-button {
    transition: all 350ms;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    background: linear-gradient(
      -45deg,
      var(--accent-purple),
      var(--card),
      var(--sidebar-primary-foreground),
      var(--sidebar-bg)
    );
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
    color: var(--text-on-accent);
    font-weight: 500;
    letter-spacing: -0.025em;
    padding: 0.375rem 0.875rem;
    cursor: pointer;
    border: none;
  }

  .skip-button {
    transition: all 350ms;
    border-radius: 0.25rem;
    padding: 0.25rem 0.5rem;
    color: var(--input);
    cursor: pointer;
    border: none;
    background: transparent;
  }

  .skip-button:hover {
    color: var(--accent-purple);
  }

  .skip-button.inactive {
    pointer-events: none;
    opacity: 0.5;
    color: var(--accent-purple);
  }

  .complete-button {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    background: linear-gradient(
      -45deg,
      var(--accent-purple),
      var(--card),
      var(--sidebar-primary-foreground),
      var(--sidebar-bg)
    );
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
    color: var(--text-on-accent);
    font-weight: 500;
    letter-spacing: -0.025em;
    padding: 0.375rem 0.875rem;
    cursor: pointer;
    border: none;
  }

  .step-indicator {
    position: relative;
    cursor: pointer;
    outline: none;
  }

  .step-indicator-inner {
    display: flex;
    height: 2rem;
    width: 2rem;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    font-weight: 600;
  }

  .active-dot {
    height: 0.75rem;
    width: 0.75rem;
    border-radius: 9999px;
    background-color: var(--text-primary);
  }

  .step-number {
    font-size: 0.875rem;
  }

  .step-connector {
    position: relative;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    height: 0.125rem;
    flex: 1;
    overflow: hidden;
    border-radius: 0.25rem;
    background-color: var(--track-bg);
  }

  .step-connector-inner {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
  }

  .check-icon {
    height: 1rem;
    width: 1rem;
    color: var(--text-primary);
  }

  .close-x {
    display: none;
  }

  @keyframes modalScaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  @media (max-width: 640px) {
    .step-circle-container {
      width: 100vw;
      height: 100vh;
      border-radius: 1.25rem;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }

    .step-indicator-row {
      padding: 0.75rem 1rem;
      margin-bottom: 0.5rem;
      justify-content: center;
      gap: 6px;
      flex-wrap: wrap;
    }

    .step-default {
      gap: 1rem;
      padding-left: 1rem;
      padding-right: 1rem;
      margin-bottom: 1rem;
      min-height: 65%;
    }

    .error {
      padding-top: 2.5rem;
    }

    .footer-container {
      padding-left: 1rem;
      padding-right: 1rem;
      padding-bottom: 1rem;
    }

    .footer-nav {
      margin-top: 1.5rem;
    }

    .step-content-default {
      min-height: 30vh !important;
    }

    .next-button,
    .complete-button {
      padding: 0.3rem 0.75rem;
      font-size: 0.85rem;
    }

    .back-button {
      padding: 0.2rem 0.4rem;
      font-size: 0.85rem;
    }

    .close-x {
      display: flex;
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 4px;
      border-radius: 6px;
      z-index: 5;
      transition: color 0.15s;
    }

    .close-x:hover {
      color: var(--text-primary);
    }
  }

  @media (max-width: 480px) {
    .step-circle-container {
      max-width: 100vw;
      max-height: 100vh;
      width: 100vw;
      height: 100vh;
      border-radius: 0;
    }

    .step-indicator-row {
      padding: 0.5rem 0.75rem;
      margin-bottom: 0.25rem;
      gap: 4px;
    }

    .step-default {
    //   gap: 1.5rem;
      padding-left: 0.75rem;
      padding-right: 0.75rem;
      padding-top: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .footer-container {
      padding-left: 0.75rem;
      padding-right: 0.75rem;
      padding-bottom: 0.75rem;
    }

    .footer-nav {
      margin-top: 1rem;
    }

    .step-content-default {
      min-height: 18vh;
    }

    .next-button,
    .complete-button {
      padding: 0.25rem 0.65rem;
      font-size: 0.8rem;
    }

    .back-button {
      padding: 0.15rem 0.35rem;
      font-size: 0.8rem;
    }

    .skip-button {
      font-size: 0.8rem;
    }

    .close-x {
      top: 0.5rem;
      right: 0.5rem;
    }
  }

  /* ===========================================================
     MOBILE STEP INDICATORS — Override inline styles from
     disableStepIndicators to show simple compact dots
     =========================================================== */
  @media (max-width: 640px) {
    .step-indicator {
      opacity: 1 !important;
      pointer-events: none !important;
      cursor: default;
    }

    .step-indicator-inner {
      width: 8px;
      height: 8px;
      font-size: 0;
      gap: 0;
    }

    .step-indicator-inner > * {
      display: none;
    }

    .step-indicator-inner::after {
      content: "";
      display: block;
      width: 8px;
      height: 8px;
      border-radius: 9999px;
      background: var(--text-muted);
      transition:
        background 0.3s,
        transform 0.3s;
    }

    .step-connector {
      margin-left: 2px;
      margin-right: 2px;
      height: 2px;
    }

    .step-connector-inner {
      height: 2px;
    }
  }

  @media (max-width: 480px) {
    .step-indicator-inner {
      width: 6px;
      height: 6px;
    }

    .step-indicator-inner::after {
      width: 6px;
      height: 6px;
    }

    .step-connector {
      margin-left: 1px;
      margin-right: 1px;
      height: 2px;
    }
  }
`;
