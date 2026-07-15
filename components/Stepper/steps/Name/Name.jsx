import {Input} from "@/components/fundamentals/Input/Input";
import {Step} from "@/components/Stepper/Stepper";
import React from "react";

export const Name = ({mode, title, identity, handleFieldChange, errors}) => {
    return (
        <Step>
            <h1>{mode === "goal" ? "What are you trying to achieve?" : "Who do you want to become?"}</h1>
            <Input
                placeholder={mode === "goal" ? "e.g. Finish Chapter 4 of React Course" : "e.g. A consistent runner"}
                hintTxt={mode === "goal" ? "Describe the outcome you’re aiming for." : "Imagine the person you see after adopting this habit."}
                value={mode === "goal" ? title : identity}
                onValueChange={(val) => handleFieldChange(mode === "goal" ? "title" : "identity", val)}
            />
            {mode === "goal" && errors.title && <div className="error">{errors.title}</div>}
            {mode === "habit" && errors.identity && <div className="error">{errors.identity}</div>}
        </Step>
    )
}