const Command = require("../../base/Command.js");
const Log = require("../../Settings/Log.json")
const Discord = require("discord.js");
const Logger = require("../../modules/Logger.js");
class Avatar extends Command {
    constructor(client) {
        super(client, {
            name: "avatar",
            aliases: ["av","pp"]
        });
    }

    async run(message, args, data) {
        if(!message.member.hasPermission("ADMINISTRATOR") && message.channel.id == Log.Photo_Chat) return
        let user = args.length > 0 ? message.mentions.users.first() || await this.client.users.fetch(args[0]) || message.author : message.author
        message.channel.send(`${user.tag} ${user.displayAvatarURL({ dynamic: true, size: 4096 })}`)

    }
}

module.exports = Avatar;
