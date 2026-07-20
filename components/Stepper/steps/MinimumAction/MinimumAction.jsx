import {Input} from "@/components/fundamentals/Input/Input";
import {Step} from "@/components/Stepper/Stepper";
import React from "react";
import styled from "styled-components";
import {useTranslation} from "@/lib/i18n/localeContext";

export const MinimumAction = ({mode, completionCriteria, minimumAction, handleFieldChange, errors}) => {
    const t = useTranslation();
    return (
        <StyledWrapper>
        <Step>
            <h1>{mode === "goal" ? t('stepper.minimum_action.goal_question') : t('stepper.minimum_action.habit_question')}</h1>
            <Input
                autoFocus
                placeholder={mode === "goal" ? t('stepper.minimum_action.goal_placeholder') : t('stepper.minimum_action.habit_placeholder')}
                hintTxt={mode === "goal" ? t('stepper.minimum_action.goal_hint') : t('stepper.minimum_action.habit_hint')}
                value={mode === "goal" ? completionCriteria : minimumAction}
                onValueChange={(val) => handleFieldChange(mode === "goal" ? "completionCriteria" : "minimumAction", val)}
            />
            {mode === "goal" && errors.completionCriteria && <div className="error">{errors.completionCriteria}</div>}
            {mode === "habit" && errors.minimumAction && <div className="error">{errors.minimumAction}</div>}
        </Step>
        </StyledWrapper>
    )
}

const StyledWrapper = styled.div`
  .error {
    color: var(--accent-red);
  }
`;
