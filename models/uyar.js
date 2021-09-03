const mongoose = require("mongoose");

module.exports = mongoose.model("cyber_uyarılar", new mongoose.Schema({
   user: String,
   uyarılar: Array,
}));