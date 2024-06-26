import {useEffect, useState} from "react";
import './IncomingCallModal.scss';
import {useNavigate} from "react-router-dom";

const IncomingCallModal = ({offer, calling, acceptCall}) => {
    const [name, setName] = useState("Inconnu");
    const navigate = useNavigate();

    useEffect(() => {
        if (offer) {
            setName(offer.pseudo_caller || "Inconnu");
        }
    }, [offer]);

    const handleAccept = async () => {
        navigate('/discussion/' + offer.discussion.discussion_uuid);
        await acceptCall(true, offer);
    }

    const handleReject = async () => {
        await acceptCall(false, offer);
    }

    return (
        <>
            <div className={'incoming_call_modal' + (calling ? ' show' : '')}>
                <div className={"modal-content"}>
                    <h2>Appel entrant de {name}</h2>
                    <div className={"modal-buttons"}>
                        <button className={'btn btn-secondary'} onClick={handleAccept}
                        >
                            Accepter
                        </button>
                        <button className={'btn btn-tertiary'} onClick={handleReject}
                        >
                            Rejeter
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default IncomingCallModal;