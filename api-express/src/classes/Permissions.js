const Permission = require('../models/permission');
const { v4: uuidv4 } = require("uuid");

class Permissions {
    controller = null;
    instanceName = "Permissions";

    listeMessagesEmis = ["admin_liste_permissions"];
    listeMessagesRecus = ["admin_demande_liste_permissions"];

    verbose = true;

    constructor(controller, instanceName) {
        this.controller = controller;
        this.instanceName = instanceName || "Permissions";

        if (this.verbose || controller.verboseall) console.log(`INFO (${this.instanceName}) - Création de l'instance Permissions`);

        controller.subscribe(this, this.listeMessagesEmis, this.listeMessagesRecus);
    }

    traitementMessage = async msg => {
        if (this.verbose || this.controller.verboseall) console.log(`INFO (${this.instanceName}) - Traitement d'un message`);

        if (typeof msg.admin_demande_liste_permissions !== 'undefined') {
            this.handleListPermissions(msg);
        }
    }

    handleListPermissions = async (msg) => {
        try {
            const permissions = await Permission.find({});
            this.controller.send(this, {
                admin_liste_permissions: {
                    success: true,
                    permissions: permissions
                },
                id: msg.id
            });
        } catch (error) {
            console.error(`ERROR (${this.instanceName}) -`, error);
            this.controller.send(this, {
                admin_liste_permissions: {
                    success: false,
                    message: "Failed to retrieve permissions"
                },
                id: msg.id
            });
        }
    }
}

module.exports = Permissions;
