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
            await self.Save();
            await self.FocusOnCurrentTurnUnit(table);
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
            await self.Save();
            await self.FocusOnCurrentTurnUnit(table);
        }
    }

    prevContainer?.appendChild(previousButton);
    nextContainer?.appendChild(nextButton);
}

export function AppendShowLogButton(document: Document): void
{
    const resetContainer = document.getElementById("resetContainer")!;
    
    const showLogButton = document.createElement('input');
    showLogButton.type = "button";
    showLogButton.id = "showLogButton";
    showLogButton.value = "Show Roll Log"
    showLogButton.title = "Show Roll Log"
    showLogButton.className = "tinyType";
    showLogButton.onclick = async function () 
    {
        const initiativeListContainer = document.getElementById("initiative-list")!;
        initiativeListContainer.hidden = true;
        
        const logContainer = document.getElementById("logContainer")!;
        logContainer.hidden = false;

        const initListFooterContainer = document.getElementById("initListFooterButtons")!;
        initListFooterContainer.hidden = true;
        
        const leaveLogContainer = document.getElementById("logButtonContainer")!;
        leaveLogContainer.hidden = false;
    }
    resetContainer.appendChild(showLogButton);
}

export function AppendLeaveLogButton(document: Document): void
{
    const leaveLogContainer = document.getElementById("logButtonContainer")!;

    const leaveLogButton = document.createElement('input');
    leaveLogButton.type = "button";
    leaveLogButton.id = "showLogButton";
    leaveLogButton.value = "Show Initiative List"
    leaveLogButton.title = "Show Initiative List"
    leaveLogButton.className = "chalkBorder";
    leaveLogButton.onclick = async function () 
    {
        const initiativeListContainer = document.getElementById("initiative-list")!;
        initiativeListContainer.hidden = false;
        
        const logContainer = document.getElementById("logContainer")!;
        logContainer.hidden = true;

        const initListFooterContainer = document.getElementById("initListFooterButtons")!;
        initListFooterContainer.hidden = false;
        
        const leaveLogContainer = document.getElementById("logButtonContainer")!;
        leaveLogContainer.hidden = true;
    }
    leaveLogContainer.appendChild(leaveLogButton);
}

/**Add Clear List Button */
export function AppendClearListButton(document: Document, list: InitiativeList): void
{
    var self = list;

    //Get Reset Container
    const resetContainer = document.getElementById("resetContainer")!;

    //Create Turn Reset Button
    const resetTurnButton = document.createElement('input');
    resetTurnButton.type = "button";
    resetTurnButton.id = "resetTurnButton";
    resetTurnButton.value = "Reset Round"
    resetTurnButton.title = "Reset Round"
    resetTurnButton.className = "tinyType";
    resetTurnButton.onclick = async function () 
    {
        self.turnCounter = 1;
        self.roundCounter = 1;
        const counterHtml = document.getElementById("roundCount")!;
        counterHtml.innerText = `Round: ${self.roundCounter}`;

        await db.Tracker.clear();
        await db.Tracker.add({ id: Constants.TURNTRACKER, currentRound: 1, currentTurn: 1 });

        await OBR.scene.items.deleteItems([Constants.LABEL]);
        await list.ShowTurnSelection();
        await list.Save();
    }
    resetContainer.appendChild(resetTurnButton);

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
            const toBeDeleted: string[] = [Constants.LABEL];
            counterHtml.innerText = `Round: ${self.roundCounter}`;

            await db.Tracker.clear();
            await db.Tracker.add({ id: Constants.TURNTRACKER, currentRound: 1, currentTurn: 1 });


            await OBR.scene.items.updateItems((item) => item.metadata[`${Constants.EXTENSIONID}/metadata_initiative`] != undefined
                || item.id === Constants.LABEL, (items) =>
            {
                for (let item of items)
                {
                    toBeDeleted.push(item.id + "_hpbar");
                    delete item.metadata[`${Constants.EXTENSIONID}/metadata_initiative`];
                    delete item.metadata[`${Constants.EXTENSIONID}/metadata_hpbar`];
                }
            });
            await db.ActiveEncounter.where({isActive: 1, sceneId: self.sceneId}).modify({ isActive: 0 }); 
            await OBR.scene.items.deleteItems(toBeDeleted);
            await list.Save();
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