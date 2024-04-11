import {appInstance} from "../../controller/index.js";
import {useState, useRef, useEffect} from "react";
import {Link} from "react-router-dom";
const listeMessagesEmis = ["naviguer_vers"];
const listeMessagesRecus = [];

const LinkTo = ({ to, children, className="" }) => {
    const instanceName = "LinkTo-" + to;

    const [controller] = useState(appInstance.getController());

    const {current} = useRef({
        instanceName,
        traitementMessage: () => {}
    });

    useEffect(() => {
        if (controller) {
           controller.subscribe(current, listeMessagesEmis, listeMessagesRecus);

              return () => {
                controller.unsubscribe(current, listeMessagesEmis, listeMessagesRecus);
              }
        }
    }, [controller, current]);

    const handleClick = () => {
        if (controller) {
            controller.send(current, {
                'naviguer_vers': to
            });
        }
    };

  return (
    <Link to={to} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
};

export default LinkTo;