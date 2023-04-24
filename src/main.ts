import OBR from "@owlbear-rodeo/sdk";
import { setupContextMenu } from "./context-menu";
import { InitiativeList } from './initiative-list';
import { PlayerList } from "./player-initiative-list";
import { db } from "./local-database";
import '/src/css/style.css'

// Render main window
const main = new InitiativeList();
const sub = new PlayerList();

const app = document.querySelector<HTMLDivElement>('#clash-main-body-app');
const database = db;
database.Ready();

app!.innerHTML = `
  <div>
    <h1>Loading...</h1>
  </div>
`

// Setup OBR functions
OBR.onReady(async () =>
{
    const user = await OBR.player.getRole();
    if (user === "GM")
    {
        await main.RenderInitiativeList(document);
        setupContextMenu();
    }
    else
    {
        sub.Render(document);
    }
});