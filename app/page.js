import Header from "@/components/Header/Header";
import Navbar from "@/components/Navbar/Navbar";
import Progress from "@/components/Progress/Progress";
import Fab from "@/components/Fab/Fab";
import Sidebar from "@/components/Sidebar/Sidebar";
import ItemsManager from "@/components/Items/ItemsManager";


export default function Home() {
    return (
        <>
        <div className="export-wrapper">
            <div className="app-wrapper" style={{position: "relative"}}>
                <Sidebar></Sidebar>
                <main className="main-area">
                    <Header></Header>
                    <Navbar></Navbar>
                    <div className="content-grid">
                        <ItemsManager mode="overview"></ItemsManager>
                    </div>
                    <Progress></Progress>
                </main>
                    <Fab givenMode="overview"></Fab>
            </div>
        </div>
        </>
    );
}
