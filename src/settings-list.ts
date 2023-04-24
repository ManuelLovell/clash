import OBR from "@owlbear-rodeo/sdk";
import { Constants } from "./constants";
import { InitiativeList } from "./initiative-list";
import { db } from "./local-database";

export class SettingsData implements ISettingsData
{
    id: string;
    gmHideHp: boolean;
    gmHideAll: boolean;
    gmDisableLabel: boolean;
    disableFocus: boolean;

    constructor()
    {
        this.id = Constants.SETTINGSID;
        this.gmHideHp = false;
        this.gmHideAll = false;
        this.gmDisableLabel = false;
        this.disableFocus = false;
    }
}

export async function RenderSettings(document: Document, list: InitiativeList): Promise<void>
{
    var self = list;

    document.querySelector<HTMLDivElement>('#clash-main-body-settings')!.innerHTML = `
        <div id="settingsContainer">
        <h1>Settings</h1>
        <div><span id="clearAllContainer"></span>Clear All Data </div>
        </br>
        <div>${CreateSlider("hideHp")}</span>&emsp;Hide HP Indication from Players </div>
        </br>
        <div>${CreateSlider("hideAll")}</span>&emsp;Hide All from Players </div>
        </br>
        <div>${CreateSlider("noFocus")}</span>&emsp;Disable Camera Focus </div>
        </br>
        <div>${CreateSlider("noLabel")}</span>&emsp;Disable Go-Label </div>
        <footer><span class="returnFloatLeft" id="settingsReturnContainer"></span></footer>
        </div>
       `;

    SetCheckbox(document, "hideHp", list.gmHideHp, list);
    SetCheckbox(document, "hideAll", list.gmHideAll, list);
    SetCheckbox(document, "noFocus", list.gmDisableFocus, list);
    SetCheckbox(document, "noLabel", list.gmDisableLabel, list);

    const settingsReturnContainer = document.getElementById("settingsReturnContainer");

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
        if (confirm("Clear ALL saved Clash info? (This will wipe saved unit info)"))
        {
            self.turnCounter = 1;
            self.roundCounter = 1;
            const counterHtml = document.getElementById("roundCount")!;
            counterHtml.innerText = `Round: ${self.roundCounter}`;

            await db.ActiveEncounter.clear();
            await db.Tracker.clear();
            await db.Settings.clear();

            await db.Tracker.add({ id: Constants.TURNTRACKER, currentRound: 1, currentTurn: 1 });
            await db.Settings.add({ id: Constants.SETTINGSID, gmHideHp: false, gmHideAll: false, gmDisableLabel: false, disableFocus: false });

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
    clearAllContainer?.appendChild(resetButton);

    //Create Return Button
    const goBackButton = document.createElement('input');
    goBackButton.type = "button";
    goBackButton.id = "returnButton";
    goBackButton.className = "turnColor chalkBorder turnIndicator";
    goBackButton.title = "Go back to Initiative List"
    goBackButton.value = "Return"
    goBackButton.onclick = async function () 
    {
        await db.Settings.update(
            Constants.SETTINGSID,
            {
                gmHideHp: list.gmHideHp,
                gmHideAll: list.gmHideAll,
                gmDisableLabel: list.gmDisableLabel,
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
                default:
                    break;
            }
        };
        container?.insertBefore(slider, container.firstChild);
    }
}