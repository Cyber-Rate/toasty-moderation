const Command = require("../../base/Command.js");
const data = require("../../models/alarm.js")
const ms = require("ms")
const moment = require("moment")
require("moment-duration-format")
class Alarm extends Command {
    constructor(client) {
        super(client, {
            name: "alarm",
            aliases: ["alarm"]
        });
    }

    async run(message, args, perm) {
        await data.findOne({ user: message.author.id }, async (err, res) => {
            let time = args[0]
            if (!time || isNaN(ms(time))) return message.channel.send("Lütfen bir süre belirt. Örnek: \`!alarm 10m Su içmeyi unutma!\`")
            if (!args.slice(1).join(" ")) return message.channel.send("Alarmı ne için kuracağımı belirtmedin.")
            let regex = /h?t?t?p?s?:?\/?\/?discord.?gg\/?[a-zA-Z0-9]+/
            let regexSecond = /h?t?t?p?s?:?\/?\/?discorda?p?p?.?com\/?invites\/?[a-zA-Z0-9]+/
            if (regex.test(message.content) == true || regexSecond.test(message.content) == true) return message.channel.send("Cidden reklamını mı hatırlamak için alarm kurdun?")
            if (message.content.includes("@here" || "@everyone")) return
            if (!res) {
                const newData = new data({
                    user: message.author.id,
                    alarm: true,
                    sebep: args.slice(1).join(" "),
                    endDate: Date.now() + ms(args[0]),
                    channel: message.channel.id
                })
                newData.save().catch(e => console.log(e))
            } else {
                res.user = message.author.id
                res.alarm = true
                res.sebep = args.slice(1).join(" ")
                res.endDate = Date.now() + ms(args[0])
                res.channel = message.channel.id
                res.save().catch(e => console.log(e))
            }
            let tamam = moment(Date.now() + ms(args[0])).fromNow()
            message.channel.send(":alarm_clock: Alarmınızı başarıyla " + tamam + " tarihine kurdum.")
        })
    }
}

module.exports = Alarm;
