/*
Author: clementfavarel
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const RoleSchema = new Schema({
    role_uuid: {type: String, required: true},
    role_label: {type: String, required: true},
    role_permissions: [{type: ObjectId, ref: 'Permission'}],
    role_default: {type: Boolean, required: true, default: false},
    // have to implement default permissions for default role user
});

module.exports = mongoose.model("Role", RoleSchema);
