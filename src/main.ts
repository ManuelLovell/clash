import OBR from "@owlbear-rodeo/sdk";
import { setupContextMenu } from "./context-menu";
import { InitiativeList } from './initiative-list';
import './style.css'

// Render main window
const main = new InitiativeList();
main.render(document);

// Setup OBR functions
OBR.onReady(async () =>
{
    const user = await OBR.player.getRole();
    if (user === "GM")
    {
        main.setupInitiativeList(document.querySelector("#unit-list")!);
        setupContextMenu();
    }
    else
    {
        document.querySelector<HTMLDivElement>('#app')!.innerHTML = `<div class="boldMiddle">Nothing implemented player side yet!</div>`;
    }
});