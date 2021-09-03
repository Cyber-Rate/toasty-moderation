const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");

const data = require("../../models/cezalar.js")
const ms = require("ms")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
const {table} = require('table');
const Discord = require("discord.js");
class Ceza extends Command {
    constructor(client) {
        super(client, {
            name: "ceza",
            aliases: ["ceza","ihlal"]
        });
    }

    async run(message, args, perm) {
        if(!message.member.roles.cache.has(Permissions.Commander) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return
        if(!args[0]) return this.client.yolla("Bir ceza numarası belirt ve tekrardan dene", message.author, message.channel)
        await data.findOne({ihlal: args[0]}, async (err, res) => {
            if(!res) return this.client.yolla("Belirttiğin numaralı ceza bilgisi bulunamadı.", message.author, message.channel)
            let user = message.guild.members.cache.get(res.user)
            let puan = await this.client.punishPoint(res.user)
            const embed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
            //.setThumbnail(user.user.displayAvatarURL({dynamic:true}))
            .setDescription(""+message.guild.name+ " sunucusunda <@"+res.user+"> kişisine uygulanan "+res.ihlal+" numaralı ceza:" + "\n\n" + "**Ceza Bilgileri**"  + "```"+
"ID => "+ res.ihlal + "\n" +
"Ceza Puan => "+ puan + "\n" +
"Yetkili => "+ this.client.users.cache.get(res.yetkili).tag + "\n"+
"Ceza Türü => "+ res.ceza + "\n" +
"Ceza Sebebi => "+ res.sebep + "\n" +
"Ceza Başlangıç => "+ res.tarih+ "\n" +
"Ceza Bitiş => "  + res.bitiş + "```" + "\n"+"kullanıcın tüm cezalarına bakmak ve ceza dosyasını indirmek için \`!cezalar @Cyber\` komutunu kullanın. "
                
            )
            .setColor("RANDOM")
            message.channel.send(embed)
           
    })
    }
}

module.exports = Ceza;