/*
Authors: Mathis Lambert, clementfavarel
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Default values
const DEFAULT_USER_PICTURE = "default.png";
const DEFAULT_ROLE = ["user"];
const DEFAULT_STATUS = "waiting";
const DEFAULT_DISTURB_STATUS = "available";

const UserSchema = new Schema({
    user_uuid: { type: String, required: true },
    user_firstname: { type: String, required: true },
    user_lastname: { type: String, required: true },
    user_email: { type: String, required: true },
    user_phone: { type: Number, required: true },
    user_status: {
        type: String,
        required: true,
        default: DEFAULT_STATUS,
        enum: ["waiting", "active", "banned", "deleted"],
        description:
            "Choose user status between : waiting, active, banned, deleted",
    },
    user_password: { type: String, required: true, description: "SHA256" },
    user_job: {
        type: String,
        required: true,
        description: "Job description",
    },
    user_date_create: { type: Date, required: true, default: Date.now },
    user_picture: {
        type: String,
        required: true,
        default: DEFAULT_USER_PICTURE,
    },
    user_is_online: { type: Boolean, required: true, default: false },
    user_disturb_status: {
        type: String,
        required: true,
        default: DEFAULT_DISTURB_STATUS,
        enum: ["available", "offline", "dnd"],
        description: "Choose user status between : available, offline, dnd",
    },
    user_last_connection: { type: Date, required: true, default: Date.now },
    user_direct_manager: {
        type: String,
        required: true,
        default: "none",
        description: "User uuid of the direct manager",
    },
    user_tokens: { type: Object, required: true },
    user_roles: {
        type: Array,
        required: true,
        default: DEFAULT_ROLE,
        description:
            "List of roles id created by admin in the roles collection",
    },
});

// Virtual for user's full name
UserSchema.virtual("user_fullname").get(function () {
    return this.user_firstname + " " + this.user_lastname;
});

// Virtual for user's URL
UserSchema.virtual("url").get(function () {
    return "/user/" + this._id;
});

// Export the model
module.exports = mongoose.model("User", UserSchema);
