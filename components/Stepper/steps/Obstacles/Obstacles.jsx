import {Input} from "@/components/fundamentals/Input/Input";
import {Step} from "@/components/Stepper/Stepper";
import React from "react";

export const Obstacles = ({obstacle, fallbackPlan, handleFieldChange, errors}) => {
    return (
        <Step>
            <h1>Obstacles & Backup Plan</h1>
            <div>
                <h2>What might stop you? (optional)</h2>
                <Input
                    placeholder="e.g. No time, distractions..."
                    value={obstacle}
                    onValueChange={(val) => handleFieldChange("obstacle", val)}
                />
                {errors.obstacle && <div className="error">{errors.obstacle}</div>}
            </div>
            <div>
                <h2>Your backup plan (optional)</h2>
                <Input
                    placeholder="e.g. If late, study 10 min only"
                    value={fallbackPlan}
                    onValueChange={(val) => handleFieldChange("fallbackPlan", val)}
                />
                {errors.fallbackPlan && <div className="error">{errors.fallbackPlan}</div>}
            </div>
        </Step>
    )
}
