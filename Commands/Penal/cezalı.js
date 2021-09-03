const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const Limit = require("../../Settings/Limit.json");
const Role = require("../../Settings/Role.json");
const Log = require("../../Settings/Log.json")
const Discord = require("discord.js")
const cezalar = require("../../models/cezalı.js")
const ceza = require("../../models/cezalar.js")
const moment = require("moment")
require("moment-duration-format")
const sunucu = require("../../models/sunucu-bilgi")
class Cezalı extends Command {
    constructor(client) {
        super(client, {
            name: "cezalı",
            aliases: ["jail"]
        });
    }

    async run(message, args, level) {
        if (!message.member.roles.cache.has(Permissions.Jail.Auth_Roles) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return
        if (args.length < 1) return this.client.yolla("Bir üye etiketle ve tekrardan dene!", message.author, message.channel)
        let user = message.mentions.users.first() || await this.client.users.fetch(args[0]).catch(e => console.log(e))
        if (!user) return this.client.yolla("Cezalıya atmak istediğin kullanıcı geçerli değil.", message.author, message.channel)

        if (!args.slice(1).join(" ")) return this.client.yolla("Sebep belirtmeden cezalı işlemi uygulayamazsın.", message.author, message.channel)
        if(message.guild.members.cache.has(user.id)) {
            let member = message.guild.members.cache.get(user.id)
       // if (member.roles.cache.has("773271657582166086") && !message.member.roles.some(r => ["727881517715423304", "729415958262710373", "736891557680119849", "727881272893898773"])) return this.client.yolla("Yetkililer birbirlerine ceza işlemi uygulayamazlar.", message.author, message.channel)
        if (message.guild.members.cache.get(user.id).hasPermission("VIEW_AUDIT_LOG")) return this.client.yolla("Üst yetkiye sahip kişileri yasaklayamazsın!", message.author, message.channel)
        if (message.member.roles.highest.position <= message.guild.members.cache.get(user.id).roles.highest.position) return this.client.yolla("Kendi rolünden yüksek kişilere işlem uygulayamazsın!", message.author, message.channel)
        }
        if (user.id == message.author.id) return this.client.yolla("Kullanıcılar kendilerine ceza-i işlem uygulayamaz.", message.author, message.channel)
        let count = await ceza.countDocuments().exec();
        let cyber = count
        let banNum = this.client.jailLimit.get(message.author.id) || 0
        this.client.jailLimit.set(message.author.id, banNum + 1)
        if (banNum == Limit.Jail_Limit) return this.client.yolla("Gün içerisinde çok fazla jail işlemi uyguladığınız için komut geçici olarak kullanımınıza kapatılmıştır.", message.author, message.channel)
        if (!message.guild.members.cache.has(user.id)) {
            const embedx = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setColor("RANDOM")
                .setDescription(`${user.tag} kullanıcısı sunucuda bulunmamasına rağmen cezalıya atıldı.Sunucuya girişi engellendi. (Ceza Numarası: \`#${cyber + 1}\`)`)
            message.channel.send(embedx)
            await cezalar.findOne({ user: user.id }, async (err, doc) => {
                if (doc) return this.client.yolla(`${user.tag} kullanıcısı veritabanında cezalı olarak bulunuyor.`, message.author, message.channel)
                if (!doc) {
                    const newPun = new cezalar({
                        user: user.id,
                        ceza: true,
                        yetkili: message.author.id,
                        tarih: moment(Date.now()).format("LLL"),
                        sebep: args.slice(1).join(" ")
                    })
                    newPun.save().catch(e => console.log(e))
                }
                await ceza.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
                    const newData = new ceza({
                        user: user.id,
                        yetkili: message.author.id,
                        ihlal: cyber + 1,
                        ceza: "Cezalı",
                        sebep: args.slice(1).join(" "),
                        tarih: moment(Date.now()).format("LLL"),
                        bitiş: "-"
                    })
                    newData.save().catch(e => console.error(e))
                    this.client.savePunishment()
                })
            })
        } else {
            await cezalar.findOne({ user: user.id }, async (err, doc) => {
                if (doc) return this.client.yolla(`${user.tag} kullanıcısı veritabanında cezalı olarak bulunuyor.`, message.author, message.channel)
                let member = message.guild.members.cache.get(user.id)
                let memberRoles = member.roles.cache.map(x => x.id)
                member.roles.set(member.roles.cache.has(Role.Jail.Role) ? [Role.Jail.Role, Role.Jail.Role] : [Role.Jail.Role]).catch(e => console.log(e))
                           const cybern = new Discord.MessageEmbed()
                           .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                           .setDescription(`${member} kişisine <@&${Role.Jail.Role}> rolü verildi. (Ceza Numarası: \`#${cyber + 1}\`)`)
                           .setColor("RANDOM")
                       //  .setFooter(`${moment(Date.now()).format("LLL")}`)
                           message.channel.send(cybern)
                           // let puan = await this.client.punishPoint(user.id)
                            await this.client.channels.cache.get(Log.Cezapuan_Log).send(`${member}; adlı üye aldığınız **#${cyber + 1}** ID'li ceza ile **${await this.client.punishPoint(member.id) + 15}** ulaştınız.`).catch(e => { })
                            const başe = new Discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setColor("RANDOM")
                    .setDescription(`${user} kişisine __${args.slice(1).join(" ")}__ sebebi ile <@&${Role.Jail.Role}> rolü verildi.`)
                    .setFooter(`${moment(Date.now()).format("LLL")}`)
                await this.client.channels.cache.get(Log.Jail.Log).send(başe)
                if (!doc) {
                    const newPun = new cezalar({
                        user: user.id,
                        ceza: true,
                        roller: memberRoles,
                        yetkili: message.author.id,
                        tarih: moment(Date.now()).format("LLL"),
                        sebep: args.slice(1).join(" ")
                    })
                    newPun.save().catch(e => console.log(e))
                }
                await ceza.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
                    const newData = new ceza({
                        user: user.id,
                        yetkili: message.author.id,
                        ihlal: cyber + 1,
                        ceza: "Cezalı",
                        sebep: args.slice(1).join(" "),
                        tarih: moment(Date.now()).format("LLL"),
                        bitiş: "-"
                    })
                    newData.save().catch(e => console.error(e))
                    this.client.savePunishment()
                })
            })
        }


    }
}

module.exports = Cezalı;
