// page.js
"use client";
import React, { useState } from 'react';
import ItemsManager from "@/components/Items/ItemsManager";
import Fab from "@/components/Fab/Fab";
import Sidebar from "@/components/Sidebar/Sidebar";
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

export default function Tasks() {
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("goal");
    const [activeDatum, setActiveDatum] = useState({});

    // Unified launcher handling both edits and new items
    const handleLaunchModal = (modeType, datumSource = null) => {
        setModalMode(modeType);
        if (datumSource) {
            setActiveDatum(datumSource);
        } else {
            setActiveDatum(modeType === "goal" ? { ...BASE_GOAL } : { ...BASE_HABIT });
        }
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
                    <div className="content-grid">
                        <ItemsManager
                            mode="goal"
                            onEditOverride={(item) => handleLaunchModal("goal", item)}
                        />
                    </div>
                </main>
            </div>

            <Fab
                givenMode="goal"
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