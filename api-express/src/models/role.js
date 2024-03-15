/*
Author: clementfavarel
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoleSchema = new Schema({
    role_uuid: { type: String, required: true },
    role_label: { type: String, required: true },
    role_permissions: { type: Array, required: true },
    // have to implement default permissions for default role user
});

module.exports = mongoose.model("Role", RoleSchema);
