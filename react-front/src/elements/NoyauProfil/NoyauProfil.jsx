const NoyauProfil = () => {

    const user = {
        user_uuid: 123456,
        user_firstname: "John",
        user_lastname: "Doe",
        user_job_desc: `Chef de département MMI à l’universite de Toulon.\nÉgalement professeur de développement web.`,
        user_picture: "https://imgv3.fotor.com/images/gallery/a-girl-cartoon-character-with-pink-background-generated-by-cartoon-character-maker-in-Fotor.jpg",
        user_email: "john.doe@example.com",
        user_date_create: Date.now(),
        user_roles: ["Chef de département", "Administration", "Enseignant"],
        user_last_connection: Date.now(),
    };

    return (
        <div className={"fc ai-fs g1"}>
            <h2>Mon profil</h2>
            <div className={"fc ai-fs g0-5"}>
                <h3>À Propos</h3>
                <p className={"ta-l o0-5"}>{user.user_job_desc}</p>
            </div>

            <div className={"fr g1"}>
                <p>
                    Nom
                </p>
                <p className={"o0-5"}>
                    {user.user_lastname}
                </p>
            </div>
            <div className={"fr g1"}>
                <p>
                    Prénom
                </p>
                <p className={"o0-5"}>
                    {user.user_firstname}
                </p>
            </div>
            <div className={"fr g1"}>
                <p>
                    Date de création
                </p>
                <p className={"o0-5"}>
                    {user.user_date_create}
                </p>
            </div>
            <div className={"fr g1"}>
                <p>
                    Email
                </p>
                <p className={"o0-5"}>
                    {user.user_email}
                </p>
            </div>
            <div className={"fr g1"}>
                <p>
                    Rôles
                </p>
                <div className={"fr g0-5"}>
                    {user.user_roles.map((role, index) => (
                        <p key={index} style={{
                            backgroundColor: "#223A6A",
                            padding: '0.3rem 0.8rem',
                            fontSize: '0.8rem',
                            whiteSpace: "nowrap",
                            borderRadius: '4rem'
                        }}>
                            {role}
                        </p>
                    ))
                    }
                </div>
            </div>
        </div>
    );
};

export default NoyauProfil;
