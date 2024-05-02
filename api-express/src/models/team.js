const mongoose = require("mongoose");
const Schema = mongoose.Schema;

DEFAULT_TEAM_LOGO = "/others/default.png";
DEFAULT_CHANNEL_TYPE = "public";

const teamSchema = new Schema({
    team_uuid: {type: String, required: true},
    team_name: {type: String, required: true},
    team_logo: {
        type: String,
        required: true,
        default: DEFAULT_TEAM_LOGO,
    },
    team_description: {type: String, required: true},

    // Pas sur de ça
    // team_roles: [
    //     {
    //         user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    //         able_to_create: { type: Boolean, required: true, default: false },
    //         role: {
    //             type: String,
    //             required: true,
    //             default: "user",
    //             enum: ["user", "founder"],
    //             description: "Choose role between : user, founder",
    //         },
    //     },
    // ],

    // team permissions ????

    team_channels: [
        {
            channel: {
                type: Schema.Types.ObjectId,
                ref: "Channel",
                required: true,
            },
        },
    ],
    team_creation_date: {type: Date, required: true, default: Date.now},
});

module.exports = mongoose.model("Team", teamSchema);
