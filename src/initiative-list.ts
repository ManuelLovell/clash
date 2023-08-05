import OBR, { Metadata, Image, Text } from "@owlbear-rodeo/sdk";
import { Constants } from "./constants";
import { ViewportFunctions } from './viewport';
import { ICurrentTurnUnit } from './interfaces/current-turn-unit';
import { LabelLogic } from "./label-logic";
import { db } from './local-database';
import { IUnitInfo } from "./interfaces/unit-info";
import { liveQuery } from "dexie";  
import * as Buttons from "./initiative-list-buttons";
import UnitInfo from "./unit-info";
import * as Utilities from './utilities';

export class InitiativeList
{
    inSceneUnits: string[] = [];
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
    gmRumbleLog = false;
    gmTurnText = "";

    /**Render the main initiatve form from the GM perspective */
    public async RenderInitiativeList(document: Document): Promise<void>
    {        
        this.setupContextMenu(this);
        this.ShowSettingsMenu(false);
        this.ShowMainMenu(true);

        const mainContainer = document.querySelector<HTMLDivElement>('#clash-main-body-app')!;
        // Place base HTML and Containers
        mainContainer.innerHTML = `
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
        if (db.inMemory)
        {
            const warning: HTMLElement = document.createElement('div');
            warning.innerText = "Local Storage Disabled - Features Limited";
            warning.className = "noDatabase";
            mainContainer.prepend(warning);
        }

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
            this.gmRumbleLog = settingData.gmRumbleLog;
            this.gmTurnText = settingData.gmTurnText;
        }
        else
        {
            await db.Settings.add({ id: Constants.SETTINGSID, gmHideHp: false, gmHideAll: false, gmDisableLabel: false, gmTurnText: "", gmReverseList: false, gmRumbleLog: false, disableFocus: false });
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

        // Subscribe to scene-onready event to check for scene change
        OBR.scene.onReadyChange(async (ready) =>
        {
            if (ready)
            {
                await this.CheckIniativeList();
            }
        });

        // Set theme accordingly
        const theme = await OBR.theme.getTheme();
        Utilities.SetThemeMode(theme, document);
        OBR.theme.onChange((theme) =>
        {
            Utilities.SetThemeMode(theme, document);
        })

        // Subscribe to on-change to detect if a token was deleted
        OBR.scene.items.onChange(async (items) =>
        {
            // Get all units from activeencounter
            //const tableUnits = await db.ActiveEncounter.toCollection();
            //const activeUnits = (await tableUnits.toArray());

            // This feels expensive, on change happens on every key press
            items.forEach(async unit =>
            {
                const imageUnit = unit as Image;
                const unitName = imageUnit.text?.plainText || imageUnit.name;
                const tableUnit = this.activeUnits.find(x => x.id === imageUnit.id);
                if (tableUnit && tableUnit.unitName !== unitName)
                {
                    await db.ActiveEncounter.update(tableUnit.id, { unitName: unitName });
                }
                if (unit.metadata[`${Constants.EXTENSIONID}/metadata_initiative`] !== undefined && tableUnit?.isActive == 0)
                {
                    await db.ActiveEncounter.update(tableUnit.id, { isActive: 1 });
                }
            });

            let missingIds = this.activeUnits.filter(({ id: listId }) => !items.some(({ id: itemId }) => itemId === listId));
            missingIds.forEach(async unit =>
            {
                // Update will trigger Refreshlist, do not want to call directly
                await db.ActiveEncounter.update(unit.id, { isActive: 0 });
            });
        });

        // The purpose of these is to catch the Add/Remove from Owlbear-ContextMenu without OBRs listener
        let updateDb = liveQuery(async () => await db.ActiveEncounter.toArray());

        updateDb.subscribe({
            next: result => this.RefreshList(result),
            error: error => console.log("Error refreshing list: " + error)
        });

        this.CheckIniativeList();
    }

    private async CheckIniativeList(): Promise<void>
    {
        // Find all units in this scene with active initiative metadata
        const units = await OBR.scene.items.getItems((item) =>
            item.layer === "CHARACTER"
            && item.metadata[`${Constants.EXTENSIONID}/metadata_initiative`] !== undefined)

        let activeEncounterUnits: IUnitInfo[] = [];
        if (units.length > 0)
        {
            // Grab by the id
            this.inSceneUnits = units.map(unit => unit.id);

            // Get all units from ActiveEncounter table
            const tableUnits = await db.ActiveEncounter.toCollection();

            // Turn to Array
            activeEncounterUnits = await tableUnits.toArray();

            // Filter the resulting list by Scene Data to see if they belong
            this.activeUnits = activeEncounterUnits.filter(aUnits => this.inSceneUnits.includes(aUnits.id));

            // Reactivate Units as needed
            this.activeUnits.forEach(async unit =>
            {
                // Update will trigger Refreshlist, do not want to call directly
                await db.ActiveEncounter.update(unit.id, { isActive: 1 });
            });
        }

        this.RefreshList(activeEncounterUnits);
    }
    public async RefreshList(unitList: IUnitInfo[]): Promise<void>
    {
        // Reference to initiative list
        const tableElement = <HTMLTableElement>document.querySelector("#unit-list")!;

        // Reference to InitiativeList class
        const self = this;

        // Get all units from activeencounter
        //const tableUnits = await db.ActiveEncounter.toCollection();

        // Unit list
        const activatedUnits = unitList.filter(x => x.isActive == 1);

        // Filter the resulting list by Scene Data to see if they belong
        this.activeUnits = activatedUnits.filter(aUnits => this.inSceneUnits.includes(aUnits.id));

        // Sort unts based on Reverse Setting or not
        const sortedUnits = this.gmReverseList ? this.activeUnits.sort((a, b) => a.initiative - b.initiative || a.unitName.localeCompare(b.unitName)!)
            : this.activeUnits.sort((a, b) => b.initiative - a.initiative || a.unitName.localeCompare(b.unitName)!);

        //Clear the table
        while (tableElement?.rows.length > 0)
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
            nameToggle.style.width = "100%";
            nameToggle.style.textOverflow = "ellipsis";
            nameToggle.style.overflow = "hidden";

            nameToggle.className = unit.isMonster ? "isMonster nameToggleInput" : "nameToggleInput";
            nameToggle.onclick = async function ()
            {
                if (nameToggle.className == "isMonster nameToggleInput")
                {
                    nameToggle.value = unit.unitName;
                    nameToggle.className = "nameToggleInput";
                }
                else
                {
                    nameToggle.value = `ʳ ${unit.unitName} ʴ`;
                    nameToggle.className = "isMonster nameToggleInput";
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
                self.Save();
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
                self.Save();
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
            triangleImg.style.marginLeft = "5px";

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

        this.AttachFocusListeners();
        await this.ShowTurnSelection();
    }

    public AttachFocusListeners(): void
    {
        const table = document.getElementById('initiative-list');
        if (table)
        {
            table.addEventListener('dblclick', FocusUnit);
        }

        async function FocusUnit(event: MouseEvent): Promise<void>
        {
            event.preventDefault();
            
            const row = (event.target as HTMLElement).closest('tr') as HTMLTableRowElement;
            
            const ctu: ICurrentTurnUnit = await LabelLogic.GetCTUFromRow(row);

            await ViewportFunctions.CenterViewportOnImage(ctu);
            
        }
    }


    public async ShowTurnSelection(): Promise<void>
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
            const isMonster = (nameElement.className == "isMonster nameToggleInput");

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
        await this.CheckIniativeList();
        await this.UpdateTrackerForPlayers();
    }

    public async UpdateTrackerForPlayers()
    {
        const trackedUnits: IUnitTrack[] = [];
        const now = new Date().toISOString();
        const updateLabels: Text[] = [];
        //Find all hp bars

        const hpBarsToUpdate = await OBR.scene.items.getItems(((item) => item.id.endsWith("_hpbar")));

        hpBarsToUpdate.forEach(hpbar =>
        {
            const label = hpbar as Text;
            const unit = this.activeUnits.find(x => x.id === label.id.replace("_hpbar", ""));
            if (unit)
            {
                label.text.plainText = LabelLogic.getHealthPercentageString(unit.currentHP, unit.maxHP);
                label.text.style.fillColor = LabelLogic.getHealthColorString(unit.currentHP, unit.maxHP);
                updateLabels.push(label);
            }
        });
        await OBR.scene.items.addItems(updateLabels);

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

        const Tracker: IOBRTracker = {
            turn: this.turnCounter,
            round: this.roundCounter,
            units: trackedUnits,
            gmHideHp: this.gmHideHp,
            gmHideAll: this.gmHideAll,
            gmReverseList: this.gmReverseList,
            lastUpdate: now,
        };

        const trackerMeta: Metadata = {};
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
        const modalBuffer = 100;
        const mobile = window.innerWidth < Constants.MOBILEWIDTH;
        const windowHeight = window.outerHeight - 150; // Magic number to account for browser bars, can't access parent (CORS)
        const viewableHeight = windowHeight > 800 ? 700 : windowHeight - modalBuffer; // Using 100 as a buffer to account for padding.

        if (mobile)
        {
            await OBR.popover.open({
                id: Constants.EXTENSIONSUBMENUID,
                url: `/submenu/subindex.html?unitid=${unitId}`,
                height: viewableHeight,
                width: 325,
                hidePaper: true
            });
        }
        else
        {
            await OBR.modal.open({
                id: Constants.EXTENSIONSUBMENUID,
                url: `/submenu/subindex.html?unitid=${unitId}`,
                height: viewableHeight,
                width: 350,
            });
        }
    }

    private setupContextMenu(mainList: InitiativeList)
    {
        // Regex to match alphanumeric preceded by a space at end of string
        const alphanumericmatchex = /\s[\da-zA-Z]$/;

        // Disable info card for people who have localstorage turned off
        // It doesn't work for how the inmemory window is setup
        // Plus have the functionality is to save things
        if (!db.inMemory)
        {
            OBR.contextMenu.create({
                id: `${Constants.EXTENSIONID}/context-menu-sheet`,
                icons: [
                    {
                        icon: "/sheet.svg",
                        label: "[Clash!] View Info",
                        filter: {
                            max: 1,
                            every: [{ key: "layer", value: "CHARACTER" }],
                        },
                    },
                    {
                        icon: "/multi-sheet.svg",
                        label: "[Clash!] View Info",
                        filter: {
                            min: 2,
                            every: [{ key: "layer", value: "CHARACTER" }],
                        },
                    },
                ],
                async onClick(context, elementId: string)
                {
                    if (context.items.length == 1)
                    {

                        const unit = context.items[0] as Image;
                        const uName = unit.text?.plainText || unit.name;
                        const dbUnitInfo = await db.ActiveEncounter.get(unit.id);

                        if (!dbUnitInfo)
                        {
                            let unitInfo = new UnitInfo(unit.id, uName);

                            // If the base token matches something in Collection, use that information
                            if (alphanumericmatchex.test(uName))
                            {
                                const trimName = uName.slice(0, -2);
                                const inCollection = await db.Creatures.get({ unitName: trimName });
                                if (inCollection)
                                {
                                    unitInfo.SetToModel(inCollection);
                                }
                            }
                            else 
                            {
                                const inCollection = await db.Creatures.get({ unitName: uName });
                                if (inCollection)
                                {
                                    unitInfo.SetToModel(inCollection);
                                }
                            }

                            await unitInfo.SaveToDB();
                        }

                        const modalBuffer = 100;
                        const windowHeight = window.outerHeight - 150; // Magic number to account for browser bars, can't access parent (CORS)
                        const viewableHeight = windowHeight > 800 ? 700 : windowHeight - modalBuffer; // Using 100 as a buffer to account for padding.

                        await OBR.popover.open({
                            id: Constants.EXTENSIONSUBMENUID,
                            url: `/submenu/subindex.html?unitid=${unit.id}`,
                            height: viewableHeight,
                            width: 325,
                            anchorElementId: elementId,
                            hidePaper: true
                        });
                    }
                    else
                    {
                        // Go through the list and make sure everyone is in the DB first
                        context.items.forEach(async unit =>
                        {
                            const unitImage = unit as Image;
                            const uName = unitImage.text?.plainText || unitImage.name;

                            const dbUnitInfo = await db.ActiveEncounter.get(unit.id);

                            if (!dbUnitInfo)
                            {
                                let unitInfo = new UnitInfo(unit.id, uName);
                                // If the base token matches something in Collection, use that information
                                if (alphanumericmatchex.test(uName))
                                {
                                    const trimName = uName.slice(0, -2);
                                    const inCollection = await db.Creatures.get({ unitName: trimName });
                                    if (inCollection)
                                    {
                                        unitInfo.SetToModel(inCollection);
                                    }
                                }
                                else 
                                {
                                    const inCollection = await db.Creatures.get({ unitName: uName });
                                    if (inCollection)
                                    {
                                        unitInfo.SetToModel(inCollection);
                                    }
                                }
                                await unitInfo.SaveToDB();
                            }
                        });

                        //set up a lot of things
                        const unitIdString = context.items.map(item => item.id).toString();
                        const unitActiveStatus = context.items.map(item => item.metadata[`${Constants.EXTENSIONID}/metadata_initiative`] !== undefined).toString();

                        const modalBuffer = 100;
                        const windowHeight = window.outerHeight - 150; // Magic number to account for browser bars, can't access parent (CORS)
                        const viewableHeight = windowHeight > 800 ? 700 : windowHeight - modalBuffer; // Using 100 as a buffer to account for padding.

                        await OBR.popover.open({
                            id: Constants.EXTENSIONSUBMENUID,
                            url: `/submenu/subindex.html?unitid=${unitIdString}&unitactive=${unitActiveStatus}&multi=true`,
                            height: viewableHeight,
                            width: 325,
                            anchorElementId: elementId,
                            hidePaper: true
                        });
                    }
                }
            });
        }
        OBR.contextMenu.create({
            id: `${Constants.EXTENSIONID}/context-hp-menu`,
            icons: [{
                icon: "/health.svg",
                label: "[Clash!] Show HP Bar",
                filter: {
                    every: [
                        { key: "layer", value: "CHARACTER" },
                        { key: ["metadata", `${Constants.EXTENSIONID}/metadata_hpbar`], value: undefined },
                        { key: ["metadata", `${Constants.EXTENSIONID}/metadata_initiative`], value: undefined, operator: "!=" },

                    ],
                },
            },
            {
                icon: "/health-black.svg",
                label: "[Clash!] Hide HP Bar",
                filter: {
                    every: [{ key: "layer", value: "CHARACTER" },
                    { key: ["metadata", `${Constants.EXTENSIONID}/metadata_hpbar`], value: undefined, operator: "!=" },],
                },
            },],
            async onClick(context)
            {
                const showHPBars = context.items.every(
                    (item) => item.metadata[`${Constants.EXTENSIONID}/metadata_hpbar`] === undefined
                );
                if (showHPBars)
                {
                    const showHpBars = true;
                    const createBars: Text[] = [];
                    await OBR.scene.items.updateItems(context.items, (items) =>
                    {
                        for (let item of items)
                        {
                            const image = item as Image;
                            const activeUnit = mainList.activeUnits.find(x => x.id === item.id);
                            if (activeUnit)
                            {
                                item.metadata[`${Constants.EXTENSIONID}/metadata_hpbar`] = { showHpBars };
                                createBars.push(LabelLogic.UpdateHPBar(image, activeUnit.currentHP, activeUnit.maxHP));
                            }
                        }

                    });
                    await OBR.scene.items.addItems(createBars);
                }
                else
                {
                    const deleteBars = context.items.map(x => x.id + "_hpbar");
                    await OBR.scene.items.deleteItems(deleteBars);

                    OBR.scene.items.updateItems(context.items, (items) =>
                    {
                        for (let item of items)
                        {
                            delete item.metadata[`${Constants.EXTENSIONID}/metadata_hpbar`];
                        }
                    });
                }

            }
        });
        OBR.contextMenu.create({
            id: `${Constants.EXTENSIONID}/context-menu`,
            icons: [
                {
                    icon: "/addunit.svg",
                    label: "[Clash!] Add to Initiative",
                    filter: {
                        every: [
                            { key: "layer", value: "CHARACTER" },
                            { key: ["metadata", `${Constants.EXTENSIONID}/metadata_initiative`], value: undefined },
                        ],
                    },
                },
                {
                    icon: "/removeunit.svg",
                    label: "[Clash!] Remove from Initiative",
                    filter: {
                        every: [{ key: "layer", value: "CHARACTER" }],
                    },
                },
            ],
            async onClick(context)
            {
                const initiative = true;
                const addToInitiative = context.items.every(
                    (item) => item.metadata[`${Constants.EXTENSIONID}/metadata_initiative`] === undefined
                );

                //Convert items over to images to access Text fields
                const contextImages = context.items as Image[];

                let ids: { id: string; name: string; }[] = [];
                if (addToInitiative)
                {
                    //Add units to OBR metadata for contextmenu update
                    OBR.scene.items.updateItems(contextImages, (items) =>
                    {
                        for (let item of items)
                        {
                            //Add to ID list for DB update
                            ids.push({ id: item.id, name: item.text?.plainText || item.name });
                            item.metadata[`${Constants.EXTENSIONID}/metadata_initiative`] = { initiative };
                        }
                    });

                    ids.forEach(async item =>
                    {
                        //Check if unit is in our ActiveList (via menu Info Card), if not - activate and add
                        const checkUnit = await db.ActiveEncounter.get(item.id);
                        if (!checkUnit)
                        {
                            let unitInfo = new UnitInfo(item.id, item.name);
                            // If the base token matches something in Collection, use that information
                            if (alphanumericmatchex.test(item.name))
                            {
                                const trimName = item.name.slice(0, -2);
                                const inCollection = await db.Creatures.get({ unitName: trimName });
                                if (inCollection)
                                {
                                    unitInfo.SetToModel(inCollection);
                                }
                            }
                            else 
                            {
                                const inCollection = await db.Creatures.get({ unitName: item.name });
                                if (inCollection)
                                {
                                    unitInfo.SetToModel(inCollection);
                                }
                            }
                            unitInfo.isActive = 1;
                            unitInfo.SaveToDB();
                        }
                        else
                        {
                            //If not-active, but is in Active Encounters (menu info card) activate this unit
                            await db.ActiveEncounter.update(item.id, { isActive: 1 });
                        }
                        mainList.inSceneUnits.push(item.id); // For tracking scene state
                    });
                }
                else
                {
                    const deleteBars = context.items.map(x => x.id + "_hpbar");
                    await OBR.scene.items.deleteItems(deleteBars);

                    OBR.scene.items.updateItems(context.items, (items) =>
                    {
                        for (let item of items)
                        {
                            ids.push({ id: item.id, name: item.name });

                            delete item.metadata[`${Constants.EXTENSIONID}/metadata_initiative`];
                            delete item.metadata[`${Constants.EXTENSIONID}/metadata_hpbar`];
                        }
                    });

                    ids.forEach(async item =>
                    {
                        await db.ActiveEncounter.update(item.id, { isActive: 0 });
                        mainList.inSceneUnits = mainList.inSceneUnits.filter(id => id != item.id); // For tracking scene state
                    });
                }
            },
        });
    }
}