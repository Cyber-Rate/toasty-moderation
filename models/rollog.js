const mongoose = require("mongoose");

module.exports = mongoose.model("cyber_roller", new mongoose.Schema({
    user: String, 
    roller: Array
}));
