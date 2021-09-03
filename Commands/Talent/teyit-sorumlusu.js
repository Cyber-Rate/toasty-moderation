const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const Role = require("../../Settings/Role.json");

class TeyitSorumlu extends Command {
    constructor(client) {
        super(client, {
            name: "teyitsorumlusu",
            aliases: ["teyit", "teyit-sorumlu", "ts"]
        });
    }

    async run(message, args, perm) {
        if (!message.member.roles.cache.has(Permissions.Trident) && !message.member.hasPermission("ADMINISTRATOR")) return
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if(!user) return this.client.yolla("Bir üye etiketle ve tekrardan dene!", message.author, message.channel)
        if(!user.roles.cache.has(Role.Register.Role)) {
            await this.client.yolla(`${user} kişisine <@&${Role.Register.Role}> rolü verildi.`, message.author, message.channel)
            user.roles.add(Role.Register.Role)
        } else{
            await this.client.yolla(`${user} kişisine <@&${Role.Register.Role}> rolü alındı.`, message.author, message.channel)
            user.roles.remove(Role.Register.Role)
        }
    }
}

module.exports = TeyitSorumlu;
