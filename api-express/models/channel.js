let channelSchema = new Schema({
  channel_uuid: { type: String, required: true },
  channel_name: { type: String, required: true },
  channel_equipe: {
    type: Schema.Types.ObjectId,
    ref: "Equipe",
    required: true,
  },
  channel_type: {
    type: String,
    required: true,
    default: "public",
    description: "Choose channel type between : public, private",
  },
  // if channel type is set to private, we need to check if the user is able to see the channel in the channel members list
  channel_members: [
    {
      user: { type: Schema.Types.ObjectId, ref: "User", required: true },
      able_to_answer: { type: Boolean, required: true, default: false },
      able_to_post: { type: Boolean, required: true, default: false },
    },
  ],
  channel_date_create: { type: Date, required: true, default: Date.now },
  channel_messages: [
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
      message_files: [
        {
          name: { type: String, required: true },
          type: { type: String, required: true },
          size: { type: Number, required: true },
          file_id: { type: Schema.Types.ObjectId, ref: "File", required: true },
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
