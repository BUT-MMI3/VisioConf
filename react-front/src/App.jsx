/**
 * Author: @mathis-lambert
 * Date : Janvier 2024
 */
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import NoyauAccueil from "./elements/NoyauAccueil/NoyauAccueil.jsx";
import Accueil from "./elements/Accueil/NoyauAccueil.jsx";
// import { io } from "./io";
import {useEffect, useRef} from "react";
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
import {socket} from "./controller/socket.js";
import { useSelector, useDispatch } from 'react-redux';
import { signIn, signOut } from './features/session/sessionSlice';

const listeMessageEmis = []

const listeMessageRecus = [
    "connexion_acceptee",
    "deconnexion"
]

const App = () => {
    const instanceName = "App";
    const verbose = true;

    const navigate = useNavigate();
    const location = useLocation();

    const session = useSelector((state) => state.session);
    const dispatch = useDispatch();

    const {current} = useRef({
        instanceName,
        traitementMessage: (msg) => {
            if (verbose || controller.verboseall) console.log(`INFO: (${instanceName}) - traitementMessage - `, msg);

            if (typeof msg.connexion_acceptee !== "undefined") {
                dispatch(signIn(msg.connexion_acceptee.user_info));
            } else if (typeof msg.deconnexion !== "undefined") {
                socket.disconnect(); // déconnecte le socket pour éviter les erreurs
                dispatch(signOut()); // déconnexion
                socket.connect(); // reconnect
            }
        }
    });

    useEffect(() => {
        controller.subscribe(current, listeMessageEmis, listeMessageRecus);

        return () => {
            controller.unsubscribe(current, listeMessageEmis, listeMessageRecus);
        };
    }, [current]);

    useEffect(() => {
        if (!session.isSignedIn && (location.pathname !== "/login" || location.pathname !== "/forgot-password")) navigate("/login");

        if (session.isSignedIn && (location.pathname === "/login" || location.pathname === "/forgot-password")) navigate("/");
    }, [session.isSignedIn, location.pathname, navigate]);


    return (
        <Routes>
            {session.isSignedIn && (
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

            {!session.isSignedIn && (
                <>
                    <Route
                        path="/login"
                        element={
                            <>
                                <NoyauConnexion/>
                            </>
                        }
                    />

                    <Route
                        path="/forgot-password"
                        element={
                            <>
                                <NoyauConnexion/>
                            </>
                        }
                    />

                    <Route path="*" element={<NotFound/>}/>
                </>
            )}
        </Routes>
    );
}

export default App;
