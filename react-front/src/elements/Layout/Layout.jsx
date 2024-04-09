import "./Layout.scss";
import BarreDeMenu from "../NoyauBarreDeMenu/NoyauBarreDeMenu";
import Accueil from "../../components/Accueil/NoyauAccueil.jsx";
import { Outlet, useLocation } from "react-router-dom";

export default function Layout() {
    const location = useLocation();

    return (
        <div className="layout">
            <div className="layout-grid">
                <BarreDeMenu
                    logoImage="https://jeremiahhaulin.fr/img/Logo%20MMI%20Toulon.png"
                    utilisateur={{
                        id: 123,
                        nom: "Doe",
                        prenom: "John",
                        email: "mama@mail.com",
                    }}
                />
                <div className="layout-content">
                    <Outlet/>
                    {location.pathname === "/" && <Accueil/>}
                </div>
            </div>
        </div>
    );
}

