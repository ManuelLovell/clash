import OBR, { Item, Image, buildShape } from "@owlbear-rodeo/sdk";
import { Constants } from "./constants";
import UnitInfo from './unit-info';
import { ViewportFunctions } from './viewport';
import { Tracker } from "./interfaces/turn-tracker-item";
import { CurrentTurnUnit } from './interfaces/current-turn-unit';
import { LabelLogic } from "./label-logic";

export class InitiativeList
{
    // Counter per round
    roundCounter: number = 1;
    // Counter per turn
    turnCounter: number = 1;

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
        <div id="roundCounter" class="bottom"><span id="turnContainer"></span><span id="roundCount" class="centerish">Round: ${this.roundCounter}</span><span id="resetContainer" class="floatright"></span></div>
        `;

        // Append basic form buttons
        this.AppendSaveOrderButton();
        this.AppendTurnButtons();
        this.AppendResetButton();
        this.AppendRollerButton();

        // Bind List to callback function
        OBR.scene.items.onChange(async (items: Item[]) =>
        {
            const filteredItems = items.filter((item) => item.metadata[`${Constants.EXTENSIONID}/metadata`] != undefined
                || item.id === Constants.TURNTRACKER)

            // Only refresh for things using Clash
            await this.RefreshList(filteredItems);
        });

        // Save to force the onChange so the initial load will render the list.
        await this.Save();
    }

    public async RefreshList(items: Item[]): Promise<void>
    {
        // Reference to initiative list
        const tableElement = <HTMLTableElement>document.querySelector("#unit-list")!;
        // Reference to InitiativeList class
        const self = this;
        // Unit list
        const units = [];

        for (const item of items)
        {
            // Sort through units and push information to the list
            const metadata = item.metadata[`${Constants.EXTENSIONID}/metadata`] as any;
            const initiative = item.metadata[`${Constants.EXTENSIONID}/metadata_initiative`] as any;
            const currenthp = item.metadata[`${Constants.EXTENSIONID}/metadata_currenthp`] as any;
            const unitPosition = item.position;

            if (metadata?.unitInfo)
            {
                const unit: UnitInfo = metadata.unitInfo;
                const unitImage = item as Image;
                const cHP = currenthp ? currenthp.currenthp : unit.maxHP;

                // This is a mess Im sorry me.
                units.push({
                    initiative: initiative.initiative,
                    unitinfo: unit,
                    currenthp: cHP,
                    position: unitPosition,
                    id: item.id,
                    dpi: unitImage.grid.dpi,
                    width: unitImage.image.width,
                    height: unitImage.image.height,
                    offsetx: unitImage.grid.offset.x,
                    offsety: unitImage.grid.offset.y
                });
            }

            // Get the turntracker and update the turn/rounds
            if (item.id == Constants.TURNTRACKER)
            {
                const trackContainer = item.metadata[`${Constants.EXTENSIONID}/metadata_trackeritem`] as any;
                const trackerItem: Tracker = trackContainer?.trackerItem;
                if (trackerItem)
                {
                    this.turnCounter = trackerItem.turn!;
                    this.roundCounter = trackerItem.round!;
                }
            }
        }

        // Sort so the highest initiative value is on top
        const sortedUnits = units.sort(
            (a, b) => b.initiative - a.initiative
        );

        //Clear the table
        while (tableElement.rows.length > 0)
        {
            tableElement.deleteRow(0);
        }
        //Rebuild the table in order
        for (const unitItems of sortedUnits)
        {
            let row = tableElement.insertRow(-1);
            let initCell = row.insertCell(0);
            let rollerCell = row.insertCell(1)
            let nameCell = row.insertCell(2);
            let hpCell = row.insertCell(3);
            let acCell = row.insertCell(4);
            let optionCell = row.insertCell(5);

            row.setAttribute("unit-id", unitItems.id);
            row.setAttribute("unit-xpos", unitItems.position.x.toString());
            row.setAttribute("unit-ypos", unitItems.position.y.toString());
            row.setAttribute("unit-dpi", unitItems.dpi.toString());
            row.setAttribute("unit-width", unitItems.width.toString());
            row.setAttribute("unit-height", unitItems.height.toString());
            row.setAttribute("unit-offsetx", unitItems.offsetx.toString());
            row.setAttribute("unit-offsety", unitItems.offsety.toString());

            const initiativeInput = document.createElement('input');
            initiativeInput.className = "InitiativeInput";
            initiativeInput.inputMode = "numeric";
            initiativeInput.value = unitItems.initiative;
            initiativeInput.id = `iI${unitItems.id}`;
            initiativeInput.size = 2;
            initiativeInput.min = "0";
            initiativeInput.max = "99";
            initiativeInput.maxLength = 2;

            const rollerButton = document.createElement('input');
            rollerButton.type = "image";
            rollerButton.title = "Roll this Unit's Iniative";
            rollerButton.id = `rB${unitItems.id}`;
            rollerButton.onclick = async function () 
            {
                initiativeInput.value = Math.floor(Math.random() * (20 - 1) + 1).toString();
            }
            rollerButton.src = "/dice.svg";
            rollerButton.height = 20;
            rollerButton.width = 20;

            const nameToggle = document.createElement('input');
            nameToggle.type = "button";
            nameToggle.value = unitItems.unitinfo.unitName;
            nameToggle.title = "Change between Player and Monster groups";
            nameToggle.id = `nT${unitItems.id}`;
            nameToggle.onclick = async function () 
            {
                if (nameToggle.className == "isMonster")
                {
                    console.log("Swapped to PLAYER");
                    nameToggle.value = unitItems.unitinfo.unitName;
                    nameToggle.className = "";
                }
                else
                {
                    console.log("Swapped to MONSTER");
                    nameToggle.value = `ʳ ${unitItems.unitinfo.unitName} ʴ`;
                    nameToggle.className = "isMonster";
                }
            }
            rollerButton.src = "/dice.svg";
            rollerButton.height = 20;
            rollerButton.width = 20;

            const heartInputMin = document.createElement('input');
            heartInputMin.className = "HealthInput";
            heartInputMin.inputMode = "numeric";
            heartInputMin.id = `cHP${unitItems.id}`;
            heartInputMin.value = unitItems.currenthp;
            heartInputMin.size = 4;
            heartInputMin.maxLength = 4;

            const triangleImg = document.createElement('input');
            triangleImg.type = "image";
            triangleImg.title = "View/Edit this Unit's Stats";
            triangleImg.id = `tB${unitItems.id}`;
            triangleImg.onclick = async function (e) 
            {
                const currentTarget = e.currentTarget as HTMLInputElement;
                await self.OpenSubMenu(currentTarget.id);
            }
            triangleImg.src = "/triangle.svg";
            triangleImg.height = 20;
            triangleImg.width = 20;

            initCell.appendChild(initiativeInput);
            rollerCell.appendChild(rollerButton);

            nameCell.appendChild(nameToggle);
            hpCell.appendChild(heartInputMin);
            hpCell.appendChild(document.createTextNode(` / `));
            hpCell.appendChild(document.createTextNode(unitItems.unitinfo.maxHP.toString()));
            acCell.appendChild(document.createTextNode(unitItems.unitinfo.armorClass.toString()));
            optionCell.appendChild(triangleImg);
        }

        console.log("Show turn selection");
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

                // This should update for player sides, also
                await this.SaveTracker();
            }

            if (table.rows[this.turnCounter])
            {
                const currentTurnRow = table.rows[this.turnCounter];
                currentTurnRow.className = "turnOutline";

                const counterHtml = document.getElementById("roundCount")!;
                counterHtml.innerText = `Round: ${this.roundCounter}`;

                let ctu: CurrentTurnUnit = LabelLogic.GetCTUFromRow(currentTurnRow);

                //Move the view
                await ViewportFunctions.CenterViewportOnImage(ctu);
            }
        }
    }

    /**Add Previous/Next Turn buttons */
    private AppendTurnButtons(): void
    {
        var self = this;
        //Get Turn Button Container
        const turnContainer = document.getElementById("turnContainer");

        //Create Turn Buttons
        const previousButton = document.createElement('input');
        previousButton.type = "button";
        previousButton.id = "previousButton";
        previousButton.value = "Previous"
        previousButton.className = "turnColor chalkBorder";
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
                await self.Save();
            }
        }

        const nextButton = document.createElement('input');
        nextButton.type = "button";
        nextButton.id = "nextButton";
        nextButton.value = "Next"
        nextButton.className = "turnColor chalkBorder";
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
                await self.Save();
            }
        }

        turnContainer?.appendChild(previousButton);
        turnContainer?.appendChild(nextButton);
    }

    /**Add Clear Data Button */
    private AppendResetButton(): void
    {
        var self = this;

        //Get Reset Container
        const resetContainer = document.getElementById("resetContainer")!;

        //Create Reset Button
        const restButton = document.createElement('input');
        restButton.type = "button";
        restButton.id = "resetButton";
        restButton.value = "Clear Data"
        restButton.title = "Clear all Data"
        restButton.onclick = async function () 
        {
            self.turnCounter = 1;
            self.roundCounter = 1;
            const counterHtml = document.getElementById("roundCount")!;
            counterHtml.innerText = `Round: ${self.roundCounter}`;

            await OBR.scene.items.deleteItems([Constants.LABEL]);

            await OBR.scene.items.updateItems((item) => item.metadata[`${Constants.EXTENSIONID}/metadata`] != undefined
                || item.id === Constants.TURNTRACKER
                || item.id === Constants.LABEL, (items) =>
            {
                for (let item of items)
                {
                    if (item.id == Constants.TURNTRACKER)
                    {
                        // Reset tracker to initial values
                        let trackerItem: Tracker = { turn: 1, round: 1 };
                        item.metadata[`${Constants.EXTENSIONID}/metadata_trackeritem`] = { trackerItem };
                    }
                    //else if (item.id == Constants.LABEL)
                    //{
                    // }
                    else
                    {
                        // Remove unit data from tokens
                        delete item.metadata[`${Constants.EXTENSIONID}/metadata`];
                        delete item.metadata[`${Constants.EXTENSIONID}/metadata_initiative`];
                        delete item.metadata[`${Constants.EXTENSIONID}/metadata_currenthp`];
                    }
                }
            });
        }
        resetContainer.appendChild(restButton);
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
        saveButton.className = "Icon";
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
        rollerButton.className = "Icon RollerButton";
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
                initElement.value = Math.floor(Math.random() * (20 - 1) + 1).toString();
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
            const currenthp = hpElement.value ? hpElement.value : null;

            if (!unitId || !initiative) return;

            await OBR.scene.items.updateItems(
                (item) => item.id === unitId,
                (items) =>
                {
                    for (let item of items)
                    {
                        item.metadata[`${Constants.EXTENSIONID}/metadata_initiative`] = { initiative };
                        item.metadata[`${Constants.EXTENSIONID}/metadata_currenthp`] = { currenthp };
                    }
                }

            );
        });
        await this.SaveTracker();
    }

    /** Save the turntracker information to an Item */
    private async SaveTracker(): Promise<void>
    {
        let trackerItem: Tracker = { turn: this.turnCounter, round: this.roundCounter };
        const saveItemExists = await OBR.scene.items.getItems([Constants.TURNTRACKER]);

        if (saveItemExists.length == 0) // There is no current save tracker item, Create one
        {
            const saveItem = buildShape().width(1).height(1).shapeType("CIRCLE").id(Constants.TURNTRACKER).visible(false).locked(true).build();
            saveItem.metadata[`${Constants.EXTENSIONID}/metadata_trackeritem`] = { trackerItem };
            saveItem.type = "SHAPE";
            await OBR.scene.items.addItems([saveItem]);
        }
        else
        {
            //Update the tracker item since it exists
            await OBR.scene.items.updateItems(
                (item) => item.id === Constants.TURNTRACKER,
                (items) =>
                {
                    for (let item of items)
                    {
                        item.metadata[`${Constants.EXTENSIONID}/metadata_trackeritem`] = { trackerItem };
                    }
                }
            );
        }
        await LabelLogic.UpdateLabel();
    }
}