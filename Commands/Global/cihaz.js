const Command = require("../../base/Command.js");
const Discord = require("discord.js")
class Cihaz extends Command {
    constructor(client) {
        super(client, {
            name: "cihaz",
            aliases: ["cıhaz"]
        });
    }

    async run(message, args, data) {
        if (!message.member.hasPermission("VIEW_AUDIT_LOG")) return
        let user = message.mentions.users.first() || this.client.users.cache.get(args[0])
        if (!args[0]) return this.client.yolla("Bir üye etiketle ve tekrardan dene!", message.author, message.channel)
        if (!user) return this.client.yolla("Belirttiğin üyeyi bulamıyorum.", message.author, message.channel)
        if (user.presence.status == "offline") return this.client.yolla(`\`${user.tag}\` kullanıcısı çevrimdışı olduğundan dolayı cihaz bilgisini tespit edemiyorum.`, message.author, message.channel)
        let cihaz = ""
        let ha = Object.keys(user.presence.clientStatus)
        if (ha[0] == "mobile") cihaz = "Mobil Telefon"
        if (ha[0] == "desktop") cihaz = "Masaüstü Uygulama"
        if (ha[0] == "web") cihaz = "İnternet Tarayıcısı"
        message.channel.send(`\`${user.tag}\` üyesinin şu anda kullandığı cihaz: \`${cihaz}\``)

    }
}

module.exports = Cihaz;
