import RemoteVideo from "../../../elements/RemoteVideo/RemoteVideo.jsx";
import './Call.scss'

const Call = ({streams, callInfo}) => {

    return (
        <div className={"left"} id={'call'}>
            <div>
                <em>{callInfo.isCallCreator ? "Vous êtes l'animateur" : ''}</em>
            </div>

            <div id="video-container">
                <video autoPlay playsInline id="local-video" muted ref={video => {
                    if (video && callInfo.localStream) {
                        video.srcObject = callInfo.localStream;
                    }
                }}></video>

                <video autoPlay playsInline id="local-screen-sharing" muted
                       className={callInfo.isScreenSharing ? "show" : "hidden"}
                       ref={video => {
                           if (video && callInfo.localScreen) {
                               video.srcObject = callInfo.localScreen;
                           }
                       }}></video>

                {Object.keys(streams).length > 0 && (
                    <div id="remote-videos">
                        {Object.values(streams).map((stream) => {
                            if (stream.user && stream.user.user_socket_id) {
                                return (
                                    <RemoteVideo key={stream.user.user_socket_id || "inconnu"}
                                                 stream={stream}
                                                 callInfo={callInfo}
                                    />
                                )
                            } else {
                                return null
                            }
                        })}
                    </div>
                )}

            </div>
        </div>
    )
}

export default Call

