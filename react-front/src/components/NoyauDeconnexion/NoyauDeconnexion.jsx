import { useModal } from '../../components/Modale/ModaleContext';
import FeatherIcon from 'feather-icons-react';


const NoyauDeconnexion = () => {
    const { newModal } = useModal();


    return (
        <>
            <button style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }} onClick={() => newModal({
                type: 'error',
                boutonClose: true,
                titre: 'Souhaitez-vous vraiment vous déconnecter ?',
                texteBoutonAction: "déconnexion",
                onValidate: () => {
                    console.log('Utilisateur déconnecté');
                    window.location.href = "/";
                },
            })}>
                <FeatherIcon icon="log-out" size="20" strokeWidth="1" className="log-out" />
                Déconnexion
            </button>
        </>
    );
};

export default NoyauDeconnexion;
