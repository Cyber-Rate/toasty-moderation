const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const Role = require("../../Settings/Role.json");
const Guild = require("../../Settings/Guild.json");
const Register = require('../../models/kayıt.js');
const Log = require("../../Settings/Log.json")
const Discord = require("discord.js")
class İsimler extends Command {
  constructor(client) {
      super(client, {
          name: "isimler",
          description: "Latency and API response times.",
          usage: "erkek",
          aliases: ["nicks"]
      });
  }
  async run(message, args, level) {

  
  if(!message.member.roles.cache.has(Permissions.Register.Auth_Roles) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return


  let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
  if(!user) return this.client.yolla("Bir üye etiketle ve tekrardan dene!", message.author, message.channel)

  let registerData = await Register.findOne({ guildId: message.guild.id, userId: user.id });
  if(!registerData.userNames.length) return this.client.yolla("Bu üyenin geçmiş isimleri bulunamadı.", user.user, message.channel)
  let embed = new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }));
  message.channel.send(embed.setDescription(`${user} Adlı üyenin ${registerData.userNames.length} isim kayıtı bulundu. \n\n${registerData.userNames.map(x => `\`• ${x.nick}\` (${x.type.replace(`Erkek`, `<@&${Role.Register.Man[0]}>`).replace(`Kız`, `<@&${Role.Register.Woman[0]}>`)})`).join("\n ")}`))

  }

}

module.exports = İsimler;
