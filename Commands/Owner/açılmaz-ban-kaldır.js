const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const Discord = require("discord.js")
const moment = require("moment");
require("moment-duration-format")
moment.locale("tr")
const db = require("../../models/cantUnBan.js")
class NoUNBANRemove extends Command {
    constructor(client) {
        super(client, {
            name: "infaz-kaldır",
            aliases: ["abankaldır","acılmazban-kaldır", "acılmaz-ban-kaldır", "açılmaz-ban-kaldır", "açılamazban-kaldır", "acılamazban-kaldır", "açılamaz-ban-kaldır", "acılamaz-ban-kaldır", "infazkaldır", "infaz-kaldır"]
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
                            if (!doc) {
                                embed.setDescription(`**${res.tag}** kullanıcısının açılmaz ban etiketi bulunmuyor.`)
                                return message.channel.send(embed)
                            } else {
                                embed.setDescription(`Bu kullanıcının açılmaz ban etiketini kaldırmak için yeterli izinlere sahip değilsin.`)
                                if (!message.member.roles.cache.has(Permissions.Sahip)) return message.channel.send(embed)
                                doc.delete().catch(e => console.log(e))
                                embed.setDescription(`**${res.tag}** kullanıcısının açılmaz ban etiketi kaldırıldı.`)
                            }
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



module.exports = NoUNBANRemove;
