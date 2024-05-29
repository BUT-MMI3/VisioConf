const User = require('../models/user');

class Profil {
    constructor(controller, instanceName) {
        this.instanceName = instanceName || 'Profil';
        this.controller = controller;
        this.listeMessagesEmis = ["retourne_modification_profil", "retourne_modification_picture"];
        this.listeMessagesRecus = ["update_profil", "update_picture"];
        this.verbose = false;

        if (this.verbose || this.controller.verboseall) {
            console.log(`INFO (${this.instanceName}) - Instance créée, abonnement aux messages : ${this.listeMessagesEmis.join(', ')}`);
        }

        this.controller.subscribe(this, this.listeMessagesEmis, this.listeMessagesRecus);
    }

    traitementMessage = async msg => {
        if (this.verbose || this.controller.verboseall) {
            console.log(`INFO (${this.instanceName}) - Réception d'un message : ${JSON.stringify(msg)}`);
        }

        if (typeof msg.update_profil !== 'undefined') {
            console.log(`INFO (${this.instanceName}) - Mise à jour du profil :`, msg.update_profil);

            try {
                // Mettre à jour user_desc dans la base de données
                await User.updateOne({}, { user_desc: msg.update_profil });
                console.log(`INFO (${this.instanceName}) - Profil mis à jour dans la base de données`);

                // Envoyer un message de confirmation de réception
                const confirmationMessage = {
                    retourne_modification_profil: {
                        status: 'success',
                        message: msg.update_profil
                    }
                };

                await this.controller.send(this, confirmationMessage);
                if (this.verbose || this.controller.verboseall) {
                    console.log(`INFO (${this.instanceName}) - Confirmation de mise à jour envoyée`);
                }
            } catch (error) {
                console.error(`ERREUR (${this.instanceName}) - Échec de la mise à jour du profil :`, error);
            }
        }

        if (typeof msg.update_picture !== 'undefined') {
            console.log(`INFO (${this.instanceName}) - Mise à jour de la photo de profil reçue`);

            try {
                const formData = msg.update_picture;

                if (!formData) {
                    console.error(`ERREUR (${this.instanceName}) - Aucun FormData trouvé dans les données d'image`);
                    return;
                }

                const fileData = formData.get("profilePicture");

                if (!fileData) {
                    console.error(`ERREUR (${this.instanceName}) - Aucun fichier trouvé dans les données d'image`);
                    return;
                }

                // Convertir les données de l'image en base64
                const reader = new FileReader();
                reader.readAsDataURL(fileData);
                reader.onloadend = async () => {
                    const base64Image = reader.result.split(',')[1];

                    // Mettre à jour user_picture dans la base de données avec la chaîne encodée en base64
                    await User.updateOne({}, { user_picture: base64Image });
                    console.log(`INFO (${this.instanceName}) - Photo de profil mise à jour dans la base de données`);

                    // Envoyer un message de confirmation de réception
                    const confirmationMessage = {
                        retourne_modification_picture: {
                            status: 'success',
                            message: 'Photo de profil mise à jour'
                        }
                    };

                    await this.controller.send(this, confirmationMessage);
                    console.log(`INFO (${this.instanceName}) - Confirmation de mise à jour envoyée`);
                };
            } catch (error) {
                console.error(`ERREUR (${this.instanceName}) - Échec de la mise à jour de la photo de profil :`, error);
            }
        }
    }
}

module.exports = Profil;
