module.exports.config = {
    name: "forward",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "cliff",
    description: "Forward messages to all group IDs",
    commandCategory: "Messaging",
    usages: "Use: forward",
    usePrefix: true,
    cooldowns: 0,
};

module.exports.run = async function({ api, event }) {
    const threadList = await api.getThreadList(100, null, ["INBOX"]);
    const threadIDs = threadList.filter(thread => thread.isGroup).map(thread => thread.threadID);

    const messageID = event.messageID;
    const attachmentData = (await api.getMessageObject(messageID)).attachments;

    if (attachmentData.length > 0) {
        for (const threadID of threadIDs) {
            for (const attachment of attachmentData) {
                await api.forwardAttachment(attachment, threadID, () => {}, messageID);
            }
        }
    } else {
        const messageContent = (await api.getMessageObject(messageID)).body;
        for (const threadID of threadIDs) {
            await api.sendMessage(messageContent, threadID);
        }
    }
};
