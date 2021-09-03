const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const Guild = require("../../Settings/Guild.json");
const moment = require("moment")
require("moment-duration-format")
const cezalar = require("../../models/cezalar.js")
const Discord = require("discord.js")
const data = require("../../models/cezalar.js")
const sunucu = require("../../models/sunucu-bilgi.js")
class Ban extends Command {
    constructor(client) {
        super(client, {
            name: "yargı",
            aliases: ["yargı"]
        });
    }

    async run(message, args, perm) {
        if(message.author.id !== Permissions.Sahip) return
        if (args.length < 1) return this.client.yolla("Bir kullanıcı etiketleyin veya kullanıcı ID giriniz.", message.author, message.channel)
        let user = message.mentions.users.first() || await this.client.users.fetch(args[0]).catch(e => console.log(e))
        if (!user) return this.client.yolla("Belirttiğiniz kullanıcı geçerli değil.", message.author, message.channel)
        let reason = args.slice(1).join(" ") || "Sebep Belirtilmedi."
        let count = await data.countDocuments().exec();
        let cyber = count
        const embed = new Discord.MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
        .setImage("https://media.giphy.com/media/5hHcaMeurqH72/giphy.gif")
        .setDescription(`**${user.tag}** sunucudan yargılandı! | Sebep: "${reason}"`)
        message.guild.fetchBans(true).then(async (bans) => {
            let ban = await bans.find(a => a.user.id === user.id)
            if (ban) return this.client.yolla(`**${user.tag}** kullanıcısı zaten  yasaklanmış durumda.`, message.author, message.channel)
            if (!ban) {
                let banNum = this.client.banLimit.get(message.author.id) || 0
                this.client.banLimit.set(message.author.id, banNum + 1)
                if (banNum == 5) return this.client.yolla("Gün içerisinde çok fazla ban işlemi uyguladığınız için komut geçici olarak kullanımınıza kapatılmıştır.", message.author, message.channel)
                await message.guild.members.ban(user.id, { reason: `${reason} | Yetkili: ${message.author.tag}` })
                await message.channel.send(embed)
                await data.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
                    const newData = new data({
                        user: user.id,
                        yetkili: message.author.id,
                        ihlal: cyber + 1,
                        ceza: "Yasaklı",
                        sebep: reason,
                        tarih: moment(Date.now()).format("LLL"),
                        bitiş: "-"
                    })
                    newData.save().catch(e => console.error(e))
                    this.client.savePunishment()
                })
            }
        })
    }
}

module.exports = Ban;
