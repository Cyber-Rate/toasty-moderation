const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");

class İzinli extends Command {
    constructor(client) {
        super(client, {
            name: "izinli",
            aliases: ["izinli","izin"]
        });
    }

    async run(message, args, perm) {
        if (!message.member.hasPermission("ADMINISTRATOR")) return
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if(!user) return this.client.yolla("Bir üye etiketle ve tekrardan dene!", message.author, message.channel)
        if(!user.roles.cache.has(Permissions.İzinli)) {
            await this.client.yolla(`${user} kişisine <@&${Permissions.İzinli}> rolü verildi.`, message.author, message.channel)
            user.roles.add(Permissions.İzinli)
        } else{
            await this.client.yolla(`${user} kişisine <@&${Permissions.İzinli}> rolü alındı.`, message.author, message.channel)
            user.roles.remove(Permissions.İzinli)
        }
    }
}

module.exports = İzinli;
