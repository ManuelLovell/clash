import OBR from "@owlbear-rodeo/sdk";
import { Constants, SettingsConstants } from "../clashConstants";
import { SUBVIEW } from "../views/clashSubView";
import { DiceRoller } from "./bsDiceCalculator";
import { SendtoChatLog } from "../utilities/bsRumbleHelper";

/** This is handled in SUBVIEW context and has access to it's properties */
export async function HandleDiceRoll(roll: string, playername: string, playercolor: string, unitname: string, unitaction: string, bonus?: number, advantage?: boolean)
{
    // if (SUBVIEW.ROOMSETTINGS![SettingsConstants.BONESDICE] === true)
    // {
    // BONES ROLLER
    // const metadata: Metadata = {};
    // const now = new Date().toISOString();
    // metadata[`${Constants.BONESID}/metadata_bonesroll`] // metadata[`com.battle-system.bones/metadata_bonesroll`]
    //     = {
    //         notation: "2d20kh1", // "2d20kh1"
    //         created: now, // new Date().toISOString()
    //         senderName: "Test", // Name to display for Roll
    //         senderId: "0000", // PlayerId | Self-Tracking-Number
    //         viewers: "ALL" // "ALL" | "GM" | "SELF"
    //     } as IBonesRoll;

    // await OBR.player.setMetadata(metadata);
    // }

    // Check if 3d Dice or Not
    //// Then check if sending results to rumble or not
    if (SUBVIEW.ROOMSETTINGS![SettingsConstants.VISUALDICE] === true)
    {
        const convertRoll = encodeURIComponent(roll);
        const convertUnitName = encodeURIComponent(unitname);
        const convertUnitAction = encodeURIComponent(unitaction);
        const convertPlayerName = encodeURIComponent(playername);
        const diceWindowUrl = `/dicewindow.html?roll=${convertRoll}&playername=${convertPlayerName}&playercolor=${playercolor.substring(1)}&unitname=${convertUnitName}&unitaction=${convertUnitAction}&advantage=${advantage}`;

        await OBR.popover.open({
            id: Constants.DICEWINDOW,
            url: diceWindowUrl,
            height: 300,
            width: 300,
            anchorPosition: { top: SUBVIEW.VIEWPORTHEIGHT - 20, left: SUBVIEW.VIEWPORTWIDTH - 20 },
            anchorReference: "POSITION",
            anchorOrigin: {
                vertical: "BOTTOM",
                horizontal: "RIGHT",
            },
            transformOrigin: {
                vertical: "BOTTOM",
                horizontal: "RIGHT",
            },
            disableClickAway: true,
            hidePaper: true
        });
    }
    else
    {
        let critical = false;

        let result = DiceRoller.RollString(roll);
        let advantageText = "";
        // True = Advantage. False = Disadvantage. Null = Normal Roll.
        if (advantage === true)
        {
            const result2 = DiceRoller.RollString(roll);
            if (result2 > result) result = result2;
            advantageText = " (Advantage)";
        }
        if (advantage === false)
        {
            const result2 = DiceRoller.RollString(roll);
            if (result2 < result) result = result2;
            advantageText = " (Disadvantage)";
        }

        if (bonus)
        {
            critical = (result - bonus) == 20 ? true : false;
        }
        const message = `${unitname} used ${unitaction}${advantageText} and rolled (${roll.replace(/[()\s]/g, '')}) for ... ${result}!`;
        await SendtoChatLog(message, unitname, critical);
    }
}