import "./Layout.scss";
import NoyauBarreDeMenu from "../NoyauBarreDeMenu/NoyauBarreDeMenu";
import Accueil from "../../components/Accueil/NoyauAccueil.jsx";
import {Outlet, useLocation} from "react-router-dom";
import {appInstance} from "../../controller/index.js";
import {useEffect, useRef, useState} from "react";
import IncomingCallModal from "../IncomingCallModal/IncomingCallModal.jsx";
import NoyauAppelWidget from "../../components/NoyauAppelWidget/NoyauAppelWidget.jsx";

const listeMessagesEmis = ["accept_incoming_call"];
const listeMessagesRecus = ["incoming_call"];

export default function Layout() {
    const location = useLocation();
    const instanceName = "Layout";
    const verbose = true;

    const [controller] = useState(appInstance.getController());
    const [offer, setOffer] = useState(null);
    const [incomingCall, setIncomingCall] = useState(false);

    const {current} = useRef({
        instanceName,
        traitementMessage: (msg) => {
            if (verbose || controller.verboseall) console.log(`INFO (${instanceName}) - traitementMessage: `, msg);

            if (typeof msg.incoming_call !== "undefined") {
                handleOffer(msg.incoming_call);
            }
        }
    })

    useEffect(() => {
        controller.subscribe(current, listeMessagesEmis, listeMessagesRecus);
        return () => {
            controller.unsubscribe(current, listeMessagesEmis, listeMessagesRecus);
        };
    }, [controller, current]);

    function handleOffer(offer) {
        setOffer(offer);
        setIncomingCall(true);
    }

    async function acceptCall(value, offer) {
        console.warn("INFO Accepting call");
        controller.send(current, {
            "accept_incoming_call": {
                "value": value,
                "offer": offer
            }
        });
        setIncomingCall(false);
    }


    return (
        <div className="layout">
            {
                /*
                    IMPLEMENT HERE THE CALL MODAL
                    IF USER RECEIVES A CALL
                */
            }
            <IncomingCallModal offer={offer} calling={incomingCall} acceptCall={acceptCall}/>
            {
                /*
                    IMPLEMENT HERE THE CALL PIP
                    IF USER IS IN CALL OR CALLING
                    ALLOW USER TO CONTROL CALL WHEREVER HE IS
                */
            }
            <NoyauAppelWidget />
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

