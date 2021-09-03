const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const GuildRole = require("../../Settings/GuildRole.json");

class SorunCozme extends Command {
    constructor(client) {
        super(client, {
            name: "sorunçözücü",
            aliases: ["soruncozucu", "sorun-cozucu", "sorun-çözücü", "sç"]
        });
    }

    async run(message, args, perm) {
        if (!message.member.roles.cache.has(Permissions.Trident) && !message.member.hasPermission("ADMINISTRATOR")) return
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if(!user) return this.client.yolla("Bir üye etiketle ve tekrardan dene!", message.author, message.channel)
        if(!user.roles.cache.has(GuildRole.SorunCozme)) {
            await this.client.yolla(`${user} kişisine <@&${GuildRole.SorunCozme}> rolü verildi.`, message.author, message.channel)
            user.roles.add(GuildRole.SorunCozme)
        } else{
            await this.client.yolla(`${user} kişisine <@&${GuildRole.SorunCozme}> rolü alındı.`, message.author, message.channel)
            user.roles.remove(GuildRole.SorunCozme)
        }
    }
}

module.exports = SorunCozme;
