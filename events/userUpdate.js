const { MessageEmbed } = require("discord.js");
const Guild = require("../Settings/Guild.json")
const Limit = require("../Settings/Limit.json")
const Log = require("../Settings/Log.json")
const Role = require("../Settings/Role.json")

module.exports = class {
    constructor(client) {
        this.client = client;
    }


    async run(eski, yeni) {  
  let tag = Guild.Tag;
  let ikinciTag = Guild.Secondary_Tag;
  let üye = yeni.client.guilds.cache.get(Guild.Sunucu).member(yeni.id);
  let log = yeni.client.channels.cache.get(Log.Auto_Tag_Log);
  let cezalı = Role.Jail.Role;
  let ekip = üye.guild.roles.cache.get(Role.Family_Role);
  let şüpheli = Role.Suspect.Role;

}
};