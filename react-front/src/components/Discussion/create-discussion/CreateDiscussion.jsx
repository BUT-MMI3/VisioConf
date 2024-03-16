import {controller} from "../../../controller/index.js";
import {useEffect, useRef, useState} from "react";
import './CreateDiscussion.scss';

const listeMessagesEmis = [
    "demande_creation_discussion",
];
const listeMessagesRecus = [
    "discussion_creee",
];

const CreateDiscussion = () => {
    const instanceName = "CreateDiscussion";
    const verbose = false;

    const [discussionName, setDiscussionName] = useState("");
    const [discussionMembers, setDiscussionMembers] = useState([]);

    const {current} = useRef({
        instanceName,
        traitementMessage: msg => {
            if (verbose || controller.verboseall) console.log("INFO (" + instanceName + ") - traitementMessage : ", msg);

            if (typeof msg.discussion_creee !== "undefined") {
                console.log("INFO (" + instanceName + ") - traitementMessage : discussion_creee : ", msg.discussion_creee);
            }
        }
    })

    useEffect(() => {
        controller.subscribe(current, listeMessagesEmis, listeMessagesRecus);

        return () => {
            controller.unsubscribe(current, listeMessagesEmis, listeMessagesRecus);
        }
    }, [current]);

    const createDiscussion = () => {
        const message = {
            "demande_creation_discussion": {
                "discussionName": discussionName,
                "discussionMembers": discussionMembers
            }
        };
        controller.send(current, message);
    }


    return (
        <div>
            <h1>Create Discussion</h1>

            <div>
                <label htmlFor="discussionName">Discussion Name</label>
                <input type="text" id="discussionName" name="discussionName" value={discussionName}
                       onChange={(e) => setDiscussionName(e.target.value)}/>

                <label htmlFor="discussionMembers">Discussion Members</label>
                <input type="text" id="discussionMembers" name="discussionMembers" value={discussionMembers}
                       onChange={(e) => setDiscussionMembers(e.target.value)}/>

                <button onClick={createDiscussion}>
                    Créer la discussion
                </button>
            </div>
        </div>
    )
}

export default CreateDiscussion