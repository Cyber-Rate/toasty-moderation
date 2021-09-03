const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const Limit = require("../../Settings/Limit.json");
const Role = require("../../Settings/Role.json");
const Log = require("../../Settings/Log.json")
const Discord = require("discord.js")
const cezalar = require("../../models/cezalı.js")
const ceza = require("../../models/cezalar.js")
const moment = require("moment")
const ms = require("ms")
require("moment-duration-format")
const sunucu = require("../../models/sunucu-bilgi")
class Karantina extends Command {
    constructor(client) {
        super(client, {
            name: "karantina",
            aliases: ["karantina","tempjail","tj","tempj","tjail"]
        });
    }

    async run(message, args, level) {
        if (!message.member.roles.cache.has(Permissions.Jail.Auth_Roles) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return
        if (args.length < 1) return this.client.yolla("Bir üye etiketle ve tekrardan dene!", message.author, message.channel)
        let user = message.mentions.users.first() || await this.client.users.fetch(args[0]).catch(e => console.log(e))
        if (!user) return this.client.yolla("Karantina'ya atmak istediğin kullanıcı geçerli değil.", message.author, message.channel)
        if (!args[1] || isNaN(ms(args[1]))) return this.client.yolla("Susturma süresini belirtmelisin.", message.author, message.channel)
        if (ms(args[1]) < ms("1m")) return this.client.yolla("Belirtilen susturma süresi geçerli değil.", message.author, message.channel)
        if (!args.slice(2).join(" ")) return this.client.yolla("Sebep belirtmeden karantina işlemi uygulayamazsın.", message.author, message.channel)
       // if (member.roles.cache.has("773271657582166086") && !message.member.roles.some(r => ["727881517715423304", "729415958262710373", "736891557680119849", "727881272893898773"])) return this.client.yolla("Yetkililer birbirlerine ceza işlemi uygulayamazlar.", message.author, message.channel)
        if (message.guild.members.cache.get(user.id).hasPermission("VIEW_AUDIT_LOG")) return this.client.yolla("Üst yetkiye sahip kişileri yasaklayamazsın!", message.author, message.channel)
        if (message.member.roles.highest.position <= message.guild.members.cache.get(user.id).roles.highest.position) return this.client.yolla("Kendi rolünden yüksek kişilere işlem uygulayamazsın!", message.author, message.channel)
        
        if (user.id == message.author.id) return this.client.yolla("Kullanıcılar kendilerine ceza-i işlem uygulayamaz.", message.author, message.channel)
        let time = ms(args[1]);
        let jailTime = time
        let cıkaralım = time + Date.parse(new Date());
        let şuanki = moment(Date.now()).format("LLL");
        let sonraki = moment(cıkaralım).format("LLL");
        let count = await ceza.countDocuments().exec();
        let cyber = count
        let banNum = this.client.karantinaLimit.get(message.author.id) || 0
        this.client.karantinaLimit.set(message.author.id, banNum + 1)
        if (banNum == Limit.Karantina_Limit) return this.client.yolla("Gün içerisinde çok fazla jail işlemi uyguladığınız için komut geçici olarak kullanımınıza kapatılmıştır.", message.author, message.channel)
      /*  if (!message.guild.members.cache.has(user.id)) {
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
                        ceza: "Karantina",
                        sebep: args.slice(1).join(" "),
                        tarih: moment(Date.now()).format("LLL"),
                        bitiş: "-"
                    })
                    newData.save().catch(e => console.error(e))
                    this.client.savePunishment()
                })
            })
        } else {*/
            await cezalar.findOne({ user: user.id }, async (err, doc) => {
                if (doc) return this.client.yolla(`${user.tag} kullanıcısı veritabanında karantina olarak bulunuyor.`, message.author, message.channel)
                let member = message.guild.members.cache.get(user.id)
                let memberRoles = member.roles.cache.map(x => x.id)
                member.roles.set(member.roles.cache.has(Role.Jail.Karantina) ? [Role.Jail.Karantina, Role.Jail.Karantina] : [Role.Jail.Karantina]).catch(e => console.log(e))
                           const cybern = new Discord.MessageEmbed()
                           .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                           .setDescription(`${member} kişisine <@&${Role.Jail.Karantina}> rolü verildi. (Ceza Numarası: \`#${cyber + 1}\`)`)
                           .setColor("RANDOM")
                       //  .setFooter(`${moment(Date.now()).format("LLL")}`)
                           message.channel.send(cybern)
                           // let puan = await this.client.punishPoint(user.id)
                            await this.client.channels.cache.get(Log.Cezapuan_Log).send(`${member}; adlı üye aldığınız **#${cyber + 1}** ID'li ceza ile **${await this.client.punishPoint(member.id) + 20}** ulaştınız.`).catch(e => { })
                            const başe = new Discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setColor("RANDOM")
                    .setDescription(`${user} (\`${user.tag}\` - \`${user.id}\`) kişisi ${await this.client.turkishDate(jailTime)} boyunca karantinaya atıldı\n\n• Karantinaya atılma sebebi: \`${args.slice(2).join(" ")}\` \n• Karantina atılma tarihi: \`${şuanki}\`\n• Karantina bitiş tarihi: \`${sonraki}\``)
                    .setFooter(`${moment(Date.now()).format("LLL")}`)
                await this.client.channels.cache.get(Log.Jail.Log).send(başe)
                if (!doc) {
                    const newPun = new cezalar({
                        user: user.id,
                        ceza: true,
                        roller: memberRoles,
                        yetkili: message.author.id,
                        tarih: moment(Date.now()).format("LLL"),
                        sebep: args.slice(2).join(" ")
                    })
                    newPun.save().catch(e => console.log(e))
                }
                await ceza.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
                    const newData = new ceza({
                        user: user.id,
                        yetkili: message.author.id,
                        ihlal: cyber + 1,
                        ceza: "Karantina",
                        sebep: args.slice(2).join(" "),
                        tarih: moment(Date.now()).format("LLL"),
                        bitiş: moment(Date.now() + time).format("LLL")
                    })
                    newData.save().catch(e => console.error(e))
                    this.client.savePunishment()
                    setTimeout(async () => {
                        
                        await cezalar.findOne({ user: user.id }, async (err, doc) => {

                    member.roles.set(doc.roller)
                    doc.delete().catch(e => console.log(e))
                    }, time);
                  })
                })
                   

                })
            }
     }
    


module.exports = Karantina;
