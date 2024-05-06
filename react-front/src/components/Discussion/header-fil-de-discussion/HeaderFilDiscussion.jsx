import './HeaderFilDiscussion.scss'
import {Phone, PhoneOff, UserPlus, Users, Video} from "react-feather";
import {useSelector} from "react-redux";
import {useDiscussion} from "../context/DiscussionContext.jsx";
import {appInstance} from "../../../controller/index.js";
import {useEffect, useRef, useState} from "react";

const listeMessagesEmis = ["end_call"]
const listeMessagesRecus = []

const HeaderFilDiscussion = ({discussion, inCall}) => {
    const instanceName = "HeaderFilDiscussion"
    const verbose = false
    const session = useSelector(state => state.session)
    const {call} = useDiscussion()
    const [controller] = useState(appInstance.getController())

    const {current} = useRef({
        instanceName,
        traitementMessage: (msg) => {
            if (verbose || controller.verboseall) console.log(`INFO (${instanceName}) - traitementMessage: `, msg);
        }
    })

    useEffect(() => {
        controller.subscribe(current, listeMessagesEmis, listeMessagesRecus)

        return () => {
            controller.unsubscribe(current, listeMessagesEmis, listeMessagesRecus)
        }
    }, [controller, current]);

    const hangUp = async () => {
        if (inCall) {
            controller.send(current, {"end_call": {}})
        }
    }

    return (
        <div className="header-fil-discussion">
            <h1>
                {(discussion.discussion_members.length === 2 && (
                    discussion.discussion_name || discussion.discussion_members.find((m) => m.user_uuid !== session.user_uuid).user_firstname
                )) || (discussion.discussion_members.length > 2 && (
                    discussion.discussion_name || discussion.discussion_members.filter((m) => m.user_uuid !== session.user_uuid).map((m) => m.user_firstname).join(', ')
                )) || (
                    discussion.discussion_name || "Discussion sans nom"
                )}
            </h1>

            <div className="actions">
                {inCall && (
                    <button className="btn btn-danger" title={'Raccrocher'} onClick={hangUp}><PhoneOff/>
                    </button>
                ) || (
                    <>
                        <button className="btn btn-primary" title={'Appel Vidéo'} onClick={() => call("video")}><Video/>
                        </button>
                        <button className="btn btn-primary" title={'Appel Audio'} onClick={() => call("audio")}><Phone/>
                        </button>
                    </>
                )}

                <button className="btn btn-primary" title={'Ajouter un participant -> non implémenté'} disabled={true}>
                    <UserPlus/></button>
                <button className="btn btn-secondary" title={'Infos du groupe -> non implémenté'} disabled={true}>
                    <Users/></button>
            </div>
        </div>
    )
}

export default HeaderFilDiscussion