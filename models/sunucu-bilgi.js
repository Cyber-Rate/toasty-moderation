const mongoose = require("mongoose")

const cyber_sunucu = new mongoose.Schema({
   guild: String,
   ihlal: Number
})

module.exports = mongoose.model("cyber_sunucu", cyber_sunucu)