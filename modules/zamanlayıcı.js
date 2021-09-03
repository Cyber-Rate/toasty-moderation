const data = require("../models/alarm.js")
const Guild = require("../Settings/Guild.json");

module.exports = client => {
    setInterval(async () => {
        let muted = await data.find({
            "alarm": true,
            "endDate": {
                $lte: Date.now()
            }
        })

        muted.forEach(async memberdata => {
            let sunucu = client.guilds.cache.get(Guild.Sunucu)
            if (!sunucu) return;
            let member = sunucu.members.cache.get(memberdata.user) || await sunucu.members.cacahe.fetch(memberdata.user).catch((err) => {
                data.deleteOne({ user: memberdata.user }, async (err) => {
                    if (err) { console.log("Silinemedi") }
                })
                console.log(`[ALARM] ${memberdata.user} bulunamadı`);
                console.log(err)
            });
            if (!member) return;
            let kanal = sunucu.channels.cache.get(memberdata.channel)
            kanal.send(":alarm_clock: <@!" + member + "> bir alarm kurmuştunuz Sebep: "+"``" + memberdata.sebep + "``")
            let mem = sunucu.members.cache.get(memberdata.user)
            mem.send(":alarm_clock: <@!" + member + "> bir alarm kurmuştunuz Sebep: "+"``" + memberdata.sebep + "``")
            data.deleteOne({ user: memberdata.user }, async (err) => {
                if (err) { console.log("Silinemedi") }
            })
        });
    }, 5000);
}