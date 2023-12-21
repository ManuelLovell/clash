import OBR, { Grid, Item, Metadata, Player, Theme } from "@owlbear-rodeo/sdk";
import { GMVIEW } from '../views/clashGMView';
import { PLVIEW } from "../views/clashPlayerView";
import { Labeler } from "../utilities/clashLabeler";
import * as Utilities from '../utilities/bsUtilities';
import { MESSAGES } from "./bsMessageTracker";
import { Constants, SettingsConstants } from "../clashConstants";

class BSCache
{
    // Cache Names
    static PLAYER = "PLAYER";
    static PARTY = "PARTY";
    static SCENEITEMS = "SCENEITEMS";
    static SCENEMETA = "SCENEMETADATA";
    static SCENEGRID = "SCENEGRID";
    static ROOMMETA = "ROOMMETADATA";

    playerId: string;
    playerColor: string;
    playerName: string;
    playerMetadata: {};
    playerRole: "GM" | "PLAYER";

    party: Player[];

    gridDpi: number;
    gridScale: number; // IE; 5ft

    sceneItems: Item[];
    sceneSelected: string[];
    sceneMetadata: Metadata;
    sceneReady: boolean;

    roomMetadata: Metadata;

    theme: any;

    caches: string[];

    //handlers
    sceneMetadataHandler?: () => void;
    sceneItemsHandler?: () => void;
    sceneGridHandler?: () => void;
    sceneReadyHandler?: () => void;
    playerHandler?: () => void;
    partyHandler?: () => void;
    themeHandler?: () => void;
    roomHandler?: () => void;

    constructor(caches: string[])
    {
        this.playerId = "";
        this.playerName = "";
        this.playerColor = "";
        this.playerMetadata = {};
        this.playerRole = "PLAYER";
        this.party = [];
        this.sceneItems = [];
        this.sceneSelected = [];
        this.sceneMetadata = {};
        this.gridDpi = 0;
        this.gridScale = 5;
        this.sceneReady = false;
        this.theme = "DARK";
        this.roomMetadata = {};

        this.caches = caches;
    }

    public async InitializeCache()
    {
        // Always Cache
        this.sceneReady = await OBR.scene.isReady();
        this.theme = await OBR.theme.getTheme();
        Utilities.SetThemeMode(this.theme, document);

        if (this.caches.includes(BSCache.PLAYER))
        {
            this.playerId = await OBR.player.getId();
            this.playerName = await OBR.player.getName();
            this.playerColor = await OBR.player.getColor();
            this.playerMetadata = await OBR.player.getMetadata();
            this.playerRole = await OBR.player.getRole();
        }

        if (this.caches.includes(BSCache.PARTY))
        {
            this.party = await OBR.party.getPlayers();
        }

        if (this.caches.includes(BSCache.SCENEITEMS))
        {
            if (this.sceneReady) this.sceneItems = await OBR.scene.items.getItems();
        }

        if (this.caches.includes(BSCache.SCENEMETA))
        {
            if (this.sceneReady) this.sceneMetadata = await OBR.scene.getMetadata();
        }

        if (this.caches.includes(BSCache.SCENEGRID))
        {
            if (this.sceneReady)
            {
                this.gridDpi = await OBR.scene.grid.getDpi();
                this.gridScale = (await OBR.scene.grid.getScale()).parsed?.multiplier ?? 5;
            }
        }

        if (this.caches.includes(BSCache.ROOMMETA))
        {
            this.roomMetadata = await OBR.room.getMetadata();
        }
    }

    public KillHandlers()
    {
        if (this.caches.includes(BSCache.SCENEMETA) && this.sceneMetadataHandler !== undefined) this.sceneMetadataHandler!();
        if (this.caches.includes(BSCache.SCENEITEMS) && this.sceneItemsHandler !== undefined) this.sceneItemsHandler!();
        if (this.caches.includes(BSCache.SCENEGRID) && this.sceneGridHandler !== undefined) this.sceneGridHandler!();
        if (this.caches.includes(BSCache.PLAYER) && this.playerHandler !== undefined) this.playerHandler!();
        if (this.caches.includes(BSCache.PARTY) && this.partyHandler !== undefined) this.partyHandler!();
        if (this.caches.includes(BSCache.ROOMMETA) && this.roomHandler !== undefined) this.roomHandler!();

        if (this.themeHandler !== undefined) this.themeHandler!();
    }

    public SetupHandlers()
    {

        if (this.sceneMetadataHandler === undefined || this.sceneMetadataHandler.length === 0)
        {
            if (this.caches.includes(BSCache.SCENEMETA))
            {
                this.sceneMetadataHandler = OBR.scene.onMetadataChange(async (metadata) =>
                {
                    this.sceneMetadata = metadata;
                    await this.OnSceneMetadataChanges(metadata);
                });
            }
        }

        if (this.sceneItemsHandler === undefined || this.sceneItemsHandler.length === 0)
        {
            if (this.caches.includes(BSCache.SCENEITEMS))
            {
                this.sceneItemsHandler = OBR.scene.items.onChange(async (items) =>
                {
                    this.sceneItems = items;
                    await this.OnSceneItemsChange(items);
                });
            }
        }

        if (this.sceneGridHandler === undefined || this.sceneGridHandler.length === 0)
        {
            if (this.caches.includes(BSCache.SCENEGRID))
            {
                this.sceneGridHandler = OBR.scene.grid.onChange(async (grid) =>
                {
                    this.gridDpi = grid.dpi;
                    this.gridScale = parseInt(grid.scale);
                    await this.OnSceneGridChange(grid);
                });
            }
        }

        if (this.playerHandler === undefined || this.playerHandler.length === 0)
        {
            if (this.caches.includes(BSCache.PLAYER))
            {
                this.playerHandler = OBR.player.onChange(async (player) =>
                {
                    this.playerName = player.name;
                    this.playerColor = player.color;
                    this.playerId = player.id;
                    this.playerRole = player.role;
                    this.playerMetadata = player.metadata;
                    await this.OnPlayerChange(player);
                });
            }
        }

        if (this.partyHandler === undefined || this.partyHandler.length === 0)
        {
            if (this.caches.includes(BSCache.PARTY))
            {
                this.partyHandler = OBR.party.onChange(async (party) =>
                {
                    this.party = party;
                    await this.OnPartyChange(party);
                });
            }
        }

        if (this.roomHandler === undefined || this.roomHandler.length === 0)
        {
            if (this.caches.includes(BSCache.ROOMMETA))
            {
                this.roomHandler = OBR.room.onMetadataChange(async (metadata) =>
                {
                    this.roomMetadata = metadata;
                    await this.OnRoomMetadataChange(metadata);
                });
            }
        }


        if (this.themeHandler === undefined)
        {
            this.themeHandler = OBR.theme.onChange(async (theme) =>
            {
                this.theme = theme.mode;
                await this.OnThemeChange(theme);
            });
        }

        // Only setup if we don't have one, never kill
        if (this.sceneReadyHandler === undefined)
        {
            this.sceneReadyHandler = OBR.scene.onReadyChange(async (ready) =>
            {
                this.sceneReady = ready;

                if (ready)
                {
                    this.sceneItems = await OBR.scene.items.getItems();
                    this.sceneMetadata = await OBR.scene.getMetadata();
                    this.gridDpi = await OBR.scene.grid.getDpi();
                    this.gridScale = (await OBR.scene.grid.getScale()).parsed?.multiplier ?? 5;
                }
                await this.OnSceneReadyChange(ready);
            });
        }
    }

    public async OnSceneMetadataChanges(_metadata: Metadata)
    {
        if (this.playerRole === "GM")
        {
            GMVIEW.ShowTurnSelection();
        }
        else
        {
            PLVIEW.turnCounter = Utilities.Seta(SettingsConstants.TURNCOUNT);
            PLVIEW.roundCounter = Utilities.Seta(SettingsConstants.ROUNDCOUNT);
            PLVIEW.ShowTurnSelection();
            PLVIEW.FocusOnCurrentTurnUnit();
        }
    }

    public async OnSceneItemsChange(_items: Item[])
    {
        if (this.sceneReady)
        {
            if (this.playerRole === "GM")
            {
                await GMVIEW.RefreshList()
            }
            else
            {
                await PLVIEW.RefreshList()
            }
            await Labeler.UpdateHealthBars();
            await Labeler.UpdateLabel();
        }
    }

    public async OnSceneGridChange(_grid: Grid)
    {

    }

    public async OnSceneReadyChange(ready: boolean)
    {
        this.playerRole === "GM" ? GMVIEW.RenderWaiting(!ready) : PLVIEW.RenderWaiting(!ready);
        console.log(ready)
        if (ready)
        {
            this.SetupHandlers();
            this.playerRole === "GM" ? await GMVIEW.Render() : await PLVIEW.Render();
            this.playerRole === "GM" ? await GMVIEW.RefreshList() : await PLVIEW.RefreshList();
        }
    }

    public async OnPlayerChange(player: Player)
    {
        this.sceneSelected = player.selection ? player.selection : [];
        await MESSAGES.HandleMessage(player.metadata);
        const nameInputs = document.querySelectorAll(".unit-name-input");

        for (let index = 0; index < nameInputs.length; index++) 
        {
            const toggle = nameInputs[index] as HTMLInputElement;
            const elementId = toggle.id;
            const unitId = elementId.substring(2);
            const selected = this.sceneSelected.includes(unitId);
            selected ? toggle.classList.add("selected") : toggle.classList.remove("selected");
        }
    }

    public async OnPartyChange(party: Player[])
    {
        if (GMVIEW.viewPlayerList)
        {
            GMVIEW.viewPlayerList.innerHTML = "";
            GMVIEW.viewPlayerList.appendChild(GMVIEW.GetEmptyContextItem());

            for (const player of party)
            {
                const listItem = document.createElement("li");
                listItem.id = player.id;
                listItem.textContent = player.name;
                listItem.style.color = player.color;
                GMVIEW.viewPlayerList.appendChild(listItem);
            }
        }

        // If showing dice rolls to everyone
        if (Utilities.Reta(SettingsConstants.DICEEVERYONE))
        {
            for (const player of party)
            {
                if (player.role === "GM")
                {
                    await MESSAGES.HandleMessage(player.metadata);
                }
            }
        }
    }

    public async OnRoomMetadataChange(metadata: Metadata)
    {
        await Labeler.UpdateHealthBars();
        await Labeler.UpdateLabel();
        if (this.playerRole === "PLAYER")
        {
            await PLVIEW.RefreshList();
            if (metadata[SettingsConstants.HIDEALL] === true)
            {
                Constants.MAINDISABLED.style.display = "block";
                Constants.MAINAPP.style.display = "none";
                Constants.MAINLOG.style.display = "none";
            }
            else
            {
                Constants.MAINDISABLED.style.display = "none";
                Constants.MAINAPP.style.display = "block";
                Constants.MAINLOG.style.display = "none";
            }
        }
    }

    public async OnThemeChange(theme: Theme)
    {
        Utilities.SetThemeMode(theme, document);
    }
};

// Set the handlers needed for this Extension
export const BSCACHE = new BSCache([BSCache.ROOMMETA, BSCache.SCENEMETA, BSCache.SCENEITEMS, BSCache.PLAYER, BSCache.PARTY]);
