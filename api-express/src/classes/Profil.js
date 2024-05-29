const User = require('../models/user');
const fs = require('fs');
const path = require('path');
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
                const file = msg.update_picture;

                if (!file || !file.name || !file.buffer) {
                    console.error(`ERREUR (${this.instanceName}) - Fichier invalide ou manquant`);
                    return;
                }

                // Convertir le buffer ArrayBuffer en Buffer Node.js
                const buffer = Buffer.from(new Uint8Array(file.buffer));

                // Définir le chemin de stockage du fichier
                const destinationDir = path.join(__dirname, '..', '..', '..', 'react-front', 'public', 'others');
                const filePath = path.join(destinationDir, file.name);

                // Vérifier que le dossier de destination existe, sinon le créer
                if (!fs.existsSync(destinationDir)) {
                    fs.mkdirSync(destinationDir, { recursive: true });
                }

                // Enregistrer le fichier sur le système de fichiers
                fs.writeFile(filePath, buffer, async (err) => {
                    if (err) {
                        console.error(`ERREUR (${this.instanceName}) - Échec de l'enregistrement du fichier`, err);
                        return;
                    }

                    console.log(`INFO (${this.instanceName}) - Fichier enregistré avec succès`);

                    // Générer l'URL de l'image stockée
                    const imageUrl = `../others/${file.name}`;

                    // Mettre à jour user_picture dans la base de données avec l'URL de l'image
                    await User.updateOne({}, { user_picture: imageUrl });
                    console.log(`INFO (${this.instanceName}) - Photo de profil mise à jour dans la base de données`);

                    // Envoyer un message de confirmation de réception avec l'URL de l'image
                    const confirmationMessage = {
                        retourne_modification_picture: {
                            status: 'success',
                            message: imageUrl,
                        }
                    };

                    await this.controller.send(this, confirmationMessage);
                    console.log(`INFO (${this.instanceName}) - Confirmation de mise à jour envoyée`);
                });
            } catch (error) {
                console.error(`ERREUR (${this.instanceName}) - Échec de la mise à jour de la photo de profil :`, error);
            }
        }
    }
}

module.exports = Profil;
