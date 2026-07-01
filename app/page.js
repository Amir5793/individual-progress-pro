import Image from "next/image";
import styles from "./page.module.css";
import Header from "@/components/Header/Header";
import Navbar from "@/components/Navbar/Navbar";
import Tasks from "@/components/Tasks/Tasks";
import Habits from "@/components/Habits/Habits";
import Progress from "@/components/Progress/Progress";
import Fab from "@/components/Fab/Fab";
import Sidebar from "@/components/Sidebar/Sidebar";
import {StepperCaller} from "@/components/Stepper/StepperCaller";


export default function Home() {
    return (
        <>
        <div className="export-wrapper">
        {/*    <div className="app-wrapper" style={{position: "relative"}}>*/}
        {/*        <Sidebar></Sidebar>*/}
        {/*        <main className="main-area">*/}
        {/*            <Header></Header>*/}
        {/*            <Navbar></Navbar>*/}
        {/*            <div className="content-grid">*/}
        {/*                <Tasks></Tasks>*/}
        {/*                <Habits></Habits>*/}
        {/*            </div>*/}
        {/*            <Progress></Progress>*/}
        {/*            <Fab></Fab>*/}
        {/*        </main>*/}
        {/*    </div>*/}
            <StepperCaller></StepperCaller>
        </div>
        </>
    );
}
