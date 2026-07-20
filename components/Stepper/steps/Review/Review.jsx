import {Step} from "@/components/Stepper/Stepper";
import React from "react";
import { useTranslation } from "@/lib/i18n/localeContext";

export const Review = ({
                           mode, title, reasonNow, actions, completionCriteria,
                           difficulty, energy, deadline, category, obstacle, fallbackPlan,
                           identity, minimumAction, target, trigger
                       }) => {
    const t = useTranslation();
    return (
        <Step>
            <h1>{t('stepper.review.title')}</h1>
            {mode === "goal" ? (
                <ul>
                    <li><strong>{t('stepper.review.goal_label')}</strong> {title}</li>
                    <li><strong>{t('stepper.review.why_label')}</strong> {reasonNow || t('stepper.review.obstacle_none')}</li>
                    <li><strong>{t('stepper.review.actions_label')}</strong> {actions.length > 0 ? actions.map(a => a.title).join(', ') : t('stepper.review.actions_none')}
                    </li>
                    <li><strong>{t('stepper.review.success_label')}</strong> {completionCriteria}</li>
                    <li><strong>{t('stepper.review.difficulty_label')}</strong> {difficulty}</li>
                    <li><strong>{t('stepper.review.energy_label')}</strong> {energy}</li>
                    <li><strong>{t('stepper.review.deadline_label')}</strong> {deadline ? deadline.toDateString() : t('stepper.review.deadline_none')}</li>
                    <li><strong>{t('stepper.review.category_label')}</strong> {category}</li>
                    <li><strong>{t('stepper.review.obstacle_label')}</strong> {obstacle || t('stepper.review.obstacle_none')}</li>
                    <li><strong>{t('stepper.review.fallback_label')}</strong> {fallbackPlan || t('stepper.review.obstacle_none')}</li>
                </ul>
            ) : (
                <ul>
                    <li><strong>{t('stepper.review.identity_label')}</strong> {identity}</li>
                    <li><strong>{t('stepper.review.action_label')}</strong> {title}</li>
                    <li><strong>{t('stepper.review.minimum_action_label')}</strong> {minimumAction}</li>
                    <li><strong>{t('stepper.review.target_label')}</strong> {target || t('stepper.review.obstacle_none')}</li>
                    <li><strong>{t('stepper.review.trigger_label')}</strong> {trigger || t('stepper.review.obstacle_none')}</li>
                    <li><strong>{t('stepper.review.obstacle_label')}</strong> {obstacle || t('stepper.review.obstacle_none')}</li>
                    <li><strong>{t('stepper.review.reason_label')}</strong> {reasonNow || t('stepper.review.obstacle_none')}</li>
                </ul>
            )}
        </Step>
    )
}
