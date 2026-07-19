"use client";
import React, { useState, Children, useRef, useLayoutEffect, useEffect, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

/* ==========================================================================
   REACT THREE FIBER & THREE.JS DEPENDENCIES (ANTIGRAVITY BACKGROUND ENGINE)
   ========================================================================== */
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Safe isomorphic layout effect to prevent SSR warnings during early NextJs parsing
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const stableRandom = (seed) => {
    const value = Math.sin(seed) * 10000;
    return value - Math.floor(value);
};

const buildParticles = (count, width, height) => {
    return Array.from({ length: count }, (_, index) => {
        const seed = index + count * 13 + width * 7 + height * 11;

        return {
            t: stableRandom(seed + 1) * 100,
            speed: 0.01 + stableRandom(seed + 2) / 200,
            mx: (stableRandom(seed + 3) - 0.5) * width,
            my: (stableRandom(seed + 4) - 0.5) * height,
            mz: (stableRandom(seed + 5) - 0.5) * 20,
            cx: (stableRandom(seed + 3) - 0.5) * width,
            cy: (stableRandom(seed + 4) - 0.5) * height,
            cz: (stableRandom(seed + 5) - 0.5) * 20,
            randomRadiusOffset: (stableRandom(seed + 6) - 0.5) * 2
        };
    });
};

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

const AntigravityInner = ({
                              count = 300,
                              magnetRadius = 10,
                              ringRadius = 10,
                              waveSpeed = 0.4,
                              waveAmplitude = 1,
                              particleSize = 2,
                              lerpSpeed = 0.1,
                              color = '#FF9FFC',
                              autoAnimate = false,
                              particleVariance = 1,
                              rotationSpeed = 0,
                              depthFactor = 1,
                              pulseSpeed = 3,
                              particleShape = 'capsule',
                              fieldStrength = 10
                          }) => {
    const meshRef = useRef(null);
    const { viewport } = useThree();
    const dummy = React.useMemo(() => new THREE.Object3D(), []);

    const lastMousePos = useRef({ x: 0, y: 0 });
    const lastMouseMoveTime = useRef(0);
    const virtualMouse = useRef({ x: 0, y: 0 });

    const particles = useMemo(() => {
        const width = viewport.width || 100;
        const height = viewport.height || 100;

        return buildParticles(count, width, height);
    }, [count, viewport.width, viewport.height]);

    useFrame(state => {
        const mesh = meshRef.current;
        if (!mesh) return;

        const { viewport: v, pointer: m } = state;

        const mouseDist = Math.sqrt(Math.pow(m.x - lastMousePos.current.x, 2) + Math.pow(m.y - lastMousePos.current.y, 2));

        if (mouseDist > 0.001) {
            lastMouseMoveTime.current = Date.now();
            lastMousePos.current = { x: m.x, y: m.y };
        }

        let destX = (m.x * v.width) / 2;
        let destY = (m.y * v.height) / 2;

        if (autoAnimate && Date.now() - lastMouseMoveTime.current > 2000) {
            const time = state.clock.getElapsedTime();
            destX = Math.sin(time * 0.5) * (v.width / 4);
            destY = Math.cos(time * 0.5 * 2) * (v.height / 4);
        }

        const smoothFactor = 0.05;
        virtualMouse.current.x += (destX - virtualMouse.current.x) * smoothFactor;
        virtualMouse.current.y += (destY - virtualMouse.current.y) * smoothFactor;

        const targetX = virtualMouse.current.x;
        const targetY = virtualMouse.current.y;

        const globalRotation = state.clock.getElapsedTime() * rotationSpeed;

        particles.forEach((particle, i) => {
            let { t, speed, mx, my, mz, cz, randomRadiusOffset } = particle;

            t = particle.t += speed / 2;

            const projectionFactor = 1 - cz / 50;
            const projectedTargetX = targetX * projectionFactor;
            const projectedTargetY = targetY * projectionFactor;

            const dx = mx - projectedTargetX;
            const dy = my - projectedTargetY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            let targetPos = { x: mx, y: my, z: mz * depthFactor };

            if (dist < magnetRadius) {
                const angle = Math.atan2(dy, dx) + globalRotation;

                const wave = Math.sin(t * waveSpeed + angle) * (0.5 * waveAmplitude);
                const deviation = randomRadiusOffset * (5 / (fieldStrength + 0.1));

                const currentRingRadius = ringRadius + wave + deviation;

                targetPos.x = projectedTargetX + currentRingRadius * Math.cos(angle);
                targetPos.y = projectedTargetY + currentRingRadius * Math.sin(angle);
                targetPos.z = mz * depthFactor + Math.sin(t) * (1 * waveAmplitude * depthFactor);
            }

            particle.cx += (targetPos.x - particle.cx) * lerpSpeed;
            particle.cy += (targetPos.y - particle.cy) * lerpSpeed;
            particle.cz += (targetPos.z - particle.cz) * lerpSpeed;

            dummy.position.set(particle.cx, particle.cy, particle.cz);

            dummy.lookAt(projectedTargetX, projectedTargetY, particle.cz);
            dummy.rotateX(Math.PI / 2);

            const currentDistToMouse = Math.sqrt(
                Math.pow(particle.cx - projectedTargetX, 2) + Math.pow(particle.cy - projectedTargetY, 2)
            );

            const distFromRing = Math.abs(currentDistToMouse - ringRadius);
            let scaleFactor = 1 - distFromRing / 10;

            scaleFactor = Math.max(0, Math.min(1, scaleFactor));

            const finalScale = scaleFactor * (0.8 + Math.sin(t * pulseSpeed) * 0.2 * particleVariance) * particleSize;
            dummy.scale.set(finalScale, finalScale, finalScale);

            dummy.updateMatrix();

            mesh.setMatrixAt(i, dummy.matrix);
        });

        mesh.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            {particleShape === 'capsule' && <capsuleGeometry args={[0.1, 0.4, 4, 8]} />}
            {particleShape === 'sphere' && <sphereGeometry args={[0.2, 16, 16]} />}
            {particleShape === 'box' && <boxGeometry args={[0.3, 0.3, 0.3]} />}
            {particleShape === 'tetrahedron' && <tetrahedronGeometry args={[0.3]} />}
            <meshBasicMaterial color={color} />
        </instancedMesh>
    );
};

const Antigravity = props => {
    return (
        <Canvas
            camera={{ position: [0, 0, 50], fov: 35 }}
            dpr={[1, 1.5]}
            gl={{ antialias: false, powerPreference: "low-power" }}
        >
            <AntigravityInner {...props} />
        </Canvas>
    );
};

/* ==========================================================================
   PRIMARY STEPPER PLATFORM
   ========================================================================== */
export default function Stepper({
                                    children,
                                    initialStep = 1,
                                    onStepChange = () => true,
                                    onFinalStepCompleted = () => {},
                                    stepCircleContainerClassName = '',
                                    stepContainerClassName = '',
                                    contentClassName = '',
                                    footerClassName = '',
                                    backButtonProps = {},
                                    nextButtonProps = {},
                                    backButtonText = 'Back',
                                    nextButtonText = 'Continue',
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

    const updateStep = useCallback(async (newStep) => {
        const result = await onStepChange(currentStep, newStep);
        const shouldChange = result !== false;

        if (shouldChange) {
            setCurrentStep(newStep);
            if (newStep > totalSteps) {
                onFinalStepCompleted();
            }
        }
    }, [currentStep, onFinalStepCompleted, onStepChange, totalSteps]);

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
        <StyledWrapper className="outer-container" {...rest} onClick={handleCloseModal}>
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
                        color="#5227FF"
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
                                        }
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
                                {isNotLastStep && <StepConnector isComplete={currentStep > stepNumber} />}
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
                        <div className={`footer-nav ${currentStep !== 1 ? 'spread' : 'end'}`}>
                            {currentStep !== 1 && (
                                <button
                                    onClick={handleBack}
                                    className={`back-button ${currentStep === 1 ? 'inactive' : ''}`}
                                    {...backButtonProps}
                                >
                                    {backButtonText}
                                </button>
                            )}
                            {!disableStepIndicators && <button className="skip-button">Skip</button>}
                            <button
                                onClick={isLastStep ? handleComplete : handleNext}
                                className={isLastStep ? "complete-button" : "next-button"}
                                {...nextButtonProps}
                            >
                                {isLastStep ? 'Complete' : nextButtonText}
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
function StepContentWrapper({ isCompleted, currentStep, direction, children, className }) {
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
            style={{ position: 'relative', overflow: 'hidden' }}
            animate={{ height: isCompleted ? 0 : parentHeight }}
            transition={{ type: 'spring', duration: 0.4 }}
        >
            <AnimatePresence initial={false} mode="sync" custom={direction}>
                {!isCompleted && (
                    <SlideTransition key={currentStep} direction={direction} onHeightReady={handleHeightReady}>
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
            style={{ position: 'absolute', left: 0, right: 0, top: 0 }}
        >
            {children}
        </motion.div>
    );
}

const stepVariants = {
    enter: (dir) => ({
        x: dir >= 0 ? '-100%' : '100%', opacity: 0
    }),
    center: {
        x: '0%', opacity: 1
    },
    exit: (dir) => ({
        x: dir >= 0 ? '50%' : '-50%', opacity: 0
    })
};

export function Step({ children }) {
    return <div className="step-default">{children}</div>;
}

/* ==========================================================================
   INDICATOR TRACKS & PLOTS
   ========================================================================== */
const StepIndicator = memo(function StepIndicator({ step, currentStep, onClickStep, disableStepIndicators }) {
    const status = currentStep === step ? 'active' : currentStep < step ? 'inactive' : 'complete';

    const handleClick = () => {
        if (step !== currentStep && !disableStepIndicators) onClickStep(step);
    };

    return (
        <motion.div
            onClick={handleClick}
            className="step-indicator"
            style={disableStepIndicators ? { pointerEvents: 'none', opacity: 0.5 } : {}}
            animate={status}
            initial={false}
        >
            <motion.div
                variants={{
                    inactive: { scale: 1, backgroundColor: '#222', color: '#a3a3a3' },
                    active: { scale: 1, backgroundColor: '#5227FF', color: '#5227FF' },
                    complete: { scale: 1, backgroundColor: '#5227FF', color: '#3b82f6' }
                }}
                transition={{ duration: 0.3 }}
                className="step-indicator-inner"
            >
                {status === 'complete' ? (
                    <CheckIcon className="check-icon" />
                ) : status === 'active' ? (
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
        incomplete: { width: 0, backgroundColor: '#fff' },
        complete: { width: '100%', backgroundColor: '#5227FF' }
    };

    return (
        <div className="step-connector">
            <motion.div
                className="step-connector-inner"
                variants={lineVariants}
                initial={false}
                animate={isComplete ? 'complete' : 'incomplete'}
                transition={{ duration: 0.4 }}
            />
        </div>
    );
});

const CheckIcon = memo(function CheckIcon(props) {
    return (
        <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.1, type: 'tween', ease: 'easeOut', duration: 0.3 }}
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
  background: rgba(4, 5, 8, 0.4);
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
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.15);
    background: linear-gradient(-45deg, #3B3B98, #2C3A47, #182C61, #2f3640);
    background-size: 400% 400%;
    /* Keep animation entries pristine and responsive */
    animation: modalScaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards, gradient 15s ease infinite;
    z-index: 2;
    overflow: visible;
  }

  .step-indicator-row {
    display: flex;
    width: 100%;
    align-items: center;
    padding: 2rem;
    margin-bottom: 2rem;
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
    background: linear-gradient(-45deg, var(--accent-purple), var(--card), var(--sidebar-primary-foreground), var(--sidebar-bg));
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
    color: #fff;
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
    background: linear-gradient(-45deg, var(--accent-purple), var(--card), var(--sidebar-primary-foreground), var(--sidebar-bg));
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
    color: #fff;
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
    background-color: #fff;
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
    background-color: #52525b;
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
    color: #fff;
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
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @media (max-width: 640px) {
    .step-circle-container {
      max-width: 95vw;
      max-height: 90vh;
      border-radius: 1.25rem;
    }

    .step-indicator-row {
      padding: 1rem;
      margin-bottom: 1rem;
    }

    .step-default {
      gap: 1rem;
      padding-left: 1rem;
      padding-right: 1rem;
      margin-bottom: 1rem;
    }

    .footer-container {
      padding-left: 1rem;
      padding-right: 1rem;
      padding-bottom: 1rem;
    }
  }

  @media (max-width: 480px) {
    .step-circle-container {
      max-width: 100vw;
      border-radius: 0;
      max-height: 100vh;
    }

    .step-indicator-row {
      padding: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .step-default {
      gap: 0.75rem;
      padding-left: 0.75rem;
      padding-right: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .footer-container {
      padding-left: 0.75rem;
      padding-right: 0.75rem;
      padding-bottom: 0.75rem;
    }
  }
`;
