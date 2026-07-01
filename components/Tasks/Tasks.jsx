import React from "react";
import "@/components/Tasks/Tasks.css";

export default function Tasks() {
    return (
        <div>
            {" "}
            <div className="content-col" id="tasks-col">
                {/* <!-- Task 1: purple, unchecked --> */}
                <div className="task-card" data-media-type="banani-button">
                    <div className="task-accent purple"></div>
                    <div className="task-container">

                        <div className="task-info">
                            <div className="task-title">Study Data Structures</div>
                            <div className="task-meta">
                                Created at 2026/5/6 &nbsp;•&nbsp; Due May 11
                            </div>
                        </div>
                        <div className="task-actions">
                            <div className="task-action-btn" data-media-type="banani-button">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                       strokeWidth="2">
                                        <path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1"/>
                                        <path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3zM16 5l3 3"/>
                                    </g>
                                </svg>

                            </div>
                            <div className="task-action-btn" data-media-type="banani-button">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path fill="currentColor"
                                          d="M6.187 8h11.625l-.695 11.125A2 2 0 0 1 15.121 21H8.879a2 2 0 0 1-1.996-1.875zM19 5v2H5V5h3V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1zm-9 0h4V4h-4z"/>
                                </svg>

                            </div>
                            <div className="task-checkbox purple">


                            </div>
                        </div>
                    </div>
                </div>

                {/* <!-- Task 3: green, checked --> */}
                <div className="task-card" data-media-type="banani-button">
                    <div className="task-accent green"></div>
                    <div className="task-container">
                        <div className="task-info">
                            <div className="task-title">Read 30 Pages</div>
                            <div className="task-meta">
                                Created at 2026/5/4 &nbsp;•&nbsp; Due May 10
                            </div>
                        </div>
                        <div className="task-actions">
                            <div className="task-action-btn" data-media-type="banani-button">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                       strokeWidth="2">
                                        <path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1"/>
                                        <path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3zM16 5l3 3"/>
                                    </g>
                                </svg>
                            </div>
                            <div className="task-action-btn" data-media-type="banani-button">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path fill="currentColor"
                                          d="M6.187 8h11.625l-.695 11.125A2 2 0 0 1 15.121 21H8.879a2 2 0 0 1-1.996-1.875zM19 5v2H5V5h3V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1zm-9 0h4V4h-4z"/>
                                </svg>
                            </div>
                            <div className="task-checkbox green">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M0 0h24v24H0z" fill="none"/>
                                    <path fill="currentColor"
                                          d="m9 16.2l-3.5-3.5a.984.984 0 0 0-1.4 0a.984.984 0 0 0 0 1.4l4.19 4.19c.39.39 1.02.39 1.41 0L20.3 7.7a.984.984 0 0 0 0-1.4a.984.984 0 0 0-1.4 0z"
                                          strokeWidth="0.4" stroke="currentColor"/>
                                </svg>


                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
