import OBR, { Item } from "@owlbear-rodeo/sdk";
import { Meta, Reta, Seta } from "./../utilities/bsUtilities";
import { Constants, SettingsConstants, UnitConstants } from "../clashConstants";
import { db } from "../local-database";
import { BSCACHE } from "../utilities/bsSceneCache";
import { GetACHeader, GetArmorInput, GetHPHeader, GetInitativeHeader, GetInitiativeInput, GetMinHPInput, GetMoveHeader, GetNameHeader, GetNameInput, GetRollInput, GetRollerHeader, GetStatInput, GetTempHPHeader, GetWhatsNewHeader, GetMaxHPInput, GetTempHPInput, GetMoveInput, ConfigureViewFooterButtons, RenderRollLog, GetElevationInput, GetElevateHeader, GetEFXHeader, GetEFXInput } from '../buttons/clashListButtons';
import { RenderSettings } from "./clashSettingsView";
import { ViewportFunctions } from "../utilities/bsViewport";
import { Labeler } from "../utilities/clashLabeler";

class GMView
{
    // Current Turn Unit
    currentTurnUnit?: Item;
    startEffectsDone = false;
    lastTurnUnit?: Item;
    // Counter per round
    roundCounter: number = 1;
    // Counter per turn
    turnCounter: number = 0;
    // Current Window Width
    windowWidth: number = 350;

    viewHeader?: HTMLTableElement;
    viewBody?: HTMLTableElement;
    viewFooter?: HTMLDivElement;
    viewCounter?: HTMLDivElement;
    viewPlayerList?: HTMLUListElement;

    // Added Columns
    addedColumns: string[] = [];

    public RenderWaiting(wait: boolean): void
    {
        if (wait)
        {
            BSCACHE.KillHandlers();
            Constants.MAINAPP!.hidden = true;
            Constants.MAINLOAD!.hidden = false;
        }
        else
        {
            Constants.MAINAPP!.hidden = false;
            Constants.MAINLOAD!.hidden = true;
        }
    }

    public async Render(): Promise<void>
    {
        Constants.MAINAPP.innerHTML = Constants.BASELIST;

        this.viewHeader = document.querySelector("#clashGMViewHeader") as HTMLTableElement;
        this.viewBody = document.querySelector("#clashGMViewBody") as HTMLTableElement;
        this.viewFooter = document.querySelector("#clashGMViewButtons") as HTMLDivElement;
        this.viewCounter = document.querySelector("#roundCounter") as HTMLDivElement;
        this.viewPlayerList = document.querySelector("#playerListing") as HTMLUListElement;

        ConfigureViewFooterButtons();

        // Warn about LocalStorage
        if (db.inMemory)
        {
            const warning: HTMLElement = document.createElement('div');
            warning.innerText = "Local Storage Disabled - Features Limited";
            warning.className = "noDatabase";
            Constants.MAINAPP.prepend(warning);
        }

        this.roundCounter = Seta(SettingsConstants.ROUNDCOUNT) ?? 1;
        this.turnCounter = Seta(SettingsConstants.TURNCOUNT) ?? 0;
        RenderSettings();
        RenderRollLog();

        const table = document.getElementById('clashGMViewBody');
        if (table)
        {
            table.addEventListener('dblclick', (event) => ViewportFunctions.FocusUnit(event));
        }

        // Setup Player Owner Context Menu
        const playerContextMenu = document.getElementById("playerListing")!;

        playerContextMenu.appendChild(this.GetEmptyContextItem());
        playerContextMenu.appendChild(this.GetRemoveContextItem());
        for (const player of BSCACHE.party)
        {
            const listItem = document.createElement("li");
            listItem.id = player.id;
            listItem.textContent = player.name;
            listItem.style.color = player.color;
            playerContextMenu.appendChild(listItem);
        };
        await this.RefreshList();
    }

    public async RefreshList(): Promise<void>
    {
        const activeUnits = BSCACHE.sceneItems.filter(unit => unit.metadata[UnitConstants.ONLIST] === true);
        let listWidth = 0;

        // Always Include Initiative and Name - Add the rest based on Settings
        const useColumns = ["INIT"];
        if (BSCACHE.roomMetadata[SettingsConstants.ROLLERROW] ?? true) useColumns.push("ROLL");
        useColumns.push("NAME");
        if (BSCACHE.roomMetadata[SettingsConstants.HPROW] ?? true) useColumns.push("HP");
        if (BSCACHE.roomMetadata[SettingsConstants.TEMPHPROW]) useColumns.push("TEMPHP");
        if (BSCACHE.roomMetadata[SettingsConstants.ACROW] ?? true) useColumns.push("AC");
        if (BSCACHE.roomMetadata[SettingsConstants.MOVEROW]) useColumns.push("MOVE");
        if (BSCACHE.roomMetadata[SettingsConstants.ELEVATEROW]) useColumns.push("ELEVATE");
        if (BSCACHE.roomMetadata[SettingsConstants.EFXROW]) useColumns.push("EFX");
        if (BSCACHE.roomMetadata[SettingsConstants.BLOCKROW] ?? true) useColumns.push("BLOCK");

        // Sort units based on Reverse Setting or not
        let sortedUnits;
        if (BSCACHE.roomMetadata[SettingsConstants.REVERSELIST])
        {
            sortedUnits = activeUnits.sort((a, b) => Meta(a, UnitConstants.INITIATIVE) - Meta(b, UnitConstants.INITIATIVE)
                || Meta(a, UnitConstants.UNITNAME).localeCompare(Meta(b, UnitConstants.UNITNAME)!));
        }
        else
        {
            sortedUnits = activeUnits.sort((a, b) => Meta(b, UnitConstants.INITIATIVE) - Meta(a, UnitConstants.INITIATIVE)
                || Meta(a, UnitConstants.UNITNAME).localeCompare(Meta(b, UnitConstants.UNITNAME)!));
        }

        //Clear the table
        this.viewHeader!.innerHTML = "";
        this.viewBody!.innerHTML = "";

        // Add the Table Header
        const row = this.viewHeader!.insertRow(-1);

        const initiativeHeader = GetInitativeHeader();
        row.appendChild(initiativeHeader);
        listWidth += 1;

        if (useColumns.includes("ROLL"))
        {
            const rollHeader = GetRollerHeader();
            row.appendChild(rollHeader);
            listWidth += 1;
        }

        const nameHeader = GetNameHeader();
        row.appendChild(nameHeader);

        listWidth += 3;
        if (useColumns.includes("HP"))
        {
            const hpHeader = GetHPHeader();
            row.appendChild(hpHeader);
            listWidth += 2;
        }

        if (useColumns.includes("TEMPHP"))
        {
            const tempHeader = GetTempHPHeader();
            row.appendChild(tempHeader);
            listWidth += 1;
        }

        if (useColumns.includes("AC"))
        {
            const acHeader = GetACHeader();
            row.appendChild(acHeader);
            listWidth += 1;
        }

        if (useColumns.includes("MOVE"))
        {
            const moveHeader = GetMoveHeader();
            row.appendChild(moveHeader);
            listWidth += 1;
        }

        if (useColumns.includes("ELEVATE"))
        {
            const elevateHeader = GetElevateHeader();
            row.appendChild(elevateHeader);
            listWidth += 1;
        }

        if (useColumns.includes("EFX"))
        {
            const efxHeader = GetEFXHeader();
            row.appendChild(efxHeader);
            listWidth += 1;
        }

        if (useColumns.includes("BLOCK"))
        {
            listWidth += 1;
        }
        const whatsNewHeader = GetWhatsNewHeader();
        row.appendChild(whatsNewHeader);

        if (listWidth > 7)
        {
            // 400 is base
            const newWidth = 350 + ((listWidth - 7) * 25);
            if (newWidth !== this.windowWidth)
            {
                await OBR.action.setWidth(newWidth);
                this.windowWidth = newWidth;
            }
        }
        else
        {
            if (400 !== this.windowWidth)
            {
                await OBR.action.setWidth(350);
                this.windowWidth = 350;
            }
        }

        //Rebuild the table in order
        for (const unit of sortedUnits)
        {
            const row = this.viewBody!.insertRow(-1);
            row.setAttribute("unit-id", unit.id!);
            let cellNumber = 0;

            // Always have Initiative
            const initCell = row.insertCell(cellNumber);
            const initiativeInput = GetInitiativeInput(unit);
            initCell.appendChild(initiativeInput);
            cellNumber++;

            // ROLL
            if (useColumns.includes("ROLL"))
            {
                const rollCell = row.insertCell(cellNumber);
                rollCell.style.textAlign = "center";
                const rollInput = GetRollInput(unit);
                rollCell.appendChild(rollInput);
                cellNumber++;
            }

            // Always have Name
            const nameCell = row.insertCell(cellNumber);
            const nameToggle = GetNameInput(unit);
            if (unit.visible === false) nameToggle.value = "(Hidden) " + nameToggle.value;
            nameCell.appendChild(nameToggle);
            nameCell.classList.add("name-cell");
            cellNumber++;

            // HP
            if (useColumns.includes("HP"))
            {
                const hpCell = row.insertCell(cellNumber);
                hpCell.style.display = "flex";
                hpCell.style.marginTop = "4px";
                const minHpInput = GetMinHPInput(unit);
                const maxHpInput = GetMaxHPInput(unit);
                hpCell.appendChild(minHpInput);
                hpCell.appendChild(document.createTextNode(`/`));
                hpCell.appendChild(maxHpInput);
                cellNumber++;
            }

            // TEMPHP
            if (useColumns.includes("TEMPHP"))
            {
                const tempHPCell = row.insertCell(cellNumber);
                const tempHPInput = GetTempHPInput(unit);
                tempHPCell.appendChild(tempHPInput);
                cellNumber++;
            }

            // AC
            if (useColumns.includes("AC"))
            {
                const acCell = row.insertCell(cellNumber);
                const acInput = GetArmorInput(unit);
                acCell.appendChild(acInput);
                cellNumber++;
            }
            // MOVE
            if (useColumns.includes("MOVE"))
            {
                const moveCell = row.insertCell(cellNumber);
                const moveInput = GetMoveInput(unit);
                moveCell.appendChild(moveInput);
                if (!useColumns.includes("BLOCK")) moveCell.colSpan = 2;
                cellNumber++;
            }

            // ELEVATION
            if (useColumns.includes("ELEVATE"))
            {
                const elCell = row.insertCell(cellNumber);
                elCell.style.display = "flex";
                elCell.style.justifyContent = "center";
                const elInput = GetElevationInput(unit);
                elCell.appendChild(elInput);
                cellNumber++;
            }

            // EFX
            if (useColumns.includes("EFX"))
            {
                const efxCell = row.insertCell(cellNumber);
                efxCell.style.textAlign = "center";
                const efxInput = GetEFXInput(unit);
                efxCell.appendChild(efxInput);
                cellNumber++;
            }

            // STAT BLOCK
            if (useColumns.includes("BLOCK"))
            {
                const optionCell = row.insertCell(cellNumber);
                const triangleImg = GetStatInput(unit);
                optionCell.appendChild(triangleImg);
            }
            else
            {
                row.insertCell(cellNumber);
            }
        }
        this.ShowTurnSelection();
    }

    public ShowTurnSelection(): void
    {
        const table = <HTMLTableElement>document.getElementById("clashGMViewBody");
        if (table && table.rows?.length > 0)
        {
            for (var i = 0, row; row = table.rows[i]; i++)
            {
                row.classList.remove("turn-outline");
            }

            // Error correction if removing a unit, who is at the end of the order and it's their turn
            if (this.turnCounter >= table.rows.length)
            {
                this.turnCounter = table.rows.length - 1;
            }

            if (table.rows[this.turnCounter])
            {
                const currentTurnRow = table.rows[this.turnCounter];
                currentTurnRow.classList.add("turn-outline");

                // Store the current unit turn
                const unitId = currentTurnRow.getAttribute("unit-id");
                this.currentTurnUnit = BSCACHE.sceneItems.find(x => x.id === unitId);

                const counterHtml = document.getElementById("roundCounter")!;
                counterHtml.innerText = `Round: ${this.roundCounter}`;

                if (this.currentTurnUnit && !this.startEffectsDone) this.HandleEffects(this.currentTurnUnit, "Start");
            }
        }
        else
        {
            // There's no one on the list
            this.currentTurnUnit = undefined;
        }
    }

    public async HandleEffects(unit: Item, when: string)
    {
        this.startEffectsDone = true;

        if (Reta(SettingsConstants.EFXROW) === true)
        {
            const newPackage: TurnEffect[] = [];
            const expired: string[] = [];

            const effectPackage = unit.metadata[UnitConstants.EFFECTS] as TurnEffect[];
            if (effectPackage && effectPackage.length > 0)
            {
                for (let index = 0; index < effectPackage.length; index++)
                {
                    const effect = effectPackage[index];

                    if (effect.EndingRound === this.roundCounter && effect.StartOfTurn === when) expired.push(effect.Name);
                    else newPackage.push(effect);
                }

                await OBR.scene.items.updateItems([unit.id], (units) =>
                {
                    for (const unit of units)
                    {
                        if (newPackage.length > 0)
                            unit.metadata[UnitConstants.EFFECTS] = newPackage;
                        else
                            unit.metadata[UnitConstants.EFFECTS] = undefined;
                    }
                });
            }
            if (expired.length > 0)
            {
                const now = new Date().toISOString();
                const message = `The following effects have expired for ${unit.metadata[UnitConstants.UNITNAME]}: ${expired.join(", ")}`;
                
                await OBR.player.setMetadata({ [`${Constants.EXTENSIONID}/metadata_effect_notify`]: { message: message, created: now } });

            }
        }
    }

    public async FocusOnCurrentTurnUnit(): Promise<void>
    {
        if (BSCACHE.playerRole === "GM")
        {
            if (this.currentTurnUnit && BSCACHE.roomMetadata[SettingsConstants.DISABLEFOCUS] !== true)
            {
                await ViewportFunctions.CenterViewportOnImage(this.currentTurnUnit);
            }
            await Labeler.UpdateLabel();
        }
    }

    public GetEmptyContextItem()
    {
        const listItem = document.createElement("li");
        listItem.id = BSCACHE.playerId;
        listItem.textContent = "No Owner";
        return listItem;
    }

    public GetRemoveContextItem()
    {
        const listItem = document.createElement("li");
        listItem.id = "REMOVE";
        listItem.textContent = "Remove Unit";
        return listItem;
    }
}

export const GMVIEW = new GMView();