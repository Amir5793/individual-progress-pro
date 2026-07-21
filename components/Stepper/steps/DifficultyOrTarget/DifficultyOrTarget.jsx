import {Input} from "@/components/fundamentals/Input/Input";
import {CheckBox} from "@/components/fundamentals/CheckBox/CheckBox";
import {Step} from "@/components/Stepper/Stepper";
import React from "react";
import styled from "styled-components";
import {useTranslation} from "@/lib/i18n/localeContext";

export const DifficultyOrTarget = ({mode, difficulty, target, handleFieldChange, errors}) => {
    const t = useTranslation();
    const difficultyLevels = [
        { value: "low", label: t('stepper.difficulty.low') },
        { value: "medium", label: t('stepper.difficulty.medium') },
        { value: "hard", label: t('stepper.difficulty.hard') },
        { value: "almost impossible", label: t('stepper.difficulty.impossible') },
    ];
    return (
        <StyledWrapper>
        <Step>
            <h1>{mode === "goal" ? t('stepper.difficulty.goal_question') : t('stepper.difficulty.target_question')}</h1>
            {mode === "goal" ? (<>
                <div className="checkbox-container">
                    {difficultyLevels.map((level) => (<CheckBox
                        key={level.value}
                        name="difficulty"
                        value={level.value}
                        label={level.label}
                        checked={difficulty === level.value}
                        func={() => handleFieldChange("difficulty", level.value)}
                    />))}
                </div>
                {errors.difficulty && <div className="error">{errors.difficulty}</div>}
            </>) : (<>
                <Input
                    autoFocus
                    placeholder={t('stepper.difficulty.target_placeholder')}
                    hintTxt={t('stepper.difficulty.target_hint')}
                    value={target}
                    onValueChange={(val) => handleFieldChange("target", val)}
                />
                {errors.target && <div className="error">{errors.target}</div>}
            </>)}
        </Step>
        </StyledWrapper>
    )
}

const StyledWrapper = styled.div`
  .checkbox-container {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .error {
    color: var(--accent-red);
  }
`;
