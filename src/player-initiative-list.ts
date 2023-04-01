import OBR, { Image, Item } from "@owlbear-rodeo/sdk";
import { Constants } from "./constants";
import UnitInfo from "./unit-info";
import { ViewportFunctions } from "./viewport";
import { Tracker } from "./interfaces/turn-tracker-item";
import { CurrentTurnUnit } from "./interfaces/current-turn-unit";
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

        // Bind List to callback function
        OBR.scene.items.onChange(async (items: Item[]) =>
        {
            const filteredItems = items.filter((item) => item.metadata[`${Constants.EXTENSIONID}/metadata`] != undefined
                || item.id === Constants.TURNTRACKER)

            // Only refresh for things using Clash
            await this.RefreshList(filteredItems);
        });
    }

    /**Refresh the initiative list after updates */
    public async RefreshList(items: Item[]): Promise<void>
    {
        // Reference to initiative list
        const tableElement = <HTMLTableElement>document.querySelector("#unit-list")!;
        // Unit list
        const units = [];

        for (const item of items)
        {
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

        for (const unitItems of sortedUnits)
        {
            let row = tableElement.insertRow(-1);
            let initCell = row.insertCell(0);
            let nameCell = row.insertCell(1);

            row.setAttribute("unit-id", unitItems.id);
            row.setAttribute("unit-xpos", unitItems.position.x.toString());
            row.setAttribute("unit-ypos", unitItems.position.y.toString());
            row.setAttribute("unit-dpi", unitItems.dpi.toString());
            row.setAttribute("unit-width", unitItems.width.toString());
            row.setAttribute("unit-height", unitItems.height.toString());
            row.setAttribute("unit-offsetx", unitItems.offsetx.toString());
            row.setAttribute("unit-offsety", unitItems.offsety.toString());

            const heartInputMin = document.createElement('input');
            heartInputMin.className = "HealthInput";
            heartInputMin.inputMode = "numeric";
            heartInputMin.id = "cHP" + unitItems.id;
            heartInputMin.value = unitItems.currenthp;
            heartInputMin.size = 4;
            heartInputMin.maxLength = 4;

            if (unitItems.currenthp <= unitItems.unitinfo.maxHP / 4)
            {
                nameCell.className = "unitHarmed";
            }
            else if (unitItems.currenthp <= unitItems.unitinfo.maxHP / 2)
            {
                nameCell.className = "unitHurt";
            }
            else
            {
                nameCell.className = "unitHappy";
            }

            initCell.appendChild(document.createTextNode(unitItems.initiative));
            nameCell.appendChild(document.createTextNode(unitItems.unitinfo.unitName));
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

                let ctu: CurrentTurnUnit = LabelLogic.GetCTUFromRow(currentTurnRow);

                //Move the view
                await ViewportFunctions.CenterViewportOnImage(ctu);
            }
        }
    }
}