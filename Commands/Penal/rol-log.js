const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const Discord = require("discord.js")
const roller = require("../../models/rollog.js")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")

class Rollog extends Command {
    constructor(client) {
        super(client, {
            name: "rol-log",
            usage: "erkek",
            aliases: ["rollog"]
        });
    }

    async run(message, args, level) {
        if (!message.member.roles.cache.has(Permissions.Trident) && !message.member.hasPermission("ADMINISTRATOR")) return
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if (!user) return this.client.yolla("Bir üye etiketle ve tekrardan dene!", message.author, message.channel)

        roller.findOne({ user: user.id }, async (err, res) => {
            if (!res) return this.client.yolla("<@" + user.id + "> kişisinin rol bilgisi veritabanında bulunmadı.", message.author, message.channel)
            let rol = res.roller.sort((a, b) => b.tarih - a.tarih)
            rol.length > 10 ? rol.length = 10 : rol.length = rol.length
            let filterRole = rol.map(x => ` \`[${x.tarih}, ${x.state}]\` <@${x.mod}>: <@&${x.rol}>`)
            const embed = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setColor("RANDOM")
                .setDescription(`${filterRole.join("\n")}`)
            message.channel.send(embed)
        })
    }
}

module.exports = Rollog;
