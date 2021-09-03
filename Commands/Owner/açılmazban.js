const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const Discord = require("discord.js")
const moment = require("moment");
require("moment-duration-format")
moment.locale("tr")
const db = require("../../models/cantUnBan.js")
class NoUNBAN extends Command {
    constructor(client) {
        super(client, {
            name: "infaz",
            aliases: ["aban","acılmazban", "acılmaz-ban", "açılmaz-ban", "açılamazban", "acılamazban", "açılamaz-ban", "acılamaz-ban", "infaz"]
        });
    }

    async run(message, args, client) {
      if(message.author.id !== Permissions.Sahip) return
      
        let embed = new Discord.MessageEmbed()
        embed.setColor("RANDOM")
        embed.setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))

        await this.client.users.fetch(args[0]).then(res => {
            if (!res) {
                embed.setDescription("Geçerli bir kullanıcı ID si giriniz.")
                return message.channel.send(embed)
            } else {
                message.guild.fetchBans(true).then(async (bans) => {
                    let ban = await bans.find(a => a.user.id === res.id)
                    if (!ban) {
                        embed.setDescription(`\`${res.tag}\` bu sunucuda yasaklı değil!`)
                        return message.channel.send(embed)
                    } else {
                        await db.findOne({ user: res.id }, async (err, doc) => {
                            if (doc) {
                                embed.setDescription(`**${res.tag}** kullanıcısı zaten <@${doc.mod}> tarafından açılamaz ban olarak etiketlenmiş.`)
                                return message.channel.send(embed)
                            } else {
                                message.guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD', limit: 100}).then(audit => {
                                    let user = audit.entries.find(a => a.target.id === res.id)
                                    if(user && user.executor.id !== message.author.id) return this.client.yolla(`Açılamaz ban etiketini sadece banı atan kişi (\`${user.executortag}\`) bırakabilir.`, message.author, message.channel)
                                    if(!user) return this.client.yolla(`Açılamaz olarak etiketlemeye çalıştığınız kullanıcı son 100 yasaklama içerisinde bulunmuyor.`, message.author, message.channel)
                                })
                                const newBanData = new db({
                                    user: res.id,
                                    mod: message.author.id,
                                    sebep: ban.reason || "Sebep Belirtilmemiş"
                                })
                                newBanData.save().catch(e => console.log(e))
                            }
                            embed.setDescription(`**${res.tag}** kullanıcısı başarıyla açılamaz ban olarak etiketlendi.`)
                            message.channel.send(embed)
                        })
                    }
                })
            }
        }).catch(err => {
            embed.setDescription("Geçerli bir kullanıcı ID si giriniz.")
            return message.channel.send(embed)
        })
    }
}



module.exports = NoUNBAN;
