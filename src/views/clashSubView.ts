import { Constants, UnitConstants } from './../clashConstants';
import OBR, { Metadata } from '@owlbear-rodeo/sdk';
import UnitInfo from "./../unitinfo/clashUnitInfo";
import { getDatabase } from './../local-database';
import * as Utilities from './../utilities/bsUtilities';
import { IUnitInfo } from './../interfaces/unit-info';
import { BuildUnitStatBlock } from './clashSubViewBuildBlock';
import '/src/css/clash-mini-style.css'
import { AppendImportButtons, AppendSearchButtons, AppendSubMainFooterButtons } from '../buttons/clashSubviewButtons';

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
    SUBMAINPINBUTTONMENU: HTMLDivElement;
    SUBMAINPINHEADERMENU: HTMLDivElement;
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
        this.SUBMAINPINBUTTONMENU = document.getElementById("clash-sub-tab-container") as HTMLDivElement;
        this.SUBMAINPINHEADERMENU = document.getElementById("clash-sub-pin-header") as HTMLDivElement;
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
            document.getElementById("groupEdit")!.style.display = "block";
            this.SUBMAIN.style.height = "90%";
            this.SUBSEARCH.style.height = "90%";
            this.SUBIMPORT.style.height = "90%";
        }
        else
        {
            document.getElementById("groupEdit")!.style.display = "none";
            this.POPOVERSUBMENUID = idParam;
        }

        this.currentUnit = new UnitInfo(this.POPOVERSUBMENUID, "Default");
        if (this.pinned)
        {
            this.SUBMAINFOOTER.style.display = "none";
            /// CHANGES HERE
            this.SUBMAINPINHEADERMENU.style.display = "flex";
            this.SUBMAIN.style.height = "calc(100% - 36px)";
            this.SUBMAIN.style.marginTop = "6px";
        }
    }

    public async RenderUnitInfo(renderButtons = true): Promise<void>
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
        if (renderButtons)
        {
            AppendSubMainFooterButtons();
            AppendSearchButtons();
            AppendImportButtons()
        }
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

    public AddUnitSelectButton(unitid: string, unitname: string): void
    {
        const newUnitButon = document.createElement('button');
        newUnitButon.id = `unitSelect_${unitid}`;
        newUnitButon.classList.add('unit_select_button');
        newUnitButon.innerText = unitname;
        newUnitButon.onclick = async (e) =>
        {
            e.preventDefault();
            if (unitid === SUBVIEW.POPOVERSUBMENUID) return; // Do nothing if we're already on this unit
            else
            {
                SUBVIEW.POPOVERSUBMENUID = unitid;
                await SUBVIEW.RenderUnitInfo();
            }
        };

        SUBVIEW.SUBMAINPINBUTTONMENU.appendChild(newUnitButon);
    }
}

// Render from main list
export const SUBVIEW = new SubMenu();

OBR.onReady(async () =>
{
    if (SUBVIEW.pinned)
    {
        // Get all OTHER units aside from the one this list is for.
        const thisUnit = await OBR.scene.items.getItems(x => x.id === SUBVIEW.POPOVERSUBMENUID);
        const otherUnits = (await OBR.scene.items.getItems(x => x.metadata[UnitConstants.ONLIST] === true)).filter(x => x.id !== SUBVIEW.POPOVERSUBMENUID);

        SUBVIEW.AddUnitSelectButton(thisUnit[0].id, thisUnit[0].metadata[UnitConstants.UNITNAME] as string);
        for (const unit of otherUnits)
        {
            SUBVIEW.AddUnitSelectButton(unit.id, unit.metadata[UnitConstants.UNITNAME] as string);
        }

        const buttonContainer = document.getElementById("clash-sub-close-container");

        //Create Export Button
        const closeButton = document.createElement('input');
        closeButton.type = "image";
        closeButton.id = "closeSubMenuPinButton";
        closeButton.classList.add("clickable");
        closeButton.style.marginLeft = "5px";
        closeButton.onclick = async function () 
        {
            if (SUBVIEW.pinned)
                await OBR.popover.close(`POP_${SUBVIEW.POPOVERSUBMENUID}`);
            else
            {
                await OBR.popover.close(Constants.EXTENSIONSUBMENUID);
                await OBR.broadcast.sendMessage(Constants.SUBCLOSE, true, { destination: "LOCAL" });
            }
        }
        closeButton.src = "/close.svg";
        closeButton.title = "Close Window";
        closeButton.height = 20;
        closeButton.width = 20;

        buttonContainer?.appendChild(closeButton);
    }
    await SUBVIEW.RenderUnitInfo();
});