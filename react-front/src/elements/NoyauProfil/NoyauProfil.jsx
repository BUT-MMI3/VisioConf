import "./NoyauProfil.css";
import {useSelector} from "react-redux";

const NoyauProfil = () => {

    const session = useSelector((state) => state.session);
    
    return (
        <div className={"fc ai-fs g1"} style={{margin:"2rem",}}>
            <div className={"content-profil fr g1"}>
                <div className={"fc g1"}>
                    <h2>Mon profil</h2>
                    {/* Informations session */}
                    <div className={"fc g1"}>
                        <div className={"fc ai-fs g0-5"}>
                            <h3>À Propos</h3>
                            <p className={"ta-l o0-5"}>{session && session.user_desc}</p>
                        </div>

                        {/* Autres informations session */}
                        <div className={"fr g1"}>
                            <p>Nom :</p>
                            <p className={"o0-5"}>{session && session.user_lastname}</p>
                        </div>
                        <div className={"fr g1"}>
                            <p>Prénom :</p>
                            <p className={"o0-5"}>{session && session.user_firstname}</p>
                        </div>
                        <div className={"fr g1"}>
                            <p>Date de création :</p>
                            <p className={"o0-5"}>
                                {session && new Date(session.user_date_create).toLocaleDateString('fr-FR')}
                            </p>
                        </div>
                        <div className={"fr g1"}>
                            <p>Email :</p>
                            <p className={"o0-5"}>{session && session.user_email}</p>
                        </div>
                        <div className={"fr g1"}>
                            <p>Job :</p>
                            <p className={"o0-5"}>{session && session.user_job}</p>
                        </div>
                        <div className={"fr g1"}>
                            <p>Rôles</p>
                            <div className={"fr g0-5"}>
                                {session && session.user_roles.map((role, index) => (
                                    <p key={index} style={{
                                        backgroundColor: "#223A6A",
                                        color: "white",
                                        padding: '0.3rem 0.8rem',
                                        fontSize: '0.8rem',
                                        whiteSpace: "nowrap",
                                        borderRadius: '4rem'
                                    }}>
                                        {role}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"fc g1 ai-c"}>
                    <h2 className={"ta-c"}>Prochainement Modifiable</h2>
                    {/* Image de profil */}
                    <div className={"fr g1"}>
                        {session && (
                            <img src={session.user_picture} alt={"Photo de profil"}
                                 style={{width: '100px', height: '100px'}}/>
                        )}
                    </div>

                    {/* Champ d'entrée pour modifier la description */}
                    <div className={"fr g1"}>
                        <input
                            type={"text"}
                            placeholder="votre description"
                            onChange={(e) => setsession({...session, user_desc: e.target.value})}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

    export default NoyauProfil;
