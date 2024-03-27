import "./Layout.scss";
import BarreDeMenu from "../NoyauBarreDeMenu/NoyauBarreDeMenu";
import {Outlet} from "react-router-dom";

export default function Layout() {
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
                </div>
            </div>
        </div>
    );
}
