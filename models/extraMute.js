const mongoose = require("mongoose");

module.exports = mongoose.model("cyber_extramute", new mongoose.Schema({
    user: String, 
    array: Array
}));