import React from "react";
import "@/components/Habits/Habits.css"

export default function Habits() {
    return (
        <div>
            {" "}
            <div className="content-col" id="habits-col">
                {/* <!-- Habit 1: Meditate - purple, done --> */}
                <div className="habit-card" data-media-type="banani-button">
                    <div className="habit-accent purple"></div>
                    <div className="habit-container">
                        <div className="habit-icon-circle purple">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M12 18.5A2.493 2.493 0 0 1 7.51 20H7.5a2.468 2.468 0 0 1-2.4-3.154a2.98 2.98 0 0 1-.85-5.274a2.47 2.47 0 0 1 .92-3.182a2.477 2.477 0 0 1 1.876-3.344a2.5 2.5 0 0 1 3.41-1.856A2.5 2.5 0 0 1 12 5.5m0 13v-13m0 13a2.493 2.493 0 0 0 4.49 1.5h.01a2.468 2.468 0 0 0 2.403-3.154a2.98 2.98 0 0 0 .847-5.274a2.47 2.47 0 0 0-.921-3.182a2.477 2.477 0 0 0-1.875-3.344A2.5 2.5 0 0 0 14.5 3A2.5 2.5 0 0 0 12 5.5m-8 5a2.5 2.5 0 0 1 3.48-2.3m-.28 8.551a3 3 0 0 1-2.953-5.185M20 10.5a2.5 2.5 0 0 0-3.481-2.3m.28 8.551a3 3 0 0 0 2.954-5.185"/>
                            </svg>

                        </div>
                        <div className="habit-info">
                            <div className="habit-name">Meditate</div>
                            <div className="habit-tracker">
                                <div className="tracker-day done purple">M</div>
                                <div className="tracker-day done purple">T</div>
                                <div className="tracker-day done purple">W</div>
                                <div className="tracker-day done purple">T</div>
                                <div className="tracker-day done purple">F</div>
                                <div className="tracker-day">S</div>
                                <div className="tracker-day">S</div>
                            </div>
                        </div>
                        <div className="habit-streak">
                            <div className="streak-num">14</div>
                            <div className="streak-label">day streak</div>
                        </div>
                        <div className="habit-check done purple">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M0 0h24v24H0z" fill="none"/>
                                <path fill="currentColor"
                                      d="m9 16.2l-3.5-3.5a.984.984 0 0 0-1.4 0a.984.984 0 0 0 0 1.4l4.19 4.19c.39.39 1.02.39 1.41 0L20.3 7.7a.984.984 0 0 0 0-1.4a.984.984 0 0 0-1.4 0z"
                                      strokeWidth="0.4" stroke="currentColor"/>
                            </svg>
                        </div>
                    </div>

                </div>
                {/* <!-- Habit 5: Drink Water - red, pending --> */}
                <div className="habit-card" data-media-type="banani-button">
                    <div className="habit-accent red"></div>
                    <div className="habit-container">
                        <div className="habit-icon-circle red">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M12 18.5A2.493 2.493 0 0 1 7.51 20H7.5a2.468 2.468 0 0 1-2.4-3.154a2.98 2.98 0 0 1-.85-5.274a2.47 2.47 0 0 1 .92-3.182a2.477 2.477 0 0 1 1.876-3.344a2.5 2.5 0 0 1 3.41-1.856A2.5 2.5 0 0 1 12 5.5m0 13v-13m0 13a2.493 2.493 0 0 0 4.49 1.5h.01a2.468 2.468 0 0 0 2.403-3.154a2.98 2.98 0 0 0 .847-5.274a2.47 2.47 0 0 0-.921-3.182a2.477 2.477 0 0 0-1.875-3.344A2.5 2.5 0 0 0 14.5 3A2.5 2.5 0 0 0 12 5.5m-8 5a2.5 2.5 0 0 1 3.48-2.3m-.28 8.551a3 3 0 0 1-2.953-5.185M20 10.5a2.5 2.5 0 0 0-3.481-2.3m.28 8.551a3 3 0 0 0 2.954-5.185"/>
                            </svg>

                        </div>
                        <div className="habit-info">
                            <div className="habit-name">Meditate</div>
                            <div className="habit-tracker">
                                <div className="tracker-day done red">M</div>
                                <div className="tracker-day done red">T</div>
                                <div className="tracker-day done red">W</div>
                                <div className="tracker-day done red">T</div>
                                <div className="tracker-day done red">F</div>
                                <div className="tracker-day">S</div>
                                <div className="tracker-day">S</div>
                            </div>
                        </div>
                        <div className="habit-streak">
                            <div className="streak-num">14</div>
                            <div className="streak-label">day streak</div>
                        </div>
                        <div className="habit-check pending red">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
