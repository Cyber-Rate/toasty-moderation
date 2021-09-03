const mongoose = require("mongoose");

module.exports = mongoose.model("cyber_cmute", new mongoose.Schema({
    user: { type: String }, 
    yetkili: {type: String},
    muted: { type: Boolean, default: false},
    sebep: { type: String, default: ""},
    start: { type: Date, default: null},
    endDate: {type: Date, default: null}    
}));