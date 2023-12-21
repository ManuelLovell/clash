import OBR from "@owlbear-rodeo/sdk";
import { Constants, SettingsConstants } from "../clashConstants";

export async function SendtoChatLog(message: string, unitName: string, crit = false): Promise<void>
{
    const rumbleSetting = await OBR.room.getMetadata();
    const sendToRumble = rumbleSetting[SettingsConstants.RUMBLELOG];
    const now = new Date().toISOString();

    // Always send to self
    await OBR.player.setMetadata(sendToRumble
        ? {
            [`${Constants.EXTENSIONID}/metadata_chatlog`]: { chatlog: message, sender: "Clash!", senderId: "Clash0000", targetId: "0000", created: now, color: "#ff9294", critical: crit },
            [`${Constants.EXTENSIONID}/metadata_rolllog`]: { chatlog: message, sender: unitName, created: now, color: "#ff9294", critical: crit }
        }
        : { [`${Constants.EXTENSIONID}/metadata_rolllog`]: { chatlog: message, sender: unitName, created: now, color: "#ff9294", critical: crit } });
}