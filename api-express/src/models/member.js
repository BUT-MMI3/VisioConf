const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const memberSchema = new Schema({
    user_id: {type: Schema.Types.ObjectId, ref: "User", required: true},
    channel_id: {type: Schema.Types.ObjectId, ref: "Channel", required: true},
    role_id: {type: Schema.Types.ObjectId, ref: "Role", required: true},
    // role_id (channel.roles[role_id]) ???
    member_date_join: {type: Date, required: true, default: Date.now},
});

module.exports = mongoose.model("Member", memberSchema);
