/*
* @author: Mathis LAMBERT
* @version: 1.0.0
*/

class WebRTCManager {
    instanceName = "WebRTCManager"
    config = {
        iceServers:
            [
                {urls: "stun:stun.l.google.com:19302"},
                {urls: "stun:stun1.l.google.com:19302"},
                {urls: "stun:stun2.l.google.com:19302"}
            ]
    }
    session = null
    connectedUsers = []
    // callbacks = {updateRemoteStreams, setInCall, setCalling, acceptIncomingCall, setIsSharingScreen, setCallCreator}
    peers = {} // The peer connections for each user
    remoteStreams = {} // The remote streams for each peer {socketId: {user, stream}}
    type = "video" // The type of call (video or audio)
    pendingIceCandidates = {} // Pending ice candidates for each peer {socketId: RTCIceCandidate[]}
    callMembers = [] // The members selected for the call
    inCallMembers = [] // The members connected to the call
    callAccepted = false // Whether the call has been accepted
    inCall = false // Whether the user is in a call
    muted = {
        audio: false,
        video: false
    } // Whether the user is muted
    isScreenSharing = false
    discussion = "" // The discussion id
    localStream = new MediaStream() // The local stream for the call
    localScreen = new MediaStream() // The local screen share stream
    callCreator = "" // The user who created the call

    controller = null
    listeMessagesRecus = [
        "receive_offer",
        "receive_answer",
        "receive_ice_candidate",
        "hung_up",
        "call_connected_users",
        "call_created",
        "accept_incoming_call",
        "connected_users",
        "info_session",
        "create_offer",
        "end_call",
        "is_in_call",
        "get_call_info",
        "get_streams",
        "mute_unmute_audio",
        "mute_unmute_video",
        "share_screen",
        "stop_sharing_screen",
        "leaved_call"
    ]
    listeMessagesEmis = [
        "send_offer",
        "send_answer",
        "send_ice_candidate",
        "hang_up",
        "reject_offer",
        "update_remote_streams",
        "set_remote_streams",
        "set_in_call",
        "set_calling",
        "incoming_call",
        "set_is_sharing_screen",
        "set_call_creator",
        "set_call_info",
        "demande_info_session",
        "demande_connected_users",
        "leave_call",
    ]

    verbose = true

    constructor(controller) {
        this.controller = controller // Le controller est un objet qui permet de gérer les messages reçus et émis
        this.controller.subscribe(this, this.listeMessagesEmis, this.listeMessagesRecus) // On s'abonne à ces messages
        if (this.verbose) console.log("WebRTCManager initialized")

        this.controller.send(this, {"demande_info_session": {}})
        this.controller.send(this, {"demande_connected_users": {}})
    }

    setSession = session => {
        if (this.verbose) console.log("Session set: ", session)
        this.session = session
    }

    setConnectedUsers = connectedUsers => {
        if (this.verbose) console.log("Connected users set: ", connectedUsers)
        this.connectedUsers = connectedUsers
    }

    setDiscussion = discussion => {
        this.discussion = discussion
    }

    traitementMessage = async (message) => {
        /**
         *  Traite le message reçu par le controller
         *
         * @param message - Le message reçu par le controller
         * @returns void
         */
        if (this.verbose) console.log("Message reçu par le WebRTCManager: ", message)

        if (typeof message.receive_offer !== "undefined") {                         // {sender: "", offer: {}, type: "", discussion: ""}
            await this.handleOffer(message.receive_offer)
        } else if (typeof message.receive_answer !== "undefined") {                 // {sender: "", answer: {}, discussion: ""}
            await this.handleAnswer(message.receive_answer)
        } else if (typeof message.receive_ice_candidate !== "undefined") {          // {sender: "", candidate: {}, discussion: ""}
            await this.handleIceCandidate(message.receive_ice_candidate)
        } else if (typeof message.hung_up !== "undefined") {                // {sender: "", discussion: ""}
            await this.handleHangUp(message.hung_up)
        } else if (typeof message.call_connected_users !== "undefined") {   // {connected_users: [], discussion: ""}
            this.inCallMembers = message.call_connected_users.connected_users
        } else if (typeof message.call_created !== "undefined") {           // {members: [], discussion: "", type: "", initiator: ""}
            console.log("CALL CREATED", message.call_created)
        } else if (typeof message.connected_users !== "undefined") {        // {connected_users: []}
            this.setConnectedUsers(message.connected_users)
        } else if (typeof message.info_session !== "undefined") {           // {session: {}}
            this.setSession(message.info_session)
        } else if (typeof message.accept_incoming_call !== "undefined") {  // {accepted: true, offer: {}}
            await this.acceptIncomingCall(message.accept_incoming_call.value, message.accept_incoming_call.offer)
        } else if (typeof message.create_offer !== "undefined") {           // {members: [], discussion: "", type: "", initiator: ""}
            await this.createOffer(message.create_offer.members, message.create_offer.discussion, message.create_offer.type, message.create_offer.initiator)
        } else if (typeof message.end_call !== "undefined") {               // {}
            await this.endCall()
        } else if (typeof message.is_in_call !== "undefined") {             // {value: true}
            this.controller.send(this, {
                "set_in_call": {
                    value: this.inCall,
                    discussion: this.discussion
                }
            })
        } else if (typeof message.get_call_info !== "undefined") {          // {}
            if (message.get_call_info.discussion === this.discussion) {
                this.controller.send(this, {"set_call_info": this.getCallInfo()})
            } else {
                this.controller.send(this, {"set_call_info": {}})
            }
        } else if (typeof message.get_streams !== "undefined") {            // {}
            if (message.get_streams.discussion === this.discussion) {
                this.controller.send(this, {"set_remote_streams": this.remoteStreams})
            } else {
                this.controller.send(this, {"set_remote_streams": {}})
            }
        } else if (typeof message.mute_unmute_audio !== "undefined") {      // {}
            this.muteUnmute("audio")
        } else if (typeof message.mute_unmute_video !== "undefined") {
            this.muteUnmute("video")
        } else if (typeof message.share_screen !== "undefined") {           // {}
            await this.shareScreen()
        } else if (typeof message.stop_sharing_screen !== "undefined") {    // {}
            await this.stopSharingScreen()
        } else if (typeof message.leaved_call !== "undefined") {            // {}
            await this.handleHangUp(message.leaved_call)
        }
    }

    newPeerConnection = async socketId => {
        /**
         * Create a new peer connection for the given socketId and add the local stream to it.
         *
         * @param socketId - The socketId of the user to connect to
         * @param type - The type of call (video or audio)
         *
         * @returns Promise<void>
         */
        if (this.peers[socketId]) return

        if (this.verbose)
            console.log("Creating new peer connection for: ", socketId)

        this.peers[socketId] = new RTCPeerConnection(this.config)

        this.peers[socketId].ontrack = event => {
            if (this.verbose) {
                console.log("Received remote stream: ", event.streams[0])
                event.streams[0].getTracks().forEach(track => {
                    console.log(
                        `Track kind: ${track.kind}, enabled: ${track.enabled}, readyState: ${track.readyState}`
                    )
                })
            }
            if (this.remoteStreams[socketId]) {
                if (this.verbose)
                    console.log("Remote stream already exists for: ", socketId)
                return
            }

            const user = this.connectedUsers.find(user => user.user_socket_id === socketId)
            if (!user) {
                console.error("Impossible de trouver l'utilisateur parmi les utilisateurs connectés")
            }
            this.remoteStreams[socketId] = {user: user, stream: event.streams[0], status: this.peers[socketId].iceConnectionState}

            this.controller.send(this, {
                "update_remote_streams": {
                    target: socketId,
                    stream: event.streams[0],
                    discussion: this.discussion
                }
            })
            this.controller.send(this, {"set_call_info": this.getCallInfo()})
        }

        this.peers[socketId].onicecandidate = event => {
            if (event.candidate) {
                if (this.verbose) console.log("Sending ice candidate: ", event.candidate)
                this.controller.send(this, {
                    "send_ice_candidate": {
                        target: socketId,
                        candidate: event.candidate,
                        discussion: this.discussion
                    }
                })
            }
            this.controller.send(this, {"set_call_info": this.getCallInfo()})
        }

        this.peers[socketId].oniceconnectionstatechange = () => {
            console.log(
                `Connection state change: ${this.peers[socketId].iceConnectionState}`
            )

            if (this.remoteStreams[socketId]) {
                this.remoteStreams[socketId].status = this.peers[socketId].iceConnectionState;
                this.controller.send(this, {
                    "update_remote_streams": {
                        target: socketId,
                        stream: this.remoteStreams[socketId],
                        discussion: this.discussion
                    }
                })
            }

            if (this.peers[socketId].iceConnectionState === "connected") {
                if (this.verbose || this.controller.verboseall) console.log("Call connected for: ", socketId)
                this.inCall = true
                this.controller.send(this, {
                    "set_in_call": {
                        value: this.inCall,
                        discussion: this.discussion
                    }
                })
                this.controller.send(this, {
                    "set_calling": false
                })
            }

            if (
                this.peers[socketId].iceConnectionState === "failed" ||
                this.peers[socketId].iceConnectionState === "disconnected"
            ) {
                console.log("Call failed or disconnected for: ", socketId)
                this.peers[socketId].close()
                delete this.peers[socketId]

                if (this.remoteStreams[socketId]) {
                    delete this.remoteStreams[socketId]
                    this.controller.send(this, {
                        "set_remote_streams": this.remoteStreams
                    })
                }

                if (Object.keys(this.peers).length === 0) {
                    this.controller.send(this, {
                        "set_in_call": {
                            value: false,
                            discussion: this.discussion
                        }
                    })
                    this.endCall()
                }
            }

            this.controller.send(this, {"set_call_info": this.getCallInfo()})
        }
    }

    addStreamTrack = async type => {
        if (!this.peers) {
            console.warn("No peer connections to add stream to")
            return
        }

        // Si le flux local n'est pas encore ajouté, obtenez-le
        if (this.localStream.getTracks().length === 0) {
            console.log("Local stream not added yet, getting local stream: ", type)
            await this.getLocalStream(type)
        }

        this.localStream.getTracks().forEach(track => {
            // Parcourir chaque connexion peer
            for (const peer in this.peers) {
                const senderAlreadyExists = this.peers[peer]
                    .getSenders()
                    .some(sender => sender.track === track)

                if (!senderAlreadyExists) {
                    console.log("Adding track to peer: ", peer)
                    this.peers[peer].addTrack(track, this.localStream)
                } else {
                    console.log("Track already exists in the peer connection: ", peer)
                }
            }
        })

        this.controller.send(this, {"set_call_info": this.getCallInfo()})
    }

    muteUnmute = (type) => {
        if (type === "audio") {
            if (this.verbose) console.log("Muting/unmuting audio")
            this.muted.audio = !this.muted.audio
            this.localStream.getAudioTracks().forEach(track => {
                track.enabled = !this.muted.audio
            })
        } else if (type === "video") {
            if (this.verbose) console.log("Muting/unmuting video")
            this.muted.video = !this.muted.video
            this.localStream.getVideoTracks().forEach(track => {
                track.enabled = !this.muted.video
            })
        }

        this.controller.send(this, {"set_call_info": this.getCallInfo()})
    }

    createOffer = async (members, discussion, type, initiator) => {
        /**
         * For each member in the discussion, create a new peer connection and send an offer
         * to the member.
         *
         * @param members - The members of the discussion
         * @param type - The type of call (video or audio)
         *
         * @returns Promise<void>
         */
        this.setDiscussion(discussion)
        this.type = type
        for (const member of members) {
            if (!this.session) {
                console.warn("No session user to create offer")
                return
            }
            if (member === this.session.user_socket_id) continue
            if (this.peers[member]) continue

            await this.newPeerConnection(member)
            await this.addStreamTrack(type)
            const offer = await this.peers[member].createOffer()
            await this.peers[member].setLocalDescription(offer)

            this.controller.send(this, {
                "send_offer": {
                    target: member,
                    offer: offer,
                    type: type,
                    discussion: discussion,
                    members: members,
                    initiator: initiator
                }
            })
        }
        this.inCall = true
        this.controller.send(this, {"set_calling": true})
        this.controller.send(this, {"set_in_call": {value: true, discussion: discussion}})
        this.controller.send(this, {"set_call_info": this.getCallInfo()})
    }

    getLocalStream = async type => {
        /**
         * Get the local stream for the given type (video or audio) and set it in the localStream
         *
         * @param type - The type of call (video or audio)
         *
         * @returns Promise<void>
         */
        try {
            if (this.verbose) console.log("Getting local stream: ", type)

            this.localStream = await navigator.mediaDevices.getUserMedia({
                video: type === "video",
                audio: type === "audio" || type === "video"
            })
        } catch (e) {
            console.error("Error getting local stream: ", e)
        }
    }

    getLocalScreen = async () => {
        try {
            this.localScreen = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true
            })
        } catch (e) {
            console.error("Error getting local screen: ", e)
        }
    }

    shareScreen = async () => {
        await this.getLocalScreen()
        if (!this.peers) console.warn("No peer connections to add stream to")

        for (const peer in this.peers) {
            const senders = this.peers[peer]
                .getSenders()
                .find(sender => (sender.track ? sender.track.kind === "video" : false))

            if (senders) {
                await senders.replaceTrack(this.localScreen.getVideoTracks()[0])
            } else {
                this.localScreen.getTracks().forEach(track => {
                    console.log("Adding track to peer: ", peer)
                    this.peers[peer].addTrack(track, this.localScreen)
                })
            }
        }

        // this.callbacks.setIsSharingScreen(true)
        this.controller.send(this, {"set_is_sharing_screen": true})
        this.isScreenSharing = true

        this.controller.send(this, {"set_call_info": this.getCallInfo()})
    }

    stopSharingScreen = async () => {
        if (!this.localScreen) return

        if (this.verbose) console.log("Stopping screen share")

        for (const peer in this.peers) {
            const senders = this.peers[peer]
                .getSenders()
                .find(sender => (sender.track ? sender.track.kind === "video" : false))
            if (senders) {
                await senders.replaceTrack(this.localStream.getVideoTracks()[0])
            }
        }

        this.localScreen.getTracks().forEach(track => track.stop())
        this.localScreen = new MediaStream()
        // this.callbacks.setIsSharingScreen(false)
        this.controller.send(this, {"set_is_sharing_screen": false})
        this.isScreenSharing = false

        this.controller.send(this, {"set_call_info": this.getCallInfo()})
    }

    handleOffer = async offer => {
        /**
         * Handle an incoming offer by creating a new peer connection and setting the remote description
         *
         * @param offer - The offer to handle
         *
         * @returns Promise<void>
         */
        if (this.verbose) console.log("Received offer: ", offer.offer)
        if (this.peers[offer.sender]) {
            console.warn("Peer connection already exists for: ", offer.sender)
            return
        }

        this.inCallMembers = offer.in_call_members

        if (offer.call_creator === offer.sender && !this.callAccepted) {
            if (this.verbose)
                console.log("Offer initiator is the sender: ", offer.sender)

            this.callCreator = offer.call_creator
            await this.newPeerConnection(offer.sender)
            this.setDiscussion(offer.discussion)
            // this.callbacks.setCallCreator(offer.initiator);
            this.controller.send(this, {"set_call_creator": offer.initiator})

            this.type = offer.type
            this.callMembers = offer.members
            // this.callbacks.incomingCall(offer)
            this.controller.send(this, {"incoming_call": offer})
        } else if (this.callAccepted) {
            if (this.verbose)
                console.log(
                    "Call already accepted, receiving offer from another user: ",
                    offer.sender
                )

            await this.newPeerConnection(offer.sender)
            await this.acceptIncomingCall(true, offer)
        } else {
            if (this.verbose) console.log("Call not accepted, rejecting offer from: ", offer.sender)

            this.controller.send(this, {"reject_offer": {target: offer.sender}})

            if (this.peers[offer.sender]) {
                this.peers[offer.sender].close()
                delete this.peers[offer.sender]
            }
        }
    }

    acceptIncomingCall = async (accepted, offer) => {
        /**
         * Accept an incoming call by creating a new peer connection and setting the remote description
         *
         * @param offer - The offer to accept
         *
         * @returns Promise<void>
         */
        if (this.verbose) console.log("Accepting incoming call: ", offer.offer)

        this.callAccepted = accepted

        if (!accepted) {
            this.controller.send(this, {"reject_offer": {target: offer.sender}})
            this.peers[offer.sender].close()
            delete this.peers[offer.sender]
            return
        }

        await this.addStreamTrack(offer.type)
        await this.peers[offer.sender].setRemoteDescription(offer.offer)
        const answer = await this.peers[offer.sender].createAnswer()
        await this.peers[offer.sender].setLocalDescription(answer)
        await this.handlePendingIceCandidates(offer.sender) // Handle any pending ice candidates
        // this.callbacks.setInCall(true)
        this.controller.send(this, {
            "set_in_call": {
                value: true,
                discussion: this.discussion
            }
        })

        this.controller.send(this, {"send_answer": {target: offer.sender, answer: answer, discussion: this.discussion}})

        console.info("In call members: ", this.inCallMembers)
        for (const member of this.inCallMembers) {
            if (!this.session) {
                console.warn("No session user to create offer")
                return
            }
            if (member === this.session.user_socket_id) continue
            if (member === offer.sender) continue
            if (this.peers[member]) continue
            console.log("Creating offer for connected member: ", member)
            await this.createOffer(
                this.callMembers,
                this.discussion,
                this.type,
                this.session.user_socket_id
            )
        }

        // this.callbacks.setCallInfo(this.getCallInfo())
        this.controller.send(this, {"set_call_info": this.getCallInfo()})
    }

    handleAnswer = async answer => {
        /**
         * Handle an incoming answer by setting the remote description
         *
         * @param answer - The answer to handle
         *
         * @returns Promise<void>
         */
        if (this.verbose) console.log("Setting remote description: ", answer.answer)
        if (!this.peers[answer.sender]) {
            console.warn("No peer connection for: ", answer.sender)
            return
        }
        // this.callbacks.setInCall(true)
        this.controller.send(this, {
            "set_in_call": {
                value: true,
                discussion: this.discussion
            }
        })
        await this.peers[answer.sender].setRemoteDescription(answer.answer)
        // this.callbacks.setCallInfo(this.getCallInfo())
        this.controller.send(this, {"set_call_info": this.getCallInfo()})
    }

    handleIceCandidate = async data => {
        /**
         * Handle an incoming ice candidate by adding it to the peer connection
         *
         * @param candidate - The ice candidate to handle
         *
         * @returns Promise<void>
         */
        try {
            const candidate = new RTCIceCandidate(data.candidate)
            if (!this.pendingIceCandidates[data.sender])
                this.pendingIceCandidates[data.sender] = []
            this.pendingIceCandidates[data.sender].push(candidate)

            if (
                this.peers[data.sender] &&
                this.peers[data.sender].remoteDescription
            ) {
                await this.handlePendingIceCandidates(data.sender)
            }
            // this.callbacks.setCallInfo(this.getCallInfo())
            this.controller.send(this, {"set_call_info": this.getCallInfo()})
        } catch (e) {
            console.error("Error adding ice candidate: ", e)
        }
    }

    handlePendingIceCandidates = async socketId => {
        /**
         * Once the peer connection is created, handle any pending ice candidates
         *
         * @param socketId - The socketId of the peer
         *
         * @returns Promise<void>
         */

        if (this.pendingIceCandidates[socketId]) {
            for (const candidate of this.pendingIceCandidates[socketId]) {
                if (this.verbose)
                    console.log(
                        "Adding pending ice candidate: ",
                        candidate,
                        " to peer: ",
                        this.peers[socketId]
                    )
                if (this.peers[socketId].remoteDescription) {
                    await this.peers[socketId].addIceCandidate(candidate)
                } else {
                    console.warn(
                        "Remote description not set, adding ice candidate to pending: ",
                        candidate
                    )
                }
            }
            delete this.pendingIceCandidates[socketId]
        } else {
            if (this.verbose)
                console.warn("No pending ice candidates for: ", socketId)
        }
    }

    handleHangUp = async data => {
        console.log("Received hang up: ", data)
        if (!this.session) {
            console.warn("No session user to create offer")
            return
        }

        if (data.sender === this.session.user_socket_id || data.sender === this.callCreator) {
            await this.endCall()
        } else {
            if (this.peers[data.sender]) {
                this.peers[data.sender].close()
            }

            delete this.peers[data.sender]

            if (this.remoteStreams[data.sender]) {
                delete this.remoteStreams[data.sender]
                this.controller.send(this, {"set_remote_streams": this.remoteStreams})
            }

            if (Object.keys(this.peers).length === 0) {
                this.controller.send(this, {
                    "set_in_call": {
                        value: false,
                        discussion: this.discussion
                    }
                })
                await this.endCall()
            }

            this.controller.send(this, {"leave_call": {discussion: this.discussion}})
        }

        this.controller.send(this, {"set_call_info": this.getCallInfo()})
    }

    endCall = async () => {
        /**
         * End the call by closing the peer connection for each peer
         *
         * @param void
         *
         * @returns void
         */
        console.log("( WebRTCManager -> endCall() ) | Ending call")

        // Close the local stream
        this.localStream.getTracks().forEach(track => track.stop())
        this.localScreen.getTracks().forEach(track => track.stop())

        this.localStream = new MediaStream()
        this.localScreen = new MediaStream()

        for (const peer in this.peers) {
            this.peers[peer].close()
            delete this.peers[peer]
        }

        if (!this.discussion) {
            console.error("No discussion to end call")
            return
        }

        this.controller.send(this, {"hang_up": {discussion: this.discussion}})
        this.reset()
        this.controller.send(this, {"set_call_info": this.getCallInfo()})
    }

    getCallInfo = () => {
        return {
            localStream: this.localStream,
            localScreen: this.localScreen,
            isScreenSharing: this.isScreenSharing,
            remoteStreams: this.remoteStreams,
            callCreator: this.callCreator,
            isCallCreator: this.callCreator === (this.session.user_socket_id ? this.session.user_socket_id : ""),
            discussion: this.discussion,
            inCall: this.inCall,
            callAccepted: this.callAccepted,
            type: this.type,
            muted: this.muted
        }
    }

    reset = () => {
        this.localStream = new MediaStream()
        this.localScreen = new MediaStream()
        this.remoteStreams = {}
        this.discussion = ""
        this.type = "video"
        this.pendingIceCandidates = {}
        this.callMembers = []
        this.inCallMembers = []
        this.callCreator = ""
        this.inCall = false
        this.callAccepted = false
        this.isScreenSharing = false
        this.controller.send(this, {"set_call_info": this.getCallInfo()})
        this.controller.send(this, {
            "set_in_call": {
                value: false,
                discussion: this.discussion
            }
        })
        this.controller.send(this, {"set_calling": false})
        this.controller.send(this, {"set_is_sharing_screen": false})
        this.controller.send(this, {"set_call_creator": ""})
        this.controller.send(this, {"set_remote_streams": {}})
    }
}

export default WebRTCManager
