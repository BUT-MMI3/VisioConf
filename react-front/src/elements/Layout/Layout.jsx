import "./Layout.scss";
import NoyauBarreDeMenu from "../NoyauBarreDeMenu/NoyauBarreDeMenu";
import Accueil from "../../components/Accueil/NoyauAccueil.jsx";
import { Outlet, useLocation } from "react-router-dom";
import {appInstance} from "../../controller/index.js";
import {useEffect, useState} from "react";
import IncomingCallModal from "../IncomingCallModal/IncomingCallModal.jsx";

export default function Layout() {
    const location = useLocation();

    const [webRTCManager] = useState(appInstance.getWebRTCManager());
    const [calling, setCalling] = useState(false);
    const [offer, setOffer] = useState(null);
    const [incomingCall, setIncomingCall] = useState(false);

    useEffect(() => {
        webRTCManager.setCallback("incomingCall", (offer) => {
            setOffer(offer);
            setIncomingCall(true);
        });

        webRTCManager.setCallback("setCalling", (value) => {
            setCalling(value);
            console.log("Setting calling to " + value)
        });

        return () => {
            webRTCManager.setCallback("incomingCall", null);
            webRTCManager.setCallback("setCalling", null);
        };
    }, [webRTCManager]);

    function acceptCall(value, offer) {
        webRTCManager.acceptIncomingCall(value, offer);
        setIncomingCall(false);
    }


    return (
        <div className="layout">
            {/*
                IMPLEMENT HERE THE CALL MODAL
                IF USER RECEIVES A CALL
            */}
            <IncomingCallModal offer={offer} calling={incomingCall} acceptCall={acceptCall}/>
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

