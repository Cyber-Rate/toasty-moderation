const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const Role = require("../../Settings/Role.json");
const Others = require("../../Settings/Others.json");
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
class Unmute extends Command {
    constructor(client) {
        super(client, {
            name: "unmute",
            aliases: ["unmute","unchatmute","cunmute","chatunmute","unvoicemute","vunmute","voiceunmute","unvmute","uncmute"]
        });
    }

    async run(message, args, perm) {
        if (!message.member.roles.cache.has(Permissions.Chat_Mute.Auth_Roles) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if(message.author.id == user.id) return
        if (!user) return this.client.yolla("Bir üye etiketle ve tekrardan dene!", message.author, message.channel)
        if (user.voice.serverMute == true) {
            user.voice.setMute(false)
           message.react(Others.Emojis.Check_Tick)
        } else {
            //message.react(Others.Emojis.Red_Tick)
        }
        if (user.roles.cache.has(Role.Chat_Mute.Role)) {
            user.roles.remove(Role.Chat_Mute.Role)
            message.react(Others.Emojis.Check_Tick)
        } else {
            message.react(Others.Emojis.Red_Tick)
        }

    }
}

module.exports = Unmute;
