import {Input} from "@/components/fundamentals/Input/Input";
import {Step} from "@/components/Stepper/Stepper";
import React from "react";

export const MinimumAction = ({mode, completionCriteria, minimumAction, handleFieldChange, errors}) => {
    return (
        <Step>
            <h1>{mode === "goal" ? "How will you know you're done?" : "What's the smallest version you can always do?"}</h1>
            <Input
                placeholder={mode === "goal" ? "e.g. Pass all unit tests for FormComponent" : "e.g. Run 1 km"}
                hintTxt={mode === "goal" ? "Specify a clear finish line." : "Your minimum commitment."}
                value={mode === "goal" ? completionCriteria : minimumAction}
                onValueChange={(val) => handleFieldChange(mode === "goal" ? "completionCriteria" : "minimumAction", val)}
            />
            {mode === "goal" && errors.completionCriteria && <div className="error">{errors.completionCriteria}</div>}
            {mode === "habit" && errors.minimumAction && <div className="error">{errors.minimumAction}</div>}
        </Step>
    )
}
