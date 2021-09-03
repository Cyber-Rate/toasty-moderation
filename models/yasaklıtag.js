const mongoose = require("mongoose");

module.exports = mongoose.model("cyber_yasaklıtag", new mongoose.Schema({
    guild: String,
  taglar: Array
}));