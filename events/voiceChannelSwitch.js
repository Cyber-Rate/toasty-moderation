let database = require("../models/voicemute.js")
const mutes = require("../models/waitMute.js")
const Discord = require("discord.js");
const moment = require("moment")
require("moment-duration-format")
const ms = require("ms");
module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run(member, oldChannel, newChannel) {
        if (member.user.bot) return;
        if(this.client.channelTime.has(member.id)) {
        this.client.channelTime.set(member.id, {channel: newChannel.id, time: Date.now()})
        }
    }
};
