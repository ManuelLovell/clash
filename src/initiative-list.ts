import OBR, { buildShape } from "@owlbear-rodeo/sdk";
import { Constants } from "./constants";
import UnitInfo from './unit-info';
import Tracker from './turn-tracker-item';

export class InitiativeList
{
    roundCounter: number = 1;
    turnCounter: number = 1;

    /**Render the main initiatve list */
    public render(document: Document): void
    {
        document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
        <table id="initiative-list">
        <thead>
            <tr>
            <th style="width: 8%"><img class="Icon" title="Initiative" src="/queue.svg"></th>
            <th style="width: 50%">Name</th>
            <th style="width: 24%"><img class="Icon" title="Hit Points" src="/heart.svg"></th>
            <th style="width: 8%"><img class="Icon" title="Armor Class" src="/shield.svg"></th>
            <th style="width: 10%"><span id="saveButtonContainer"></span></th>
            </tr>
        </thead>
        <tbody id="unit-list"></tbody>
        </table>
        <div id="roundCounter" class="bottom"><span id="turnContainer"></span><span id="roundCount" class="centerish">Round: ${this.roundCounter}</span><span id="resetContainer" class="floatright"></span></div>
        `;

        this.AppendSaveOrderButton();
    }

    /**Refresh the initiative list after updates */
    public setupInitiativeList(element: HTMLTableElement): void
    {
        const renderList = async (items: any) =>
        {
            // Get the name and initiative of any item with
            // our initiative metadata
            const initiativeItems = [];
            for (const item of items)
            {
                const metadata = item.metadata[`${Constants.EXTENSIONID}/metadata`];
                const initiative = item.metadata[`${Constants.EXTENSIONID}/metadata_initiative`];
                const currenthp = item.metadata[`${Constants.EXTENSIONID}/metadata_currenthp`];
                const trackItem = item.metadata[`${Constants.EXTENSIONID}/metadata_trackeritem`];

                if (metadata?.unitInfo)
                {
                    let unit: UnitInfo = metadata.unitInfo;
                    const cHP = currenthp ? currenthp.currenthp : unit.maxHP;

                    initiativeItems.push({
                        initiative: initiative.initiative,
                        unitinfo: unit,
                        currenthp: cHP,
                        id: item.id,
                    });
                }

                if (trackItem?.trackerItem)
                {
                    this.turnCounter = trackItem.trackerItem.turn!;
                    this.roundCounter = trackItem.trackerItem.round!;
                }
            }

            // Sort so the highest initiative value is on top
            const sortedItems = initiativeItems.sort(
                (a, b) => b.initiative - a.initiative
            );

            //Clear the table
            while (element.rows.length > 0)
            {
                element.deleteRow(0);
            }

            for (const initiativeItem of sortedItems)
            {
                let row = element.insertRow(-1);
                let initCell = row.insertCell(0);
                let nameCell = row.insertCell(1);
                let hpCell = row.insertCell(2);
                let acCell = row.insertCell(3);
                let optionCell = row.insertCell(4);

                const initiativeInput = document.createElement('input');
                initiativeInput.className = "InitiativeInput";
                initiativeInput.inputMode = "numeric";
                initiativeInput.value = initiativeItem.initiative;
                initiativeInput.id = initiativeItem.id;
                initiativeInput.size = 2;
                initiativeInput.min = "0";
                initiativeInput.max = "99";
                initiativeInput.maxLength = 2;

                const heartInputMin = document.createElement('input');
                heartInputMin.className = "HealthInput";
                heartInputMin.inputMode = "numeric";
                heartInputMin.id = "cHP" + initiativeItem.id;
                heartInputMin.value = initiativeItem.currenthp;
                heartInputMin.size = 4;
                heartInputMin.maxLength = 4;

                const triangleImg = document.createElement('input');
                triangleImg.type = "image";
                triangleImg.title = "View/Edit this Unit's Stats";
                triangleImg.id = initiativeItem.id;
                triangleImg.onclick = function (e) 
                {
                    const currentTarget = e.currentTarget as HTMLInputElement;
                    openMini(currentTarget.id);
                }
                triangleImg.src = "/triangle.svg";
                triangleImg.height = 20;
                triangleImg.width = 20;

                initCell.appendChild(initiativeInput);

                nameCell.appendChild(document.createTextNode(initiativeItem.unitinfo.unitName));
                hpCell.appendChild(heartInputMin);
                hpCell.appendChild(document.createTextNode(` / `));
                hpCell.appendChild(document.createTextNode(initiativeItem.unitinfo.maxHP.toString()));
                acCell.appendChild(document.createTextNode(initiativeItem.unitinfo.armorClass.toString()));
                optionCell.appendChild(triangleImg);
            }

            console.log("Show turn selectino");
            this.ShowTurnSelection();
        };

        this.AppendTurnButtons();
        this.AppendResetButton();

        OBR.scene.items.onChange(renderList);
        // Save to force the onChange so the initial load will render the list.
        this.Save();

        //Calls the submenu
        function openMini(uid: string)
        {
            OBR.popover.open({
                id: Constants.EXTENSIONSUBMENUID,
                url: `/submenu/subindex.html?unitid=${uid}`,
                height: 700,
                width: 325,
                anchorPosition: { left: 625, top: 15 },
                anchorReference: "POSITION"
            });
        }
    }

    private ShowTurnSelection(): void
    {
        const table = <HTMLTableElement>document.getElementById("initiative-list");
        if (table.rows?.length > 1)
        {
            for (var i = 0, row; row = table.rows[i]; i++) 
            {
                row.classList.remove("turnOutline");
            }
            //console.log(`turn selection count is ${this.turnCounter}`);
            if (table.rows[this.turnCounter])
            {
                table.rows[this.turnCounter].className = "turnOutline";
                const counterHtml = document.getElementById("roundCount")!;
                counterHtml.innerText = `Round: ${this.roundCounter}`;
            }
        }
    }

    private AppendTurnButtons(): void
    {
        var self = this;
        //Get Reset Container
        const turnContainer = document.getElementById("turnContainer");

        //Create Turn Buttons
        const previousButton = document.createElement('input');
        previousButton.type = "button";
        previousButton.id = "previousButton";
        previousButton.value = "Previous"
        previousButton.className = "turnColor chalkBorder";
        previousButton.title = "Previous Turn"
        previousButton.onclick = function async() 
        {
            const table = <HTMLTableElement>document.getElementById("initiative-list");
            if (table.rows?.length > 1)
            {
                self.turnCounter--;
                //console.log(`turn count is ${self.turnCounter}`);
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
                self.Save();
            }
        }

        const nextButton = document.createElement('input');
        nextButton.type = "button";
        nextButton.id = "nextButton";
        nextButton.value = "Next"
        nextButton.className = "turnColor chalkBorder";
        nextButton.title = "Next Turn"
        nextButton.onclick = function async() 
        {
            const table = <HTMLTableElement>document.getElementById("initiative-list");
            if (table.rows?.length > 1)
            {
                self.turnCounter++;
                //console.log(`turn count is ${self.turnCounter}`);
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
                self.Save();
            }
        }

        turnContainer?.appendChild(previousButton);
        turnContainer?.appendChild(nextButton);
    }

    private AppendResetButton(): void
    {
        var self = this;

        //Get Reset Container
        const resetContainer = document.getElementById("resetContainer");

        //Create Reset Button
        const restButton = document.createElement('input');
        restButton.type = "button";
        restButton.id = "resetButton";
        restButton.value = "Clear Data"
        restButton.title = "Clear all Data"
        restButton.onclick = function async() 
        {

            self.turnCounter = 1;
            self.roundCounter = 1;
            const counterHtml = document.getElementById("roundCount")!;
            counterHtml.innerText = `Round: ${self.roundCounter}`;

            OBR.onReady(async () =>
            {
                await OBR.scene.items.updateItems((item) => item.metadata[`${Constants.EXTENSIONID}/metadata`] != undefined, (items) =>
                {
                    for (let item of items)
                    {
                        delete item.metadata[`${Constants.EXTENSIONID}/metadata`];
                        delete item.metadata[`${Constants.EXTENSIONID}/metadata_initiative`];
                        delete item.metadata[`${Constants.EXTENSIONID}/metadata_currenthp`];
                        delete item.metadata[`${Constants.EXTENSIONID}/metadata_trackeritem`];
                    }
                });
            });
        }
        resetContainer?.appendChild(restButton);
    }

    private AppendSaveOrderButton(): void
    {
        var self = this;
        //Get Button Container
        const buttonContainer = document.getElementById("saveButtonContainer");

        //Create Save Button
        const saveButton = document.createElement('input');
        saveButton.type = "image";
        saveButton.className = "Icon";
        saveButton.id = "saveButton";
        saveButton.onclick = function async() 
        {
            self.Save();
        }
        saveButton.src = "/save.svg";
        saveButton.title = "Save Changes";
        saveButton.height = 20;
        saveButton.width = 20;

        buttonContainer?.appendChild(saveButton);
    }

    private async Save(): Promise<void>
    {
        OBR.onReady(async () =>
        {
            let trackerItem: Tracker = { turn: this.turnCounter, round: this.roundCounter };

            const unitsInOrder = document.querySelectorAll(".InitiativeInput");
            unitsInOrder.forEach(async (unit) =>
            {
                const unitInput = unit as HTMLInputElement;
                const unitId = unitInput.id;
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
                            item.metadata[`${Constants.EXTENSIONID}/metadata_trackeritem`] = { trackerItem };
                        }
                    }
                );
            });
        });
    }
}