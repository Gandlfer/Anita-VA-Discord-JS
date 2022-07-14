const { createAudioResource } = require("@discordjs/voice");
const { createReadStream } = require("fs")

function hasPrefix(str) {
    let prefixList = ['!anita ']
    for (let pre of prefixList)
        if (str.startsWith(pre))
            return true;
    return false;
}
async function setTriggerSoundResource(triggerFilePath) {
    console.log("Triggered")
    console.log(triggerFilePath);

    let resource = createAudioResource(createReadStream(triggerFilePath), {
        inlineVolume: true
    });

    resource.volume.setVolume(0.2);
    return resource
}
module.exports = {
    hasPrefix,
    setTriggerSoundResource
}