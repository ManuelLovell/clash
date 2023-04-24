import OBR from '@owlbear-rodeo/sdk';
import * as Settings from './settings-list';
import { InitiativeList } from './initiative-list';
import { db } from './local-database';
import { Constants } from './constants';


/** Add Save Button */
export function AppendSaveOrderButton(document: Document, list: InitiativeList): void
{
    var self = list;
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
export function AppendRollerButton(document: Document): void
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

/**Add Previous/Next Turn buttons */
export function AppendTurnButtons(document: Document, list: InitiativeList): void
{
    var self = list;
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

/**Add Clear List Button */
export function AppendClearListButton(document: Document, list: InitiativeList): void
{
    var self = list;

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
            await db.Tracker.add({ id: Constants.TURNTRACKER, currentRound: 1, currentTurn: 1 });
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

    //Create Settings button
    const settingsButton = document.createElement('input');
    settingsButton.type = "button";
    settingsButton.id = "settingsButton";
    settingsButton.value = "Settings"
    settingsButton.title = "View Settings"
    settingsButton.className = "tinyType";
    settingsButton.onclick = async function () 
    {
        self.ShowMainMenu(false);
        self.ShowSettingsMenu(true);
        Settings.RenderSettings(document, list);
    }
    resetContainer.appendChild(settingsButton);
}