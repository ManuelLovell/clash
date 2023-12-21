import { Constants } from './../clashConstants';
import OBR, { Metadata } from '@owlbear-rodeo/sdk';
import UnitInfo from "./../unitinfo/clashUnitInfo";
import { getDatabase } from './../local-database';
import * as Utilities from './../utilities/bsUtilities';
import { IUnitInfo } from './../interfaces/unit-info';
import { BuildUnitStatBlock } from './clashSubViewBuildBlock';
import '/src/css/clash-mini-style.css'
import {  AppendImportButtons, AppendSearchButtons, AppendSubMainFooterButtons } from '../buttons/clashSubviewButtons';

export class SubMenu
{
    dbImport: IUnitInfo | undefined;
    currentUnit: UnitInfo;
    freshImport: boolean;
    favorite: boolean;
    userId: string | undefined;
    userName: string | undefined;
    userColor: string | undefined;
    sender = "Clash!";

    POPOVERSUBMENUID: string = "";
    multiSheet: boolean = false;
    multiIds: string[] = [];
    pinned = false;
    
    VIEWPORTWIDTH = 0;
    VIEWPORTHEIGHT = 0;

    SUBMAIN: HTMLDivElement;
    SUBMAINCARD: HTMLDivElement;
    SUBMAINFOOTER: HTMLDivElement;

    SUBSEARCH: HTMLDivElement;
    SUBSEARCHCARD: HTMLDivElement;
    SUBSEARCHFOOTER: HTMLDivElement;

    SUBIMPORT: HTMLDivElement;
    SUBIMPORTCARD: HTMLDivElement;
    SUBIMPORTFOOTER: HTMLDivElement;

    SUBGROUPEDIT: HTMLDivElement;
    SUBCARDEDIT: HTMLUListElement;

    ROOMSETTINGS?: Metadata;

    constructor()
    {
        this.freshImport = false;
        this.favorite = false;

        this.SUBMAIN = document.getElementById("clash-sub-main") as HTMLDivElement;
        this.SUBMAINCARD = document.getElementById("subMainCard") as HTMLDivElement;
        this.SUBMAINFOOTER = document.getElementById("subMainFooter") as HTMLDivElement;

        this.SUBSEARCH = document.getElementById("clash-sub-search") as HTMLDivElement;
        this.SUBSEARCHCARD = document.getElementById("subSearch") as HTMLDivElement;
        this.SUBSEARCHFOOTER = document.getElementById("subSearchFooter") as HTMLDivElement;

        this.SUBIMPORT = document.getElementById("clash-sub-import") as HTMLDivElement;
        this.SUBIMPORTCARD = document.getElementById("subImport") as HTMLDivElement;
        this.SUBIMPORTFOOTER = document.getElementById("subImportFooter") as HTMLDivElement;

        this.SUBGROUPEDIT = document.getElementById("groupEdit") as HTMLDivElement;
        this.SUBCARDEDIT = document.querySelector("#cardEdit") as HTMLUListElement;

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const idParam = urlParams.get('unitid')!;
        this.pinned = urlParams.get('pinned')! === "true";

        // If found, it means multiple sheet updates
        const multiParam = urlParams.get('multi');

        if (multiParam == "true")
        {
            this.POPOVERSUBMENUID = Constants.MULTISHEETID;
            this.multiSheet = true;
            this.multiIds = idParam.split(",");

            document.documentElement.style.borderColor = "deeppink"; // Full pink border
            this.SUBMAIN.style.height = "90%";
            this.SUBSEARCH.style.height = "90%";
            this.SUBIMPORT.style.height = "90%";
        }
        else
        {
            document.getElementById("groupEdit")!.hidden = true;
            this.POPOVERSUBMENUID = idParam;
        }

        this.currentUnit = new UnitInfo(this.POPOVERSUBMENUID, "Default");
        if (this.pinned)
        {
            this.SUBMAINFOOTER.style.display = "none";
            this.SUBMAIN.style.height = "100%";
        }
    }

    public async RenderUnitInfo(): Promise<void>
    {
        // If there's no ID, just give up.
        if (this.POPOVERSUBMENUID == undefined) return;

        this.ShowSubMenu();
        // Prep database for collection
        await getDatabase();

        // Set new themehandler for new window
        const theme = await OBR.theme.getTheme();
        Utilities.SetThemeMode(theme, document);
        OBR.theme.onChange((theme) =>
        {
            Utilities.SetThemeMode(theme, document);
        })

        // Retrieve player ID for Rumble Integrations
        this.userId = await OBR.player.getId();
        this.userColor = await OBR.player.getColor();
        this.userName = await OBR.player.getName();
        this.VIEWPORTHEIGHT = await OBR.viewport.getHeight();
        this.VIEWPORTWIDTH = await OBR.viewport.getWidth();
        this.ROOMSETTINGS = await OBR.room.getMetadata();

        // Retrieve the unit in question if it's not multi
        if (!this.multiSheet)
        {
            const unit = await OBR.scene.items.getItems([this.POPOVERSUBMENUID]);
            this.currentUnit.SetMetadata(unit[0]);

            if (!this.freshImport && !this.multiSheet)
            {
                const unit = await OBR.scene.items.getItems([this.POPOVERSUBMENUID]);
                if (unit.length > 0)
                {
                    this.currentUnit.SetMetadata(unit[0]);
                }
            }
        }

        this.freshImport = false;

        // Assemble Stat Card
        BuildUnitStatBlock(this.currentUnit);
        AppendSubMainFooterButtons();
        AppendSearchButtons();
        AppendImportButtons()
    }

    public ShowSubMenu(): void
    {
        this.SUBMAIN.style.display = "block";
        this.SUBIMPORT.style.display = "none";
        this.SUBSEARCH.style.display = "none";
    }

    public ShowSearchMenu(): void
    {
        this.SUBMAIN.style.display = "none";
        this.SUBIMPORT.style.display = "none";
        this.SUBSEARCH.style.display = "block";
    }

    public ShowImportMenu(): void
    {
        this.SUBMAIN.style.display = "none";
        this.SUBIMPORT.style.display = "block";
        this.SUBSEARCH.style.display = "none";
    }
}

// Render from main list
export const SUBVIEW = new SubMenu();

OBR.onReady(async () =>
{
    await SUBVIEW.RenderUnitInfo();
});