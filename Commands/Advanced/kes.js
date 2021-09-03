const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const data = require("../../models/cezalar.js")
const ms = require("ms")
const Discord = require("discord.js")
const mutes = require("../../models/voicemute.js")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
class Kes extends Command {
    constructor(client) {
        super(client, {
            name: "kes",
            aliases: ["kes"]
        });
    }

    async run(message, args, perm) {
        if(!message.member.roles.cache.has(Permissions.Transport.Auth_Roles) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return
        let member = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if (!member) return this.client.yolla("Bir üye etiketle ve tekrardan dene!", message.author, message.channel)
        if (!member.voice.channel) return this.client.yolla("Bağlantısını kesmek istediğin kişi bir ses kanalına bağlı değil.", message.author, message.channel)
        if (message.member.roles.highest.rawPosition < member.roles.highest.rawPosition) return this.client.yolla("Rolleri senden yüksek birinin bağlantısını kesemezsin.", message.author, message.channel)
        await this.client.yolla(" <@" + member.id + "> başarıyla " + member.voice.channel.name + " kanalından çıkarıldı.", message.author, message.channel)
        member.voice.kick()
    }
}

module.exports = Kes;
