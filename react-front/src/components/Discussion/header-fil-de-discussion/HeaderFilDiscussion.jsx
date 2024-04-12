import './HeaderFilDiscussion.scss'
import {Phone, UserPlus, Video, Users} from "react-feather";
import {useSelector} from "react-redux";

const HeaderFilDiscussion = ({discussion}) => {
    const session = useSelector(state => state.session)

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
                <button className="btn btn-primary" title={'Appel Vidéo'}><Video/></button>
                <button className="btn btn-primary" title={'Appel Audio'}><Phone/></button>
                <button className="btn btn-primary" title={'Ajouter un participant'}><UserPlus/></button>
                <button className="btn btn-secondary" title={'Infos du groupe'}><Users/></button>
            </div>
        </div>
    )
}

export default HeaderFilDiscussion