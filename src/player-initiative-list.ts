import OBR, { Metadata } from "@owlbear-rodeo/sdk";
import { Constants } from "./constants";
import { ViewportFunctions } from "./viewport";
import { IOBRTracker } from "./interfaces/turn-tracker-item";
import { ICurrentTurnUnit } from "./interfaces/current-turn-unit";
import { LabelLogic } from "./label-logic";

export class PlayerList
{
    roundCounter: number = 1;
    turnCounter: number = 1;
    disableFocus: boolean = false;

    /**Render the main initiatve list */
    public async Render(document: Document): Promise<void>
    {
        document.querySelector<HTMLDivElement>('#clash-main-body-app')!.innerHTML = `
            <table id="initiative-list">
            <thead>
                <tr>
                <th style="width: 20%"><img class="Icon" title="Initiative" src="/queue.svg"></th>
                <th style="width: 80%">Name</th>
                </tr>
            </thead>
            <tbody id="unit-list"></tbody>
            </table>
            <footer>
            <div id="roundCounter" class="playerBottom">
            <label class="switch" id="settingnoFocusContainer">
            <span class="slider round"></span>
            </label> No AutoFocus
            <span id="roundCount" class="playerCenterish">Round: ${this.roundCounter}</span>
            </div>
            </footer>
            `;

            var self = this;
            const container = document.getElementById(`settingnoFocusContainer`);
            const slider = document.createElement('input');
            slider.type = "checkbox";
            slider.value = String(this.disableFocus);
            slider.checked = this.disableFocus;
            slider.onclick = async function (element)
            {
                const target = element.target as HTMLInputElement;
                slider.value = String(target.checked);
                self.disableFocus = target.checked;
            }
            container?.insertBefore(slider, container.firstChild);
            
        OBR.scene.onMetadataChange((metadata) => this.RefreshList(metadata));

        const metadata = await OBR.scene.getMetadata();
        await this.RefreshList(metadata);
    }

    /**Refresh the initiative list after updates */
    public async RefreshList(metadata: Metadata): Promise<void>
    {
        const meta = metadata[`${Constants.EXTENSIONID}/metadata_trackeritem`] as any;
        const trackerData = meta.Tracker as IOBRTracker;

        if (!trackerData || !trackerData.units) return;
        
        // Reference to initiative list
        const tableElement = <HTMLTableElement>document.querySelector("#unit-list")!;

        if (trackerData.gmHideAll)
        {
            tableElement.innerHTML = "";
            return;
        }

        // Sort unts based on Reverse Setting or not
        const sortedUnits = trackerData.gmReverseList ? trackerData.units.sort((a, b) => a.initiative - b.initiative || a.name.localeCompare(b.name)!) 
        : trackerData.units.sort((a, b) => b.initiative - a.initiative || a.name.localeCompare(b.name)!);

        this.roundCounter = trackerData.round;
        this.turnCounter = trackerData.turn;
        //Clear the table
        while (tableElement.rows.length > 0)
        {
            tableElement.deleteRow(0);
        }

        for (const unitItems of sortedUnits)
        {
            let row = tableElement.insertRow(-1);
            let initCell = row.insertCell(0);
            let nameCell = row.insertCell(1);
            nameCell.style.textOverflow = "ellipsis";
            nameCell.style.overflow = "hidden";
            nameCell.style.whiteSpace = "nowrap";

            row.setAttribute("unit-id", unitItems.id);

            const heartInputMin = document.createElement('input');
            heartInputMin.className = "HealthInput";
            heartInputMin.inputMode = "numeric";
            heartInputMin.id = "cHP" + unitItems.id;
            heartInputMin.value = unitItems.cHp.toString();
            heartInputMin.size = 4;
            heartInputMin.maxLength = 4;

            // If the GM has the HP indicator turned off
            if (!trackerData.gmHideHp)
            {
                if (unitItems.cHp <= unitItems.mHp / 4)
                {
                    nameCell.className = "unitHarmed";
                }
                else if (unitItems.cHp <= unitItems.mHp / 2)
                {
                    nameCell.className = "unitHurt";
                }
                else
                {
                    nameCell.className = "unitHappy";
                }
            }

            initCell.appendChild(document.createTextNode(unitItems.initiative.toString()));
            initCell.style.width = "20%";
            nameCell.appendChild(document.createTextNode(unitItems.name));
            nameCell.style.width = "75%";

        }

        console.log("Show turn selection");
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

                let ctu: ICurrentTurnUnit = await LabelLogic.GetCTUFromRow(currentTurnRow);

                if (ctu.visible)
                {
                    //Move the view
                    if (!this.disableFocus)
                    {
                        await ViewportFunctions.CenterViewportOnImage(ctu);
                    }
                }
            }
        }
    }
}