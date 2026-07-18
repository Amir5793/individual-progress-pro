// page.js
"use client";
import React, { useState } from 'react';
import Header from "@/components/Header/Header";
import Progress from "@/components/Progress/Progress";
import Fab from "@/components/Fab/Fab";
import Sidebar from "@/components/Sidebar/Sidebar";
import ItemsManager from "@/components/Items/ItemsManager";
import { StepperCaller } from "@/components/Stepper/StepperCaller";

const BASE_GOAL = {
    id: "",
    type: "goal",
    period: "daily",
    title: "",
    category: "",
    reason: {},
    completionCriteria: "",
    difficulty: "",
    energy: "",
    deadline: null,
    obstacle: "",
    fallbackPlan: "",
    completed: false,
    completedAt: null,
    createdAt: null,
    actions: [],
};

const BASE_HABIT = {
    id: "",
    type: "habit",
    period: "daily",
    title: "",
    category: "",
    reason: {},
    identity: "",
    minimumAction: "",
    target: "",
    trigger: "",
    preferredTime: "",
    obstacle: "",
    fallbackPlan: "",
    streak: 0,
    completions: [],
    createdAt: null,
};

export default function Home() {
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("goal");
    const [activeDatum, setActiveDatum] = useState({});

    const handleLaunchModal = (modeType, datumSource = null) => {
        setModalMode(modeType);
        setActiveDatum(datumSource
            ? datumSource
            : modeType === "goal" ? { ...BASE_GOAL } : { ...BASE_HABIT }
        );
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setActiveDatum({});
    };

    return (
        <div className="export-wrapper">
            <div className="app-wrapper" style={{ position: "relative" }}>
                <Sidebar />
                <main className="main-area">
                    <Header />
                    <div className="content-grid">
                        <ItemsManager
                            mode="overview"
                            onEditOverride={(item) => handleLaunchModal(item.type, item)}
                        />
                    </div>
                    <Progress />
                </main>
            </div>

            <Fab
                givenMode="overview"
                onLaunchCreator={(modeSelected) => handleLaunchModal(modeSelected, null)}
            />

            {showModal && (
                <div className="stepper-wrapper">
                    <StepperCaller
                        mode={modalMode}
                        handleCloseModal={handleCloseModal}
                        datum={activeDatum}
                    />
                </div>
            )}
        </div>
    );
}
