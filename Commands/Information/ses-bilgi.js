const Command = require("../../base/Command.js");
const Discord = require("discord.js")

class Sesbilgi extends Command {
    constructor(client) {
        super(client, {
            name: "ses",
            aliases: ["ses-bilgi"]
        });
    }

    async run(message, args, data) {
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!user) return this.client.yolla("Bir üye etiketle ve tekrardan dene!", message.author, message.channel)
        if (!user.voice.channel) return this.client.yolla("<@" + user.id + "> bir ses kanalına bağlı değil.", message.author, message.channel)
        let mic = user.voice.selfMute == true ? "kapalı" : "açık"
        let hop = user.voice.selfDeaf == true ? "kapalı" : "açık"
        let süresi = this.client.channelTime.get(user.id) || {channel: user.voice.channel.name, time: "Yok"}
        await this.client.yolla("<@" + user.id + "> kişisi " + user.voice.channel.name + " kanalında. Mikrofonu " + mic + ", kulaklığı " + hop + ".\n───────────────\nKullanıcı <#"+ süresi.channel +"> kanalına "+await this.client.turkishDate(Date.now() - süresi.time)+" önce giriş yapmış.", message.author, message.channel)

    };
}
module.exports = Sesbilgi;
