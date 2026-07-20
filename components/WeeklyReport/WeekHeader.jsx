"use client";

import React from "react";
import { useTranslation } from "@/lib/i18n/localeContext";
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
  const t = useTranslation();

  return (
    <HeaderBar>
      <StatusBadge $variant={status}>{status.replace("-", " ")}</StatusBadge>

      <ActionRow>
        <ActionBtn onClick={onExport}>{t('report.export')}</ActionBtn>
        <ActionBtn $primary onClick={onSave} disabled={saving}>
          {saving ? t('report.saving') : t('report.save_draft')}
        </ActionBtn>
        {status !== "published" && (
          <ActionBtn $primary onClick={onPublish}>
            {t('report.publish')}
          </ActionBtn>
        )}
      </ActionRow>
    </HeaderBar>
  );
}
