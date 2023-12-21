import OBR, { Item } from "@owlbear-rodeo/sdk";
import { Constants, SettingsConstants, UnitConstants } from "../clashConstants";
import { BSCACHE } from "../utilities/bsSceneCache";
import { ConfigureViewFooterPlayerButtons, GetACHeader, GetArmorInput, GetHPHeader, GetInitativeHeader, GetInitiativeInput, GetMaxHPInput, GetMinHPInput, GetMoveHeader, GetMoveInput, GetNameHeader, GetNameInput, GetRollInput, GetRollerHeader, GetTempHPHeader, GetTempHPInput, GetWhatsNewHeader, RenderRollLog } from "../buttons/clashListButtons";
import { Meta, Reta, Seta, HexToRgba } from "../utilities/bsUtilities";
import { ViewportFunctions } from "../utilities/bsViewport";

class PlayerView
{
    DISABLEMYFOCUS = "";
    viewHeader?: HTMLTableElement;
    viewBody?: HTMLTableElement;
    viewFooter?: HTMLDivElement;
    viewCounter?: HTMLDivElement;

    windowWidth: number = 350;
    currentTurnUnit?: Item;
    // Counter per round
    roundCounter: number = 1;
    // Counter per turn
    turnCounter: number = 0;

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
        Constants.MAINAPP.innerHTML = Constants.PLAYERLIST;

        this.viewHeader = document.querySelector("#clashPLViewHeader") as HTMLTableElement;
        this.viewBody = document.querySelector("#clashPLViewBody") as HTMLTableElement;
        this.viewFooter = document.querySelector("#clashPLViewButtons") as HTMLDivElement;
        this.viewCounter = document.querySelector("#roundCounterContainer") as HTMLDivElement;

        BSCACHE.SetupHandlers(); // Incase the first didn't
        
        this.roundCounter = Seta(SettingsConstants.ROUNDCOUNT);
        this.turnCounter = Seta(SettingsConstants.TURNCOUNT);

        this.DISABLEMYFOCUS = `${Constants.EXTENSIONID}/setting_disablefocus_${BSCACHE.playerId}`;

        this.SetupFocusSlider();
        ConfigureViewFooterPlayerButtons();
        RenderRollLog();

        const table = document.getElementById('clashPLViewBody');
        if (table)
        {
            table.addEventListener('dblclick', (event) => ViewportFunctions.FocusUnit(event));
        }
        await this.RefreshList();
    }

    public async RefreshList(): Promise<void>
    {
        const activeUnits = BSCACHE.sceneItems.filter(unit => unit.metadata[UnitConstants.ONLIST] === true);
        let listWidth = 0;
        const alphaColor = HexToRgba(BSCACHE.playerColor, 0.9);

        // Always Include Initiative and Name - Add the rest based on Settings
        const useColumns = ["INIT"];
        if (BSCACHE.roomMetadata[SettingsConstants.ROLLERROW]) useColumns.push("ROLL");
        useColumns.push("NAME");
        if (BSCACHE.roomMetadata[SettingsConstants.HPROW] ?? true) useColumns.push("HP");
        if (BSCACHE.roomMetadata[SettingsConstants.TEMPHPROW]) useColumns.push("TEMPHP");
        if (BSCACHE.roomMetadata[SettingsConstants.ACROW] ?? true) useColumns.push("AC");
        if (BSCACHE.roomMetadata[SettingsConstants.MOVEROW]) useColumns.push("MOVE");

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
        while (this.viewHeader!.rows.length > 0)
        {
            this.viewHeader!.deleteRow(0);
        }
        while (this.viewBody!?.rows.length > 0)
        {
            this.viewBody!.deleteRow(0);
        }

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
            const myUnit = BSCACHE.playerId === unit.createdUserId;

            const row = this.viewBody!.insertRow(-1);
            if (!unit.visible)
            {
                row.style.display = "none";
            }
            row.setAttribute("unit-id", unit.id!);
            let cellNumber = 0;

            // Always have Initiative
            const initCell = row.insertCell(cellNumber);
            const initiativeInput = GetInitiativeInput(unit);
            this.Disable(initiativeInput, myUnit);
            initCell.appendChild(initiativeInput);
            cellNumber++;

            // ROLL
            if (useColumns.includes("ROLL"))
            {
                const rollCell = row.insertCell(cellNumber);
                rollCell.style.textAlign = "center";
                const rollInput = GetRollInput(unit);
                this.Disable(rollInput, myUnit);
                rollCell.appendChild(rollInput);
                cellNumber++;
            }

            // Always have Name
            const nameCell = row.insertCell(cellNumber);
            const nameToggle = GetNameInput(unit);
            if (myUnit)
            {
                nameToggle.style.borderColor = alphaColor;
                nameToggle.style.borderWidth = "2px";
            }

            if (!Reta(SettingsConstants.HIDEHP))
            {
                const currentHp = Meta(unit, UnitConstants.CURRENTHP);
                const maxHp = Meta(unit, UnitConstants.MAXHP);
                if (currentHp <= maxHp / 4)
                {
                    nameToggle.classList.add("unitHarmed");
                }
                else if (currentHp <= maxHp / 2)
                {
                    nameToggle.classList.add("unitHurt");
                }
                else
                {
                    nameToggle.classList.add("unitHappy");
                }
            }
            this.Disable(nameToggle, myUnit);
            nameCell.appendChild(nameToggle);
            cellNumber++;

            // HP
            if (useColumns.includes("HP"))
            {
                const hpCell = row.insertCell(cellNumber);
                hpCell.style.display = "flex";
                hpCell.style.marginTop = "4px";
                const minHpInput = GetMinHPInput(unit);
                this.Disable(minHpInput, myUnit);
                const maxHpInput = GetMaxHPInput(unit);
                this.Disable(maxHpInput, myUnit);
                hpCell.appendChild(minHpInput);
                if (!Reta(SettingsConstants.HIDEENEMYINFO))
                {
                    hpCell.appendChild(document.createTextNode(`/`));
                }
                hpCell.appendChild(maxHpInput);
                cellNumber++;
            }

            // TEMPHP
            if (useColumns.includes("TEMPHP"))
            {
                const tempHPCell = row.insertCell(cellNumber);
                const tempHPInput = GetTempHPInput(unit);
                this.Disable(tempHPInput, myUnit);
                tempHPCell.appendChild(tempHPInput);
                cellNumber++;
            }

            // AC
            if (useColumns.includes("AC"))
            {
                const acCell = row.insertCell(cellNumber);
                const acInput = GetArmorInput(unit);
                this.Disable(acInput, myUnit);
                acCell.appendChild(acInput);
                cellNumber++;
            }
            // MOVE
            if (useColumns.includes("MOVE"))
            {
                const moveCell = row.insertCell(cellNumber);
                const moveInput = GetMoveInput(unit);
                moveCell.colSpan = 2;
                if (!myUnit)
                {
                    moveInput.innerText = "";
                    moveInput.classList.remove("information");
                    moveInput.setAttribute('data-information', "");
                }
                moveCell.appendChild(moveInput);
                cellNumber++;
            }
        }
        this.ShowTurnSelection();
    }

    public ShowTurnSelection(): void
    {
        const table = this.viewBody;
        if (table && table.rows?.length > 1)
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
            }
        }
    }

    public FocusOnCurrentTurnUnit(): void
    {
        if (BSCACHE.roomMetadata[this.DISABLEMYFOCUS] === true && this.currentTurnUnit)
        {
            ViewportFunctions.CenterViewportOnImage(this.currentTurnUnit);
        }
    }

    public Disable(input: HTMLInputElement, myUnit: boolean): void
    {
        if (!myUnit)
        {
            input.disabled = true;
            input.classList.add("disabled");
            input.classList.remove("clickable");
            input.onclick = null;
            if (Reta(SettingsConstants.HIDEENEMYINFO) && !input.classList.contains("unit-initiative") && !input.classList.contains("unit-name-input"))
            {
                input.hidden = true;
            }
        }
    }

    public SetupFocusSlider()
    {
        const container = document.getElementById(`settingnoFocusContainer`);
        const slider = document.createElement('input');
        slider.type = "checkbox";
        slider.value = Reta(this.DISABLEMYFOCUS) ? "true" : "false";
        slider.checked = Reta(this.DISABLEMYFOCUS) ? true : false;
        slider.onclick = async function (element)
        {
            const target = element.target as HTMLInputElement;
            await OBR.room.setMetadata({ [`${Constants.EXTENSIONID}/setting_disablefocus_${BSCACHE.playerId}`]: target.checked });
        }
        container?.insertBefore(slider, container.firstChild);
    }
}

export const PLVIEW = new PlayerView();