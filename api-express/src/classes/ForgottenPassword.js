// ForgottenPassword.js
require("dotenv").config();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const mailer = require('../utils/mailer');
const {v4: uuidv4} = require("uuid");

class ForgottenPassword {
    constructor(controller) {
        this.controller = controller;
        this.instanceName = "ForgottenPassword";

        this.listeMessagesEmis = ["password_acceptee", "password_refusee"];
        this.listeMessagesRecus = ["demande_password"];

        this.verbose = true;

        if (this.verbose || this.controller.verboseall) console.log("INFO (" + this.instanceName + ") - Création de l'instance ForgottenPassword : " + this.instanceName);

        this.controller.subscribe(this, this.listeMessagesEmis, this.listeMessagesRecus);
    }

    handlePassForgotten = async (msg) => {
        if (this.verbose || this.controller.verboseall) console.log(`INFO (${this.instanceName}) - Traitement de la demande de changement de mot de passe`);

        const email = msg.demande_password.email;

        try {
            const user = await User.findOne({"user_email": email});
            if (user) {
                function generateRandomToken(length) {
                    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
                    let token = '';
                    for (let i = 0; i < length; i++) {
                        const randomIndex = Math.floor(Math.random() * characters.length);
                        token += characters[randomIndex];
                    }
                    return token;
                }

                // Générer un token unique
                const token = jwt.sign({user: user.user_email}, process.env.JWT_SECRET, {expiresIn: "1h", algorithm: "HS256"})
                const safeToken = token.replace(/\./g, '');

                // Ajouter le token au champ `user_tokens.inscription`
                user.set({
                    "user_tokens.invitation": safeToken,
                });
                await user.save();

                // Créer un lien vers la page d'inscription
                const resetLink = `http://localhost:3000/inscription/${safeToken}`;

                // Envoyer l'email avec mailer.sendMail
                await mailer.sendMail({
                    to: user.user_email,
                    subject: 'Réinitialisation de votre mot de passe',
                    text: `Bonjour ${user.user_firstname},\n\nVous avez demandé à réinitialiser votre mot de passe. Veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe : ${resetLink}\n\nSi vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.\n\nMerci,\nVotre équipe`,
                    html: `<p>Bonjour ${user.user_firstname},</p><p>Vous avez demandé à réinitialiser votre mot de passe. Veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe : <a href="${resetLink}">Réinitialiser le mot de passe</a></p><p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p><p>Merci,<br>Votre équipe</p>`
                });

                if (this.verbose || this.controller.verboseall) console.log(`INFO (${this.instanceName}) - Email de réinitialisation de mot de passe envoyé à ${user.user_email} - Token : ${safeToken}`);

                // Envoyer un message pour indiquer que l'email est envoyé avec succès
                this.controller.send(this, {
                    "password_acceptee": {
                        message: "Email envoyé avec succès",
                    },
                });
            } else {
                // Envoyer un message pour indiquer que l'e-mail n'existe pas dans la base de données
                this.controller.send(this, {
                    "password_refusee": {
                        message: "Utilisateur non trouvé dans la base de données",
                    }
                });
            }
        } catch (error) {
            // Gérer les erreurs
            console.error(`Erreur lors de l'envoi de l'email : ${error}`);
            this.controller.send(this, {
                "password_refusee": {
                    message: "Erreur lors du traitement du changement de mot de passe",
                }
            });
        }
    };


    traitementMessage = async (msg) => {
        if (this.verbose || this.controller.verboseall) console.log("INFO (" + this.instanceName + ") - Traitement du message : " + JSON.stringify(msg));

        if (typeof msg.demande_password !== "undefined") {
            await this.handlePassForgotten(msg);
        }
    };
}

module.exports = ForgottenPassword;
