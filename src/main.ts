import OBR, { Metadata } from "@owlbear-rodeo/sdk";
import { InitiativeList } from './initiative-list';
import { PlayerList } from "./player-initiative-list";
import { db } from "./local-database";
import * as Utilities from './utilities';
import '/src/css/style.css'
import { Constants } from "./constants";

// Render main window
const main = new InitiativeList();
const sub = new PlayerList();
let sceneReady = false;
//clash-main-body-loading
const app = document.querySelector<HTMLDivElement>('#clash-main-body-app');
const loading = document.querySelector<HTMLDivElement>('#clash-main-body-loading');
const database = db;
database.Ready();

app!.innerHTML = `
  <div>
    <h1>Loading...</h1>
  </div>
`;
loading!.innerHTML = `
<div>
<h1>Waiting for Scene...</h1>
<div class="imageContainer">
<img class="resize_fit_center" src="logo.png" alt="Clash!" class="center">
</div>
</div>`;

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
            await GetSceneId();
            if (!main.rendered) await main.RenderInitiativeList(document);
            main.SetupItemOnChangeHandler();
            main.RefreshList();
        }
        else
        {
            if (!sub.rendered) await sub.Render(document);
        }
        app!.hidden = false;
        loading!.hidden = true;
    }
    else
    {
        // Show loading, disable onchange handler
        main.itemOnChangeHandler();
        app!.hidden = true;
        loading!.hidden = false;
    }
}

/** Set an unique id to the room to track units */
async function GetSceneId(): Promise<void>
{
    const retrieveMeta = await OBR.scene.getMetadata();
    const packageMeta = retrieveMeta[`${Constants.EXTENSIONID}/metadata_sceneid`] as any;
    main.sceneId = packageMeta?.SceneId as string;

    if (!main.sceneId)
    {
        const SceneId: string = Utilities.GetGUID();
        const sceneMeta: Metadata = {};
        sceneMeta[`${Constants.EXTENSIONID}/metadata_sceneid`] = { SceneId };
        await OBR.scene.setMetadata(sceneMeta);
        
        main.sceneId = SceneId;
    }

    const trackerMeta = retrieveMeta[`${Constants.EXTENSIONID}/metadata_trackeritem`] as any;
    const trackerData = trackerMeta?.Tracker as IOBRTracker;
    if (trackerData)
    {
        main.roundCounter = trackerData.round;
        main.turnCounter = trackerData.turn;
    }
}