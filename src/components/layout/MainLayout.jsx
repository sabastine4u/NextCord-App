import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import RightPanel from "./RightPanel";
import ModalManager from "../modals/ModalManager";
//import './main.css'

const MainLayout = () => {
    return (
        <>
            <div
                style={{
                    display: "flex",
                    minHeight: "100vh",
                    background: "var(--bg-base)",
                }}
            >
                {/* Sidebar */}
                <div style={{ display: "flex" }} className="sidebar-wrapper">
                    {/* sidebar componenet */}
                    <Sidebar />
                </div>

                {/* Main Space */}
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        minWidth: 0,
                    }}
                >
                    {/* Top bar */}
                    <Topbar />
                    <div style={{ flex: 1, display: "flex", gap: 0, maxWidth: "100%" }}>
                        {/* Main page Content */}
                        <main
                            style={{
                                flex: 1,
                                padding: "24px 24px",
                                minWidth: 0,
                                maxWidth: 600,
                            }} >
                            <Outlet />
                        </main>

                        {/* Right Pannel */}
                        <div className="right-panel-wrapper">
                            {/* RightPanel */}
                            <RightPanel />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Manager */}
            <ModalManager />
            <style>
                {`@media(max-width: 1100px){
                .right-panel-wrapper{display:none; }}
                @media(max-width: 768px){
                .sidebar-wrapper{display:none}
                main {padding:16px !important;}
                 }
                `}
            </style>
        </>
    );
};

export default MainLayout;
