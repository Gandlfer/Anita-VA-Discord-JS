const { Discord, Client } = require("discord.js"); // Requires the npm package 'discord.js'.
const { joinVoiceChannel, VoiceReceiver, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"] })
const dotenv = require("dotenv");
const Transcriber = require("discord-speech-to-text");
const { createReadStream } = require("fs");
const { hasPrefix, setTriggerSoundResource } = require("./utilities");

dotenv.config({ path: __dirname + '/.env' });
const transcriber = new Transcriber(process.env.WIT_AI_TOKEN);
const prefix = ["-cc"]
let player = null

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
    player = createAudioPlayer()
})

client.on("messageCreate", (msg) => {
    if (hasPrefix(msg.content)) {
        token = msg.content.split(" ")
        if (token[1] == "connect") {
            const voiceChannel = msg.member.voice.channel;
            var connection = null
            if (voiceChannel) {
                connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: voiceChannel.guild.id,
                    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                    selfDeaf: false,
                });
                connection.subscribe(player)
                connection.receiver.speaking.on("start", (userId) => {
                    //console.log(userId)

                    if (userId == "244492190292770816") {
                        transcriber.listen(connection.receiver, userId, client.users.cache.get(userId)).then((data) => {

                            if (!data.transcript.text) return;
                            //let text = data.transcript.text;

                            try {
                                console.log(data.transcript)
                                console.log(data.transcript.entities)
                                if (data.transcript.intents[0].name == 'wit_trigger' && data.transcript.entities['wit$contact:contact'][0].value == "Anita") {
                                    console.log("Here")
                                    player.play(createAudioResource(__dirname + "\\trigger.mp3", {
                                            inlineVolume: true
                                        }))
                                        //player.play(setTriggerSoundResource(__dirname + "\\trigger.mp3"))
                                        //connection.subscribe(player)
                                    console.log("Done")
                                } else if (data.transcript.intents[0].name == 'wit_disconnect' && data.transcript.entities['wit_command:wit_command'][0].value == "disconnect") {
                                    connection.destroy()
                                }
                            } catch (err) {
                                console.log("Not calling me")
                                console.log(err)
                            }
                            // if (text.includes("disconnect")) {
                            //     connection.destroy();
                            // }
                            // let user = data.user;
                            // console.log(user)
                        });
                    }

                });
            } else {
                msg.reply("You are not in a Voice Channel!")
            }
        }
    }


});
// client.on("messageCreate", async message => {
//     // console.log(message.member.voice.channelId)
//     // console.log(message.content == "a")
//     // console.log(message.guild.channels.cache.get(message.member.voice.channelId))
//     // console.log(message.guildId)
//     // console.log(message.guild.voiceAdapterCreator)
//     if (message.content === "ping") {
//         message.reply("pong");
//     } else if (message.content == "a" && message.member.voice.channelId) {
//         console.log("Joining")
//         const connection = joinVoiceChannel({
//             channelId: message.member.voice.channelId,
//             guildId: message.guildId,
//             adapterCreator: message.guild.voiceAdapterCreator,
//             selfDeaf: false
//         });
//         // const audio = connection.receiver.subscribe(message.member.id, { mode: 'pcm', end: 'manual' });
//         // const writer = audio.pipe(fs.createWriteStream('user_audio.opus'))
//         // writer.on("finish", () => {
//         //     console.log("Finish")
//         //     connection.destroy();
//         // })
//         // setTimeout(() => audio.unsubscribe(), 3000)
//         // const stream = fs.createWriteStream('user_audio')
//         // audio.pipe(stream);
//         // setTimeout(() => audio.unsubscribe(), 3000)
//         // stream.close()
//         // audio.speaking.on('start', (userId) => {
//         //         console.log(userId)
//         //     })
//         //audio.pipe(fs.createWriteStream('user_audio'));
//         // if (audio) {
//         //     setTimeout(() => audio.unsubscribe(), 3000);
//         // }
//         //audio.subscribe(message.member.id, { mode: 'pcm', end: 'manual' });
//         // console.log("Done")
//     }

// })

client.login(process.env.TOKEN)