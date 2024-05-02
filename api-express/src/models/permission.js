const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PermissionSchema = new Schema({
    permission_uuid: {type: String, required: true},
    permission_label: {type: String, required: true},
});

module.exports = mongoose.model("Permission", PermissionSchema);
