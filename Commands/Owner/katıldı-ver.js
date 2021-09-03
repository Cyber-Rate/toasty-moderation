const Command = require("../../base/Command.js");
const Role = require("../../Settings/Role.json")
const Log = require("../../Settings/Log.json")
const Discord = require("discord.js");
class Toplantı extends Command {
    constructor(client) {
        super(client, {
            name: "yoklama",
            aliases: ["yoklama"]
        });
    }

    async run(message, args, level) {
        if (!message.member.hasPermission("ADMINISTRATOR")) return
        let embed = new Discord.MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor("RANDOM").setTimestamp();
        if(!message.member.voice || message.member.voice.channelID != Log.Meeting.Log) return;
        
        let members = message.guild.members.cache.filter(member => member.roles.cache.has(Role.Meeting.Role) && member.voice.channelID != Log.Meeting.Log);
        members.array().forEach((member, index) => {
          setTimeout(() => {
            member.roles.remove(Role.Meeting.Role).catch();
          }, index * 1250)
        });
        let verildi = message.member.voice.channel.members.filter(member => !member.roles.cache.has(Role.Meeting.Role) && !member.user.bot)
        verildi.array().forEach((member, index) => {
          setTimeout(() => {
            member.roles.add(Role.Meeting.Role).catch();
          }, index * 1250)
        });
        message.channel.send(embed.setDescription(`Toplantıda olan yetkililere katıldı permi verilmeye başlandı! \n\n Rol Verilecek Yetkili Sayısı: **${verildi.size}** \n Rol Alınacak Yetkili Sayısı: **${members.size}**`)).catch()
        return message.channel.send("Toplantıda olan tüm yetkililere katıldı permi verildi, Toplantıya gelip katıldı permini alan kişilerden ise katıldı permi alındı.")

    }
}
module.exports = Toplantı