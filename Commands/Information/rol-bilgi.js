const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
class Roller extends Command {
    constructor(client) {
        super(client, {
            name: "rol",
            aliases: ["roller", "rol-bilgi"]
        });
    }

    async run(message, args, perm) {
        if (!message.member.roles.cache.has(Permissions.Trident) && !message.member.hasPermission("ADMINISTRATOR")) return
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
        if (!args[0]) return this.client.yolla("Bir rol etiketle ve tekrardan dene!", message.author, message.channel)
        if (!role) return this.client.yolla("Belirtmiş olduğun rolü bulamadım ! Düzgün bir rol etiketle veya ID belirtip tekrar dene.", message.author, message.channel)
        let sayı = role.members.size
        if (sayı > 200) return message.channel.send(`${role} rolünde toplam ${sayı} kişi olduğundan dolayı rol bilgisini yollayamıyorum.`)
        let üyeler = role.members.map(x => `<@${x.id}> - (\`${x.id}\`) `)
        message.channel.send(`- ${role} rol bilgileri;
- Rol Rengi: \`${role.hexColor}\`
- Rol ID: \`${role.id}\`
- Rol Kişi Sayısı: \`${sayı}\`
─────────────────
- Roldeki Kişiler: 
${üyeler.join("\n")}
        `, { split: true })

    }
}

module.exports = Roller;
