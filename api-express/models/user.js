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
  user_job_desc: {
    type: String,
    required: true,
    description: "Job description",
  },
  user_picture: {
    type: String,
    required: true,
    default: DEFAULT_USER_PICTURE,
  },
  user_email: { type: String, required: true },
  user_password: { type: String, required: true, description: "SHA256" },
  user_date_create: { type: Date, required: true, default: Date.now },
  user_permissions: {
    user: {
      able_to_create: { type: Boolean, required: true, default: false },
      able_to_delete: { type: Boolean, required: true, default: false },
      able_to_update: { type: Boolean, required: true, default: false },
    },
    conversations: {
      able_to_create: { type: Boolean, required: true, default: false },
      able_to_delete: { type: Boolean, required: true, default: false },
      able_to_update: { type: Boolean, required: true, default: false },
      able_to_leave_group: { type: Boolean, required: true, default: true },
    },
    teams: {
      able_to_create: { type: Boolean, required: true, default: false },
      able_to_delete: { type: Boolean, required: true, default: false },
      able_to_update: { type: Boolean, required: true, default: false },
      able_to_leave: { type: Boolean, required: true, default: false },

      channels: {
        able_to_create: { type: Boolean, required: true, default: false },
        able_to_delete: { type: Boolean, required: true, default: false },
        able_to_update: { type: Boolean, required: true, default: false },
      },
    },
  },
  user_roles: {
    type: Array,
    required: true,
    default: DEFAULT_ROLE,
    description: "List of roles id created by admin in the roles collection",
  },
  user_is_status: {
    type: String,
    required: true,
    default: DEFAULT_STATUS,
    enum: ["waiting", "active", "banned", "deleted"],
    description:
      "Choose user status between : waiting, active, banned, deleted",
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
});

// Virtual for user's full name
UserSchema.virtual("user_fullname").get(function () {
  return this.user_firstname + " " + this.user_lastname;
});

// Virtual for user's URL
UserSchema.virtual("url").get(function () {
  return "/user/" + this._id;
});

// Virtual for user's permissions
UserSchema.virtual("user_permissions").get(function () {
  return this.user_permissions;
});

// Export the model
module.exports = mongoose.model("User", UserSchema);
