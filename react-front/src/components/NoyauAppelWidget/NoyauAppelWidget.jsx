import {appInstance} from "../../controller/index.js";
import {useEffect, useRef, useState} from "react";
import './NoyauAppelWidget.scss'
import Draggable from "react-draggable";
import LinkTo from "../../elements/LinkTo/LinkTo.jsx";
import {Phone} from "react-feather";
import {useLocation} from "react-router-dom";

const listeMessagesEmis = ["get_call_info", "get_streams", "is_in_call", "end_call"]
const listeMessagesRecus = ["set_call_info", "set_remote_streams", "update_remote_streams", "set_in_call"]

const NoyauAppelWidget = () => {
    const instanceName = "NoyauAppelWidget"
    const verbose = true

    const location = useLocation()

    const [controller] = useState(appInstance.getController())

    const [hidden, setHidden] = useState(true)
    const [callInfo, setCallInfo] = useState({})
    const [remoteStreams, setRemoteStreams] = useState({})
    const [inCall, setInCall] = useState(false)
    const [discussion, setDiscussion] = useState(null)
    const [callTime, setCallTime] = useState(0)

    const {current} = useRef({
        instanceName,
        traitementMessage: (msg) => {
            if (verbose || controller.verboseall) console.log(`INFO (${instanceName}) - traitementMessage: `, msg);

            if (typeof msg.set_call_info !== "undefined") {
                console.warn("INFO - set_call_info: ", msg.set_call_info)
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
        if (location.pathname.includes("discussion")) {
            if (location.pathname.split('/')[2] === callInfo.discussion && inCall) {
                setHidden(true)
            } else if (inCall) {
                setHidden(false)
            }
        } else if (inCall) {
            setHidden(false)
        }
    }, [callInfo.discussion, discussion, inCall, location])

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
                <div className={"NoyauAppelWidget__header"}>
                    <div className={"NoyauAppelWidget__header__drag"}></div>
                </div>

                <div className={"NoyauAppelWidget__content"}>
                    <div className="NoyauAppelWidget__content__left">
                        {/*
                          IMPLEMENT HERE THE CALLER NAME (discussion info)
                        */}
                        <h3 className={"NoyauAppelWidget__content__left__title"}>{discussion?.discussion_name}</h3>
                        <LinkTo to={`discussion/${callInfo?.discussion.discussion_uuid}`}>Voir l&apos;appel</LinkTo>
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

                {/*<div className={"NoyauAppelWidget__streams"}>*/}
                {/*    {Object.keys(remoteStreams).map((socketId) => {*/}
                {/*        return (*/}
                {/*            <video key={socketId} style={'visibility:hidden;'} autoPlay={true} ref={(video) => {*/}
                {/*                if (video) {*/}
                {/*                    video.srcObject = remoteStreams[socketId];*/}
                {/*                }*/}
                {/*            }}/>*/}
                {/*        );*/}
                {/*    })}*/}
                {/*</div>*/}
            </div>
        </Draggable>
    )
}

export default NoyauAppelWidget;