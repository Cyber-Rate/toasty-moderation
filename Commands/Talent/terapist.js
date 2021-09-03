const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const GuildRole = require("../../Settings/GuildRole.json");
class Terapist extends Command {
    constructor(client) {
        super(client, {
            name: "terapist",
            aliases: ["terapist"]
        });
    }

    async run(message, args, perm) {
        if (!message.member.roles.cache.has(Permissions.Trident) && !message.member.hasPermission("ADMINISTRATOR")) return
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if(!user) return this.client.yolla("Bir üye etiketle ve tekrardan dene!", message.author, message.channel)
        if(!user.roles.cache.has(Role.Terapist)) {
            await this.client.yolla(`${user} kişisine <@&${Role.Terapist}> rolü verildi.`, message.author, message.channel)
            user.roles.add(Role.Terapist)
        } else{
            await this.client.yolla(`${user} kişisine <@&${Role.Terapist}> rolü alındı.`, message.author, message.channel)
            user.roles.remove(Role.Terapist)
        }
    }
}

module.exports = Terapist;
