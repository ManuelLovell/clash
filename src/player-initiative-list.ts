import OBR from "@owlbear-rodeo/sdk";
import { Constants } from "./constants";
import UnitInfo from "./unit-info";

export class PlayerList
{
    roundCounter: number = 1;
    turnCounter: number = 0;

    /**Render the main initiatve list */
    public render(document: Document): void
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
    }

    /**Refresh the initiative list after updates */
    public setupPlayerList(element: HTMLTableElement): void
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
                const trackItem = item.metadata[`${Constants.EXTENSIONID}/metadata_tracker`];

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

                const heartInputMin = document.createElement('input');
                heartInputMin.className = "HealthInput";
                heartInputMin.inputMode = "numeric";
                heartInputMin.id = "cHP" + initiativeItem.id;
                heartInputMin.value = initiativeItem.currenthp;
                heartInputMin.size = 4;
                heartInputMin.maxLength = 4;
                
                if (initiativeItem.currenthp <= initiativeItem.unitinfo.maxHP / 4)
                {
                    nameCell.className = "unitHarmed";
                }
                else if (initiativeItem.currenthp <= initiativeItem.unitinfo.maxHP / 2)
                {
                    nameCell.className = "unitHurt";
                }
                else
                {
                    nameCell.className = "unitHappy";
                }

                initCell.appendChild(document.createTextNode(initiativeItem.initiative));
                nameCell.appendChild(document.createTextNode(initiativeItem.unitinfo.unitName));
                this.ShowTurnSelection();
            }
        }

        OBR.scene.items.onChange(renderList);
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

            const totalRows = table.rows.length - 1;
            const currentTurn = (this.turnCounter % totalRows) + 1;
            table.rows[currentTurn].className = "turnOutline";

            this.roundCounter = Math.floor(this.turnCounter / totalRows) + 1;
            const counterHtml = document.getElementById("roundCount")!;
            counterHtml.innerText = `Round: ${this.roundCounter}`;
        }
    }
}