import { useState, useEffect } from 'react';
import FeatherIcon from 'feather-icons-react';
import Modale from '../Modale/Modale';

const NoyauDeconnexion = ({ onValidate, visible }) => {
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setModalVisible(visible);
  }, [visible]);

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleValiderDeconnexion = () => {
    onValidate();
    handleCloseModal();
  };

  return (
    <>
      {/* Bouton de déconnexion */}
      <a style={{ color: 'red', cursor: 'pointer' }} onClick={() => setModalVisible(true)}>
        <FeatherIcon icon="log-out" size="20" strokeWidth="1" className="log-out" />
        Déconnexion
      </a>

      {/* Modale de déconnexion */}
      {modalVisible && (
        <Modale
          type="error"
          titre="Vous êtes sur le point de vous déconnecter"
          texte="Souhaitez-vous vraiment vous déconnecter"
          texteBoutonAction="Déconnexion"
          onClose={handleCloseModal}
          onValidate={handleValiderDeconnexion}
        />
      )}
    </>
  );
};

export default NoyauDeconnexion;
