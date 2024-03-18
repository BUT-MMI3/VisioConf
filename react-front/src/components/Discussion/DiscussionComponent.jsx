import {DiscussionContextProvider} from './context/DiscussionContext.jsx';
import './DiscussionComponent.scss';

const DiscussionComponent = () => {
    return (
        <div className="discussion-component layout-content--full">
            <DiscussionContextProvider/>
        </div>
    );
};

export default DiscussionComponent;
