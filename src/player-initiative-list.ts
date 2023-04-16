import OBR, { Metadata } from "@owlbear-rodeo/sdk";
import { Constants } from "./constants";
import { ViewportFunctions } from "./viewport";
import { Tracker } from "./interfaces/turn-tracker-item";
import { ICurrentTurnUnit } from "./interfaces/current-turn-unit";
import { LabelLogic } from "./label-logic";

export class PlayerList
{
    roundCounter: number = 1;
    turnCounter: number = 1;

    /**Render the main initiatve list */
    public async Render(document: Document): Promise<void>
    {
        document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
            <table id="initiative-list">
            <thead>
                <tr>
                <th style="width: 20%"><img class="Icon" title="Initiative" src="/queue.svg"></th>
                <th style="width: 80%">Name</th>
                </tr>
            </thead>
            <tbody id="unit-list"></tbody>
            </table>
            <div id="roundCounter" class="bottom"><span id="turnContainer"></span><span id="roundCount" class="centerish">Round: ${this.roundCounter}</span><span id="resetContainer" class="floatright"></span></div>
            `;

        OBR.scene.onMetadataChange((metadata) => this.RefreshList(metadata));
    }

    /**Refresh the initiative list after updates */
    public async RefreshList(metadata: Metadata): Promise<void>
    {
        const meta = metadata[`${Constants.EXTENSIONID}/metadata_trackeritem`] as any;
        const trackerData = meta.Tracker as Tracker;

        if (!trackerData || !trackerData.units) return;
        // Reference to initiative list
        const tableElement = <HTMLTableElement>document.querySelector("#unit-list")!;

        // Sort so the highest initiative value is on top
        const sortedUnits = trackerData.units.sort(
            (a, b) => b.initiative - a.initiative || a.name.localeCompare(b.name)!
        );

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

            row.setAttribute("unit-id", unitItems.id);

            const heartInputMin = document.createElement('input');
            heartInputMin.className = "HealthInput";
            heartInputMin.inputMode = "numeric";
            heartInputMin.id = "cHP" + unitItems.id;
            heartInputMin.value = unitItems.cHp.toString();
            heartInputMin.size = 4;
            heartInputMin.maxLength = 4;

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

            initCell.appendChild(document.createTextNode(unitItems.initiative.toString()));
            nameCell.appendChild(document.createTextNode(unitItems.name));
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
                    await ViewportFunctions.CenterViewportOnImage(ctu);
                }
            }
        }
    }
}