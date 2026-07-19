"use client";

import React from "react";
import {
  HeaderBar,
  StatusBadge,
  ActionRow,
  ActionBtn,
} from "./WeeklyReport.styles";

export default function WeekHeader({
  status,
  onSave,
  onPublish,
  onExport,
  saving,
}) {
  return (
    <HeaderBar>
      <StatusBadge $variant={status}>{status.replace("-", " ")}</StatusBadge>

      <ActionRow>
        <ActionBtn onClick={onExport}>Export</ActionBtn>
        <ActionBtn $primary onClick={onSave} disabled={saving}>
          {saving ? "Saving…" : "Save Draft"}
        </ActionBtn>
        {status !== "published" && (
          <ActionBtn $primary onClick={onPublish}>
            Publish
          </ActionBtn>
        )}
      </ActionRow>
    </HeaderBar>
  );
}
