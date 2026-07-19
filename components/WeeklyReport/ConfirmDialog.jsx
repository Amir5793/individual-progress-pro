"use client";

import React from "react";
import { Overlay, DialogCard, DialogTitle, DialogText, DialogActions, DialogBtn } from "./WeeklyReport.styles";

export default function ConfirmDialog({
  title,
  message,
  onSave,
  onDiscard,
  onCancel,
}) {
  return (
    <Overlay onClick={onCancel}>
      <DialogCard onClick={(e) => e.stopPropagation()}>
        <DialogTitle>{title}</DialogTitle>
        <DialogText>{message}</DialogText>
        <DialogActions>
          <DialogBtn onClick={onCancel}>Cancel</DialogBtn>
          <DialogBtn $variant="danger" onClick={onDiscard}>
            Discard
          </DialogBtn>
          <DialogBtn $variant="save" onClick={onSave}>
            Save
          </DialogBtn>
        </DialogActions>
      </DialogCard>
    </Overlay>
  );
}
