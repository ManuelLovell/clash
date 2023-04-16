import OBR, { Metadata } from "@owlbear-rodeo/sdk";
import { Constants } from "./constants";
import { ViewportFunctions } from './viewport';
import { Tracker, UnitTrack } from './interfaces/turn-tracker-item';
import { ICurrentTurnUnit } from './interfaces/current-turn-unit';
import { LabelLogic } from "./label-logic";
import { db } from './local-database';
import { IUnitInfo } from "./interfaces/unit-info";
import { liveQuery } from "dexie";

export class InitiativeList
{
    // Counter per round
    roundCounter: number = 1;
    // Counter per turn
    turnCounter: number = 1;
    // Active Units
    activeUnits: IUnitInfo[] = [];

    /**Render the main initiatve form from the GM perspective */
    public async Render(document: Document): Promise<void>
    {
        // Place base HTML and Containers
        document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
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
        <div id="roundCounter" class="bottom"><span id="prevContainer"></span><span id="roundCount" class="centerish">Round: ${this.roundCounter}</span><span id="nextContainer" class="floatright"></span></div>
        <div id="bombContainer" class="bombBottom"><span id="resetContainer" class=""></span></div>
        `;

        // Append basic form buttons
        this.AppendSaveOrderButton();
        this.AppendTurnButtons();
        this.AppendResetButton();
        this.AppendRollerButton();

        // Initialize base turn order if none exists
        const trackerExists = await db.Tracker.get(Constants.TURNTRACKER);
        if (trackerExists)
        {
            this.turnCounter = trackerExists.currentTurn;
            this.roundCounter = trackerExists.currentRound;
        }
        else
        {
            await db.Tracker.add({id: Constants.TURNTRACKER, currentRound: 1, currentTurn: 1});
        }

        // The purpose of these is to catch the Add/Remove from Owlbear-ContextMenu without OBRs listener
        let updateDb = liveQuery(() => db.ActiveEncounter.toArray());
        updateDb.subscribe(() => this.RefreshList(), error => console.error('Clash!SubscriptionError: '+error));

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

        // Sort so the highest initiative value is on top
        const sortedUnits = this.activeUnits.sort(
            (a, b) => b.initiative - a.initiative || a.unitName.localeCompare(b.unitName)!
        );

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
            initiativeInput.setAttribute("unit-dexbonus", Math.floor( (unit.dexScore! - 10) / 2 ).toString());
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
            }
            rollerButton.src = "/dice.svg";
            rollerButton.height = 20;
            rollerButton.width = 20;

            const nameToggle = document.createElement('input');
            nameToggle.type = "button";
            nameToggle.value = unit.isMonster ? `ʳ ${unit.unitName} ʴ` : unit.unitName;
            nameToggle.title = "Change between Player and Monster groups";
            nameToggle.id = `nT${unit.id}`;
            nameToggle.className = unit.isMonster ? "isMonster" : "";
            nameToggle.onclick = async function () 
            {
                if (nameToggle.className == "isMonster")
                {
                    console.log("Swapped to PLAYER");
                    nameToggle.value = unit.unitName;
                    nameToggle.className = "";
                }
                else
                {
                    console.log("Swapped to MONSTER");
                    nameToggle.value = `ʳ ${unit.unitName} ʴ`;
                    nameToggle.className = "isMonster";
                }
            }

            const heartInputMin = document.createElement('input');
            heartInputMin.className = "HealthInput";
            heartInputMin.inputMode = "numeric";
            heartInputMin.id = `cHP${unit.id}`;
            heartInputMin.value = unit.currentHP!.toString();
            heartInputMin.size = 4;
            heartInputMin.maxLength = 4;

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
            }
            triangleImg.src = "/triangle.svg";
            triangleImg.height = 20;
            triangleImg.width = 20;

            initCell.appendChild(initiativeInput);
            rollerCell.appendChild(rollerButton);

            nameCell.appendChild(nameToggle);
            hpCell.appendChild(heartInputMin);
            hpCell.appendChild(document.createTextNode(`/`));
            hpCell.appendChild(heartInputMax);
            acCell.appendChild(armorInput);
            optionCell.appendChild(triangleImg);
        }

        await this.ShowTurnSelection();
    }

    private async OpenSubMenu(unitId: string): Promise<void>
    {
        await OBR.popover.open({
            id: Constants.EXTENSIONSUBMENUID,
            url: `/submenu/subindex.html?unitid=${unitId}`,
            height: 700,
            width: 325,
            anchorPosition: { left: 625, top: 15 },
            anchorReference: "POSITION"
        });
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

    /**Add Previous/Next Turn buttons */
    private AppendTurnButtons(): void
    {
        var self = this;
        //Get Turn Button Container
        const prevContainer = document.getElementById("prevContainer");
        const nextContainer = document.getElementById("nextContainer");

        //Create Turn Buttons
        const previousButton = document.createElement('input');
        previousButton.type = "button";
        previousButton.id = "previousButton";
        previousButton.value = "Previous"
        previousButton.className = "turnColor chalkBorder turnIndicator";
        previousButton.title = "Previous Turn"
        previousButton.onclick = async function () 
        {
            const table = <HTMLTableElement>document.getElementById("initiative-list");
            if (table.rows?.length > 1)
            {
                self.turnCounter--;

                for (var i = 0, row; row = table.rows[i]; i++) 
                {
                    if (row.className == "turnOutline")
                    {
                        if (row.parentElement?.firstElementChild === row)
                        {
                            self.roundCounter--;
                            if (self.roundCounter < 1) self.roundCounter = 1;
                            self.turnCounter = row.parentElement.childElementCount;
                        }
                    }
                }
                await self.FocusOnCurrentTurnUnit(table);
                await self.Save();
            }
        }

        const nextButton = document.createElement('input');
        nextButton.type = "button";
        nextButton.id = "nextButton";
        nextButton.value = "Next";
        nextButton.className = "turnColor chalkBorder turnIndicator";
        nextButton.title = "Next Turn"
        nextButton.onclick = async function () 
        {
            const table = <HTMLTableElement>document.getElementById("initiative-list");
            if (table.rows?.length > 1)
            {
                self.turnCounter++;
                for (var i = 0, row; row = table.rows[i]; i++) 
                {
                    if (row.className == "turnOutline")
                    {
                        if (row.parentElement?.lastElementChild === row)
                        {
                            self.roundCounter++;
                            self.turnCounter = 1;
                        }
                    }
                }
                await self.FocusOnCurrentTurnUnit(table);
                await self.Save();
            }
        }

        prevContainer?.appendChild(previousButton);
        nextContainer?.appendChild(nextButton);
    }

    /**Add Clear Data Button */
    private AppendResetButton(): void
    {
        var self = this;

        //Get Reset Container
        const resetContainer = document.getElementById("resetContainer")!;

        //Create Soft Reset Button
        const clearButton = document.createElement('input');
        clearButton.type = "button";
        clearButton.id = "clearButton";
        clearButton.value = "CLEAR LIST"
        clearButton.title = "Clear List"
        clearButton.className = "tinyType";
        clearButton.onclick = async function () 
        {
            if (confirm("Clear the Initiative List (This will leave unit info)?"))
            {
                self.turnCounter = 1;
                self.roundCounter = 1;
                const counterHtml = document.getElementById("roundCount")!;
                counterHtml.innerText = `Round: ${self.roundCounter}`;

                await db.Tracker.clear();
                await db.Tracker.add({id: Constants.TURNTRACKER, currentRound: 1, currentTurn: 1});
                await db.ActiveEncounter.where("isActive").equals(1).modify({ isActive: 0 });

                await OBR.scene.items.deleteItems([Constants.LABEL]);

                await OBR.scene.items.updateItems((item) => item.metadata[`${Constants.EXTENSIONID}/metadata_initiative`] != undefined
                    || item.id === Constants.LABEL, (items) =>
                {
                    for (let item of items)
                    {
                        delete item.metadata[`${Constants.EXTENSIONID}/metadata_initiative`];
                    }
                });
            }
        }
        resetContainer.appendChild(clearButton);

        //Create Reset ALL Button
        const resetButton = document.createElement('input');
        resetButton.type = "button";
        resetButton.id = "resetButton";
        resetButton.value = "DELETE DATA"
        resetButton.title = "Clear all Clash! Data"
        resetButton.className = "tinyType";
        resetButton.onclick = async function () 
        {
            if (confirm("Clear ALL saved Clash info? (This will wipe saved unit info)"))
            {
                self.turnCounter = 1;
                self.roundCounter = 1;
                const counterHtml = document.getElementById("roundCount")!;
                counterHtml.innerText = `Round: ${self.roundCounter}`;

                await db.ActiveEncounter.clear();
                await db.Tracker.clear();

                await db.Tracker.add({id: Constants.TURNTRACKER, currentRound: 1, currentTurn: 1});

                await OBR.scene.items.deleteItems([Constants.LABEL]);

                await OBR.scene.items.updateItems((item) => item.metadata[`${Constants.EXTENSIONID}/metadata_initiative`] != undefined
                    || item.id === Constants.LABEL, (items) =>
                {
                    for (let item of items)
                    {
                        delete item.metadata[`${Constants.EXTENSIONID}/metadata_initiative`];
                    }
                });
            }
        }
        resetContainer.appendChild(resetButton);
    }

    /** Add Save Button */
    private AppendSaveOrderButton(): void
    {
        var self = this;
        //Get Button Container
        const buttonContainer = document.getElementById("saveButtonContainer")!;

        //Create Save Button
        const saveButton = document.createElement('input');
        saveButton.type = "image";
        saveButton.className = "Icon clickable";
        saveButton.id = "saveButton";
        saveButton.onclick = async function () 
        {
            await self.Save();
        }
        saveButton.src = "/save.svg";
        saveButton.title = "Save Changes";
        saveButton.height = 20;
        saveButton.width = 20;

        buttonContainer.appendChild(saveButton);
    }

    /** Add RollAll Button */
    private AppendRollerButton(): void
    {
        //Get Button Container
        const rollerContainer = document.getElementById("rollAllContainer")!;

        //Create RollAll Button
        const rollerButton = document.createElement('input');
        rollerButton.type = "image";
        rollerButton.className = "Icon RollerButton clickable";
        rollerButton.id = "rollAllButton";
    
        rollerButton.onclick = async function () 
        {
            OBR.notification.show("Rolled Initiative for all Monsters.");

            const unitsInOrder = document.querySelectorAll(".isMonster");
            unitsInOrder.forEach((unit) =>
            {
                const unitNameInput = unit as HTMLInputElement;
                const unitId = unitNameInput.id.substring(2);

                const initElement = document.querySelector(`#iI${unitId}`) as HTMLInputElement;
                const dexBonus = parseFloat(initElement.getAttribute("unit-dexbonus")!);
                initElement.value = (dexBonus + Math.floor(Math.random() * (20 - 1) + 1)).toString();
            });
        }
        rollerButton.src = "/dice.svg";
        rollerButton.title = "Roll Initiative for all Monsters";
        rollerButton.height = 20;
        rollerButton.width = 20;

        rollerContainer.appendChild(rollerButton);
    }

    /** Save all information that can be editted from the main list (not sub menu) */
    private async Save(): Promise<void>
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
                    {initiative:parseFloat(initiative),
                    currentHP:parseFloat(currentHp),
                    maxHP:parseFloat(maxHp),
                    armorClass:parseFloat(armorClass),
                    isMonster: isMonster});
            }
        });
        await db.Tracker.update(Constants.TURNTRACKER, { id: Constants.TURNTRACKER, currentTurn: this.turnCounter, currentRound: this.roundCounter });
        await this.RefreshList();
        await this.UpdateTrackerForPlayers();
    }

    private async UpdateTrackerForPlayers()
    {
        let trackedUnits: UnitTrack[] = [];
        for (const unit of this.activeUnits)
        {
            trackedUnits.push(
                {
                    id: unit.id,
                    name: unit.unitName,
                    initiative: unit.initiative,
                    cHp: unit.currentHP,
                    mHp: unit.maxHP
                }
            );
        }

        let Tracker: Tracker = { turn: this.turnCounter, round: this.roundCounter, units: trackedUnits };

        let trackerMeta: Metadata = {};
        trackerMeta[`${Constants.EXTENSIONID}/metadata_trackeritem`] = { Tracker };
        await OBR.scene.setMetadata(trackerMeta);
    }

    private async FocusOnCurrentTurnUnit(table: HTMLTableElement): Promise<void>
    {
        const currentTurnRow = table.rows[this.turnCounter];
        const ctu: ICurrentTurnUnit = await LabelLogic.GetCTUFromRow(currentTurnRow);

        //Move the view
        await ViewportFunctions.CenterViewportOnImage(ctu);
        await LabelLogic.UpdateLabel(ctu);
    }
}