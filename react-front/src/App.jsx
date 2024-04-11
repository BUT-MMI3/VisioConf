/**
 * Author: @mathis-lambert
 * Date : Janvier 2024
 */
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import Accueil from "./components/Accueil/NoyauAccueil.jsx";
import {useEffect, useRef, useState} from "react";
import NotFound from "./elements/NotFound.jsx";
import Layout from "./elements/Layout/Layout.jsx";
import NoyauProfil from "./elements/NoyauProfil/NoyauProfil.jsx";
import NoyauInscription from "./components/NoyauInscription/NoyauInscription.jsx";
import NoyauConnexion from "./components/NoyauConnexion/NoyauConnexion.jsx";
import AdminListeUtilisateurs from "./elements/AdminListeUtilisateurs/AdminListeUtilisateurs.jsx";
import AdminListeRoles from "./elements/AdminListeRoles/AdminListeRoles.jsx";
import AdminListePermissions from "./elements/AdminListePermissions/AdminListePermissions.jsx";
import TestComponents from "./elements/TestComponents.jsx";
import {appInstance} from "./controller/index.js";
import {socket} from "./controller/socket.js";
import {useDispatch, useSelector} from 'react-redux';
import {signIn, signOut} from './features/session/sessionSlice';
import DiscussionComponent from "./components/Discussion/DiscussionComponent.jsx";
import Loader from "./elements/Loader/Loader.jsx";

const listeMessageEmis = []

const listeMessageRecus = [
    "connexion_acceptee",
    "inscription_acceptee",
    "client_deconnexion"
]

const App = () => {
    const instanceName = "App";
    const verbose = false;

    const [loading, setLoading] = useState(appInstance.loading);
    const [controller, setController] = useState(appInstance.controller);
    const [canal, setCanal] = useState(appInstance.canal);

    const navigate = useNavigate();
    const location = useLocation();

    const session = useSelector((state) => state.session);
    const dispatch = useDispatch();

    const {current} = useRef({
        instanceName,
        traitementMessage: (msg) => {
            if (verbose || (controller ? controller.verboseall : null)) console.log(`INFO: (${instanceName}) - traitementMessage - `, msg);

            if (typeof msg.connexion_acceptee !== "undefined") {
                dispatch(signIn({
                    session_token: msg.connexion_acceptee.session_token,
                    user_info: msg.connexion_acceptee.user_info
                }));
            } else if (typeof msg.client_deconnexion !== "undefined") {
                socket.disconnect(); // déconnecte le socket pour éviter les erreurs
                dispatch(signOut()); // déconnexion
                canal ? canal.setSessionToken(null) : null; // supprime le token de session
                socket.connect(); // reconnect
            } else if (typeof msg.inscription_acceptee !== "undefined") {
                dispatch(signIn({
                    session_token: msg.inscription_acceptee.session_token,
                    user_info: msg.inscription_acceptee.user_info
                }));
            }
        }
    });

    useEffect(() => {
        // Définir un callback pour être notifié des changements de `loading`
        appInstance.setLoadingCallback(setLoading);
        appInstance.setControllerCallback(setController);
        appInstance.setCanalCallback(setCanal);

        return () => {
            appInstance.setLoadingCallback(null);
            appInstance.setControllerCallback(null);
            appInstance.setCanalCallback(null);
        }
    }, []);

    useEffect(() => {
        if (!loading) {
            controller.subscribe(current, listeMessageEmis, listeMessageRecus);

            return () => {
                controller.unsubscribe(current, listeMessageEmis, listeMessageRecus);
            };
        }
    }, [controller, current, loading]);

    useEffect(() => {
        if (!session.isSignedIn && (location.pathname !== "/login" && location.pathname !== "/forgot-password" && location.pathname !== "/inscription")) {
            navigate("/login");
        }

        if (session.isSignedIn && (location.pathname === "/login" || location.pathname === "/forgot-password" || location.pathname === "/inscription")) {
            navigate("/");
        }
    }, [session.isSignedIn, location.pathname, navigate]);


    useEffect(() => {
        if (session.user_session_token) {
            canal.setSessionToken(session.user_session_token);
        }
    }, [canal, session.user_session_token]);

    useEffect(() => {
        if (session) {
            if (verbose) console.log("session", session);
        }
    }, [verbose, session]);

    return (
        <Routes>
            {loading && (
                <>
                    <Route path="*" element={<Loader/>}/>
                </>
            )}
            {session.isSignedIn && !loading && (
                <>
                    <Route path="/" element={<Layout/>}>
                        <Route
                            index
                            path="discussions"
                            element={
                                /* l'élément à l'interieur de <></> sera affiché grâce au composant <Outlet /> dans <Layout /> */
                                <>
                                    <DiscussionComponent/>
                                </>
                            }
                        />
                        <Route
                            path="discussion/:id"
                            element={
                                <>
                                    <DiscussionComponent/>
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
                            path="/profil"
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

            {!session.isSignedIn && !loading && (
                <>
                    <Route
                        path="/inscription"
                        element={
                            <>
                                <NoyauInscription/>
                            </>
                        }
                    />

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
