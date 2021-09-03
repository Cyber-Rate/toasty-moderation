const { MessageEmbed } = require("discord.js");
const Log = require("../Settings/Log.json")

module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run(oldState, newState) {
    if (Log.Ses.Log && newState.guild.channels.cache.get(Log.Ses.Log)) {
        let logKanali = newState.guild.channels.cache.get(Log.Ses.Log);
        if (!oldState.channelID && newState.channelID) return logKanali.send(`**${newState.guild.members.cache.get(newState.id).displayName}** üyesi **${newState.guild.channels.cache.get(newState.channelID).name}** adlı sesli kanala **katıldı!**`).catch();
        if (oldState.channelID && !newState.channelID) return logKanali.send(`**${newState.guild.members.cache.get(newState.id).displayName}** üyesi **${newState.guild.channels.cache.get(oldState.channelID).name}** adlı sesli kanaldan **ayrıldı!**`).catch();
        if (oldState.channelID && newState.channelID && oldState.channelID != newState.channelID) return logKanali.send(`**${newState.guild.members.cache.get(newState.id).displayName}** üyesi ses kanalını **değiştirdi!** (**${newState.guild.channels.cache.get(oldState.channelID).name}** => **${newState.guild.channels.cache.get(newState.channelID).name}**)`).catch();
       }
    if (Log.Ses.Mic && newState.guild.channels.cache.get(Log.Ses.Mic)) {
        let cyber = newState.guild.channels.cache.get(Log.Ses.Mic);
        if (oldState.channelID && oldState.selfMute && !newState.selfMute) return cyber.send(`**${newState.guild.members.cache.get(newState.id).displayName}** üyesi **${newState.guild.channels.cache.get(newState.channelID).name}** adlı sesli kanalda kendi susturmasını **kaldırdı!**`).catch();
        if (oldState.channelID && !oldState.selfMute && newState.selfMute) return cyber.send(`**${newState.guild.members.cache.get(newState.id).displayName}** üyesi **${newState.guild.channels.cache.get(newState.channelID).name}** adlı sesli kanalda kendini **susturdu!**`).catch();
        if (oldState.channelID && oldState.selfDeaf && !newState.selfDeaf) return cyber.send(`**${newState.guild.members.cache.get(newState.id).displayName}** üyesi **${newState.guild.channels.cache.get(newState.channelID).name}** adlı sesli kanalda kendi sağırlaştırmasını **kaldırdı!**`).catch();
        if (oldState.channelID && !oldState.selfDeaf && newState.selfDeaf) return cyber.send(`**${newState.guild.members.cache.get(newState.id).displayName}** üyesi **${newState.guild.channels.cache.get(newState.channelID).name}** adlı sesli kanalda kendini **sağırlaştırdı!**`).catch();
      }
    }
}

