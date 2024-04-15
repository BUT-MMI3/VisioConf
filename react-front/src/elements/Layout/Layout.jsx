import "./Layout.scss";
import NoyauBarreDeMenu from "../NoyauBarreDeMenu/NoyauBarreDeMenu";
import Accueil from "../../components/Accueil/NoyauAccueil.jsx";
import { Outlet, useLocation } from "react-router-dom";

export default function Layout() {
    const location = useLocation();

    return (
        <div className="layout">
            <div className="layout-grid">
                <NoyauBarreDeMenu/>
                <div className="layout-content">
                    <Outlet/>
                    {location.pathname === "/" && <Accueil/>}
                </div>
            </div>
        </div>
    );
}

