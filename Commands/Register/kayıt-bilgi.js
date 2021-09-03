const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const Discord = require("discord.js")
const kayıtlar = require("../../models/kayıt.js")

class Kayıt extends Command {
    constructor(client) {
        super(client, {
            name: "kayıt-bilgi",
            description: "Latency and API response times.",
            usage: "erkek",
            aliases: ["kayıtbilgi", "kayıtlar","kayıtlarım","kaydettiklerim","kayıt-info"]
        });
    }

    async run(message, args, level) {
        if(!message.member.roles.cache.has(Permissions.Register.Auth_Roles) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild) || message.member
        await kayıtlar.findOne({ guildId: message.guild.id, userId: user.id }, async (err, res) => {
            if (!res) return this.client.yolla("<@" + user.id + "> kişisinin hiç kayıt bilgisi yok.", message.author, message.channel)
          //  let üyeler = await this.client.shuffle(res.kayıtlar.map(x => "<@" + x + ">"))
           // if (üyeler.length > 10) üyeler.length = 10
            this.client.yolla("<@" + user.id + "> kişisi "+ res.manRegister + " erkek, " + res.womanRegister + " kadın kaydetmiş.\nToplam kayıt: " + res.totalRegister + " ", user.user, message.channel)
        })
    }
}

module.exports = Kayıt;
