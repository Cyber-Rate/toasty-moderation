const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const Discord = require("discord.js")
const cezalar = require("../../models/cezalı.js")

class Yetkilisayy extends Command {
    constructor(client) {
        super(client, {
            name: "yetkilisay",
            aliases: ["ysay", "yetkili-say"]
        });
    }


    async run(message, args, level) {
        if (!message.member.hasPermission("ADMINISTRATOR")) return
        let roles = message.guild.roles.cache.get(Permissions.Yetkili); // EN ALT YETKILI ROLUNUN IDSI BURAYA
        let üyeler = message.guild.members.cache.filter(uye => !uye.user.bot && uye.roles.highest.position >= roles.position && uye.presence.status !== "offline" && !uye.voice.channel).array();
         var filter = m => m.author.id === message.author.id && m.author.id !== client.user.id && !m.author.bot;
         if(üyeler.length == 0) return
   
         message.channel.send(`Online olup seste olmayan <@&${roles.id}> rolündeki ve üzerinde ki yetkili sayısı: ${üyeler.length ?? 0} `)
            message.channel.send(``+ üyeler.map(x => "<@" + x.id + ">").join(",") + ``)
    }
}

module.exports = Yetkilisayy
