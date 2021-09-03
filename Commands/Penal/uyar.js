const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const Guild = require("../../Settings/Guild.json");
const Role = require("../../Settings/Role.json");
const Log = require("../../Settings/Log.json")
const data = require("../../models/cezalar.js")
const uyarılar = require("../../models/uyar.js")
const ms = require("ms")
const moment = require("moment")
const sunucu = require("../../models/sunucu-bilgi")
require("moment-duration-format")
moment.locale("tr")
const { table } = require('table');
const uyar = require("../../models/uyar.js");
class Uyar extends Command {
    constructor(client) {
        super(client, {
            name: "uyar",
            aliases: ["uyar"]
        });
    }

    async run(message, args, perm) {
        if (!message.member.roles.cache.has(Permissions.Warn.Auth_Roles) && !message.member.hasPermission("ADMINISTRATOR")) return
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if (!user) return this.client.yolla("Bir üye etiketle ve tekrardan dene!", message.author, message.channel)
        let sebep = args.slice(1).join(" ")
        if(!sebep) return this.client.yolla("Kullanıcının uyarı sebebini belirtmelisin.", message.author, message.channel)
        if (sebep && (await this.client.chatKoruma(sebep))) return message.reply('Sebep olarak reklam veya küfür yazamazsınız. Lütfen geçerli bir sebep girip yeniden deneyin. ')
        let count = await data.countDocuments().exec();
        let cyber = count
        uyarılar.findOne({user: user.id}, async(err,res) => {
            if(!res) {
                let arr = []
                arr.push({mod: message.author.id, sebep: sebep, tarih: moment(Date.now()).format("LLL")})
                const newWarn = new uyarılar({
                    user: user.id,
                    uyarılar: arr
                })
                newWarn.save().catch(e => console.log(e))
                user.roles.add(Role.Warn.Role)
                await data.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
                    const newData = new data({
                        user: user.id,
                        yetkili: message.author.id,
                        ihlal: cyber + 1,
                        ceza: "Uyarı",
                        sebep: sebep,
                        tarih: moment(Date.now()).format("LLL"),
                        bitiş: "-"
                    })
                    newData.save().catch(e => console.error(e))
                    this.client.savePunishment()
                })
                message.channel.send(`${this.client.ok} ${user} kişisine **${sebep}** sebebiyle ilk uyarısı verildi.Kullanıcının ceza puanı \`${await this.client.punishPoint(user.id)}\` oldu.`)
                await this.client.channels.cache.get(Log.Cezapuan_Log).send(`${user}; adlı üye aldığınız **#${cyber + 1}** ID'li ceza ile **${await this.client.punishPoint(user.id) + 3}** ulaştınız.`).catch(e => { })

            } else {
                res.uyarılar.push({mod: message.author.id, sebep: sebep, tarih: moment(Date.now()).format("LLL")})
                res.save().catch(e => console.log(e))
                await data.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
                    const newData = new data({
                        user: user.id,
                        yetkili: message.author.id,
                        ihlal: cyber + 1,
                        ceza: "Uyarı",
                        sebep: sebep,
                        tarih: moment(Date.now()).format("LLL"),
                        bitiş: "-"
                    })
                    newData.save().catch(e => console.error(e))
                    this.client.savePunishment()
                })
                if(res.uyarılar.length == 2) {
                    message.channel.send(`${this.client.ok} ${user} kişisine **${sebep}** sebebiyle 2. uyarısı verildi.Kullanıcının ceza puanı \`${await this.client.punishPoint(user.id)}\` oldu.`)
                    user.roles.remove(Role.Warn.Role)
                    user.roles.add(Role.Warn.Role2)
                }
                if(res.uyarılar.length == 3) {
                    message.channel.send(`${this.client.ok} ${user} kişisine **${sebep}** sebebiyle 3. uyarısı verildi.Kullanıcının ceza puanı \`${await this.client.punishPoint(user.id)}\` oldu.`)
                    user.roles.remove(Role.Warn.Role2)
                    user.roles.add(Role.Warn.Role3)
                }

            }

        })
      
    }
}

module.exports = Uyar;
