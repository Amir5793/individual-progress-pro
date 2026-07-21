import { Input } from "@/components/fundamentals/Input/Input";
import { Step } from "@/components/Stepper/Stepper";
import React from "react";
import styled from "styled-components";
import {useTranslation} from "@/lib/i18n/localeContext";

export const Reason = ({
  mode,
  reason,
  reasonNow,
  reasonSucceed,
  title,
  handleFieldChange,
  errors,
}) => {
  const t = useTranslation();
  return (
    <StyledWrapper>
      <Step>
        <div
          className="multiple-reasons-container"
          style={
            mode === "goal" ? {
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "2.5rem",
            } : undefined
          }
        >
          <h1>
            {mode === "goal"
              ? t('stepper.reason.goal_question')
              : t('stepper.reason.habit_question')}
          </h1>

          <Input
            autoFocus
            placeholder={
              mode === "goal"
                ? t('stepper.reason.goal_placeholder')
                : t('stepper.reason.habit_placeholder')
            }
            hintTxt={
              mode === "goal"
                ? t('stepper.reason.goal_hint')
                : t('stepper.reason.habit_hint')
            }
            value={mode === "goal" ? reason : title}
            onValueChange={(val) =>
              handleFieldChange(
                mode === "goal" ? "reason" : "title",
                mode === "goal" ? { mainReason: val } : val,
                "main",
              )
            }
          />
          {mode === "goal" && errors.reason && (
            <div className="error">{errors.reason}</div>
          )}
          {mode === "habit" && errors.title && (
            <div className="error">{errors.title}</div>
          )}

          {mode === "goal" && (
            <>
              <h1>{t('stepper.reason.now_question')}</h1>
              <Input
                placeholder={t('stepper.reason.now_placeholder')}
                hintTxt={t('stepper.reason.now_hint')}
                value={reasonNow}
                onValueChange={(val) =>
                  handleFieldChange("reason", { now: val }, "now")
                }
              />
              {errors.reason && <div className="error">{errors.reason}</div>}
            </>
          )}

          {mode === "goal" && (
            <>
              <h1>{t('stepper.reason.succeed_question')}</h1>
              <Input
                placeholder={t('stepper.reason.succeed_placeholder')}
                hintTxt=""
                value={reasonSucceed}
                onValueChange={(val) =>
                  handleFieldChange("reason", { succeedReason: val }, "succeed")
                }
              />
              {errors.reason && <div className="error">{errors.reason}</div>}
            </>
          )}
        </div>
      </Step>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .error {
    color: var(--accent-red);
  }
`;
