const Role = require('../models/role');
const { v4: uuidv4 } = require("uuid");

class Roles {
    controller = null;
    instanceName = "Roles";

    listeMessagesEmis = ["admin_liste_roles", "admin_role_details", "admin_role_cree", "admin_role_modifie", "admin_role_supprime"];
    listeMessagesRecus = ["admin_demande_liste_roles", "admin_demande_role_details", "admin_ajouter_role", "admin_modifier_role", "admin_supprimer_role"];

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
        } else if (typeof msg.admin_demande_role_details !== 'undefined') {
            this.handleRoleDetails(msg);
        } else if (typeof msg.admin_ajouter_role !== 'undefined') {
            this.handleAddRole(msg.admin_ajouter_role);
        } else if (typeof msg.admin_modifier_role !== 'undefined') {
            this.handleModifyRole(msg.admin_modifier_role);
        } else if (typeof msg.admin_supprimer_role !== 'undefined') {
            await this.handleDeleteRole(msg.admin_supprimer_role);
            this.handleListRoles(msg);
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

    handleRoleDetails = async (msg) => {
        try {
            const role = await Role.findOne({ _id: msg.admin_demande_role_details.roleId });
            this.controller.send(this, {
                admin_role_details: {
                    success: true,
                    role: role
                },
                id: msg.id
            });
        } catch (error) {
            console.error(`ERROR (${this.instanceName}) -`, error);
            this.controller.send(this, {
                admin_role_details: {
                    success: false,
                    message: "Failed to retrieve role"
                },
                id: msg.id
            });
        }
    }

    handleAddRole = async (msg) => {
        console.log("roleData", msg.roleData);
        try {
            console.log(msg.roleData.role_label);
            const newRole = new Role({
                role_uuid: uuidv4(),
                role_label: msg.roleData.role_label,
                role_permissions: msg.roleData.role_permissions || []
            });
            await newRole.save();
            this.controller.send(this, {
                admin_role_cree: {
                    success: true,
                    role: newRole
                },
                id: msg.id
            });
        } catch (error) {
            console.error(`ERROR (${this.instanceName}) -`, error);
            this.controller.send(this, {
                admin_role_cree: {
                    success: false,
                    message: "Failed to create role"
                },
                id: msg.id
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

    handleDeleteRole = async (msg) => {
        try {
            // cant delete if role.role_default == true
            const role = await Role.findOne({ _id: msg });
            if (role.role_default) {
                this.controller.send(this, {
                    admin_role_supprime: {
                        success: false,
                        message: "Can't delete default role"
                    },
                    id: msg.id
                });
            }else{
                await Role.deleteOne({ _id: msg });
                this.controller.send(this, {
                    admin_role_supprime: {
                        success: true
                    },
                    id: msg.id
                });
            }

        } catch (error) {
            console.error(`ERROR (${this.instanceName}) -`, error);
            this.controller.send(this, {
                admin_role_supprime: {
                    success: false,
                    message: "Failed to delete role"
                },
                id: msg.id
            });
        }
    }
}

module.exports = Roles;
