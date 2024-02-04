/**
 * Author: @mathis-lambert
 * Date : Janvier 2024
 */
import "./NoyauAccueil.scss";
import ConnectionState from "../../components/ConnectionState";
import ConnectionManager from "../../components/ConnectionManager";
import { DiscussionContextProvider } from "../../components/FilDiscussion/DiscussionContext";
import TestComponents from "../../components/TestComponents";

function NoyauAccueil({ isConnected }) {
  return (
    <div className="NoyeauAccueil">
      {/* <ConnectionState isConnected={isConnected} />
      <ConnectionManager /> */}

      <DiscussionContextProvider />
    </div>
  );
}

export default NoyauAccueil;
