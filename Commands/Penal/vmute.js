const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const Guild = require("../../Settings/Guild.json");
const Others = require("../../Settings/Others.json");
const Log = require("../../Settings/Log.json")
const data = require("../../models/cezalar.js")
const ms = require("ms")
const moment = require("moment")
require("moment-duration-format")
const Discord = require("discord.js")
moment.locale("tr")
const cyber = require("pretty-ms");
const mutes = require("../../models/voicemute.js")
const sunucu = require("../../models/sunucu-bilgi.js")
const wmute = require("../../models/waitMute.js")
class VMute extends Command {
    constructor(client) {
        super(client, {
            name: "vmute",
            aliases: ["vmute"]
        });
    }

    async run(message, args, perm) {
        if(!message.member.roles.cache.has(Permissions.Voice_Mute.Auth_Roles) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if (!user) return this.client.yolla("Bir üye etiketle ve tekrardan dene!", message.author, message.channel)
        if (!args[1] || isNaN(ms(args[1]))) return this.client.yolla("Susturma süresini belirtmelisin.", message.author, message.channel)
        if (ms(args[1]) < ms("1m")) return this.client.yolla("Belirtilen susturma süresi geçerli değil.", message.author, message.channel)
        if (!args[2]) return this.client.yolla("Susturma sebebini belirtmelisin.", message.author, message.channel)
       // if (user.id == message.author.id) return this.client.yolla("Kullanıcılar kendilerine ceza-i işlem uygulayamaz.", message.author, message.channel)
       // if (user.hasPermission("ADMINISTRATOR")) return this.client.yolla("Yöneticilere ceza-i işlem uygulayamazsın.", message.author, message.channel)
      //  if (user.roles.cache.has("773271657582166086") && !message.member.roles.cache.some(r =>["727881517715423304", "729415958262710373", "736891557680119849", "727881272893898773"].includes(r.id))) return this.client.yolla("Yetkililer birbirlerine ceza işlemi uygulayamazlar.", message.author, message.channel)
      //  if (message.member.roles.highest.position <= message.guild.members.cache.get(user.id).roles.highest.position) return this.client.yolla("Kendi rolünden yüksek kişilere işlem uygulayamazsın!", message.author, message.channel)
        if (user.voice.serverMute == true) return this.client.yolla("Kullanıcı zaten susturulmuş durumda.", message.author, message.channel)
        let time = ms(args[1]);
        let cıkaralım = time + Date.parse(new Date());
        let şuanki = moment(Date.now()).format("LLL");
        let sonraki = moment(cıkaralım).format("LLL");
        let count = await data.countDocuments().exec();
        let cyber = count
        if(user.voice.channel) {
        user.voice.setMute(true)
        await message.channel.send(`${Others.Emojis.Off_Mic} <@${user.id}> kişisi ${await this.client.turkishDate(time)} boyunca ses kanallarında susturuldu. (Ceza Numarası: \`#${cyber + 1}\`)`)
        //let puan = await this.client.punishPoint(user.id)
        await this.client.channels.cache.get(Log.Cezapuan_Log).send(`${user}; adlı üye aldığınız **#${cyber + 1}** ID'li ceza ile **${await this.client.punishPoint(user.id) + 10}** ulaştınız.`).catch(e => { })
        const mutelendı = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setColor("32CD32")
            .setFooter(`Ceza Numarası: #${cyber + 1}`)
            .setDescription(`${user} (\`${user.user.tag}\` - \`${user.id}\`) kişisi ${await this.client.turkishDate(time)} boyunca ses kanallarında susturuldu\n\n• Susturulma sebebi: \`${args.slice(2).join(" ")}\`\n• Ses Mute atılma tarihi: \`${şuanki}\`\n• Ses Mute bitiş tarihi: \`${sonraki}\``)
            await this.client.channels.cache.get(Log.Voice_Mute.Log).send(mutelendı)
        await mutes.findOne({ user: user.id }, async (err, doc) => {
            const newMute = new mutes({
                user: user.id,
                muted: true,
                yetkili: message.author.id,
                endDate: moment(Date.now()) + ms(args[1]),
                tarih: moment(Date.now()).format("LLL"),
                sebep: args.slice(2).join(" ")
            })
            newMute.save().catch(e => console.log(e))
        })
    } else {
        await wmute.findOne({user: user.id}, async(err,res) => {
            if(!res) {
                await message.channel.send(`${Others.Emojis.Off_Mic} <@${user.id}> kişisinin ${await this.client.turkishDate(time)} sürelik ses mutesi başlatılamadı kullanıcı sese bağlanınca otomatik olarak cezası başlayacak. (Ceza Numarası: \`#${cyber + 1}\`)`)
            const newWmute = new wmute({
                user: user.id,
                muted: true,
                yetkili: message.author.id,
                sebep: args.slice(2).join(" "),
                date: time,
                cezano: cyber + 1
            })
            newWmute.save().catch(e => console.log(e))
            await data.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
                const newData = new data({
                    user: user.id,
                    yetkili: message.author.id,
                    ihlal: cyber + 1,
                    ceza: "Voice Mute",
                    sebep: args.slice(2).join(" "),
                    tarih: moment(Date.now()).format("LLL"),
                    bitiş: moment(Date.now() + time).format("LLL")
                })
                newData.save().catch(e => console.error(e))
            this.client.savePunishment()
            })
        } else {
            return message.channel.send(`${Others.Emojis.Off_Mic} <@${user.id}> kişisinin veritabanında halihazırda başlayacak bir cezası mevcut.`)
     
        }
        })
    }
    }
}

module.exports = VMute;
