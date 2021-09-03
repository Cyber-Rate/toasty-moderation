const Discord = require("discord.js");
const Log = require("../Settings/Log.json")

module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run(oldMessage, newMessage) {
            if (newMessage.author.bot || newMessage.channel.type === "dm") return;
            let sc = newMessage.guild.channels.cache.get(Log.Message.Update)
        
            if (oldMessage.content == newMessage.content) return;
            let embed = new Discord.MessageEmbed()
              .setColor("RANDOM")
              .setThumbnail(newMessage.author.avatarURL())
              .setAuthor(`Mesaj Düzenlendi`, newMessage.author.avatarURL())
              .addField("Kullanıcı", "<@"+newMessage.author+">**  -  **"+newMessage.author.id +"")
              .addField("Kanal Adı - Mesaj ID", newMessage.channel.name +"**  -  **"+ newMessage.id)
              .addField("Eski Mesaj", "```" + oldMessage.content + "```")
              .addField("Yeni Mesaj", "```" + newMessage.content + "```")
              .setFooter(`Bugün saat ${newMessage.createdAt.getHours()}:${newMessage.createdAt.getMinutes()}`
              );
              sc.send(embed)
              }   
            }

    
