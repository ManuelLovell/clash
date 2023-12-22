import OBR from "@owlbear-rodeo/sdk";
import * as Utilities from "./../utilities/bsUtilities";
import { Constants, SettingsConstants, UnitConstants } from "../clashConstants";
import { db } from "../local-database";
import UnitInfo from "../unitinfo/clashUnitInfo";
import { BSCACHE } from "../utilities/bsSceneCache";
import { GMVIEW } from "./clashGMView";
import { ShowMainMenu, ShowSettingsMenu } from "../buttons/clashListButtons";
import { Reta } from "../utilities/bsUtilities";

export async function RenderSettings(): Promise<void>
{
    Constants.MAINSETTINGS!.innerHTML = `
        <div id="settingsWindowContainer">
            <div class="settings-header">Settings - Data Management</div>
            <div class="settings-item">
                <div>
                    <span id="exportAllContainer"></span>
                    - Collection to Clash! JSON
                </div>
                <i><small>This will save Collection data to a Text/JSON file</small></i>
            </div>
            <div class="settings-item">
                <div>
                    <span id="importSubmitContainer">
                    <label id="importSubmitLabel" for="importSubmitButton">IMPORT</label></span>
                    - Clash! JSON to Collection
                </div>
                <div>
                    <span id="importAllContainer"></span>
                </div>
                <i><small>This will overwrite keys with the same Name/Author</small></i>
            </div>
            <div class="settings-item">
                <div>
                    <span id="clearAllContainer"></span>
                    - Clear All Clash! Collection Data 
                </div>
                <i><small>This will delete the database and start from scratch.</small></i>
            </div>
            <div class="settings-header">Initiative List</div>
                <div style="display:flex;">
                    <span id="resetClearContainer"></span>
                </div>
                <table>
                    <tr>
                        <td>
                            ${CreateSlider("HPROW")}
                            Health </div>
                        </td>
                        <td>
                            ${CreateSlider("TEMPHPROW")}
                            Temp Health </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            ${CreateSlider("ACROW")}
                            Armor </div>
                        </td>
                        <td>
                            ${CreateSlider("MOVEROW")}
                            Fastest Move </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            ${CreateSlider("ROLLERROW")}
                            Roller </div>
                        </td>
                        <td>
                            ${CreateSlider("BLOCKROW")}
                            Stat Block </div>
                        </td>
                    </tr>
                </table>
            <div class="settings-header">Gameplay</div>
            <div title="This disables the view from a player's perspective, so they cannot see any information on the Initiative List.">
                ${CreateSlider("HIDEALL")}
                Disable Player Initiative List
            </div>
            <div title="Ths will hide all information other than enemy Initiative for units they do not own.">
                ${CreateSlider("HIDEENEMYINFO")}
                Hide Enemy Information on Player Initiative List
            </div>
            <div title="This changes the color of a unit from White to Yellow to Red depending on how much HP they have left. 100% => 50% => 25%.">
                ${CreateSlider("HIDEHP")}
                Disable HP Colors on Player Initiative List 
            </div>
            <div title="This disables showing HP bars on each token in Initiative for you and your players.">
                ${CreateSlider("HIDEHPBAR")}
                Disable HP Bars on Tokens 
            </div>
            <div title="This swaps the HP on the bar to showing exact numbers instead of a percentage.">
                ${CreateSlider("HPBARNUMBERS")}
                Show HP Numbers instead of Bar 
            </div>
            <div title="This reverses the Initiative List turn order, so that lowest number goes first.">
                ${CreateSlider("REVERSELIST")}
                Reverse Initiative Order
            </div>
            <div title="This disables the auto-focus when current turn changes.">
                ${CreateSlider("DISABLEFOCUS")}
                Disable Camera Focus (For Self)
            </div>
            <div title="This removes the label applied to the token indicating it's their turn.">
                ${CreateSlider("DISABLELABEL")}
                Disable Turn Label
            </div>
                <span style="display:flex;">Turn Label <div id="turnLabelTextContainer" style="padding-left: 6px;"></div></span>
            <div class="settings-header">Dice</div>
            <div title="This enables the integration with Rumble! so that roll results are shown for all to see.">
                ${CreateSlider("RUMBLELOG")}
                Enable Rumble! Integratrion 
            </div>
            <div title="This enables the 3D dice window when rolling (To self only).">
                ${CreateSlider("VISUALDICE")}
                Enable 3D Dice Rolls (For Self)
            </div>
            <div title="This enables the dice notification showing the results at the top of the screen.">
                ${CreateSlider("DICENOTIFICATION")}
                Enable Dice Text Notification of Results 
            </div>
            <div title="This enables showing dice notifications to everyone.">
                ${CreateSlider("DICEEVERYONE")}
                Enable Showing Text Results to All
            </div>
            <footer>
                <span id="settingsReturnContainer"></span>
            </footer>
        </div>
       `;

    SetCheckbox("HIDEHP", Reta(SettingsConstants.HIDEHP) ? true : false);
    SetCheckbox("HIDEALL", Reta(SettingsConstants.HIDEALL) ? true : false);
    SetCheckbox("HIDEENEMYINFO", Reta(SettingsConstants.HIDEENEMYINFO) ? true : false);
    SetCheckbox("HIDEHPBAR", Reta(SettingsConstants.HIDEHPBAR) ? true : false);
    SetCheckbox("HPBARNUMBERS", Reta(SettingsConstants.HPBARNUMBERS) ? true : false);
    SetCheckbox("REVERSELIST", Reta(SettingsConstants.REVERSELIST) ? true : false);
    SetCheckbox("DISABLEFOCUS", Reta(SettingsConstants.DISABLEFOCUS) ? true : false);
    SetCheckbox("DISABLELABEL", Reta(SettingsConstants.DISABLELABEL) ? true : false);
    SetCheckbox("RUMBLELOG", Reta(SettingsConstants.RUMBLELOG) ? true : false);
    SetCheckbox("VISUALDICE", Reta(SettingsConstants.VISUALDICE) ? true : false);
    SetCheckbox("DICENOTIFICATION", Reta(SettingsConstants.DICENOTIFICATION) ? true : false);
    SetCheckbox("DICEEVERYONE", Reta(SettingsConstants.DICEEVERYONE) ? true : false);

    SetCheckbox("HPROW", Reta(SettingsConstants.HPROW) ?? true);
    SetCheckbox("TEMPHPROW", Reta(SettingsConstants.TEMPHPROW) ? true : false);
    SetCheckbox("ACROW", Reta(SettingsConstants.ACROW) ?? true);
    SetCheckbox("MOVEROW", Reta(SettingsConstants.MOVEROW) ? true : false);
    SetCheckbox("ROLLERROW", Reta(SettingsConstants.ROLLERROW) ?? true);
    SetCheckbox("BLOCKROW", Reta(SettingsConstants.BLOCKROW) ?? true);

    //Create TextLabel Input
    const turnLabelTextContainer = document.getElementById("turnLabelTextContainer");
    const textLabelButton = document.createElement('input');
    textLabelButton.type = "text";
    textLabelButton.id = "textLabelButton";
    textLabelButton.title = "Change your Turn Label's text"
    textLabelButton.placeholder = "Custom Turn Label";
    textLabelButton.maxLength = 20;
    textLabelButton.value = BSCACHE.roomMetadata[SettingsConstants.TURNTEXT] as string ?? "";
    textLabelButton.size = 20;
    textLabelButton.onblur = async (event: Event) =>
    {
        const target = event.currentTarget as HTMLInputElement;
        await OBR.room.setMetadata({ [SettingsConstants.TURNTEXT]: target.value });
    };
    turnLabelTextContainer?.appendChild(textLabelButton);

    //Create Import ALL Button
    const importAllContainer = document.getElementById("importAllContainer");

    const favBox = document.createElement('input');
    favBox.type = "checkbox";
    favBox.id = "favBox";
    favBox.title = "Unfavorite during Upload";

    const importSubmitContainer = document.getElementById("importSubmitContainer");
    const importSubmitButton = document.createElement('input');
    importSubmitButton.type = "file";
    importSubmitButton.style.display = "none";
    importSubmitButton.id = "importSubmitButton";
    importSubmitButton.onchange = async function () 
    {
        if (importSubmitButton.files && importSubmitButton.files.length > 0)
        {
            let file = importSubmitButton.files[0];
            let reader = new FileReader();

            reader.readAsText(file);

            reader.onload = async function ()
            {
                try
                {
                    const units: UnitInfo[] = JSON.parse(reader.result as string);
                    await UploadCollection(units);
                    OBR.notification.show("Import Complete!", "SUCCESS");
                    importSubmitButton.files = null;
                }
                catch (error) 
                {
                    await OBR.notification.show(`The import failed - ${error}`, "ERROR");
                    importSubmitButton.files = null;
                }
            };

            reader.onerror = function ()
            {
                console.log(reader.error);
                importSubmitButton.files = null;
            };
        }
    };

    importAllContainer?.appendChild(favBox);
    importAllContainer?.appendChild(document.createTextNode(`Unfavorite all items that are Imported`));
    importSubmitContainer?.appendChild(importSubmitButton);

    //Create Export ALL Button
    const exportAllContainer = document.getElementById("exportAllContainer");
    const exportButton = document.createElement('input');
    exportButton.type = "button";
    exportButton.classList.add("settings-input-button");
    exportButton.id = "exportButton";
    exportButton.value = "EXPORT"
    exportButton.title = "Export Clash Collection Data"
    exportButton.onclick = async function () 
    {
        await DownloadCollection();
    };
    exportAllContainer?.appendChild(exportButton);

    //Create Reset ALL Button
    const clearAllContainer = document.getElementById("clearAllContainer");
    const deleteButton = document.createElement('input');
    deleteButton.type = "button";
    deleteButton.classList.add("settings-input-button");
    deleteButton.id = "deleteButton";
    deleteButton.value = "DELETE"
    deleteButton.title = "Clear all Clash! Data"
    deleteButton.onclick = async function () 
    {
        if (confirm("Delete EVERYTHING? (Deletes Database and Refreshes Window)"))
        {
            GMVIEW.turnCounter = 1;
            GMVIEW.roundCounter = 1;
            GMVIEW.viewCounter!.innerText = `Round: ${GMVIEW.roundCounter}`;

            await OBR.scene.items.deleteItems([Constants.LABEL]);

            await OBR.scene.items.updateItems((item) => item.metadata[`${Constants.EXTENSIONID}/metadata_initiative`] != undefined
                || item.id === Constants.LABEL, (items) =>
            {
                for (let item of items)
                {
                    delete item.metadata[`${Constants.EXTENSIONID}/metadata_initiative`];
                }
            });

            await db.delete();
            window.location.reload();
        }
    };
    clearAllContainer?.appendChild(deleteButton);

    const settingsReturnContainer = document.getElementById("settingsReturnContainer");
    const goBackButton = document.createElement('input');
    goBackButton.type = "button";
    goBackButton.id = "returnButton";
    goBackButton.title = "Save and return to Initiative List"
    goBackButton.value = "Return"
    goBackButton.onclick = async function () 
    {
        ShowSettingsMenu(false);
        GMVIEW.RefreshList();
        ShowMainMenu(true);
    };
    settingsReturnContainer?.append(goBackButton);

    const resetClearContainer = document.getElementById("resetClearContainer");
    const resetTurnButton = document.createElement('input');
    resetTurnButton.type = "button";
    resetTurnButton.classList.add("settings-input-button");
    resetTurnButton.id = "resetTurnButton";
    resetTurnButton.value = "Reset Initiative List";
    resetTurnButton.title = "Reset"
    resetTurnButton.onclick = async function () 
    {
        GMVIEW.turnCounter = 0;
        GMVIEW.roundCounter = 1;
        const counterHtml = document.getElementById("roundCounter")!;
        counterHtml.innerText = `Round: ${GMVIEW.roundCounter}`;

        await OBR.scene.items.updateItems(BSCACHE.sceneItems.filter(item => Utilities.Meta(item, UnitConstants.ONLIST) === true).map(item => item.id), (items) =>
        {
            for (let item of items)
            {
                item.metadata[UnitConstants.INITIATIVE] = 1;
            }
        });
        await OBR.scene.setMetadata({
            [SettingsConstants.TURNCOUNT]: GMVIEW.turnCounter,
            [SettingsConstants.ROUNDCOUNT]: GMVIEW.roundCounter
        });

        GMVIEW.ShowTurnSelection();
    }
    resetClearContainer?.appendChild(resetTurnButton);

    const clearButton = document.createElement('input');
    clearButton.type = "button";
    clearButton.id = "clearButton";
    clearButton.classList.add("settings-input-button");
    clearButton.value = "Clear Initiative List";
    clearButton.title = "Clear"
    clearButton.onclick = async function () 
    {
        if (confirm("Clear the Initiative List (This will leave unit info)?"))
        {
            GMVIEW.turnCounter = 0;
            GMVIEW.roundCounter = 1;
            const counterHtml = document.getElementById("roundCounter")!;
            //const toBeDeleted: string[] = [Constants.LABEL];
            counterHtml.innerText = `Round: ${GMVIEW.roundCounter}`;

            const deleteBars = BSCACHE.sceneItems.map(x => x.id + "_hpbar");
            deleteBars.push(Constants.LABEL);
            await OBR.scene.items.deleteItems(deleteBars);

            await OBR.scene.items.updateItems(BSCACHE.sceneItems, (items) =>
            {
                for (let item of items)
                {
                    item.metadata[UnitConstants.INITIATIVE] = 1;
                    delete item.metadata[UnitConstants.ONLIST];
                    delete item.metadata[UnitConstants.HPBAR];
                }
            });
        }
    }
    resetClearContainer?.appendChild(clearButton);

    function CreateSlider(id: string): string
    {
        return `<label class="switch" id="setting${id}Container">
            <span class="slider round"></span>
            </label>`;
    };

    function SetCheckbox(id: string, setting: boolean)
    {
        const container = document.getElementById(`setting${id}Container`);
        const slider = document.createElement('input');
        slider.type = "checkbox";
        slider.value = String(setting);
        slider.checked = setting;
        slider.onclick = async function (element)
        {
            const target = element.target as HTMLInputElement;
            slider.value = String(target.checked);
            switch (id)
            {
                case "HIDEHP":
                    await OBR.room.setMetadata({ [SettingsConstants.HIDEHP]: target.checked });
                    break;
                case "HIDEALL":
                    await OBR.room.setMetadata({ [SettingsConstants.HIDEALL]: target.checked });
                    break;
                case "HIDEENEMYINFO":
                    await OBR.room.setMetadata({ [SettingsConstants.HIDEENEMYINFO]: target.checked });
                    break;
                case "HIDEHPBAR":
                    await OBR.room.setMetadata({ [SettingsConstants.HIDEHPBAR]: target.checked });
                    break;
                case "HPBARNUMBERS":
                    await OBR.room.setMetadata({ [SettingsConstants.HPBARNUMBERS]: target.checked });
                    break;
                case "DISABLEFOCUS":
                    await OBR.room.setMetadata({ [SettingsConstants.DISABLEFOCUS]: target.checked });
                    break;
                case "DISABLELABEL":
                    await OBR.room.setMetadata({ [SettingsConstants.DISABLELABEL]: target.checked });
                    break;
                case "REVERSELIST":
                    await OBR.room.setMetadata({ [SettingsConstants.REVERSELIST]: target.checked });
                    break;
                case "RUMBLELOG":
                    await OBR.room.setMetadata({ [SettingsConstants.RUMBLELOG]: target.checked });
                    break;
                case "VISUALDICE":
                    await OBR.room.setMetadata({ [SettingsConstants.VISUALDICE]: target.checked });
                    break;
                case "DICENOTIFICATION":
                    await OBR.room.setMetadata({ [SettingsConstants.DICENOTIFICATION]: target.checked });
                    break;
                case "DICEEVERYONE":
                    await OBR.room.setMetadata({ [SettingsConstants.DICEEVERYONE]: target.checked });
                    break;
                case "HPROW":
                    await OBR.room.setMetadata({ [SettingsConstants.HPROW]: target.checked });
                    break;
                case "ROLLERROW":
                    await OBR.room.setMetadata({ [SettingsConstants.ROLLERROW]: target.checked });
                    break;
                case "TEMPHPROW":
                    await OBR.room.setMetadata({ [SettingsConstants.TEMPHPROW]: target.checked });
                    break;
                case "ACROW":
                    await OBR.room.setMetadata({ [SettingsConstants.ACROW]: target.checked });
                    break;
                case "MOVEROW":
                    await OBR.room.setMetadata({ [SettingsConstants.MOVEROW]: target.checked });
                    break;
                case "BLOCKROW":
                    await OBR.room.setMetadata({ [SettingsConstants.BLOCKROW]: target.checked });
                    break;
                default:
                    break;
            }
        };
        container?.insertBefore(slider, container.firstChild);
    };

    async function DownloadCollection()
    {
        const content = await db.Creatures.toArray();

        var a = document.createElement("a");
        var file = new Blob([JSON.stringify(content)], { type: "text/plain" });
        a.href = URL.createObjectURL(file);
        a.download = `ClashCollectionExport-${Date.now()}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    async function UploadCollection(uploadedItem: UnitInfo[])
    {
        const database = await db.Creatures.toArray();
        let verifiedItems: UnitInfo[] = [];
        //Check DB for dupes to update and sign over Ids
        uploadedItem.forEach(unit =>
        {
            let defaultItem = new UnitInfo("", "Default");
            defaultItem.SetToModel(unit, !favBox.checked); // If its checked, we unfavorite
            defaultItem.tokenId = "";

            const foundMatch = database.find(data => data.unitName == unit.unitName && data.dataSlug == unit.dataSlug);
            if (foundMatch)
            {
                //If we have it, update it
                defaultItem.id = foundMatch.id;
            }
            else
            {
                //If we don't, new ID
                defaultItem.id = Utilities.GetGUID();
            }
            verifiedItems.push(defaultItem);
        });

        await db.Creatures.bulkPut(verifiedItems);
    }
}