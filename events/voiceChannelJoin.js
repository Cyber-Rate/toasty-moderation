let database = require("../models/voicemute.js")
const mutes = require("../models/waitMute.js")
const Log = require("../Settings/Log.json")
const Discord = require("discord.js");
const moment = require("moment")
require("moment-duration-format")
const ms = require("ms");
module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run(member, channel) {
        if (member.user.bot) return;
        if(!this.client.channelTime.has(member.id)) {
        this.client.channelTime.set(member.id, {channel: channel.id, time: Date.now()})
        }
        await mutes.findOne({ user: member.id }, async (err, res) => {
            if (!res) return
            await database.findOne({ user: member.id }, async (err, doc) => {
                if (!doc) {
                    const newData = new database({
                        user: member.id,
                        muted: true,
                        yetkili: res.yetkili,
                        endDate: Date.now() + res.date,
                        start: Date.now(),
                        sebep: res.sebep
                    })
                    newData.save().catch(e => console.log(e))
                }
            })
            member.voice.setMute(true, res.sebep)
            let userx = this.client.users.cache.get(res.yetkili)
            let sonraki = Date.parse(new Date()) + res.date
            const mutelendı = new Discord.MessageEmbed()
                .setAuthor(userx.tag, userx.displayAvatarURL({ dynamic: true }))
                .setColor("32CD32")
                .setFooter(`Ceza Numarası: #${res.cezano}`)
                .setDescription(`${member} (\`${member.user.tag}\` - \`${member.id}\`) kişisinin ${await this.client.turkishDate(res.date)} süresi boyunca ses mute cezası otomatik olarak başlatıldı.\n\n• Susturulma sebebi: \`${res.sebep}\`\n• Ses Mute atılma tarihi: \`${moment(Date.parse(new Date())).format("LLL")}\`\n• Ses Mute bitiş tarihi: \`${moment(sonraki).format("LLL")}\``)
            await this.client.channels.cache.get(Log.Voice_Mute.Log).send(mutelendı)
            await mutes.deleteOne({ user: member.id }, async (err) => {
                if (err) { console.log("Silinemedi.") }
            })
        })
    }
};
