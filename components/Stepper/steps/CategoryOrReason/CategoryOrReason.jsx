import {Input} from "@/components/fundamentals/Input/Input";
import {TagsCard} from "@/components/fundamentals/TagsCard/TagsCard";
import {Step} from "@/components/Stepper/Stepper";
import React from "react";

export const CategoryOrReason = ({mode, category, reasonNow, handleFieldChange, errors}) => {
    return (
        <Step>
            <h1>{mode === "goal" ? "Which area of life does this belong to?" : "Why does this matter? (Your reason)"}</h1>
            {mode === "goal" ? (<>
                <div className="tags-container">
                    <TagsCard
                        tags={["Learning", "Career", "Health", "Hobby", "Personal", "Other"]}
                        selectedTag={category}
                        func={(tag) => handleFieldChange("category", tag)}
                    />
                </div>
                {errors.category && <div className="error">{errors.category}</div>}
            </>) : (<>
                <Input
                    placeholder="e.g. I want to be a healthy person for my family."
                    hintTxt="This will remind Future You of your motivation."
                    value={reasonNow}
                    onValueChange={(val) => handleFieldChange("reason", val)}
                    size="large"
                />
                {errors.reason && <div className="error">{errors.reason}</div>}
            </>)}
        </Step>
    )
}
