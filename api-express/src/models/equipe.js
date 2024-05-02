const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Default values
DEFAULT_EQUIPE_LOGO = "/others/default.png";
DEFAULT_CHANNEL_TYPE = "public";

const equipeSchema = new Schema({
    equipe_uuid: {type: String, required: true},
    equipe_name: {type: String, required: true},
    equipe_icon: {
        type: String,
        required: true,
    },
    equipe_description: {type: String, required: true},
    equipe_members: [
        {
            user: {type: Schema.Types.ObjectId, ref: "User", required: true},
            able_to_create: {type: Boolean, required: true, default: false},
            role: {
                type: String,
                required: true,
                default: "user",
                enum: ["user", "founder"],
                description: "Choose role between : user, founder",
            },
        },
    ],
    equipe_channels: [
        {
            channel_uuid: {type: String, required: true},
            channel_name: {
                type: String,
                required: true,
                default: DEFAULT_CHANNEL_NAME,
            },
            channel_type: {
                type: String,
                required: true,
                default: DEFAULT_CHANNEL_TYPE,
                enum: ["public", "private"],
                description: "Choose channel type between : public, private",
            },
            channel_date_create: {
                type: Date,
                required: true,
                default: Date.now,
            },
        },
        {
            channel: {
                type: Schema.Types.ObjectId,
                ref: "Channel",
                required: true,
            },
        },
    ],
    equipe_date_create: {type: Date, required: true, default: Date.now},
});

// virtuals
equipeSchema.virtual("equipe_members_count").get(function () {
    return this.equipe_members.length;
});

equipeSchema.virtual("equipe_channels_count").get(function () {
    return this.equipe_channels.length;
});

// Export the model
module.exports = mongoose.model("Equipe", equipeSchema);
