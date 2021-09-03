const mongoose = require("mongoose")

const cyber_cezalar = new mongoose.Schema({
    user: String,
    ihlal: Number,
    yetkili: String,
    ceza: String,
    tarih: String,
    bitiş: String,
    sebep: String
})

module.exports = mongoose.model("cyber_cezalar", cyber_cezalar)