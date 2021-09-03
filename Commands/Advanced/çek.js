const Command = require("../../base/Command.js");
const Log = require("../../Settings/Log.json");
const Others = require("../../Settings/Others.json")
const moment = require("moment")
const Discord = require("discord.js")
class Çek extends Command {
  constructor(client) {
      super(client, {
          name: "çek",
          aliases: ["çek"]
      });
  }

    async run(message, args, perm) {
        if (!message.member.voice.channelID) return this.client.yolla("Bir ses kanalında olmalısın!", message.author, message.channel);
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        if (!member) return  this.client.yolla("Bir üye etiketle ve tekrardan dene!", message.author, message.channel);
        if (!member.voice.channelID) return this.client.yolla("Bu kullanıcı herhangi bir ses kanalında bulunmuyor!", message.author, message.channel);
        if (message.member.voice.channelID === member.voice.channelID) return this.client.yolla("Zaten aynı kanaldasınız!", message.author, message.channel);
        let embed = new Discord.MessageEmbed().setColor("RANDOM").setFooter(moment(Date.now()).format("LLL")).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }))
       
        if (message.member.permissions.has("ADMINISTRATOR")) {
            member.voice.setChannel(message.member.voice.channelID);
            message.react("✅")
            message.channel.send(`${message.author}, ${member} kişisini yanınıza taşıdınız.`)
            this.client.channels.cache.get(Log.Transport.Log).send( embed.setDescription(`
            Bir Transport işlemi gerçekleşti.

            **Odaya Taşınan Kullanıcı:** ${member} - **${member.id}**
            **Odasına Taşıyan Yetkili:** ${message.author} - **${message.author.id}**`))
        } else {
        const question = await message.channel.send(member.toString(), { embed: embed.setDescription(`${member}, ${message.author} \`${message.member.voice.channel.name}\` seni odasına çekmek istiyor. Kabul ediyor musun?`) });
        await question.react("✅");
        await question.react("❌");
        const answer = await question.awaitReactions((reaction, user) => ["✅", "❌"].includes(reaction.emoji.toString()) && user.id === member.user.id, { max: 1, time: 60000, errors: ["time"] }).catch(() => { question.edit(embed.setDescription("İşlem iptal edildi!")) });
        if (answer.first().emoji.toString() === "✅") {
          embed.setColor("GREEN");
          question.delete();
          message.channel.send(`${message.author}, ${member} kişisini yanınıza taşıdınız.`)
          member.voice.setChannel(message.member.voice.channelID);
        } else {
          embed.setColor("RED");
          question.delete();
        }
      }
    }
}
module.exports = Çek;


