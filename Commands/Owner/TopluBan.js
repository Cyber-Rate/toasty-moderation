const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const Others = require("../../Settings/Others.json");
const Discord = require("discord.js")
const moment = require("moment");
require("moment-duration-format")
moment.locale("tr")
const db = require("../../models/cantUnBan.js")
class TopluBan extends Command {
    constructor(client) {
        super(client, {
            name: "topluban",
            aliases: ["topluban"]
        });
    }

    async run(message, args, client) {
        if(message.author.id !== Permissions.Sahip) return
        if (args.length < 1)
        return message.channel.send(
            "Banlanacak kişilerin ID'lerini belirt.",
        );
    const members = args
        .filter((id) => message.guild.members.cache.has(id))
        .map((id) => message.guild.member(id));
    if (members.length < 1)
        return message.channel.send(
            "Banlanacak kişilerin sunucuda olması gerekir.",
        );
        
    const prompt = await message.channel.send(
        `${members
            .map((member, idx) => `**${idx + 1}. ${member.toString()}**`)
            .join("\n")}\nBu üyeleri banlamak istiyor musun?`,
    );
    await prompt.react("✅");
    const collector = prompt.createReactionCollector(
        (reaction, user) =>
            reaction.emoji.name === "✅" && user.id === message.author.id,
        { time: 1000 * 10 },
    );

    collector.on("collect", async () => {
        await prompt.edit(`${this.client.ok} ${members.length} adet kullanıcı başarıyla yasaklandı.`);
        for (const member of members) {
            if (member.bannable)
                await member.ban({ days: 7, reason: "Toplu ban" });
        }
        collector.stop();
    });

    collector.on("end", (_, reason) => {
        console.log("end", reason);
        if (reason === "time")
            prompt.edit("10 saniye geçtiği için işlem iptal edildi.");
    });
    }
}



module.exports = TopluBan;
