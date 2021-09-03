const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const data = require("../../models/cezalar.js")
const uyarılar = require("../../models/uyar.js")
const ms = require("ms")
const moment = require("moment")
const sunucu = require("../../models/sunucu-bilgi")
require("moment-duration-format")
moment.locale("tr")
const { table } = require('table');
const uyar = require("../../models/uyar.js");
const { MessageEmbed } = require("discord.js");
class Uyarılar extends Command {
    constructor(client) {
        super(client, {
            name: "uyarılar",
            aliases: ["uyarılar"]
        });
    }

    async run(message, args, perm) {
        if (!message.member.roles.cache.has(Permissions.Warn.Auth_Roles) && !message.member.hasPermission("ADMINISTRATOR")) return
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if (!user) return this.client.yolla("Bir üye etiketle ve tekrardan dene!", message.author, message.channel)
        uyarılar.findOne({user: user.id}, async(err,res) => {
            if(!res) return message.channel.send("Belirttiğin kullanıcının uyarısı bulunmuyor.")
            let num = 1
            let uyarılarMap = res.uyarılar.map(x => `- ${num++}. uyarı ${this.client.users.cache.get(x.mod).tag} tarafından ${x.tarih} tarihinde "${x.sebep}" sebebiyle verildi.\n`).join("\n")
            const embed = new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
            .setColor("RANDOM")
            .setDescription(`${user} kullanıcısının uyarıları aşağıda belirtilmiştir:\n\n\`\`\`${uyarılarMap}\`\`\``)
            message.channel.send(embed)

        })
      
    }
}

module.exports = Uyarılar;
