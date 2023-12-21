import OBR, { Metadata } from "@owlbear-rodeo/sdk";
import { Constants, SettingsConstants } from "../clashConstants";
import { IChatLog } from "../interfaces/chatlog";
import { Reta } from "./bsUtilities";

export class MessageTracker
{
    messageCounter: { [key: string]: string };

    constructor()
    {
        this.messageCounter = {};
    }

    public IsThisOld(timeStamp: string, processId: string, category = "DEFAULT"): boolean
    {
        const processCategory = `${processId}_${category}}`;
        const logKey = this.messageCounter[processCategory];
        if (logKey)
        {
            if (logKey !== timeStamp)
            {
                this.messageCounter[processCategory] = timeStamp;
                return false;
            }
            else
                return true;
        }
        else
        {
            this.messageCounter[processCategory] = timeStamp;
            return false;
        }
    }
    
    public async HandleMessage(metadata: Metadata)
    {
        const chatLog = document.querySelector<HTMLDivElement>('#rollLog')!;
        const TIME_STAMP = new Date().toLocaleTimeString();

        // Checks for own logs passing through
        if (metadata[`${Constants.EXTENSIONID}/metadata_rolllog`] != undefined)
        {
            const messageContainer = metadata[`${Constants.EXTENSIONID}/metadata_rolllog`] as IChatLog;
            if (!this.IsThisOld(messageContainer.created, "CLASH", "DICE"))
            {
                const message = messageContainer.chatlog;

                // Flag to see if you're the sender
                const author = document.createElement('li');
                const log = document.createElement('li');

                author.className = "clashAuthor";
                author.style.color = messageContainer.color;
                author.innerText = `[${TIME_STAMP}] - ${messageContainer.sender}`;

                log.className = messageContainer.critical ? "clashLog glow" : "clashLog";
                // Remove sender name because the header above has it
                log.innerText = "..." + message.replace(messageContainer.sender!, "").trim() as string;
                chatLog.append(author);
                chatLog.append(log);

                // Show notifications
                if (Reta(SettingsConstants.DICENOTIFICATION))
                {
                    await OBR.notification.show(message, "INFO");
                }
            }
        }
    }
}

export const MESSAGES = new MessageTracker();