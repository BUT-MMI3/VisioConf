const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const discussionSchema = new Schema({
  discussion_uuid: { type: String, required: true },
  discussion_name: { type: String, required: true, default: "" },
  discussion_description: { type: String, required: true },
  discussion_type: {
    type: String,
    required: true,
    default: "unique",
    description: "Choose discussion type between : unique, group",
  },
  discussion_members: [
    {
      user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
  ],
  discussion_date_create: { type: Date, required: true, default: Date.now },
  discussion_messages: [
    {
      message_uuid: { type: String, required: true },
      message_content: { type: String, required: true },
      message_sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      message_date_create: { type: Date, required: true, default: Date.now },
      message_react_list: [
        {
          user: { type: Schema.Types.ObjectId, ref: "User", required: true },
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

// Export model
module.exports = mongoose.model("Discussion", discussionSchema);