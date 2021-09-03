const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const Discord = require("discord.js")
const moment = require("moment");
const data = require("../../models/cezalar.js")
const Log = require("../../Settings/Log.json")
const ceza = require("../../models/cezalar.js")
require("moment-duration-format")
moment.locale("tr")
const db = require("../../models/cantUnBan.js")
class Unban extends Command {
    constructor(client) {
        super(client, {
            name: "unban",
            aliases: ["unban"]
        });
    }

    async run(message, args, client) {
        if(!message.member.roles.cache.has(Permissions.Ban.Auth_Roles) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return
      let embed = new Discord.MessageEmbed()
      let count = await ceza.countDocuments().exec();
      let cyber = count
      embed.setColor("RANDOM")
      embed.setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
      
      let user = message.mentions.users.first() || await this.client.users.fetch(args[0]).then(res => {
          if(!res){
              embed.setDescription("Bir üye etiketle ve tekrardan dene!")
              return message.channel.send(embed)
          }else{
              message.guild.fetchBans(true).then(async(bans) => {
                  let ban = await bans.find(a => a.user.id === res.id)
                  if(!ban){
                      embed.setDescription(`\`${res.tag}\` bu sunucuda yasaklı değil!`)
                      return message.channel.send(embed)
                  } else {
                    await db.findOne({userid: res.id}, async(err,dbres) => {
                        if(!dbres) {
                            await message.guild.members.unban(res.id)
                            embed.setDescription(`**${res.tag}** kullanıcısının yasağı kaldırıldı. (\`#${cyber + 1}\`)`)
                            message.channel.send(embed)
                            this.client.channels.cache.get(Log.Ban.Unban).send(new Discord.MessageEmbed()
                            .setColor("RANDOM")
                            .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
                            .setFooter(moment(Date.now()).format("LLL"))
                            .setDescription(`**${res.tag}** üyesinin yasağı **${message.author}** tarafından kaldırıldı.`)
                            )
                            await data.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
                                const newData = new data({
                                    user: user,
                                    yetkili: message.author.id,
                                    ihlal: cyber + 1,
                                    ceza: "Unban",
                                    sebep: "-",
                                    tarih: moment(Date.now()).format("LLL"),
                                    bitiş: "-"
                                })
                                newData.save().catch(e => console.error(e))
                                this.client.savePunishment()
                            })
                        } else {
                            embed.setDescription(`${res.tag} kullanıcısının yasağı <@${dbres.mod}> tarafından açılamaz olarak etiketlenmiştir.Yasağı sadece <@${dbres.mod}> kaldırabilir.`)
                            if(message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed)
                            await message.guild.members.unban(res.id)
                            embed.setDescription(`**${res.tag}** kullanıcısının yasağı kaldırıldı. (\`#${cyber + 1}\`) `)
                            this.client.channels.cache.get(Log.Ban.Unban).send(new Discord.MessageEmbed()
                            .setColor("RANDOM")
                            .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
                            .setFooter(moment(Date.now()).format("LLL"))
                            .setDescription(`**${res.tag}** üyesinin yasağı **${message.author}** tarafından kaldırıldı.`)
                            )
                            message.channel.send(embed)
                            await data.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
                                const newData = new data({
                                    user: user,
                                    yetkili: message.author.id,
                                    ihlal: cyber + 1,
                                    ceza: "Unban",
                                    sebep: "-",
                                    tarih: moment(Date.now()).format("LLL"),
                                    bitiş: "-"
                                })
                                newData.save().catch(e => console.error(e))
                                this.client.savePunishment()
                            })
                            res.delete().catch(e => console.log(e))
                      
                      
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



module.exports = Unban;
