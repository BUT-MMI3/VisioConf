const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const discussionSchema = new Schema({
    discussion_uuid: {type: String, required: true},
    discussion_name: {type: String, default: ""},
    discussion_description: {type: String, default: ""},
    discussion_creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    discussion_type: {
        type: String,
        required: true,
        default: "unique",
        description: "Choose discussion type between : unique, group",
    },
    discussion_members: [
        {type: Schema.Types.ObjectId, ref: "User", required: true},
    ],
    discussion_date_create: {type: Date, required: true, default: Date.now},
    discussion_messages: [
        {
            message_uuid: {type: String, required: true},
            message_content: {type: String, required: true},
            message_sender: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            message_date_create: {type: Date, required: true, default: Date.now},
            message_react_list: [
                {
                    user: {type: Schema.Types.ObjectId, ref: "User", required: true},
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
                description: "Choose message status between : sent, received, read",
            },
        },
    ],
});

// virtuals
discussionSchema.virtual("discussion_members_count").get(function () {
    return this.discussion_members.length;
});

discussionSchema.virtual("discussion_messages_count").get(function () {
    return this.discussion_messages.length;
});

discussionSchema.virtual("info").get(function () {
    return {
        discussion_uuid: this.discussion_uuid,
        discussion_name: this.discussion_name,
        discussion_description: this.discussion_description,
        discussion_creator: this.discussion_creator,
        discussion_type: this.discussion_type,
        discussion_members: this.discussion_members,
        discussion_date_create: this.discussion_date_create,
        discussion_members_count: this.discussion_members_count,
        discussion_messages_count: this.discussion_messages_count,
    };
});

// findLastMessage
discussionSchema.methods.findLastMessage = function () {
    return this.discussion_messages[this.discussion_messages.length - 1]
};

async function findManyByUser(user) {
    return await this.model("Discussion").find({
        discussion_members: user._id,
    }).populate({
        path: 'discussion_members',
        model: 'User',
        select: 'user_firstname user_lastname user_picture user_socket_id user_uuid'
    }).populate({
        path: 'discussion_messages.message_sender',
        model: 'User',
        select: 'user_firstname user_lastname user_picture user_socket_id user_uuid'
    });
}

async function findPopulateMembersByDiscussionId(discussion_uuid) {
    return await this.model("Discussion").findOne({
        discussion_uuid: discussion_uuid,
    }).populate({
        path: 'discussion_members',
        model: 'User',
        select: 'user_firstname user_lastname user_picture user_socket_id user_uuid user_is_online'
    }).populate({
        path: 'discussion_messages.message_sender',
        model: 'User',
        select: 'user_firstname user_lastname user_picture user_socket_id user_uuid user_is_online'
    });
}

// Export model
module.exports = mongoose.model("Discussion", discussionSchema);
module.exports.findManyByUser = findManyByUser;
module.exports.findPopulateMembersByDiscussionId = findPopulateMembersByDiscussionId;