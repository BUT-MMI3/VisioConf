const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let channelSchema = new Schema({
    channel_uuid: {type: String, required: true},
    channel_name: {type: String, required: true},
    channel_icon: {type: String, required: true},
    channel_role: {
        role: {
            type: Schema.Types.ObjectId,
            ref: "Role",
            required: true,
        },
    },
    channel_date_create: {type: Date, required: true, default: Date.now},
    channel_type: {
        type: Enumerator,
        required: true,
        default: "public",
        enum: ["public", "private"],
        description: "Choose channel type between : public, private",
    },
    // if channel type is set to private, we need to check if the user is able to see the channel in the channel members list
    channel_messages: [
        {
            message_uuid: {type: String, required: true},
            message_content: {type: String, required: true},
            message_sender: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            message_reader: [
                {
                    user: {
                        type: Schema.Types.ObjectId,
                        ref: "User",
                        required: true,
                    },
                },
            ],
            message_date_create: {
                type: Date,
                required: true,
                default: Date.now,
            },
            message_react_list: [
                {
                    user: {
                        type: Schema.Types.ObjectId,
                        ref: "User",
                        required: true,
                    },
                    react_type: {
                        type: String,
                        required: true,
                        default: "like",
                        description:
                            "Choose react type between : like, love, haha, wow, sad, angry",
                    },
                },
            ],
            message_status: {
                type: String,
                required: true,
                default: "sent",
                description:
                    "Choose message status between : sent, received, read",
            },
        },
    ],
});

module.exports = mongoose.model("Channel", channelSchema);
