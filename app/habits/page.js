// page.js
"use client";
import React, { useState } from 'react';
import ItemsManager from "@/components/Items/ItemsManager";
import Fab from "@/components/Fab/Fab";
import Sidebar from "@/components/Sidebar/Sidebar";
import { StepperCaller } from "@/components/Stepper/StepperCaller";

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
    const [activeDatum, setActiveDatum] = useState({});

    const handleLaunchModal = (datumSource = null) => {
        setActiveDatum(datumSource ? datumSource : { ...BASE_HABIT });
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
                            mode="habit"
                            onEditOverride={(item) => handleLaunchModal(item)}
                        />
                    </div>
                </main>
            </div>

            <Fab
                givenMode="habit"
                onLaunchCreator={(modeSelected) => handleLaunchModal(null)}
            />

            {showModal && (
                <div className="stepper-wrapper">
                    <StepperCaller
                        mode="habit"
                        handleCloseModal={handleCloseModal}
                        datum={activeDatum}
                    />
                </div>
            )}
        </div>
    );
}
