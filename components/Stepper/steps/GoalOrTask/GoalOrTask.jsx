import {CheckBox} from "@/components/fundamentals/CheckBox/CheckBox";
import {Step} from "@/components/Stepper/Stepper";
import React from "react";
import styled from "styled-components";

export const GoalOrTask = ({isAchieveAbleInOneAction, handleGoalOrTask}) => {
    return (
        <StyledWrapper>
        <Step>
            {console.log(handleGoalOrTask)}
            <h1>Can you achieve this goal in one straight action?</h1>
            <div className="goal-or-task-checkbox-container">
                <CheckBox checked={isAchieveAbleInOneAction} value="Yes" func={() => {
                    handleGoalOrTask("Yes")
                }} name="goalOrTask"></CheckBox>
                <CheckBox checked={!isAchieveAbleInOneAction} value="No" func={() => {
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
