import {Input} from "@/components/fundamentals/Input/Input";
import {Step} from "@/components/Stepper/Stepper";
import React from "react";
import styled from "styled-components";

export const Reason = ({mode, reason, reasonNow, reasonSucceed, title, handleFieldChange, errors}) => {
    return (
        <StyledWrapper>
        <Step>
            <h1>{mode === "goal" ? "If you do not do this, what will you lose?" : "What action represents that person?"}</h1>

            <Input
                autoFocus
                placeholder={mode === "goal" ? "e.g. Needed for my portfolio to get a job" : "e.g. Run 5 km"}
                hintTxt={mode === "goal" ? "Write a short reason that reminds you of your motivation." : "Describe a specific daily/weekly action."}
                value={mode === "goal" ? reason : title}
                onValueChange={(val) => handleFieldChange(mode === "goal" ? "reason" : "title", mode === "goal" ? {mainReason: val} : val, "main")}
            />
            {mode === "goal" && errors.reason && <div className="error">{errors.reason}</div>}
            {mode === "habit" && errors.title && <div className="error">{errors.title}</div>}

            {mode === "goal" && (<>
                <h1>Why NOW?</h1>
                <Input
                    placeholder="e.g. Because I need to get hired"
                    hintTxt="Write why you need to do it now"
                    value={reasonNow}
                    onValueChange={(val) => handleFieldChange("reason", {now: val}, "now")}
                />
                {errors.reason && <div className="error">{errors.reason}</div>}
            </>)}

            {mode === "goal" && (<>
                <h1>What changes if you succeed?</h1>
                <Input
                    placeholder="e.g. My chance of getting hired will be better"
                    hintTxt=""
                    value={reasonSucceed}
                    onValueChange={(val) => handleFieldChange("reason", {succeedReason: val}, "succeed")}
                />
                {errors.reason && <div className="error">{errors.reason}</div>}
            </>)}
        </Step>
        </StyledWrapper>
    )
}

const StyledWrapper = styled.div`
  .error {
    color: var(--accent-red);
  }
`;
