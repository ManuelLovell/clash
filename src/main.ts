import OBR from "@owlbear-rodeo/sdk";
import { setupContextMenu } from "./context-menu";
import { InitiativeList } from './initiative-list';
import '/src/css/style.css'
import { PlayerList } from "./player-initiative-list";

// Render main window
const main = new InitiativeList();
const sub = new PlayerList();

const app = document.querySelector<HTMLDivElement>('#app');

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
        await main.Render(document);
        setupContextMenu();
    }
    else
    {
        sub.Render(document);
    }
});