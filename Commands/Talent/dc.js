const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const Guild = require("../../Settings/Guild.json");
const GuildRole = require("../../Settings/GuildRole.json");

class DoğrulukCesaret extends Command {
    constructor(client) {
        super(client, {
            name: "dc",
            aliases: ["dc"]
        });
    }

    async run(message, args, perm) {
        if (!message.member.roles.cache.some(r => Permissions.Trident.includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return
        let user = message.mentions.members.first() || await this.client.üye(args[1], message.guild)
        if(!user) return this.client.yolla("Bir üye etiketle ve tekrardan dene!", message.author, message.channel)
        if (!args[0]) return this.client.yolla("Rol verme biçimini belirt ve tekrar dene. \`Örnek kullanım: !vk sorumlu @cyber/ID - !vk cezalı @cyber/ID\`", message.author, message.channel)

        if (args[0] == "sorumlu") {
            if (!message.member.roles.cache.has(Permissions.Trident) && !message.member.hasPermission("ADMINISTRATOR")) return
            if (!user.roles.cache.has(Guild.Role)) {
                await this.client.yolla(`${user} kişisine <@&${GuildRole.Dc_Sorumlusu}> rolü verildi.`, message.author, message.channel)
                user.roles.add(GuildRole.Dc_Sorumlu)
            } else {
                await this.client.yolla(`${user} kişisine <@&${GuildRole.Dc_Sorumlusu}>  rolü alındı.`, message.author, message.channel)
                user.roles.remove(GuildRole.Dc_Sorumlu)
            }
        }

        if (args[0] == "denetleyici") {
            if (!message.member.roles.cache.has(Permissions.Trident) && !message.member.hasPermission("ADMINISTRATOR")) return
            if (!user.roles.cache.has(GuildRole.Dc_Denetliyici)) {
                await this.client.yolla(`${user} kişisine <@&${GuildRole.Dc_Denetliyici}>  rolü verildi.`, message.author, message.channel)
                user.roles.add(GuildRole.Dc_Denetliyici)
            } else {
                await this.client.yolla(`${user} kişisine <@&${GuildRole.Dc_Denetliyici}>  rolü alındı.`, message.author, message.channel)
                user.roles.remove(GuildRole.Dc_Denetliyici)
            }
        }

       /* if (args[0] == "elit") {
            if (!message.member.roles.cache.some(r => Permissions.Trident) && !message.member.hasPermission("ADMINISTRATOR")) return
            if (!user.roles.cache.has("740233528741986331")) {
                await this.client.yolla(`${user} kişisine <@&740233528741986331> rolü verildi.`, message.author, message.channel)
                user.roles.add("740233528741986331")
            } else {
                await this.client.yolla(`${user} kişisine <@&740233528741986331> rolü alındı.`, message.author, message.channel)
                user.roles.remove("740233528741986331")
            }
        }
*/

        if (args[0] == "cezalı") {
            if (!user.roles.cache.has(GuildRole.Dc_Cezalı)) {
                await this.client.yolla(`${user} kişisine <@&${GuildRole.Dc_Cezalı}> rolü verildi.`, message.author, message.channel)
                user.roles.add(GuildRole.Dc_Cezalı)
            } else {
                await this.client.yolla(`${user} kişisine <@&${GuildRole.Dc_Cezalı}> rolü alındı.`, message.author, message.channel)
                user.roles.remove(GuildRole.Dc_Cezalı)
            }
        }
    }
}

module.exports = DoğrulukCesaret;
