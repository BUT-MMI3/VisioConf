import {MoreHorizontal} from "react-feather";
import {memo, useEffect, useRef, useState} from "react";
import "./RemoteVideo.scss";

const RemoteVideo = ({stream, callInfo}) => {
    const [modalVisibility, setModalVisibility] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream.stream;
        }
    }, [stream]);


    return (
        <div className="remote-video-container">
            <video autoPlay playsInline className={"remote-video"} ref={videoRef}></video>
            <div className="remote-video-info">
                <p className={"stream-name"}>{stream.user.user_firstname} {callInfo.callCreator === stream.user.user_socket_id ? "(Animateur)" : ""}</p>
                <p className={"stream-status " + (stream.status)}
                   title={stream.status}></p>
            </div>

            <div className="remote-video-options">
                <button className="remote-video-button" onClick={() => {
                    setModalVisibility(!modalVisibility);
                }}><MoreHorizontal/></button>
            </div>

            <div className={"remote-video-options-modal" + (modalVisibility ? " show" : "")}>
                {callInfo.isCallCreator && (
                    <button className="remote-video-button" disabled>
                        Rendre animateur
                    </button>
                )}
                <button className="remote-video-button" disabled onClick={() => {
                }}>Mettre en sourdine
                </button>
                <button className="remote-video-button" disabled onClick={() => {
                }}>Arrêter la vidéo
                </button>
                <button className="remote-video-button" disabled onClick={() => {
                }}>Expulser
                </button>
            </div>
        </div>
    );
}

export default memo(RemoteVideo);