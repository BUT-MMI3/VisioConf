import FeatherIcon from "feather-icons-react";
import "./Modale.css";

const Modale = ({
  type,
  titre,
  texte,
  texteBoutonAction,
  onValidate,
  onClose,
}) => {
  const getIcon = () => {
    switch (type) {
      case "error":
        return <FeatherIcon icon="alert-octagon" />;
      case "info":
        return <FeatherIcon icon="alert-circle" />;
      case "warning":
        return <FeatherIcon icon="alert-triangle" />;
      default:
        return "";
    }
  };

  return (
    <div className="modale-background">
      <div className={`modale-container ${type}`}>
        <div className="modale-icon">{getIcon()}</div>
        <div className="modale-header">
          <h3>{titre}</h3>
        </div>
        <div className="modale-body">
          <p>{texte}</p>
        </div>
        <div className="modale-footer">
          <button onClick={onClose} className="modale-close-button">
            Annuler
          </button>
          {onValidate && (
            <button onClick={onValidate} className="modale-action-button">
              {texteBoutonAction}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modale;
