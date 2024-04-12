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
});

callSchema.methods.addMemberToCall = function (socketId) {
    const user = User.findBySocketId(socketId);
    this.inCallMembers.push(user);
    return this.save();
}

callSchema.methods.removeMemberFromCall = function (socketId) {
    const user = User.findBySocketId(socketId);
    this.inCallMembers.pull(user);

    if (this.inCallMembers.length === 0) {
        this.remove();
    }

    return this.save();
}

callSchema.methods.addMemberToAllowedList = function (socketId) {
    const user = User.findBySocketId(socketId);
    this.membersAllowedToJoin.push(user);
    return this.save();
}

callSchema.methods.removeMemberFromAllowedList = function (socketId) {
    const user = User.findBySocketId(socketId);
    this.membersAllowedToJoin.pull(user);
    return this.save();
}

callSchema.methods.isMemberAllowedToJoin = function (socketId) {
    const user = User.findBySocketId(socketId);
    return this.membersAllowedToJoin.includes(user);
}

callSchema.methods.isMemberInCall = function (socketId) {
    const user = User.findBySocketId(socketId);
    return this.inCallMembers.includes(user);
}

callSchema.methods.isCallCreator = function (socketId) {
    const user = User.findBySocketId(socketId);
    return this.callCreator === user;
}

module.exports = mongoose.model('Call', callSchema);