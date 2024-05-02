const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const participantSchema = new Schema({
    user_id: {type: Schema.Types.ObjectId, ref: "User", required: true},
    team_id: {type: Schema.Types.ObjectId, ref: "Team", required: true},
    role_id: {type: Schema.Types.ObjectId, ref: "Role", required: true},
    // role_id (team.roles[role_id]) ???
    participant_date_join: {type: Date, required: true, default: Date.now},
});

module.exports = mongoose.model("Participant", participantSchema);
