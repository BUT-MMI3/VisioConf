const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reactIconSchema = new Schema({
    react_icon_uuid: {type: String, required: true},
    react_icon_name: {type: String, required: true},
    react_icon_url: {type: String, required: true},
});

module.exports = mongoose.model("ReactIcon", reactIconSchema);
