const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

const callSchema = new Schema({
    call_uuid: {
        type: String,
        required: true,
        description: 'Unique identifier for the call'
    },
    discussion_uuid: {
        type: String,
        required: true,
        description: 'Unique identifier for the discussion'
    },
    type: {
        type: String,
        enum: ['video', 'audio'],
        required: true,
        description: 'Type of call (video, audio)'
    },
    members_allowed_to_join: [{type: Schema.Types.ObjectId, ref: "User", required: true}],
    in_call_members: [{type: Schema.Types.ObjectId, ref: "User", required: true}],
    call_creator:{type: Schema.Types.ObjectId, ref: "User", required: true},
    is_ended: {
        type: Boolean,
        default: false,
        description: 'Whether the call has ended'
    },
    date_created: {
        type: Date,
        default: Date.now,
        description: 'Date the call was created'
    },
    date_ended: {
        type: Date,
        description: 'Date the call was ended'
    }
});

callSchema.methods.addMemberToCall = async function (socketId) {
    const user = await User.findBySocketId(socketId);
    this.in_call_members.push(user);
    return this.save();
}

callSchema.methods.removeMemberFromCall = async function (socketId) {
    const user = await User.findBySocketId(socketId);
    this.in_call_members.pull(user);

    if (this.in_call_members.length === 0) {
        this.remove();
    }

    return this.save();
}

callSchema.methods.addMemberToAllowedList = async function (socketId) {
    const user = await User.findBySocketId(socketId);
    this.members_allowed_to_join.push(user);
    return this.save();
}

callSchema.methods.removeMemberFromAllowedList = async function (socketId) {
    const user = await User.findBySocketId(socketId);
    this.members_allowed_to_join.pull(user);
    return this.save();
}

callSchema.methods.isMemberAllowedToJoin = async function (socketId) {
    const user = await User.findBySocketId(socketId);
    return this.members_allowed_to_join.includes(user);
}

callSchema.methods.isMemberInCall = async function (socketId) {
    const user = await User.findBySocketId(socketId);
    return this.in_call_members.includes(user);
}

callSchema.methods.isCallCreator = async function (socketId) {
    const user = await User.findBySocketId(socketId);
    return this.call_creator === user;
}

module.exports = mongoose.model('Call', callSchema);