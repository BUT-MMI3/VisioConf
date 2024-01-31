import { useState } from 'react';
import './NoyauConnexion.css';

const NoyauConnexion = ({ logoImage, utilisateur }) => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');

  const handleConnexion = () => {
    // Simulez une vérification de l'adresse email et du mot de passe
    if (email === utilisateur.email && motDePasse === utilisateur.motDePasse) {
      // Informations valides, redirigez vers la page d'accueil
      window.location.href = '/';  // Redirection vers la page d'accueil
    } else {
      // Informations invalides, affichez un message d'erreur
      setErreur('Mot de passe ou Email invalide...');
    }
  };

  return (
    <div className="page-connexion">
      <div className="card-connexion">
        <img src={logoImage} alt="Logo de l'entreprise" className="logo-connexion" />
        <form>
          <div className="form-group">
            <label htmlFor="email" style={{fontWeight:600,}} className={erreur ? 'erreur' : ''}>Adresse Email :</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={erreur ? 'erreur' : ''}
            />
          </div>
          <div className="form-group">
            <label htmlFor="motDePasse" style={{fontWeight:600,}} className={erreur ? 'erreur' : ''}>Mot de Passe :</label>
            <input
              type="password"
              id="motDePasse"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              className={erreur ? 'erreur' : ''}
            />
          </div>
          {erreur && <p className="erreur-message">{erreur}</p>}
          <button className={erreur ? 'button-connexion erreur' : 'button-connexion'} type="button" onClick={handleConnexion}>
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
