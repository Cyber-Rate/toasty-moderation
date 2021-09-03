const Command = require("../../base/Command.js");
const {MessageEmbed} = require("discord.js");
const Permissions = require("../../Settings/Permissions.json");
const data = require("../../models/cezalar.js")
const ms = require("ms")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
const { table } = require('table');
class CezaSayı extends Command {
    constructor(client) {
        super(client, {
            name: "cezasayı",
            aliases: ["cs","ceza-sayı"]
        });
    }

    async run(message, args, perm) {
        if(!message.member.roles.cache.has(Permissions.Commander) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if (!user) return this.client.yolla("Bir üye etiketle ve tekrardan dene!", message.author, message.channel)
        await data.find({ user: user.id }).sort({ ihlal: "descending" }).exec(async (err, res) => {
            if(!res) return this.client.yolla(`${user} kullanıcısının ceza bilgisi bulunmuyor.`, message.author, message.channel)
        
        let filterArr = res.map(x => (x.ceza))
        let chatMute = filterArr.filter(x => x == "Chat Mute").length || 0
        let voiceMute = filterArr.filter(x => x == "Voice Mute").length || 0
        let jail = filterArr.filter(x => x == "Cezalı").length || 0
        let ban = filterArr.filter(x => x == "Yasaklı").length || 0
        let warn = filterArr.filter(x => x == "Uyarı").length || 0
        const embed = new MessageEmbed().setColor("RANDOM").setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
        .setDescription(`🚫 ${user.toString()} kişisinin sahip olduğu ceza sayıları aşağıda belirtilmiştir
        
        ${chatMute} Chat Mute, ${voiceMute} Voice Mute, ${jail} Cezalı, ${ban} Ban, ve ${warn} uyarı almış.
        `)
        
          message.channel.send(embed);
        }
        )
    }
}

module.exports = CezaSayı;
