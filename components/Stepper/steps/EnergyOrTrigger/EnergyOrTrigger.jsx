import {Input} from "@/components/fundamentals/Input/Input";
import {CheckBox} from "@/components/fundamentals/CheckBox/CheckBox";
import {Step} from "@/components/Stepper/Stepper";
import React from "react";
import styled from "styled-components";

export const EnergyOrTrigger = ({mode, energy, trigger, handleFieldChange, errors}) => {
    return (
        <StyledWrapper>
        <Step>
            <h1>{mode === "goal" ? "How much focus will you need?" : "What will remind you to do this?"}</h1>
            {mode === "goal" ? (<>
                <div className="checkbox-container">
                    {["low", "medium", "much", "life or death"].map((level) => (<CheckBox
                        key={level}
                        name="energy"
                        value={level}
                        checked={energy === level}
                        func={() => handleFieldChange("energy", level)}
                    />))}
                </div>
                {errors.energy && <div className="error">{errors.energy}</div>}
            </>) : (<>
                <Input
                    autoFocus
                    placeholder="e.g. After breakfast"
                    hintTxt="Link to an existing routine or time."
                    value={trigger}
                    onValueChange={(val) => handleFieldChange("trigger", val)}
                />
                {errors.trigger && <div className="error">{errors.trigger}</div>}
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
