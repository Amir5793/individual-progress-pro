"use client";

import React, { useState, useCallback, useMemo } from "react";
import useReportCommitments from "@/lib/hooks/useReportCommitments";
import { saveDraft } from "@/lib/services/draftService";
import { useTranslation } from "@/lib/i18n/localeContext";
import WeekHeader from "./WeekHeader";
import ReportItem from "./ReportItem";
import EmptyWeek from "./EmptyWeek";
import ConfirmDialog from "./ConfirmDialog";
import {
  PageWrapper,
  ItemList,
  Toast,
} from "./WeeklyReport.styles";

export default function WeeklyReport({
  weekStart,
  weekEnd,
  onPrev,
  onNext,
  onToday,
  onJump,
  onNavigate,
}) {
  const { commitments, loading } = useReportCommitments(weekStart, weekEnd);
  const t = useTranslation();
  const [dirty, setDirty] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, variant = "success") => {
    setToast({ msg, variant });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const goals = useMemo(
    () => commitments.filter((c) => c.type === "goal"),
    [commitments]
  );

  const habits = useMemo(
    () => commitments.filter((c) => c.type === "habit"),
    [commitments]
  );

  const hasItems = goals.length > 0 || habits.length > 0;

  const handleNavAttempt = useCallback(
    (navFn) => {
      if (dirty) {
        setShowDialog(true);
        return;
      }
      navFn();
    },
    [dirty]
  );

  const wrappedPrev = useCallback(() => handleNavAttempt(onPrev), [handleNavAttempt, onPrev]);
  const wrappedNext = useCallback(() => handleNavAttempt(onNext), [handleNavAttempt, onNext]);
  const wrappedToday = useCallback(() => handleNavAttempt(onToday), [handleNavAttempt, onToday]);
  const wrappedJump = useCallback(() => handleNavAttempt(onJump), [handleNavAttempt, onJump]);

  const handleSave = useCallback(() => {
    if (!hasItems) {
      showToast(t('report.nothing_to_save'), "error");
      return;
    }
    setSaving(true);
    const weekKey = weekStart.toISOString().split("T")[0];
    saveDraft(weekKey, goals, habits);
    setTimeout(() => {
      setSaving(false);
      setDirty(false);
      showToast(t('report.draft_saved'));
    }, 400);
  }, [goals, habits, weekStart, hasItems, showToast]);

  const handlePublish = useCallback(() => {
    if (!hasItems) {
      showToast(t('report.nothing_to_publish'), "error");
      return;
    }
    setDirty(false);
    showToast(t('report.published'));
  }, [hasItems, showToast]);

  const handleExport = useCallback(() => {
    const rows = [
      "Type,Title,Category,Status",
      ...goals.map(
        (g) =>
          `goal,"${g.title}","${g.category}",${g.completed ? "done" : "active"}`
      ),
      ...habits.map((h) => {
        const status = h.completions?.length ? "tracked" : "pending";
        return `habit,"${h.title}","${h.category}",${status}`;
      }),
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(t('report.exported_csv'));
  }, [goals, habits, showToast]);

  const handleDialogSave = useCallback(() => {
    setShowDialog(false);
    setDirty(false);
  }, []);

  const handleDialogDiscard = useCallback(() => {
    setShowDialog(false);
    setDirty(false);
  }, []);

  const handleDialogCancel = useCallback(() => {
    setShowDialog(false);
  }, []);

  if (loading) return null;

  return (
    <PageWrapper>
      <WeekHeader
        status="draft"
        onSave={handleSave}
        onPublish={handlePublish}
        onExport={handleExport}
        saving={saving}
      />

      {hasItems ? (
        <ItemList>
          {goals.map((item) => (
            <ReportItem key={item.id} item={item} />
          ))}
          {habits.map((item) => (
            <ReportItem key={item.id} item={item} />
          ))}
        </ItemList>
      ) : (
        <EmptyWeek />
      )}

      {showDialog && (
        <ConfirmDialog
          title={t('dialog.unsaved_title')}
          message={t('dialog.unsaved_msg')}
          onSave={handleDialogSave}
          onDiscard={handleDialogDiscard}
          onCancel={handleDialogCancel}
        />
      )}

      {toast && <Toast $variant={toast.variant}>{toast.msg}</Toast>}
    </PageWrapper>
  );
}
