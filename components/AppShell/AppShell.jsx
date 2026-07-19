"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header/Header";
import DashboardSummary from "@/components/DashboardSummary/DashboardSummary";
import Progress from "@/components/Progress/Progress";
import Fab from "@/components/Fab/Fab";
import Sidebar from "@/components/Sidebar/Sidebar";
import ItemsManager from "@/components/Items/ItemsManager";
import { createEmptyCommitment } from "@/lib/items/baseCommitments";

const StepperCaller = dynamic(
    () => import("@/components/Stepper/StepperCaller").then((mod) => mod.StepperCaller),
    {
        ssr: false,
        loading: () => null,
    }
);

export default function AppShell({ mode = "overview" }) {
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("goal");
    const [activeDatum, setActiveDatum] = useState({});

    const showHeader = mode === "overview";
    const showProgress = mode === "overview";
    const itemMode = mode === "overview" ? "overview" : mode;
    const fabMode = mode === "overview" ? "overview" : mode;

    const handleLaunchModal = (nextMode, datumSource = null) => {
        setModalMode(nextMode);
        setActiveDatum(datumSource ?? createEmptyCommitment(nextMode));
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setActiveDatum({});
    };

    return (
        <div className="export-wrapper">
            <div className="app-wrapper">
                <Sidebar />
                <main className="main-area">
                    {showHeader ? <Header /> : null}
                    {showHeader ? <DashboardSummary /> : null}
                    <div className={`content-grid${showHeader ? " hide-on-mobile" : ""}`}>
                        <ItemsManager
                            mode={itemMode}
                            onEditOverride={(item) => handleLaunchModal(item.type, item)}
                        />
                    </div>
                    {showProgress ? <Progress /> : null}
                </main>
            </div>

            <Fab
                givenMode={fabMode}
                onLaunchCreator={(selectedMode) => handleLaunchModal(selectedMode, null)}
            />

            {showModal ? (
                <div className="stepper-wrapper">
                    <StepperCaller
                        mode={modalMode}
                        handleCloseModal={handleCloseModal}
                        datum={activeDatum}
                    />
                </div>
            ) : null}
        </div>
    );
}
