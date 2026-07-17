import React from 'react';
import "./page.module.css"
import ItemsManager from "@/components/Items/ItemsManager";
import Fab from "@/components/Fab/Fab";
import Sidebar from "@/components/Sidebar/Sidebar";

function Tasks(props) {
    return (
        <div className="export-wrapper">
            <div className="app-wrapper" style={{position: "relative"}}>
                <Sidebar></Sidebar>
                <main className="main-area">
                    <div className="content-grid">
                        <ItemsManager mode="habit"></ItemsManager>
                    </div>
                </main>
            </div>
            <Fab givenMode="habit"></Fab>
        </div>
    );
}

export default Tasks;