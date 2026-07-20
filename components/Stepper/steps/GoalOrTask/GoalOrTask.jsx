import {CheckBox} from "@/components/fundamentals/CheckBox/CheckBox";
import {Step} from "@/components/Stepper/Stepper";
import React from "react";
import styled from "styled-components";
import {useTranslation} from "@/lib/i18n/localeContext";

export const GoalOrTask = ({isAchieveAbleInOneAction, handleGoalOrTask}) => {
    const t = useTranslation();
    return (
        <StyledWrapper>
        <Step>
            <h1>{t('stepper.goal_or_task')}</h1>
            <div className="goal-or-task-checkbox-container">
                <CheckBox checked={isAchieveAbleInOneAction} value={t('stepper.yes')} func={() => {
                    handleGoalOrTask("Yes")
                }} name="goalOrTask"></CheckBox>
                <CheckBox checked={!isAchieveAbleInOneAction} value={t('stepper.no')} func={() => {
                    handleGoalOrTask("No")
                }} name="goalOrTask"></CheckBox>
            </div>
        </Step>
        </StyledWrapper>
    )
}

const StyledWrapper = styled.div`
  .goal-or-task-checkbox-container {
    margin-top: 1vh;
    display: flex;
    justify-content: space-around;
  }
`;
