const Command = require("../../base/Command.js");
const Discord = require("discord.js");
const Others = require("../../Settings/Others.json");
const Limit = require("../../Settings/Limit.json");
const Register = require('../../models/kayıt.js');
const Guild = require('../../Settings/Guild.json');
const Role = require('../../Settings/Role.json');

class Booster extends Command {
    constructor(client) {
        super(client, {
            name: "zengin",
            aliases: ["booster", "b"]
        });
    }

    async run(message, args, data) {

  let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
  if(!message.member.roles.cache.has(Role.Booster_Role)) return message.react(Others.Emojis.Red_Tick)
  const nick = args.slice(1).filter(arg => isNaN(arg)).map(arg => arg[0].toUpperCase() + arg.slice(1).toLowerCase()).join(" ");
  if(!nick) return message.react(Others.Emojis.Red_Tick)
  if (nick && (await this.client.chatKoruma(nick))) return this.client.yolla('Kullanıcı isminizde küfür-reklam kullanamazsınız.', message.author, message.channel)
  if(nick.length > 30) return this.client.yolla("isim ya da yaş ile birlikte toplam 30 karakteri geçecek bir isim giremezsin.", message.author, message.channel)
  if (!member.manageable) return this.client.yolla(`Benden yüksek bir pozisyona sahipsin o yüzden ismini değiştiremiyorum.`, message.author, message.channel)
  let banNum = this.client.boosterLimit.get(message.author.id) || 0
  this.client.boosterLimit.set(message.author.id, banNum + 1)
  if (banNum == Limit.Booster_Limit) return this.client.yolla("Gün içerisinde çok fazla jail işlemi uyguladığınız için komut geçici olarak kullanımınıza kapatılmıştır.", message.author, message.channel)
  let yaş = args.filter(arg => !isNaN(arg))[0]
  let registerData = await Register.findOne({ guildId: message.guild.id, userId: member.id });

  if(!registerData) {
    let newRegisterData = new Register({
      guildId: message.guild.id,
      userId: member.id,
      userNames: [{ nick: `${nick.charAt(0).toUpperCase() + nick.slice(1).toLowerCase()}${yaş ? ` | ${yaş}` : ``}`, type: `Booster İsim Değiştirme`}]
    }).save();
  } else {
    registerData.userNames.push({ nick: `${nick.charAt(0).toUpperCase() + nick.slice(1).toLowerCase()}${yaş ? ` | ${yaş}` : ``}`, type: `Booster İsim Değiştirme`})
    registerData.save();
  }

if(!message.member.user.username.includes(Guild.Tag)) {
    message.member.setNickname(`${Guild.Secondary_Tag} ${nick.charAt(0).toUpperCase() + nick.slice(1).toLowerCase()} ${yaş ? `| ${yaş}` : ``}`)
} else if (message.member.user.username.includes(Guild.Tag)) {
message.member.setNickname(`${Guild.Tag} ${nick.charAt(0).toUpperCase() + nick.slice(1).toLowerCase()} ${yaş ? `| ${yaş}` : ``}`)
} 
 return message.react(Others.Emojis.Check_Tick)

}
}
 module.exports = Booster;
