const Command = require("../../base/Command.js");
const Discord = require("discord.js");

class Nerede extends Command {
    constructor(client) {
        super(client, {
            name: "nerede",
            aliases: ["n"]
        });
    }

    async run(message, args, data) {
    let cyber;
    var cybernn = message.mentions.members.first();
    if (cybernn) {
        cyber = cybernn;
    } else {
        cyber = message.guild.members.cache.get(args[0]);
    }
    
    if (!cyber) return this.client.yolla(`Bir üye etiketle ve tekrardan dene!`, message.author, message.channel);
    let cybern = ``;
    if (!cyber.voice.channel) {
        cyber = `Belirtilen kullanıcı hiçbir kanalda bulunmamaktadır.`;
        
    } else {
        let süresi = this.client.channelTime.get(cyber.id) || {channel: cyber.voice.channel.name, time: "Yok"}
        let selfMt = cyber.voice.selfMute ? "**Mikrofonu: Kapalı**" : "**Mikrofonu: Açık**";
        let selfDf = cyber.voice.selfDeaf ? "**Kulaklığı: Kapalı**" : "**Kulaklığı: Açık**";
        let asd = await cyber.voice.channel.createInvite({maxUses: 1});
        cyber = "" + cyber.voice.channel.name + "" + " ("+cyber.voice.channel.members.size +"/"+ cyber.voice.channel.userLimit+")" + " kanalında. Kanala gitmek için [tıklaman](https://discord.gg/"+asd.code+") yeterli." + "\n```" +await this.client.turkishDate(Date.now() - süresi.time)+" önce giriş yapmış. ```"+ "\n "+ selfMt +"" + ", "+ selfDf +"";

    };
    let xxx = message.guild.channels.cache.get(cyber.lastMessageChannelID);
    if (!xxx) {
        xxx = `Bulunamadı`;
    };
    const embed = new Discord.MessageEmbed().setAuthor(cyber.user.tag, cyber.user.avatarURL({ dynamic: true }))
    .setDescription(`${cyber} kişisi #${cyber}\n\nEn son yazdığı kanal: ${xxx}`)
    message.channel.send(embed);

}

}
module.exports = Nerede;
