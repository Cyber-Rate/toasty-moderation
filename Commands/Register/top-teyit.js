const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const Discord = require("discord.js")
const Register = require("../../models/kayıt.js")

class topteyit extends Command {
    constructor(client) {
        super(client, {
            name: "topteyit",
            description: "Latency and API response times.",
            usage: "erkek",
            aliases: ["topteyit"]
        });
    }

    async run(message, args, level) {
        if(!message.member.roles.cache.has(Permissions.Register.Auth_Roles) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return
   
   let registerTop = await Register.find({ guildId: message.guild.id }).sort([["totalRegister", "descending"]]).exec();
 // let toplam = registerTop.map(x => x.totalRegister).reduce((a, b) => a + b, 0)
  let kayıt = registerTop.sort((a, b) => b.totalRegister - a.totalRegister, 0).slice(0, 20)
  let num = 1
  let find = kayıt.find(x => x.userId === message.author.id)
  let bişi = kayıt.map(x => `\`${num++}.\` <@${x.userId}>: \`${x.totalRegister ?? 0} Kayıt.\`${x.userId === message.author.id ? " **(Siz)** " : ""}`).join("\n")
  message.channel.send(new Discord.MessageEmbed().setColor("RANDOM").setDescription(`**Top 20 kayıt sıralaması aşağıda belirtilmiştir.** \n\n Tüm zamanlar da toplam **${registerTop.length}** kayıt yapılmış.\n${bişi}\n\n${find ? `Siz ${registerTop.indexOf(find) + 1}. sırada bulunuyorsunuz. Toplam ${find.manRegister} erkek, ${find.womanRegister} kadın kaydetmişsiniz.` : "Hiç kayıt bilginiz yok."}`))
//\nBu hafta toplam \`${toplam}\` kayıt işlemi yapıldı.

    }
}

module.exports = topteyit;
