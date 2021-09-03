const mongoose = require("mongoose");

module.exports = mongoose.model("cyber_cezalı", new mongoose.Schema({
    user: { type: String }, 
    yetkili: {type: String},
    roller: Array,
    ceza: { type: Boolean, default: false},
    sebep: { type: String, default: ""},
    tarih: { type: String, default: ""}, 
}));