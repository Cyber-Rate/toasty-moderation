const Command = require("../../base/Command.js")
const Permissions = require("../../Settings/Permissions.json");
const Others = require("../../Settings/Others.json")
class Kanal extends Command {
    constructor(client) {
        super(client, {
            name: "kanal",
            aliases: ["kanal","kilit"]
        });
    }

    async run(message, args, perm) {
if(!message.member.roles.cache.has(Permissions.Guild_Owner) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return
        if (args[0] == "kilit" || args[0] == "kapat" || args[0] == "kilitle") {
            message.channel.updateOverwrite(message.guild.id, {
                SEND_MESSAGES: false
            }).then(async() => {
                message.react("🔒")
                await this.client.yolla("Kanal başarıyla kilitlendi.", message.author, message.channel)
            })
        }

        if (args[0] == "aç") {
            message.channel.updateOverwrite(message.guild.id, {
                SEND_MESSAGES: true
            }).then(async() => {
                message.react("🔓")
                await this.client.yolla("Kanalın kilidi başarıyla açıldı.", message.author, message.channel)
            })
        }
    }
}

module.exports = Kanal;
