import OBR, { Metadata } from "@owlbear-rodeo/sdk";
import { Constants, SettingsConstants } from "../clashConstants";

export async function SendtoChatLog(message: string, unitName: string, crit = false): Promise<void>
{
    const roomData = await OBR.room.getMetadata();
    const sendToRumble = roomData[SettingsConstants.RUMBLELOG];
    const now = new Date().toISOString();

    await SendtoDiscord(message, roomData, unitName);

    // Always send to self
    await OBR.player.setMetadata(sendToRumble
        ? {
            [`${Constants.EXTENSIONID}/metadata_chatlog`]: { chatlog: message, sender: "Clash!", senderId: "Clash0000", targetId: "0000", created: now, color: "#ff9294", critical: crit },
            [`${Constants.EXTENSIONID}/metadata_rolllog`]: { chatlog: message, sender: unitName, created: now, color: "#ff9294", critical: crit }
        }
        : { [`${Constants.EXTENSIONID}/metadata_rolllog`]: { chatlog: message, sender: unitName, created: now, color: "#ff9294", critical: crit } });
}

async function SendtoDiscord(message: string, roomData: Metadata, tokenName: string): Promise<void>
{
    const hookEnabled = roomData[SettingsConstants.DISCORDHOOK];
    const hookUrl = roomData[SettingsConstants.DISCORDURL] as string;

    // If the hook is empty, leave
    if (!hookEnabled || !hookUrl || hookUrl.length < 10) return;

    // Send the message to Discord
    const request = new XMLHttpRequest();
    request.open("POST", hookUrl);

    request.setRequestHeader('Content-type', 'application/json');

    const params = {
        username: "Clash! : " + tokenName,
        avatar_url: "https://battle-system.com/owlbear/clash-docs/logo.png",
        content: message
    }

    request.send(JSON.stringify(params));
}