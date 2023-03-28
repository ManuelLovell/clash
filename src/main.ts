import OBR from "@owlbear-rodeo/sdk";
import { setupContextMenu } from "./context-menu";
import { InitiativeList } from './initiative-list';
import './style.css'
import { PlayerList } from "./player-initiative-list";

// Render main window
const main = new InitiativeList();
const sub = new PlayerList();

// Setup OBR functions
OBR.onReady(async () =>
{
    const user = await OBR.player.getRole();
    if (user === "GM")
    {
        main.render(document);
        main.setupInitiativeList(document.querySelector("#unit-list")!);
        setupContextMenu();
    }
    else
    {
        sub.render(document);
        //document.querySelector<HTMLDivElement>('#app')!.innerHTML = `<div class="boldMiddle">Nothing implemented player side yet!</div>`;
        sub.setupPlayerList(document.querySelector("#unit-list")!);
    }
});