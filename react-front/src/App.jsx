/**
 * Author: @mathis-lambert
 * Date : Janvier 2024
 */
import {Route, Routes} from "react-router-dom";
import NoyauAccueil from "./elements/NoyauAccueil/NoyauAccueil.jsx";
import Accueil from "./elements/Accueil/NoyauAccueil.jsx";
// import { io } from "./io";
import {useEffect, useRef, useState} from "react";
import NotFound from "./elements/NotFound.jsx";
import Layout from "./elements/Layout/Layout.jsx";
import ListeDiscussion from "./elements/ListeDiscussion/ListeDiscussion.jsx";
import NoyauProfil from "./elements/NoyauProfil/NoyauProfil.jsx";
import NoyauConnexion from "./components/NoyauConnexion/NoyauConnexion.jsx";
import AdminListeUtilisateurs from "./elements/AdminListeUtilisateurs/AdminListeUtilisateurs.jsx";
import AdminListeRoles from "./elements/AdminListeRoles/AdminListeRoles.jsx";
import AdminListePermissions from "./elements/AdminListePermissions/AdminListePermissions.jsx";
import TestComponents from "./elements/TestComponents.jsx";
import {controller} from "./controller/index.js";

const listeMessageEmis = []

const listeMessageRecu = [
    "connexion_acceptee",
]

const App = () => {
    const nomDInstance = "App";
    const verbose = true;

    const [loggedIn, setLoggedIn] = useState(false);

    const {current} = useRef({
        nomDInstance,
        traitementMessage: (msg) => {
            if (verbose || controller.verboseall) console.log(`INFO: (${nomDInstance}) - traitementMessage - `, msg);

            if (typeof msg.connexion_acceptee !== "undefined") {
                setLoggedIn(true);
            }
        }
    });

    useEffect(() => {
        if (verbose || controller.verboseall) console.log(`INFO: (${nomDInstance}) - useEffect - `);
        controller.subscribe(current, listeMessageEmis, listeMessageRecu);

        return () => {
            controller.unsubscribe(current, listeMessageEmis, listeMessageRecu);
        };
    }, []);


    return (
        <Routes>
            {loggedIn && (
                <>
                    <Route
                        path="/dev_route_connexion"
                        element={
                            <>
                                <NoyauConnexion/>
                            </>
                        }
                    />
                    <Route path="/" element={<Layout/>}>
                        <Route
                            index
                            path="discussions"
                            element={
                                /* l'élément à l'interieur de <></> sera affiché grâce au composant <Outlet /> dans <Layout /> */
                                <>
                                    <ListeDiscussion/>
                                    <NoyauAccueil/>
                                </>
                            }
                        />
                        <Route
                            path="discussion/:id"
                            element={
                                <>
                                    <ListeDiscussion/>
                                    <NoyauAccueil/>
                                </>
                            }
                        />
                        <Route
                            path="/dev_route_accueil"
                            element={
                                <>
                                    <Accueil/>
                                </>
                            }
                        />
                        <Route
                            path="profil"
                            element={
                                <>
                                    <NoyauProfil/>
                                </>
                            }
                        />
                        <Route
                            path="admin"
                            element={
                                <>
                                    <AdminListeUtilisateurs/>
                                </>
                            }
                        />
                        <Route
                            path="admin/users"
                            element={
                                <>
                                    <AdminListeUtilisateurs/>
                                </>
                            }
                        />
                        <Route
                            path="admin/roles"
                            element={
                                <>
                                    <AdminListeRoles/>
                                </>
                            }
                        />
                        <Route
                            path="admin/permissions"
                            element={
                                <>
                                    <AdminListePermissions/>
                                </>
                            }
                        />
                        <Route
                            path="test"
                            element={
                                <>
                                    <TestComponents/>
                                </>
                            }
                        />

                        <Route path="*" element={<NotFound/>}/>
                    </Route>
                </>
            )}

            {!loggedIn && (
                <>
                    <Route
                        path="/"
                        element={
                            <>
                                <NoyauConnexion/>
                            </>
                        }
                    />
                </>
            )}
        </Routes>
    );
}

export default App;
