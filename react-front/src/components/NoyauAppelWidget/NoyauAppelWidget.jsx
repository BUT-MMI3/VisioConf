import {appInstance} from "../../controller/index.js";
import {useEffect, useRef, useState} from "react";
import './NoyauAppelWidget.scss'
import Draggable from "react-draggable";
import LinkTo from "../../elements/LinkTo/LinkTo.jsx";
import {ExternalLink, Phone, Video, VideoOff} from "react-feather";
import {useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
import RemoteVideo from "../../elements/RemoteVideo/RemoteVideo.jsx";

const listeMessagesEmis = ["get_call_info", "get_streams", "is_in_call", "end_call"]
const listeMessagesRecus = ["set_call_info", "set_remote_streams", "update_remote_streams", "set_in_call"]

const NoyauAppelWidget = () => {
    const instanceName = "NoyauAppelWidget"
    const verbose = false

    const location = useLocation()

    const [controller] = useState(appInstance.getController())
    const session = useSelector(state => state.session)

    const [hidden, setHidden] = useState(true)
    const [callInfo, setCallInfo] = useState({})
    const [remoteStreams, setRemoteStreams] = useState({})
    const [showStreams, setShowStreams] = useState(false)
    const [inCall, setInCall] = useState(false)
    const [discussion, setDiscussion] = useState(null)
    const [callTime, setCallTime] = useState(0)

    const {current} = useRef({
        instanceName,
        traitementMessage: (msg) => {
            if (verbose || controller.verboseall) console.log(`INFO (${instanceName}) - traitementMessage: `, msg);

            if (typeof msg.set_call_info !== "undefined") {
                setCallInfo(msg.set_call_info)
                setDiscussion(msg.set_call_info.discussion)
            } else if (typeof msg.set_remote_streams !== "undefined") {
                setRemoteStreams(msg.set_remote_streams)
            } else if (typeof msg.update_remote_streams !== "undefined") {
                updateRemoteStreams(msg.update_remote_streams.target, msg.update_remote_streams.stream);
            } else if (typeof msg.set_in_call !== "undefined") {
                setInCall(msg.set_in_call.value)
            }
        }
    })

    const updateRemoteStreams = (socketId, stream) => {
        setRemoteStreams((prevStreams) => {
            return {...prevStreams, [socketId]: stream};
        });
    };

    useEffect(() => {
        controller.subscribe(current, listeMessagesEmis, listeMessagesRecus)

        return () => {
            controller.send(current, {"get_call_info": {}})
            controller.unsubscribe(current, listeMessagesEmis, listeMessagesRecus)
        }
    }, [controller, current])

    useEffect(() => {
        if (inCall && callInfo) {
            if (location.pathname.includes("discussion")) {
                if (location.pathname.split('/')[2] === callInfo.discussion.discussion_uuid && inCall) {
                    setHidden(true)
                } else if (inCall && (location.pathname.split('/')[2] !== callInfo.discussion)) {
                    setHidden(false)
                }
            } else if (inCall) {
                setHidden(false)
            }
        } else {
            setHidden(true)
        }
    }, [callInfo, discussion, inCall, location])

    useEffect(() => {
        if (inCall) {
            const interval = setInterval(() => {
                // start time is callInfo.timeStart
                // current time is Date.now()
                setCallTime(Date.now() - callInfo.timeStart)
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [inCall, callInfo])

    return (
        <Draggable
            bounds={'parent'}
            handle=".NoyauAppelWidget__header"
            defaultPosition={{x: 0, y: 0}}
        >
            <div className={"NoyauAppelWidget"} hidden={hidden}>
                {inCall && !hidden && (
                    <>

                        <div className={"NoyauAppelWidget__header"}>
                            <div className={"NoyauAppelWidget__header__drag"}></div>
                        </div>

                        <div className={"NoyauAppelWidget__content"}>
                            <div className="NoyauAppelWidget__content__left">
                                {/*
                          IMPLEMENT HERE THE CALLER NAME (discussion info)
                        */}
                                <h3 className={"NoyauAppelWidget__content__left__title"}>
                                    {(discussion.discussion_members.length === 2 && (
                                        discussion.discussion_name || discussion.discussion_members.find((m) => m.user_uuid !== session.user_uuid).user_firstname
                                    )) || (discussion.discussion_members.length > 2 && (
                                        discussion.discussion_name || discussion.discussion_members.filter((m) => m.user_uuid !== session.user_uuid).map((m) => m.user_firstname).join(', ')
                                    )) || (
                                        discussion.discussion_name || "Discussion sans nom"
                                    )}
                                </h3>
                                <div className={"NoyauAppelWidget__content__left__icons"}>
                                    <LinkTo to={`discussion/${callInfo?.discussion.discussion_uuid}`}
                                            className={"btn btn-secondary"} title={"Retourner à l'appel"}>
                                        <ExternalLink size={18}/>
                                    </LinkTo>
                                    <button className={"btn btn-tertiary"} onClick={() => setShowStreams(!showStreams)}
                                            title={"Afficher/Masquer les flux"}>
                                        {showStreams ? <Video size={18}/> : <VideoOff size={18}/>}
                                    </button>
                                </div>
                                <p className={"NoyauAppelWidget__content__left__call-time"}>{new Date(callTime).toISOString().substring(11, 19)}</p>
                            </div>

                            <div className="NoyauAppelWidget__content__right">
                                <div className={"NoyauAppelWidget__content__right__hangup"} onClick={() => {
                                    controller.send(current, {"end_call": {}})
                                    setHidden(true)
                                    setInCall(false)
                                }}>
                                    <Phone size={18}/>
                                </div>
                            </div>

                        </div>

                        <div className={"NoyauAppelWidget__streams"} style={{display: showStreams ? "block" : "none"}}>
                            {Object.keys(callInfo?.remoteStreams).map((socketId) => {
                                return (
                                    <div className={"NoyauAppelWidget__streams__stream"} key={socketId}>
                                        <RemoteVideo key={socketId} stream={callInfo?.remoteStreams[socketId]}
                                                     callInfo={callInfo}/>
                                    </div>
                                );
                            })}
                        </div>

                    </>
                )}
            </div>
        </Draggable>
    )
}

export default NoyauAppelWidget;