import { useState } from 'react';
import './NoyauConnexion.css';

const NoyauConnexion = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [utilisateur, setUtilisateur] = useState({
    id: 123,
    nom: "Doe",
    prenom: "John",
    email: "john.doe@example.com",
    motDePasse: "azerty",
    job: "Etudiant MMI3",
    isConnected: false,
    isAdmin: true,
    logo: "https://imgv3.fotor.com/images/gallery/a-girl-cartoon-character-with-pink-background-generated-by-cartoon-character-maker-in-Fotor.jpg",
  });

  const logoImage = "https://upload.wikimedia.org/wikipedia/fr/thumb/1/1a/Logo_Universit%C3%A9_de_Toulon.svg/1200px-Logo_Universit%C3%A9_de_Toulon.svg.png"
  
  const initSession = () => {
    if (email === utilisateur.email && motDePasse === utilisateur.motDePasse) {
      // Sauvegarde de l'e-mail et de l'ID utilisateur
      localStorage.setItem('userEmail', utilisateur.email);
      localStorage.setItem('userId', utilisateur.id);
      setUtilisateur((prevState) => ({ ...prevState, isConnected: true }));

      openSocket();
      goto('/NoyauAccueil');
    } else {
      // Informations invalides, affichez un message d'erreur
      setErreur('Adresse email ou mot de passe invalide.');
    }
  };

  const openSocket = () => {
    console.log('Ouverture du tunnel TCP...');
  };

  const goto = (location) => {
    window.location.href = location;
  };

  return (
    <div className={`page-connexion ${utilisateur.isConnected ? 'online' : ''}`}>
      <div className={`card-connexion ${utilisateur.isConnected ? 'online' : ''}`}>
        <img src={logoImage} alt="Logo de l'entreprise" className="logo-connexion" />
        <form className='from-controller'>
          <div className="form-group">
            <label htmlFor="email" style={{ fontWeight: 600 }} className={erreur ? 'erreur' : ''}>Adresse Email :</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={erreur ? 'erreur' : ''}
              placeholder="Entrez votre adresse email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="motDePasse" style={{ fontWeight: 600 }} className={erreur ? 'erreur' : ''}>Mot de Passe :</label>
            <input
              type="password"
              id="motDePasse"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              className={erreur ? 'erreur' : ''}
              placeholder="Entrez votre mot de passe"
            />
          </div>
          {erreur && <p className="erreur-message">{erreur}</p>}
          <button className={erreur ? 'button-connexion erreur' : 'button-connexion'} type="button" onClick={initSession}>
            Connexion
          </button>
        </form>
        <div className="lien-mot-de-passe-oublie">
          <a href="/mot-de-passe-oublie">Mot de passe oublié ?</a>
        </div>
      </div>
    </div>
  );
};

export default NoyauConnexion;
