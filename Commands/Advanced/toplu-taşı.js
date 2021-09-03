const Command = require("../../base/Command.js");
const data = require("../../models/cezalar.js")
const ms = require("ms")
const Discord = require("discord.js")
const mutes = require("../../models/voicemute.js")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
class TopluTaşı extends Command {
    constructor(client) {
        super(client, {
            name: "toplu-taşı",
            aliases: ["toplutaşı", "ttaşı"]
        });
    }

    async run(message, args, perm) {
        if (!message.member.hasPermission("ADMINISTRATOR")) return
        if (!message.member.voice.channel) return this.client.yolla("Bir ses kanalında olmalısın", message.author, message.channel)
        let channel = args[0]
        if (args.length < 1) return this.client.yolla("Kanalındaki üyeleri taşıyacağın bir kanal IDsi belirt.", message.author, message.channel)
        let positionChannel = message.guild.channels.cache.find(x => x.id == channel)
        if (!positionChannel) return this.client.yolla("Belirttiğin kanal IDsi geçerli değil.", message.author, message.channel)
        let channelMembers = message.member.voice.channel.members.map(x => x.id)
        for (let i = 0; i < channelMembers.length; i++) {
            setTimeout(() => {
                message.guild.members.cache.get(toplantıdaOlanlarx[i]).voice.setChannel(positionChannel.id)
            }, (i + 1) * 1000)
        }
        await this.client.yolla(`${message.member.voice.channel} kanalındaki üyeler ${positionChannel} kanalına taşındı`, message.author, message.channel)

    }
}

module.exports = TopluTaşı;
