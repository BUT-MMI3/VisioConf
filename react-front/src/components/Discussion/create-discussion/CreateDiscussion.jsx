import {initConnection} from "../../../controller/index.js";
import {useEffect, useRef, useState} from "react";
import './CreateDiscussion.scss';
import {useDiscussion} from "../context/DiscussionContext.jsx";
import {Check, X} from "react-feather";

const listeMessagesEmis = [
    "demande_creation_discussion",
    "demande_liste_utilisateurs",
];
const listeMessagesRecus = [
    "discussion_creee",
    "liste_utilisateurs",
];

const CreateDiscussion = () => {
    const instanceName = "CreateDiscussion";
    const verbose = false;

    const {setCreateDiscussion} = useDiscussion();

    const [controller] = useState(initConnection.getController());

    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const [discussionName, setDiscussionName] = useState("");
    const [discussionMembers, setDiscussionMembers] = useState([]);

    const [listeUtilisateurs, setListeUtilisateurs] = useState([]);

    const {current} = useRef({
        instanceName,
        traitementMessage: msg => {
            if (verbose || controller.verboseall) console.log("INFO (" + instanceName + ") - traitementMessage : ", msg);

            if (typeof msg.discussion_creee !== "undefined") {
                console.log("INFO (" + instanceName + ") - traitementMessage : discussion_creee : ", msg.discussion_creee);
                setCreateDiscussion(false);
            } else if (typeof msg.liste_utilisateurs !== "undefined") {
                console.log("INFO (" + instanceName + ") - traitementMessage : liste_utilisateurs : ", msg.liste_utilisateurs);
                setListeUtilisateurs(msg.liste_utilisateurs);
            }
        }
    })

    useEffect(() => {
        controller.subscribe(current, listeMessagesEmis, listeMessagesRecus);
        controller.send(current, {"demande_liste_utilisateurs": {}});

        return () => {
            controller.unsubscribe(current, listeMessagesEmis, listeMessagesRecus);
        }
    }, [current]);

    useEffect(() => {
        if (search === "" || listeUtilisateurs.length === 0) {
            setSearchResults([]);
            return;
        }
        setSearch(search.toLowerCase());

        const results = [];
        search.split(" ").forEach((word) => {
            listeUtilisateurs.forEach((user) => {
                Object.keys(user).forEach((key) => {
                    if (typeof user[key] === "string" && user[key].toLowerCase().includes(word) && !discussionMembers.includes(user._id) && !results.includes(user)) {
                        results.push(user);
                    }
                });
            });
        });
        setSearchResults(results);
    }, [search, listeUtilisateurs, discussionMembers]);

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
        <div className='create-discussion'>
            <div className='d-flex header-create-discussion'>
                <div className={"title"}>
                    <h1>Créer une discussion</h1>
                </div>

                <div className={"actions"}>
                    <button onClick={() => {
                        setDiscussionName("");
                        setDiscussionMembers([]);
                        setCreateDiscussion(false);
                    }} className={"close"}>
                        <X size={18}/>
                    </button>

                    <button onClick={createDiscussion} className={"create"}>
                        <Check size={18}/>
                    </button>
                </div>
            </div>

            <div className='form-create-discussion'>
                <div className="input-group">
                    <label htmlFor="discussionName">Nom de la discussion (facultatif)</label>
                    <input type="text" id="discussionName" name="discussionName" value={discussionName}
                           onChange={(e) => setDiscussionName(e.target.value)}/>
                </div>

                <div className="input-group">
                    <label htmlFor={'discussionMembers'}>Membres</label>
                    <div className="membres">
                        {discussionMembers.map((member, index) => {
                            const user = listeUtilisateurs.find((user) => user._id === member);
                            return (
                                <div key={index}>
                                    <div className='membre'>
                                        <span>{user.user_firstname} {user.user_lastname} ({user.user_job})</span>
                                        <X
                                            className='remove'
                                            onClick={() => {
                                                setDiscussionMembers(discussionMembers.filter((m) => m !== member));
                                            }}/>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <input type="text" id="discussionMembers" name="discussionMembers"
                           placeholder={'Recherchez des membres ...'} value={search}
                           onChange={(e) => setSearch(e.target.value)}/>
                </div>


                <ul className='search-results'>
                    {searchResults.map((user, index) => {
                        return (
                            <li key={index} className='search-result'>
                                <input type="checkbox" id={user._id} name={user._id} value={user._id}
                                       checked={discussionMembers.includes(user._id)}
                                       onChange={(e) => {
                                           if (e.target.checked) {
                                               setDiscussionMembers([...discussionMembers, e.target.value]);
                                           }
                                       }}/>
                                <label
                                    htmlFor={user._id}
                                    className={(discussionMembers.includes(user._id) ? 'selected' : '')}>{user.user_firstname} {user.user_lastname} ({user.user_job})</label>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

export default CreateDiscussion