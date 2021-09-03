const mongoose = require("mongoose");

module.exports = mongoose.model("cyber_alarm", new mongoose.Schema({
    user: { type: String }, 
    alarm: { type: Boolean, default: false},
    sebep: { type: String, default: ""},
    endDate: {type: Date, default: null}   ,
    channel: {type: String, default: ""} 
}));