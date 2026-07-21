import {Input} from "@/components/fundamentals/Input/Input";
import {CheckBox} from "@/components/fundamentals/CheckBox/CheckBox";
import {Step} from "@/components/Stepper/Stepper";
import React from "react";
import styled from "styled-components";
import {useTranslation} from "@/lib/i18n/localeContext";

export const EnergyOrTrigger = ({mode, energy, trigger, handleFieldChange, errors}) => {
    const t = useTranslation();
    const energyLevels = [
        { value: "low", label: t('stepper.energy.low') },
        { value: "medium", label: t('stepper.energy.medium') },
        { value: "much", label: t('stepper.energy.high') },
        { value: "life or death", label: t('stepper.energy.extreme') },
    ];
    return (
        <StyledWrapper>
        <Step>
            <h1>{mode === "goal" ? t('stepper.energy.goal_question') : t('stepper.energy.trigger_question')}</h1>
            {mode === "goal" ? (<>
                <div className="checkbox-container">
                    {energyLevels.map((level) => (<CheckBox
                        key={level.value}
                        name="energy"
                        value={level.value}
                        label={level.label}
                        checked={energy === level.value}
                        func={() => handleFieldChange("energy", level.value)}
                    />))}
                </div>
                {errors.energy && <div className="error">{errors.energy}</div>}
            </>) : (<>
                <Input
                    autoFocus
                    placeholder={t('stepper.energy.trigger_placeholder')}
                    hintTxt={t('stepper.energy.trigger_hint')}
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
