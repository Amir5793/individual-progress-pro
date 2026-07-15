import {Input} from "@/components/fundamentals/Input/Input";
import {CheckBox} from "@/components/fundamentals/CheckBox/CheckBox";
import {Step} from "@/components/Stepper/Stepper";
import React from "react";

export const DifficultyOrTarget = ({mode, difficulty, target, handleFieldChange, errors}) => {
    return (
        <Step>
            <h1>{mode === "goal" ? "How difficult does it feel?" : "On a good day, what's your ideal target?"}</h1>
            {mode === "goal" ? (<>
                <div className="checkbox-container">
                    {["low", "medium", "hard", "almost impossible"].map((level) => (<CheckBox
                        key={level}
                        name="difficulty"
                        value={level}
                        checked={difficulty === level}
                        func={() => handleFieldChange("difficulty", level)}
                    />))}
                </div>
                {errors.difficulty && <div className="error">{errors.difficulty}</div>}
            </>) : (<>
                <Input
                    placeholder="e.g. 30 minutes"
                    hintTxt="Your preferred goal on a good day."
                    value={target}
                    onValueChange={(val) => handleFieldChange("target", val)}
                />
                {errors.target && <div className="error">{errors.target}</div>}
            </>)}
        </Step>
    )
}
