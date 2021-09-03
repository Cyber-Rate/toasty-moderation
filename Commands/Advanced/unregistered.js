const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json")
const { MessageEmbed } = require("discord.js")
const Role = require("../../Settings/Role.json")
class Unregister extends Command {
    constructor(client) {
        super(client, {
            name: "kayıtsız",
            aliases: ["unregistered", "teyitsiz","teyitat","teyit-at","unreg","unregister"]
        });
    }

    async run(message, args, client) {
        if (!message.member.hasPermission("ADMINISTRATOR") && !Permissions.Register.Auth_Roles.some(role => message.member.roles.cache.has(role))) return this.client.yolla("Bunu yapmak için yeterli bir yetkiye sahip değilsin.", message.author, message.channel);
  
        let victim = message.mentions.members.first() || message.guild.member(args[0]);
        if (!victim) return this.client.yolla("Bir üye etiketle ve tekrardan dene!", message.author, message.channel);
              
        if(victim.roles.highest.position >= message.member.roles.highest.position) return this.client.yolla("etiketlediğin kişi senden yüksek bir pozisyona sahip, onu cezalandıramazsın!", message.author, message.channel);
        
       
        let roles = victim.roles.cache.clone().filter(e => e.managed).map(e => e.id).concat(Role.Register.Unregistered);
        victim.roles.set(roles).catch();
        
        return this.client.yolla(`${victim} üyesi başarı ile kayıtsıza gönderildi!`, message.author, message.channel); 
    }
}

module.exports = Unregister;
