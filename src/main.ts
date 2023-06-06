import OBR from "@owlbear-rodeo/sdk";
import { InitiativeList } from './initiative-list';
import { PlayerList } from "./player-initiative-list";
import { db } from "./local-database";
import '/src/css/style.css'

// Render main window
const main = new InitiativeList();
const sub = new PlayerList();
let sceneReady = false;

const app = document.querySelector<HTMLDivElement>('#clash-main-body-app');
const database = db;
database.Ready();

app!.innerHTML = `
  <div>
    <h1>Loading...</h1>
  </div>
`;

// Setup OBR functions
OBR.onReady(async () =>
{
    sceneReady = await OBR.scene.isReady();
    LoadScene(sceneReady);

    OBR.scene.onReadyChange(async (ready) =>
    {
        LoadScene(ready);
    });
});

async function LoadScene(ready: boolean)
{
    const user = await OBR.player.getRole();
    if (ready)
    {
        if (user === "GM")
        {
            await main.RenderInitiativeList(document);
        }
        else
        {
            await sub.Render(document);
        }
    }
    else
    {
        app!.innerHTML = `
            <div>
            <h1>Waiting for Scene...</h1>
            <div class="imageContainer">
            <img class="resize_fit_center" src="logo.png" alt="Clash!" class="center">
            </div>
            </div>`;
    }
}