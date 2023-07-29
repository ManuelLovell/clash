import OBR from "@owlbear-rodeo/sdk";
import { Constants } from "./constants";
import { InitiativeList } from "./initiative-list";
import { db } from "./local-database";
import UnitInfo from "./unit-info";
import * as Utilities from './utilities';

export class SettingsData implements ISettingsData
{
    id: string;
    gmHideHp: boolean;
    gmHideAll: boolean;
    gmDisableLabel: boolean;
    gmReverseList: boolean;
    gmTurnText: string;
    gmRumbleLog: boolean;
    disableFocus: boolean;

    constructor()
    {
        this.id = Constants.SETTINGSID;
        this.gmHideHp = false;
        this.gmHideAll = false;
        this.gmDisableLabel = false;
        this.gmReverseList = false;
        this.gmRumbleLog = false;
        this.disableFocus = false;
        this.gmTurnText = "";
    }
}

export async function RenderSettings(document: Document, list: InitiativeList): Promise<void>
{
    var self = list;
    const smallBreak = '<hr style="height:5px; margin-top: 4px; margin-bottom: 4px; visibility:hidden;" />';

    document.querySelector<HTMLDivElement>('#clash-main-body-settings')!.innerHTML = `
        <div id="settingsContainer">
        <h2 style="margin-top: 10px;">Settings</h2>
        <div><span id="exportAllContainer"></span>Export Collection Data </div>
        <i><small>This will save Collection data to a Text/JSON file</small></i>
        </br>
        ${smallBreak}
        <div><span id="importSubmitContainer"></span>Import Collection Data </div>
        <div><span id="importAllContainer"></span></div>
        <i><small>This will overwrite keys with the same Name/Author</small></i>
        </br>
        ${smallBreak}
        <div><span id="clearAllContainer"></span>Clear All Data </div>
        <i><small>This will delete the database.</small></i>
        </br>
        ${smallBreak}
        <div>${CreateSlider("hideHp")}</span>&emsp;Hide HP Indication from Players </div>
        ${smallBreak}
        <div>${CreateSlider("hideAll")}</span>&emsp;Hide All from Players </div>
        ${smallBreak}
        <div>${CreateSlider("reverseList")}</span>&emsp;Reverse Initiative </div>
        ${smallBreak}
        <div>${CreateSlider("noFocus")}</span>&emsp;Disable Camera Focus </div>
        ${smallBreak}
        <div>${CreateSlider("noLabel")}</span>&emsp;Disable Turn Label </div>
        <div id="turnLabelTextContainer">&emsp;&emsp;&emsp;&emsp;</div>
        ${smallBreak}
        <div>${CreateSlider("logToGM")}</span>&emsp;[Rumble!] Send Log to GM Only </div>
        <footer><span class="returnFloatLeft" id="settingsReturnContainer"></span></footer>
        </div>
       `;

    SetCheckbox(document, "hideHp", list.gmHideHp, list);
    SetCheckbox(document, "hideAll", list.gmHideAll, list);
    SetCheckbox(document, "reverseList", list.gmReverseList, list);
    SetCheckbox(document, "noFocus", list.gmDisableFocus, list);
    SetCheckbox(document, "noLabel", list.gmDisableLabel, list);
    SetCheckbox(document, "logToGM", list.gmRumbleLog, list);


    //Create TextLabel Input
    const turnLabelTextContainer = document.getElementById("turnLabelTextContainer");
    const textLabelButton = document.createElement('input');
    textLabelButton.type = "text";
    textLabelButton.id = "textLabelButton";
    textLabelButton.title = "Change your Turn Label's text"
    textLabelButton.placeholder = "« Go! »";
    textLabelButton.maxLength = 40;
    textLabelButton.value = list.gmTurnText ? list.gmTurnText : "";
    textLabelButton.size = 30;
    textLabelButton.className = "textInput";
    turnLabelTextContainer?.appendChild(textLabelButton);

    //Create Import ALL Button
    const importAllContainer = document.getElementById("importAllContainer");
    const importButton = document.createElement('input');
    importButton.type = "file";
    importButton.id = "importButton";
    importButton.title = "Choose a file to import"
    importButton.className = "tinyType";

    const favBox = document.createElement('input');
    favBox.type = "checkbox";
    favBox.id = "favBox";
    favBox.title = "Unfavorite during Upload";

    const importSubmitContainer = document.getElementById("importSubmitContainer");
    const importSubmitButton = document.createElement('input');
    importSubmitButton.type = "button";
    importSubmitButton.id = "importSubmitButton";
    importSubmitButton.value = "IMPORT DATA"
    importSubmitButton.title = "Import Clash Collection Data"
    importSubmitButton.className = "tinyType";
    importSubmitButton.onclick = async function () 
    {
        if (importButton.files && importButton.files.length > 0)
        {
            let file = importButton.files[0];
            let reader = new FileReader();

            reader.readAsText(file);

            reader.onload = async function ()
            {
                try
                {
                    const units: UnitInfo[] = JSON.parse(reader.result as string);
                    await UploadCollection(units);
                    OBR.notification.show("Import Complete!", "SUCCESS");
                }
                catch (error) 
                {
                    alert(`The import failed - ${error}`);
                }
            };

            reader.onerror = function ()
            {
                console.log(reader.error);
            };
        }
    }

    importAllContainer?.appendChild(favBox);
    importAllContainer?.appendChild(document.createTextNode(`Un-Favorite  ˣ  `));
    importAllContainer?.appendChild(importButton);
    importSubmitContainer?.appendChild(importSubmitButton);

    //Create Export ALL Button
    const exportAllContainer = document.getElementById("exportAllContainer");
    const exportButton = document.createElement('input');
    exportButton.type = "button";
    exportButton.id = "exportButton";
    exportButton.value = "EXPORT DATA"
    exportButton.title = "Export Clash Collection Data"
    exportButton.className = "tinyType";
    exportButton.onclick = async function () 
    {
        await DownloadCollection();
    }
    exportAllContainer?.appendChild(exportButton);

    //Create Reset ALL Button
    const clearAllContainer = document.getElementById("clearAllContainer");
    const resetButton = document.createElement('input');
    resetButton.type = "button";
    resetButton.id = "resetButton";
    resetButton.value = "DELETE DATA"
    resetButton.title = "Clear all Clash! Data"
    resetButton.className = "tinyType";
    resetButton.onclick = async function () 
    {
        if (confirm("Delete EVERYTHING? (Deletes Database and Refreshes Window)"))
        {
            self.turnCounter = 1;
            self.roundCounter = 1;
            const counterHtml = document.getElementById("roundCount")!;
            counterHtml.innerText = `Round: ${self.roundCounter}`;

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
    }
    clearAllContainer?.appendChild(resetButton);

    const settingsReturnContainer = document.getElementById("settingsReturnContainer");
    //Create Return Button
    const goBackButton = document.createElement('input');
    goBackButton.type = "button";
    goBackButton.id = "returnButton";
    goBackButton.className = "turnColor chalkBorder turnIndicator";
    goBackButton.title = "Save and return to Initiative List"
    goBackButton.value = "Return"
    goBackButton.onclick = async function () 
    {
        //Update list text
        list.gmTurnText = textLabelButton.value;

        await db.Settings.update(
            Constants.SETTINGSID,
            {
                gmHideHp: list.gmHideHp,
                gmHideAll: list.gmHideAll,
                gmDisableLabel: list.gmDisableLabel,
                gmReverseList: list.gmReverseList,
                gmTurnText: list.gmTurnText,
                gmRumbleLog: list.gmRumbleLog,
                disableFocus: list.gmDisableFocus,
            });
        if (list.gmDisableLabel)
        {
            OBR.scene.items.deleteItems([Constants.LABEL]);
        }
        self.ShowSettingsMenu(false);
        self.ShowMainMenu(true);
    };
    settingsReturnContainer?.append(goBackButton);

    function CreateSlider(id: string): string
    {
        return `<label class="switch" id="setting${id}Container">
            <span class="slider round"></span>
            </label>`;
    };

    function SetCheckbox(document: Document, id: string, setting: boolean, list: InitiativeList)
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
                case "hideHp":
                    list.gmHideHp = target.checked;
                    break;
                case "hideAll":
                    list.gmHideAll = target.checked;
                    break;
                case "noFocus":
                    list.gmDisableFocus = target.checked;
                    break;
                case "noLabel":
                    list.gmDisableLabel = target.checked;
                    break;
                case "reverseList":
                    list.gmReverseList = target.checked;
                    break;
                case "logToGM":
                    list.gmRumbleLog = target.checked;
                    break;
                default:
                    break;
            }
        };
        container?.insertBefore(slider, container.firstChild);
    }

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
        console.log("Import complete.");
    }
}