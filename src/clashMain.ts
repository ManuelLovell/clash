import OBR from "@owlbear-rodeo/sdk";
import { db, getDatabase } from "./local-database";
import { Constants } from "./clashConstants";
import { BSCACHE } from "./utilities/bsSceneCache";
import { PLVIEW } from "./views/clashPlayerView";
import { GMVIEW } from "./views/clashGMView";
import { SetupContextMenu } from "./buttons/clashContextMenu";
import '/src/css/clash-style.css'

Constants.MAINAPP.innerHTML = `
  <div>
    <h1>Loading...</h1>
  </div>
`;
Constants.MAINLOAD.innerHTML = `
<div>
    <h1 id="loadingScreenHeader">Waiting for Scene...</h1>
    <div class="imageContainer">
        <img class="resize-fit-center" src="logo.png" alt="Clash!" class="center">
    </div>
</div>`;
Constants.MAINDISABLED.innerHTML = `
<div>
    <h1 id="loadingScreenHeader">Access has been disabled</h1>
    <div class="imageContainer">
        <img class="resize-fit-center" src="logo.png" alt="Clash!" class="center">
    </div>
</div>`;

// Setup OBR functions
OBR.onReady(async () =>
{
    await BSCACHE.InitializeCache();
    BSCACHE.SetupHandlers();

    // Start the Local Collection
    // Possibly move to remote storage in future and phase this out
    if (BSCACHE.playerRole === "GM")
    {
        await getDatabase();
        db.Ready();
    }

    if (BSCACHE.playerRole === "GM")
    {
        /// Enter GM Initiative List
        GMVIEW.Render();
        SetupContextMenu();
    }
    else
    {
        /// Enter Player Initiative List
        PLVIEW.Render();
    }
    Constants.MAINAPP!.hidden = false;
    Constants.MAINLOAD!.hidden = true;
});