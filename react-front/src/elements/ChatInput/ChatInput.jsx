/* 
Author: @mathis-lambert
Date: Janvier 2024
*/

import {useState} from "react";
import {useDiscussion} from "../../components/Discussion/context/DiscussionContext.jsx";
import "./ChatInput.scss";
import {Send} from "react-feather";

export default function ChatInput() {
    const {addMessage} = useDiscussion();
    const [newMessage, setNewMessage] = useState("");
    // const [file, setFile] = useState(null);

    // Gestion de la soumission du nouveau message
    const handleSubmit = (event) => {
        event.preventDefault();
        if (newMessage.trim()) {
            addMessage(newMessage.trim());
            // TODO: check the structure
            /*
                {
                    message: newMessage.trim(),
                    file: file
                }
             */
            setNewMessage(""); // Réinitialiser le champ après l'envoi
        }
    };

    // handle paste file
    // const handlePaste = (event) => {
    //     event.preventDefault();
    //     const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    //     for (const item of items) {
    //         if (item.kind === 'file') {
    //             const file = item.getAsFile();
    //             const blob = new Blob([file], {type: file.type});
    //             setFile(blob);
    //         }
    //     }
    // }

    return (
        <form onSubmit={handleSubmit} className="chat-form">
            {/* Affichage du nom du fichier collé et de l'aperçu */}
            {/* TODO: Terminer son implémentation */}
            {/*<div className="preview">*/}
            {/*    {file && (*/}
            {/*        <div className="preview-file">*/}
            {/*            {file.type.includes("image") && (*/}
            {/*                <img src={URL.createObjectURL(file)} alt="file"/>*/}
            {/*            )}*/}
            {/*            <button*/}
            {/*                type="button"*/}
            {/*                onClick={() => setFile(null)}*/}
            {/*            >*/}
            {/*                Annuler*/}
            {/*            </button>*/}
            {/*        </div>*/}
            {/*    )}*/}
            {/*</div>*/}
            <input
                type="text"
                value={newMessage}
                onChange={(event) => setNewMessage(event.target.value)}
                placeholder="Votre message"
                className="chat-input"
                // onPaste={(event) => handlePaste(event)}
            />
            <button type="submit" className="chat-send">
                <Send
                    size={20}
                />
            </button>
        </form>
    );
}
