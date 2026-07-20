import {Input} from "@/components/fundamentals/Input/Input";
import {Step} from "@/components/Stepper/Stepper";
import React from "react";
import styled from "styled-components";
import {useTranslation} from "@/lib/i18n/localeContext";

export const Name = ({mode, title, identity, handleFieldChange, errors}) => {
    const t = useTranslation();
    return (
        <StyledWrapper>
        <Step>
            <h1>{mode === "goal" ? t('stepper.name.goal_question') : t('stepper.name.habit_question')}</h1>
            <Input
                autoFocus
                placeholder={mode === "goal" ? t('stepper.name.goal_placeholder') : t('stepper.name.habit_placeholder')}
                hintTxt={mode === "goal" ? t('stepper.name.goal_hint') : t('stepper.name.habit_hint')}
                value={mode === "goal" ? title : identity}
                onValueChange={(val) => handleFieldChange(mode === "goal" ? "title" : "identity", val)}
            />
            {mode === "goal" && errors.title && <div className="error">{errors.title}</div>}
            {mode === "habit" && errors.identity && <div className="error">{errors.identity}</div>}
        </Step>
        </StyledWrapper>
    )
}

const StyledWrapper = styled.div`
  .error {
    color: var(--accent-red);
  }
`;
