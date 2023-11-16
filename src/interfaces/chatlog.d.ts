export interface IChatLog
{
    chatlog: string; // Message
    sender?: string; // Sender Name
    senderId: string; // Sender OBR Id
    target?: string; // Target Name
    targetId?: string; // Target OBR Id
    created: string; // new Date().toISOString();
    critical?: boolean; // critical hit css
    rollResult?: any; // result of a roll to broadcast

    // Outside-Extension Metadata ID: "com.battle-system.friends"
    // Example:
    // metadata[`com.battle-system.friends/metadata_chatlog`] = {
    //   chatlog: "How are you",
    //   sender: "CoolExtension",
    //   targetId: "User-OBR-Id" to send to yourself .. OR... "0000" to 'everyone'
    //   created: new Date().toISOString()
    // };
    // await OBR.scene.setMetadata(metadata);

    color: string;
}