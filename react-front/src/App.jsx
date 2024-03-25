/**
 * Author: @mathis-lambert
 * Date : Janvier 2024
 */
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import Accueil from "./elements/Accueil/NoyauAccueil.jsx";
import {useEffect, useRef} from "react";
import NotFound from "./elements/NotFound.jsx";
import Layout from "./elements/Layout/Layout.jsx";
import NoyauProfil from "./elements/NoyauProfil/NoyauProfil.jsx";
import NoyauInscription from "./components/NoyauInscription/NoyauInscription.jsx";
import NoyauConnexion from "./components/NoyauConnexion/NoyauConnexion.jsx";
import AdminListeUtilisateurs from "./elements/AdminListeUtilisateurs/AdminListeUtilisateurs.jsx";
import AdminListeRoles from "./elements/AdminListeRoles/AdminListeRoles.jsx";
import AdminListePermissions from "./elements/AdminListePermissions/AdminListePermissions.jsx";
import TestComponents from "./elements/TestComponents.jsx";
import {controller, canal} from "./controller/index.js";
import {socket} from "./controller/socket.js";
import {useSelector, useDispatch} from 'react-redux';
import {signIn, signOut} from './features/session/sessionSlice';
import DiscussionComponent from "./components/Discussion/DiscussionComponent.jsx";

const listeMessageEmis = []

const listeMessageRecus = [
    "connexion_acceptee",
    "inscription_acceptee",
    "client_deconnexion"
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
                dispatch(signIn({
                    session_token: msg.connexion_acceptee.session_token,
                    user_info: msg.connexion_acceptee.user_info
                }));
            } else if (typeof msg.client_deconnexion !== "undefined") {
                socket.disconnect(); // déconnecte le socket pour éviter les erreurs
                dispatch(signOut()); // déconnexion
                canal.setSessionToken(null); // supprime le token de session
                console.log(canal.sessionToken);
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
        controller.subscribe(current, listeMessageEmis, listeMessageRecus);

        return () => {
            controller.unsubscribe(current, listeMessageEmis, listeMessageRecus);
        };
    }, [current]);

    useEffect(() => {
        if (!session.isSignedIn && location.pathname !== "/login" && location.pathname !== "/forgot-password" && location.pathname !== "/inscription") navigate("/login");


        if (session.isSignedIn && (location.pathname === "/login" || location.pathname === "/forgot-password")) navigate("/");
    }, [session.isSignedIn, location.pathname, navigate]);

    useEffect(() => {
        if (session.user_session_token) {
            canal.setSessionToken(session.user_session_token);
        }
    }, [session.user_session_token]);

    useEffect(() => {
        if (session) {
            console.log("session", session);
        }
    }, [session]);

    return (
        <Routes>
            {session.isSignedIn && (
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
