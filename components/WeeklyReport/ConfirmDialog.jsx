"use client";

import React from "react";
import { useTranslation } from "@/lib/i18n/localeContext";
import { Overlay, DialogCard, DialogTitle, DialogText, DialogActions, DialogBtn } from "./WeeklyReport.styles";

export default function ConfirmDialog({
  title,
  message,
  onSave,
  onDiscard,
  onCancel,
}) {
  const t = useTranslation();

  return (
    <Overlay onClick={onCancel}>
      <DialogCard onClick={(e) => e.stopPropagation()}>
        <DialogTitle>{title}</DialogTitle>
        <DialogText>{message}</DialogText>
        <DialogActions>
          <DialogBtn onClick={onCancel}>{t('dialog.cancel')}</DialogBtn>
          <DialogBtn $variant="danger" onClick={onDiscard}>
            {t('dialog.discard')}
          </DialogBtn>
          <DialogBtn $variant="save" onClick={onSave}>
            {t('dialog.save')}
          </DialogBtn>
        </DialogActions>
      </DialogCard>
    </Overlay>
  );
}
