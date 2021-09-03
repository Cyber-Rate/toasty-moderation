const mongoose = require("mongoose");

module.exports = mongoose.model("cyber_notlar", new mongoose.Schema({
    user: { type: String }, 
    notlar: {type: Array }
}));