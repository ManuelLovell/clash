import OBR, { Metadata } from "@owlbear-rodeo/sdk";
import { Constants } from "./constants";
import { ViewportFunctions } from './viewport';
import { IOBRTracker, IUnitTrack } from './interfaces/turn-tracker-item';
import { ICurrentTurnUnit } from './interfaces/current-turn-unit';
import { LabelLogic } from "./label-logic";
import { db } from './local-database';
import { IUnitInfo } from "./interfaces/unit-info";
import { liveQuery } from "dexie";
import * as Buttons from "./initiative-list-buttons";

export class InitiativeList
{
    // Counter per round
    roundCounter: number = 1;
    // Counter per turn
    turnCounter: number = 1;
    // Active Units
    activeUnits: IUnitInfo[] = [];
    // Setting Flags for GM
    gmHideHp = false;
    gmHideAll = false;
    gmDisableLabel = false;
    gmDisableFocus = false;
    gmReverseList = false;
    gmTurnText = "";

    /**Render the main initiatve form from the GM perspective */
    public async RenderInitiativeList(document: Document): Promise<void>
    {
        this.ShowSettingsMenu(false);
        this.ShowMainMenu(true);

        // Place base HTML and Containers
        document.querySelector<HTMLDivElement>('#clash-main-body-app')!.innerHTML = `
        <table id="initiative-list">
        <thead>
            <tr>
            <th style="width: 8%"><img class="Icon" title="Initiative" src="/queue.svg"></th>
            <th style="width: 8%"><div id="rollAllContainer"></div></th>
            <th style="width: 42%">Name</th>
            <th style="width: 24%"><img class="Icon" title="Hit Points" src="/heart.svg"></th>
            <th style="width: 8%"><img class="Icon" title="Armor Class" src="/shield.svg"></th>
            <th style="width: 10%"><span id="saveButtonContainer"></span></th>
            </tr>
        </thead>
        <tbody id="unit-list"></tbody>
        </table>
        <footer>
        <div id="roundCounter" class="bottom"><span id="prevContainer"></span><span id="roundCount" class="centerish">Round: ${this.roundCounter}</span><span id="nextContainer"></span></div>
        <div id="bombContainer" class="bombBottom"><span id="resetContainer" class=""></span></div>
        </footer>
        `;

        // Append basic form buttons
        //this.AppendSaveOrderButton();
        Buttons.AppendSaveOrderButton(document, this);
        Buttons.AppendTurnButtons(document, this);
        Buttons.AppendClearListButton(document, this);
        Buttons.AppendRollerButton(document);

        // Initialize Settings if none exists
        const settingData = await db.Settings.get(Constants.SETTINGSID);
        if (settingData)
        {
            this.gmHideHp = settingData.gmHideHp;
            this.gmHideAll = settingData.gmHideAll;
            this.gmDisableLabel = settingData.gmDisableLabel;
            this.gmDisableFocus = settingData.disableFocus;
            this.gmReverseList = settingData.gmReverseList;
            this.gmTurnText = settingData.gmTurnText;
        }
        else
        {
            await db.Settings.add({ id: Constants.SETTINGSID, gmHideHp: false, gmHideAll: false, gmDisableLabel: false, gmTurnText: "", gmReverseList: false, disableFocus: false });
        }

        // Initialize base turn order if none exists
        const trackerExists = await db.Tracker.get(Constants.TURNTRACKER);
        if (trackerExists)
        {
            this.turnCounter = trackerExists.currentTurn;
            this.roundCounter = trackerExists.currentRound;
        }
        else
        {
            await db.Tracker.add({ id: Constants.TURNTRACKER, currentRound: 1, currentTurn: 1 });
        }

        // Subscribe to on-change to detect if a token was deleted
        OBR.scene.items.onChange(async (items)=>
        {
            let missingIds = this.activeUnits.filter(({ id: listId }) => !items.some(({ id: itemId }) => itemId === listId));
            missingIds.forEach(async unit => 
            {
                // Update will trigger Refreshlist, do not want to call directly
                await db.ActiveEncounter.update(unit.id, { isActive: 0 });
            });
        });

        // The purpose of these is to catch the Add/Remove from Owlbear-ContextMenu without OBRs listener
        let updateDb = liveQuery(() => db.ActiveEncounter.toArray());
        updateDb.subscribe(() => this.RefreshList(), error => console.error('Clash!SubscriptionError: ' + error));

        this.RefreshList();
    }

    public async RefreshList(): Promise<void>
    {
        // Reference to initiative list
        const tableElement = <HTMLTableElement>document.querySelector("#unit-list")!;

        // Reference to InitiativeList class
        const self = this;

        // Get all units from activeencounter
        const tableUnits = await db.ActiveEncounter.toCollection();

        // Unit list
        this.activeUnits = (await tableUnits.toArray()).filter(x => x.isActive == 1);

        // Sort unts based on Reverse Setting or not
        const sortedUnits = this.gmReverseList ? this.activeUnits.sort((a, b) => a.initiative - b.initiative || a.unitName.localeCompare(b.unitName)!)
            : this.activeUnits.sort((a, b) => b.initiative - a.initiative || a.unitName.localeCompare(b.unitName)!);

        //Clear the table
        while (tableElement.rows.length > 0)
        {
            tableElement.deleteRow(0);
        }
        //Rebuild the table in order
        for (const unit of sortedUnits)
        {
            let row = tableElement.insertRow(-1);
            let initCell = row.insertCell(0);
            let rollerCell = row.insertCell(1)
            let nameCell = row.insertCell(2);
            let hpCell = row.insertCell(3);
            let acCell = row.insertCell(4);
            let optionCell = row.insertCell(5);

            row.setAttribute("unit-id", unit.id!);

            const initiativeInput = document.createElement('input');
            initiativeInput.className = "InitiativeInput";
            initiativeInput.inputMode = "numeric";
            initiativeInput.setAttribute("unit-dexbonus", Math.floor((unit.dexScore! - 10) / 2).toString());
            initiativeInput.value = unit.initiative!.toString();
            initiativeInput.id = `iI${unit.id}`;
            initiativeInput.size = 2;
            initiativeInput.min = "0";
            initiativeInput.max = "99";
            initiativeInput.maxLength = 2;

            const rollerButton = document.createElement('input');
            rollerButton.type = "image";
            rollerButton.title = "Roll this Unit's Iniative";
            rollerButton.id = `rB${unit.id}`;
            rollerButton.className = "clickable";
            rollerButton.onclick = async function () 
            {
                const dexBonus = parseFloat(initiativeInput.getAttribute("unit-dexbonus")!);
                initiativeInput.value = (dexBonus + Math.floor(Math.random() * (20 - 1) + 1)).toString();
            };
            rollerButton.src = "/dice.svg";
            rollerButton.height = 20;
            rollerButton.width = 20;

            const nameToggle = document.createElement('input');
            nameToggle.type = "button";
            nameToggle.value = unit.isMonster ? `ʳ ${unit.unitName} ʴ` : unit.unitName;
            nameToggle.title = "Change between Player and Monster groups";
            nameToggle.id = `nT${unit.id}`;
            nameToggle.style.width = "140px";
            nameToggle.style.textOverflow = "ellipsis";
            nameToggle.style.overflow = "hidden";

            nameToggle.className = unit.isMonster ? "isMonster" : "";
            nameToggle.onclick = async function () 
            {
                if (nameToggle.className == "isMonster")
                {
                    nameToggle.value = unit.unitName;
                    nameToggle.className = "";
                }
                else
                {
                    nameToggle.value = `ʳ ${unit.unitName} ʴ`;
                    nameToggle.className = "isMonster";
                }
            };

            const heartInputMin = document.createElement('input');
            heartInputMin.className = "HealthInput";
            heartInputMin.inputMode = "numeric";
            heartInputMin.id = `cHP${unit.id}`;
            heartInputMin.title = unit.currentHP!.toString();
            heartInputMin.value = unit.currentHP!.toString();
            heartInputMin.size = 4;
            heartInputMin.maxLength = 4;
            heartInputMin.onblur = function (e)
            {
                const target = e.currentTarget as HTMLInputElement;
                const value = target.value;
                if (value.substring(0, 1) == "+")
                {
                    const addThis = value.substring(value.indexOf('+') + 1);
                    heartInputMin.value = (+addThis + +heartInputMin.title).toString();
                    heartInputMin.title = heartInputMin.value;
                    e.preventDefault();
                }
                else if (value.substring(0, 1) == "-")
                {
                    const minusThis = value.substring(value.indexOf('-') + 1);
                    heartInputMin.value = (+heartInputMin.title - +minusThis).toString();
                    heartInputMin.title = heartInputMin.value;
                    e.preventDefault();
                }
            };
            heartInputMin.onkeydown = function (e)
            {
                if (e.key !== "Enter") return;
                const target = e.currentTarget as HTMLInputElement;
                const value = target.value;
                if (value.substring(0, 1) == "+")
                {
                    const addThis = value.substring(value.indexOf('+') + 1);
                    heartInputMin.value = (+addThis + +heartInputMin.title).toString();
                    heartInputMin.title = heartInputMin.value;
                    e.preventDefault();
                }
                else if (value.substring(0, 1) == "-")
                {
                    const minusThis = value.substring(value.indexOf('-') + 1);
                    heartInputMin.value = (+heartInputMin.title - +minusThis).toString();
                    heartInputMin.title = heartInputMin.value;
                    e.preventDefault();
                }
            }

            const heartInputMax = document.createElement('input');
            heartInputMax.className = "HealthInput";
            heartInputMax.inputMode = "numeric";
            heartInputMax.id = `mHP${unit.id}`;
            heartInputMax.value = unit.maxHP!.toString();
            heartInputMax.size = 4;
            heartInputMax.maxLength = 4;

            const armorInput = document.createElement('input');
            armorInput.className = "ArmorInput";
            armorInput.inputMode = "numeric";
            armorInput.id = `aC${unit.id}`;
            armorInput.value = unit.armorClass!.toString();
            armorInput.size = 2;
            armorInput.maxLength = 2;

            const triangleImg = document.createElement('input');
            triangleImg.type = "image";
            triangleImg.title = "View/Edit this Unit's Stats";
            triangleImg.id = `tB${unit.id}`;
            triangleImg.className = "clickable";
            triangleImg.onclick = async function (e) 
            {
                const currentTarget = e.currentTarget as HTMLInputElement;
                await self.OpenSubMenu(currentTarget.id.substring(2));
            };
            triangleImg.src = "/triangle.svg";
            triangleImg.height = 20;
            triangleImg.width = 20;

            initCell.appendChild(initiativeInput);
            initCell.style.width = "8%";
            rollerCell.appendChild(rollerButton);
            rollerCell.style.width = "8%";

            nameCell.appendChild(nameToggle);
            nameCell.style.width = "42%";
            hpCell.appendChild(heartInputMin);
            hpCell.appendChild(document.createTextNode(`/`));
            hpCell.appendChild(heartInputMax);
            hpCell.style.width = "24%";
            acCell.appendChild(armorInput);
            acCell.style.width = "8%";
            if (!db.inMemory)
            {
                optionCell.appendChild(triangleImg);
                optionCell.style.width = "10%";
            };
        }

        await this.ShowTurnSelection();
    }

    private async ShowTurnSelection(): Promise<void>
    {
        const table = <HTMLTableElement>document.getElementById("initiative-list");
        if (table.rows?.length > 1)
        {
            for (var i = 0, row; row = table.rows[i]; i++) 
            {
                row.classList.remove("turnOutline");
            }

            // Error correction if removing a unit, who is at the end of the order and it's their turn
            if (this.turnCounter >= table.rows.length)
            {
                this.turnCounter = table.rows.length - 1;
            }

            if (table.rows[this.turnCounter])
            {
                const currentTurnRow = table.rows[this.turnCounter];
                currentTurnRow.className = "turnOutline";

                const counterHtml = document.getElementById("roundCount")!;
                counterHtml.innerText = `Round: ${this.roundCounter}`;
            }
        }
    }

    /** Save all information that can be editted from the main list (not sub menu) */
    public async Save(): Promise<void>
    {
        const unitsInOrder = document.querySelectorAll(".InitiativeInput");
        unitsInOrder.forEach(async (unit) =>
        {
            const unitInput = unit as HTMLInputElement;
            const unitId = unitInput.id.substring(2);
            const initiative = unitInput.value;

            const hpElement = document.querySelector(`#cHP${unitId}`) as HTMLInputElement;
            const currentHp = hpElement.value ? hpElement.value : "0";

            const mhpElement = document.querySelector(`#mHP${unitId}`) as HTMLInputElement;
            const maxHp = mhpElement.value ? mhpElement.value : "1";

            const acElement = document.querySelector(`#aC${unitId}`) as HTMLInputElement;
            const armorClass = acElement.value ? acElement.value : "10";

            const nameElement = document.querySelector(`#nT${unitId}`) as HTMLInputElement;
            const isMonster = (nameElement.className == "isMonster");

            if (!unitId || !initiative) return;

            let updateMe = this.activeUnits?.find(x => x.id == unitId);
            if (updateMe)
            {
                await db.ActiveEncounter.update(
                    updateMe.id,
                    {
                        initiative: parseFloat(initiative),
                        currentHP: parseFloat(currentHp),
                        maxHP: parseFloat(maxHp),
                        armorClass: parseFloat(armorClass),
                        isMonster: isMonster
                    });
            }
        });
        await db.Tracker.update(Constants.TURNTRACKER, { id: Constants.TURNTRACKER, currentTurn: this.turnCounter, currentRound: this.roundCounter });
        await this.RefreshList();
        await this.UpdateTrackerForPlayers();
    }

    private async UpdateTrackerForPlayers()
    {
        let trackedUnits: IUnitTrack[] = [];
        for (const unit of this.activeUnits)
        {
            trackedUnits.push(
                {
                    id: unit.id,
                    name: unit.unitName,
                    initiative: unit.initiative,
                    cHp: unit.currentHP,
                    mHp: unit.maxHP,
                }
            );
        }

        let Tracker: IOBRTracker = { turn: this.turnCounter, round: this.roundCounter, units: trackedUnits, gmHideHp: this.gmHideHp, gmHideAll: this.gmHideAll, gmReverseList: this.gmReverseList };

        let trackerMeta: Metadata = {};
        trackerMeta[`${Constants.EXTENSIONID}/metadata_trackeritem`] = { Tracker };
        await OBR.scene.setMetadata(trackerMeta);
    }

    public async FocusOnCurrentTurnUnit(table: HTMLTableElement): Promise<void>
    {
        const currentTurnRow = table.rows[this.turnCounter];
        const ctu: ICurrentTurnUnit = await LabelLogic.GetCTUFromRow(currentTurnRow);

        if (!this.gmDisableFocus)
        {
            //Update the view if the setting is allowed
            await ViewportFunctions.CenterViewportOnImage(ctu);
        }

        if (!this.gmDisableLabel)
        {
            //Update the label if the setting is allowed
            await LabelLogic.UpdateLabel(ctu, this.gmTurnText);
        }
    }

    public ShowSettingsMenu(show: boolean): void
    {
        const page = document.querySelector<HTMLDivElement>('#clash-main-body-settings')!;
        page.hidden = !show;
    }

    public ShowMainMenu(show: boolean): void
    {
        const page = document.querySelector<HTMLDivElement>('#clash-main-body-app')!;
        page.hidden = !show;
    }

    private async OpenSubMenu(unitId: string): Promise<void>
    {
        await OBR.popover.open({
            id: Constants.EXTENSIONSUBMENUID,
            url: `/submenu/subindex.html?unitid=${unitId}`,
            height: 700,
            width: 350,
            anchorElementId: `000`, // This defaults to center.
            anchorReference: "ELEMENT"
            //anchorReference: "ELEMENT"
        });
    }
}