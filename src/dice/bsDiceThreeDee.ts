import OBR from "@owlbear-rodeo/sdk";
import './dicewindow.css'
import DiceBox from '@3d-dice/dice-box-threejs';
import * as Utilities from '../utilities/bsUtilities';
import { SendtoChatLog } from "../utilities/bsRumbleHelper";
import { Constants } from "../clashConstants";

OBR.onReady(async () =>
{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const roll = decodeURIComponent(urlParams.get('roll')!).replace(/\+\s*-/g, '-');
    const playerColor = "#" + urlParams.get('playercolor')!;
    const playerName = decodeURIComponent(urlParams.get('playername')!);
    const unitName = decodeURIComponent(urlParams.get('unitname')!);
    const unitAction = decodeURIComponent(urlParams.get('unitaction')!);
    const advantage = decodeURIComponent(urlParams.get('advantage')!);

    const dWindow = document.getElementById("dicewindow")!;
    dWindow.style.borderColor = playerColor;
    const dOwner = document.getElementById("owner")!;
    dOwner.innerText = playerName.replaceAll("_", " ");

    const Box = new DiceBox("#dicewindow", {
        theme_customColorset: {
            background: "#ff8989",
            foreground: Utilities.InvertColor("#ff8989"),
            baseScale: 80,
            texture: "astral",
            material: "plastic",
        },
        onRollComplete: (results: any) =>
        {
            const modifier = results.modifier as number;
            if (advantage !== "undefined")
            {
                let advantageText = advantage === "true" ? " (Advantage)" : " (Disadvtange)";
                const diceOne = results.sets[0].rolls[0].value;
                const diceTwo = results.sets[0].rolls[1].value;
                const result = advantage === "true" ? Math.max(diceOne, diceTwo) : Math.min(diceOne, diceTwo);
                setTimeout(async () =>
                {
                    const message = `${unitName} used ${unitAction}${advantageText} and rolled (${roll}) for ... ${result + modifier}!`;

                    await SendtoChatLog(message, unitName, result == 20);
                    await OBR.popover.close(Constants.DICEWINDOW);
                }, 2000);
            }
            else
            {
                const total = results.total as number;
                const critical = total - modifier == 20;
                setTimeout(async () =>
                {
                    const message = `${unitName} used ${unitAction} and rolled (${roll}) for ... ${total}!`;

                    await SendtoChatLog(message, unitName, critical);
                    await OBR.popover.close(Constants.DICEWINDOW);
                }, 2000);
            }
        }
    });

    Box.initialize()
        .then(() =>
        {
            setTimeout(() =>
            {
                if (advantage !== "undefined")
                {
                    Box.roll(roll.replace("1d", "2d"));
                }
                else
                {
                    Box.roll(roll.replace(/\_/g, '+').replace(/[()\s]/g, ''));
                }
            }, 500);
        })
        .catch((e: any) => console.error(e));

    setTimeout(async () =>
    {
        await OBR.popover.close(Constants.DICEWINDOW);
    }, 7000);
});