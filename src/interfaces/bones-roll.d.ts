interface IBonesRoll
{
    created: string;
    notation: string;
    senderName?: string,
    senderColor?: string,
    viewers?: "SELF" | "ALL" | "GM";

    // Outside-Extension Metadata ID: "com.battle-system.friends"
    // metadata[`com.battle-system.friends/metadata_diceroll`] = {
    //   created: now,
    //   notation: "2d10",
    //   sender: "Buddy!!"
    //   viewers: "GM"
    // };
}

interface IBonesLog
{
    created: string;
    rollHtml: string;
    senderColor: string;
    senderId: string;
    senderName: string;
    viewers: string;
}