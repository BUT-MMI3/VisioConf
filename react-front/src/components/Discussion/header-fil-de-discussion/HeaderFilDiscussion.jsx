import './HeaderFilDiscussion.scss'
import {Phone, Video, UserPlus} from "react-feather";

const HeaderFilDiscussion = ({discussion}) => {
    return (
        <div className="header-fil-discussion">
            <h1>{discussion.discussion_name}</h1>

            <div className="actions">
                <button className="btn btn-primary" title={'Appel Vidéo'}><Video /></button>
                <button className="btn btn-primary" title={'Appel Audio'}><Phone /></button>
                <button className="btn btn-primary" title={'Ajouter un participant'}><UserPlus /></button>
            </div>
        </div>
    )
}

export default HeaderFilDiscussion