const Role = require('../models/role');
const { v4: uuidv4 } = require("uuid");

class Roles {
    controller = null;
    instanceName = "Roles";

    listeMessagesEmis = ["admin_liste_roles", "admin_role_cree", "admin_role_modifie"];
    listeMessagesRecus = ["admin_demande_liste_roles", "admin_ajouter_role", "admin_modifier_role"];

    verbose = true;

    constructor(controller, instanceName) {
        this.controller = controller;
        this.instanceName = instanceName || "Roles";

        if (this.verbose || controller.verboseall) console.log(`INFO (${this.instanceName}) - Création de l'instance Roles`);

        controller.subscribe(this, this.listeMessagesEmis, this.listeMessagesRecus);
    }

    traitementMessage = async msg => {
        if (this.verbose || this.controller.verboseall) console.log(`INFO (${this.instanceName}) - Traitement d'un message`);

        if (typeof msg.admin_demande_liste_roles !== 'undefined') {
            this.handleListRoles(msg);
        } else if (typeof msg.admin_ajouter_role !== 'undefined') {
            this.handleAddRole(msg.admin_ajouter_role);
        } else if (typeof msg.admin_modifier_role !== 'undefined') {
            this.handleModifyRole(msg.admin_modifier_role);
        }
    }

    handleListRoles = async (msg) => {
        try {
            const roles = await Role.find({});
            this.controller.send(this, {
                admin_liste_roles: {
                    success: true,
                    roles: roles
                },
                id: msg.id
            });
        } catch (error) {
            console.error(`ERROR (${this.instanceName}) -`, error);
            this.controller.send(this, {
                admin_liste_roles: {
                    success: false,
                    message: "Failed to retrieve roles"
                },
                id: msg.id
            });
        }
    }

    handleAddRole = async (roleData) => {
        try {
            const newRole = new Role({
                role_uuid: uuidv4(),
                role_label: roleData.role_label,
                role_permissions: roleData.role_permissions
            });
            await newRole.save();
            this.controller.send(this, {
                admin_role_cree: {
                    success: true,
                    role: newRole
                },
                id: roleData.id
            });
        } catch (error) {
            console.error(`ERROR (${this.instanceName}) -`, error);
            this.controller.send(this, {
                admin_role_cree: {
                    success: false,
                    message: "Failed to create role"
                },
                id: roleData.id
            });
        }
    }

    handleModifyRole = async (roleData) => {
        try {
            const role = await Role.findOne({ role_uuid: roleData.role_uuid });
            role.role_label = roleData.role_label;
            role.role_permissions = roleData.role_permissions;
            await role.save();
            this.controller.send(this, {
                admin_role_modifie: {
                    success: true,
                    role: role
                },
                id: roleData.id
            });
        } catch (error) {
            console.error(`ERROR (${this.instanceName}) -`, error);
            this.controller.send(this, {
                admin_role_modifie: {
                    success: false,
                    message: "Failed to modify role"
                },
                id: roleData.id
            });
        }
    }
}

module.exports = Roles;
