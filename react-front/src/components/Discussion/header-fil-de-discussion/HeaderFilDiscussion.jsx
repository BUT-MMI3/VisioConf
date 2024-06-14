import './HeaderFilDiscussion.scss'
import {Cast, Mic, MicOff, Phone, PhoneOff, UserPlus, Users, Video, VideoOff} from "react-feather";
import {useSelector} from "react-redux";
import {useDiscussion} from "../context/DiscussionContext.jsx";
import {appInstance} from "../../../controller/index.js";
import {useEffect, useRef, useState} from "react";

const listeMessagesEmis = ["end_call", "mute_unmute_audio", "share_screen", "stop_sharing_screen", "mute_unmute_video", "get_call_info"]
const listeMessagesRecus = ["set_call_info"]

const HeaderFilDiscussion = ({discussion, inCall}) => {
    const instanceName = "HeaderFilDiscussion"
    const verbose = false
    const session = useSelector(state => state.session)
    const {call} = useDiscussion()
    const [controller] = useState(appInstance.getController())
    const [callInfo, setCallInfo] = useState({})

    const [showInfo, setShowInfo] = useState(false)

    const {current} = useRef({
        instanceName,
        traitementMessage: (msg) => {
            if (verbose || controller.verboseall) console.log(`INFO (${instanceName}) - traitementMessage: `, msg);

            if (typeof msg.set_call_info !== "undefined") {
                setCallInfo(msg.set_call_info)
            }
        }
    })

    useEffect(() => {
        controller.subscribe(current, listeMessagesEmis, listeMessagesRecus)

        controller.send(current, {"get_call_info": {}})
        console.log(discussion)
        console.log(discussion.discussion_members.find((m) => m._id === discussion.discussion_creator))

        return () => {
            controller.unsubscribe(current, listeMessagesEmis, listeMessagesRecus)
        }
    }, [controller, current]);

    const hangUp = async () => {
        if (inCall) {
            controller.send(current, {"end_call": {}})
        }
    }

    const muteUnmute = (type) => {
        if (inCall) {
            if (type === "audio") {
                controller.send(current, {"mute_unmute_audio": {}})
            } else if (type === "video") {
                controller.send(current, {"mute_unmute_video": {}})
            }
        }
    }

    const shareScreen = () => {
        if (inCall) {
            controller.send(current, {"share_screen": {}})
        }
    }

    const stopSharingScreen = () => {
        if (inCall) {
            controller.send(current, {"stop_sharing_screen": {}})
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
                    <>
                        <button className="btn btn-danger" title={'Raccrocher'} onClick={hangUp}><PhoneOff/></button>
                        {callInfo.isScreenSharing && (
                            <button className="btn btn-primary" title={'Arrêter de partager l\'écran'}
                                    onClick={stopSharingScreen}>
                                <Cast/></button>
                        ) || (
                            <button className="btn btn-secondary" title={'Partager l\'écran'} onClick={shareScreen}>
                                <Cast/></button>
                        )}

                        {callInfo.muted && (
                            <>
                                {callInfo.muted?.audio && (
                                    <button className="btn btn-secondary" title={'Activer le micro'}
                                            onClick={() => muteUnmute("audio")}>
                                        <MicOff/></button>
                                ) || (
                                    <button className="btn btn-primary" title={'Couper le micro'}
                                            onClick={() => muteUnmute("audio")}>
                                        <Mic/></button>
                                )
                                }

                                {callInfo.muted?.video && (
                                    <button className="btn btn-secondary" title={'Activer la vidéo'}
                                            onClick={() => muteUnmute("video")}>
                                        <VideoOff/></button>
                                ) || (
                                    <button className="btn btn-primary" title={'Couper la vidéo'}
                                            onClick={() => muteUnmute("video")}>
                                        <Video/></button>
                                )
                                }
                            </>
                        )}
                    </>
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
                <button className="btn btn-secondary" title={'Infos du groupe'}
                        onClick={() => setShowInfo(!showInfo)}
                >
                    <Users/></button>
            </div>

            <div className={"header-fil-discussion__info" + (showInfo ? " show" : "")}>
                <div className="header-fil-discussion__info__container">
                    <div className="header-fil-discussion__info__container__members">
                        {discussion.discussion_members.map((m) => (
                            <div key={m._id} className="header-fil-discussion__info__container__members__item">
                                <img src={m.user_picture} alt={"pdp"}/>
                                <span>{m.user_firstname + " " + m.user_lastname}</span>
                                {m._id === discussion.discussion_creator && (
                                    <span className={"creator"}>Créateur</span>
                                ) || (m.user_is_online && (
                                    <span className={"online"}></span>
                                ) || (
                                    <span className={"offline"}></span>
                                ))}
                            </div>
                        ))}
                    </div>

                    <div className="header-fil-discussion__info__container__date">
                        <span>Création le {new Date(discussion.discussion_date_create).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeaderFilDiscussion