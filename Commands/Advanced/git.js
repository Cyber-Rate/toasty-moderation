const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const Others = require("../../Settings/Others.json")
const Log = require("../../Settings/Log")
const Discord = require("discord.js")
const mutes = require("../../models/voicemute.js")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
class Git extends Command {
    constructor(client) {
        super(client, {
            name: "git",
            aliases: ["git"]
        });
    }

    async run(message, args, perm) {
 
if (!message.member.voice.channelID) return this.client.yolla("Bir ses kanalında olmalısın!", message.author, message.channel);
let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
if (!member) return this.client.yolla("Bir üye etiketle ve tekrardan dene!", message.author, message.channel);
if (!member.voice.channelID) return this.client.yolla("Bu kullanıcı herhangi bir ses kanalında bulunmuyor!", message.author, message.channel);
if (message.member.voice.channelID === member.voice.channelID) return this.client.yolla("Zaten aynı kanaldasınız!", message.author, message.channel);
let embed = new Discord.MessageEmbed().setColor("RANDOM").setFooter(moment(Date.now()).format("LLL")).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }))

if (message.member.permissions.has("ADMINISTRATOR")) {
    message.member.voice.setChannel(member.voice.channel)
    message.react("✅")
    message.channel.send(`${message.author}, ${member} kişisinin yanına gittiniz.`)
    this.client.channels.cache.get(Log.Transport.Log).send( embed.setDescription(`
    Bir Gitme işlemi gerçekleşti.

    **Odaya Giden Kullanıcı:** ${member} - **${member.id}**
    **Odasına Gidilen Yetkili:** ${message.author} - **${message.author.id}**`))
} else {
const question = await message.channel.send(member.toString(), { embed: embed.setDescription(`${member}, ${message.author} \`${member.voice.channel.name}\` odasına gelmek istiyor. Kabul ediyor musun?`) });
await question.react("✅");
await question.react("❌");
const answer = await question.awaitReactions((reaction, user) => ["✅", "❌"].includes(reaction.emoji.toString()) && user.id === member.user.id, { max: 1, time: 60000, errors: ["time"] }).catch(() => { question.edit(embed.setDescription("İşlem iptal edildi!")) });
if (answer.first().emoji.toString() === "✅") {
  embed.setColor("GREEN");
  question.delete();
  message.channel.send(`${message.author}, ${member} kişisinin yanına gittiniz.`)
  message.member.voice.setChannel(member.voice.channel);
} else {
  embed.setColor("RED");
  question.delete();
}
}
    }
}
module.exports = Git;

