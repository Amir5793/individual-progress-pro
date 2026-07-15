import {Step} from "@/components/Stepper/Stepper";
import React from "react";

export const Review = ({
                           mode, title, reasonNow, actions, completionCriteria,
                           difficulty, energy, deadline, category, obstacle, fallbackPlan,
                           identity, minimumAction, target, trigger
                       }) => {
    return (
        <Step>
            <h1>Review your commitment</h1>
            {mode === "goal" ? (
                <ul>
                    <li><strong>Goal:</strong> {title}</li>
                    <li><strong>Why:</strong> {reasonNow || "—"}</li>
                    <li><strong>Actions:</strong> {actions.length > 0 ? actions.map(a => a.title).join(', ') : "None"}
                    </li>
                    <li><strong>Success criteria:</strong> {completionCriteria}</li>
                    <li><strong>Difficulty:</strong> {difficulty}</li>
                    <li><strong>Energy:</strong> {energy}</li>
                    <li><strong>Deadline:</strong> {deadline ? deadline.toDateString() : "No deadline"}</li>
                    <li><strong>Category:</strong> {category}</li>
                    <li><strong>Obstacle:</strong> {obstacle || "—"}</li>
                    <li><strong>Fallback plan:</strong> {fallbackPlan || "—"}</li>
                </ul>
            ) : (
                <ul>
                    <li><strong>Identity:</strong> {identity}</li>
                    <li><strong>Action:</strong> {title}</li>
                    <li><strong>Minimum action:</strong> {minimumAction}</li>
                    <li><strong>Target:</strong> {target || "—"}</li>
                    <li><strong>Trigger:</strong> {trigger || "—"}</li>
                    <li><strong>Obstacle:</strong> {obstacle || "—"}</li>
                    <li><strong>Reason:</strong> {reasonNow || "—"}</li>
                </ul>
            )}
        </Step>
    )
}
