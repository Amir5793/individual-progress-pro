"use client";
import React, {useState} from "react";
import "@/components/Fab/Fab.css";
import {StepperCaller} from "@/components/Stepper/StepperCaller";

export default function Fab() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [mode, setMode] = useState("task");
    const [showModal, setShowModal] = useState(false);
    // Base Commitment fields
    const BaseCommitment = {
        id: "",             // e.g. UUID or crypto.randomUUID()
        type: "",           // "task" or "habit"
        period: "",         // "daily"/"weekly"/"monthly"
        title: "",
        reason: "",
        category: "",
        createdAt: new Date(),
    };

    // Task extension
    const Task = {
        ...BaseCommitment,
        type: "task",
        completionCriteria: "",
        difficulty: "",
        energy: "",
        deadline: null,      // JS Date or null
        obstacle: "",
        fallbackPlan: "",
        completed: false,
        completedAt: null
    };

    // Habit extension
    const Habit = {
        ...BaseCommitment,
        type: "habit",
        identity: "",
        minimumAction: "",
        target: "",
        trigger: "",
        preferredTime: "",
        obstacle: "",
        fallbackPlan: "",
        streak: 0,
        completions: []      // array of Dates
    };

    const [datum, setDatum] = useState({});


    const handleFabClick = () => {
        setIsExpanded(!isExpanded);
    };

    const handleOptionClick = (selectedMode) => {
        setMode(selectedMode);
        setDatum(selectedMode === "task" ? Task : Habit)
        setShowModal(true);
        setIsExpanded(false); // hide options when modal opens
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="fab-container">
            {/* Main FAB */}
            <div
                className={`fab ${isExpanded ? "fab-expanded" : ""}`}
                onClick={handleFabClick}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    {isExpanded ? (
                        // Plus icon
                        <g fill="none">
                            <path
                                d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
                            />
                            <path
                                fill="currentColor"
                                d="M10.5 20a1.5 1.5 0 0 0 3 0v-6.5H20a1.5 1.5 0 0 0 0-3h-6.5V4a1.5 1.5 0 0 0-3 0v6.5H4a1.5 1.5 0 0 0 0 3h6.5z"
                            />
                        </g>
                    ) : (
                        // Close (X) icon
                        <g fill="none">
                            <path
                                d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 13.414l5.657 5.657a1 1 0 0 0 1.414-1.414L13.414 12l5.657-5.657a1 1 0 0 0-1.414-1.414L12 10.586 6.343 4.929A1 1 0 0 0 4.93 6.343L10.586 12l-5.657 5.657a1 1 0 1 0 1.414 1.414L12 13.414z"
                            />
                        </g>
                    )}
                </svg>
            </div>

            {/* Task button (left of FAB) */}
            {isExpanded && (
                <div
                    className="fab-option fab-option-left"
                    onClick={() => handleOptionClick("task")}
                >
                    <span>Task</span>
                </div>
            )}

            {/* Habit button (above FAB) */}
            {isExpanded && (
                <div
                    className="fab-option fab-option-top"
                    onClick={() => handleOptionClick("habit")}
                >
                    <span>Habit</span>
                </div>
            )}

            {/* Stepper modal overlay */}
            {showModal && (
                <div className="stepper-wrapper">
                    <StepperCaller mode={mode} handleCloseModal={handleCloseModal} datum={datum}/>
                </div>
            )}
        </div>
    );
}