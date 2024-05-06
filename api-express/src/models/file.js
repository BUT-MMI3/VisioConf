const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    file_uuid: {type: String, required: true},
    file_name: {type: String, required: true},
    file_type: {type: String, required: true},
    file_size: {type: Number, required: true},
    file_url: {type: String, required: true},
    file_author: {type: Schema.Types.ObjectId, ref: "User", required: true},
    file_discussion: {
        type: Schema.Types.ObjectId,
        ref: "Discussion",
        required: false,
        default: null,
    },
    file_channel: {
        type: Schema.Types.ObjectId,
        ref: "Channel",
        required: false,
        default: null,
    },
    file_date_create: {type: Date, required: true, default: Date.now},
});

module.exports = mongoose.model("File", fileSchema);
