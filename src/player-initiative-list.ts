import OBR, { Metadata, Player } from "@owlbear-rodeo/sdk";
import { Constants } from "./constants";
import { ViewportFunctions } from "./viewport";
import { ICurrentTurnUnit } from "./interfaces/current-turn-unit";
import { LabelLogic } from "./label-logic";
import * as Utilities from "./utilities";

export class PlayerList
{
    roundCounter: number = 1;
    turnCounter: number = 1;
    enableAutoFocus: boolean = false;
    lastUpdate: string = "";
    playerId: string = "";
    playerColor: string = "";
    party: Player[] = [];
    rendered = false;

    /**Render the main initiatve list */
    public async Render(document: Document): Promise<void>
    {
        document.querySelector<HTMLDivElement>('#clash-main-body-app')!.innerHTML = `
            <table id="initiative-list">
            <thead>
                <tr>
                <th style="width: 10%"><img class="Icon" title="Initiative" src="/queue.svg"></th>
                <th style="width: 58%">Name</th>
                <th style="width: 24%"><img class="Icon" title="Hit Points" src="/heart.svg"></th>
                <th style="width: 8%"><img class="Icon" title="Armor Class" src="/shield.svg"></th>
                </tr>
            </thead>
            <tbody id="unit-list"></tbody>
            </table>
            <footer>
            <div id="roundCounter" class="playerBottom">
            <label class="switch" id="settingnoFocusContainer">
            <span class="slider round"></span>
            </label> AutoFocus
            <span id="roundCount" class="playerCenterish">Round: ${this.roundCounter}</span>
            </div>
            </footer>
            `;

        var self = this;
        const container = document.getElementById(`settingnoFocusContainer`);
        const slider = document.createElement('input');
        slider.type = "checkbox";
        slider.value = String(this.enableAutoFocus);
        slider.checked = this.enableAutoFocus;
        slider.onclick = async function (element)
        {
            const target = element.target as HTMLInputElement;
            slider.value = String(target.checked);
            self.enableAutoFocus = target.checked;
        }
        container?.insertBefore(slider, container.firstChild);

        this.playerId = await OBR.player.getId();
        this.playerColor = await OBR.player.getColor();

        this.party = await OBR.party.getPlayers();

        // Set theme accordingly
        const theme = await OBR.theme.getTheme();
        Utilities.SetThemeMode(theme, document);

        this.SetupListeners();

        const metadata = await OBR.scene.getMetadata();
        await this.RefreshList(metadata);
        this.rendered = true;
    }

    /**Refresh the initiative list after updates */
    public async RefreshList(metadata: Metadata): Promise<void>
    {
        const self = this;
        const meta = metadata[`${Constants.EXTENSIONID}/metadata_trackeritem`] as any;
        const trackerData = meta?.Tracker as IOBRTracker;

        if (!trackerData || !trackerData.units || trackerData.lastUpdate == this.lastUpdate) return;

        // Set a stamp so we know not to update twice.
        this.lastUpdate = trackerData.lastUpdate;

        // Reference to initiative list
        const tableElement = <HTMLTableElement>document.querySelector("#unit-list")!;

        if (trackerData.gmHideAll)
        {
            tableElement.innerHTML = "";
            return;
        }

        // Sort unts based on Reverse Setting or not
        const sortedUnits = trackerData.gmReverseList ? trackerData.units.sort((a, b) => a.initiative! - b.initiative! || a.name!.localeCompare(b.name!)!)
            : trackerData.units.sort((a, b) => b.initiative! - a.initiative! || a.name!.localeCompare(b.name!)!);

        this.roundCounter = trackerData.round;
        this.turnCounter = trackerData.turn;
        //Clear the table
        while (tableElement.rows.length > 0)
        {
            tableElement.deleteRow(0);
        }

        for (const unitItem of sortedUnits)
        {
            // Set the row
            let row = tableElement.insertRow(-1);

            // Check if player maintained
            if (unitItem.owner === this.playerId)
            {
                const alphaColor = Utilities.HexToRgba(this.playerColor, 0.4);
                row.setAttribute("unit-id", unitItem.id!);

                //Setup Initative Input
                let initCell = row.insertCell(0);
                initCell.style.placeContent = "center";

                const initiativeInput = document.createElement('input');
                initiativeInput.className = "InitiativeInput wide";
                initiativeInput.inputMode = "numeric";
                initiativeInput.value = unitItem.initiative!.toString();
                initiativeInput.id = `iI${unitItem.id}`;
                initiativeInput.size = 2;
                initiativeInput.min = "0";
                initiativeInput.max = "99";
                initiativeInput.maxLength = 2;
                initiativeInput.onblur = function (e: Event)
                {
                    const target = e.currentTarget as HTMLInputElement;
                    if (!target.value) return;
                    self.SendUpdate({
                        id: target.id.substring(2),
                        initiative: +target.value
                    })
                };
                initiativeInput.onkeydown = function (e)
                {
                    if (e.key !== "Enter") return;
                    const target = e.currentTarget as HTMLInputElement;
                    if (!target.value) return;
                    self.SendUpdate({
                        id: target.id.substring(2),
                        initiative: +target.value
                    })
                };

                //Setup Name Info
                let nameCell = row.insertCell(1);
                nameCell.style.placeContent = "center";
                nameCell.style.textOverflow = "ellipsis";
                nameCell.style.overflow = "hidden";
                nameCell.style.whiteSpace = "nowrap";
                nameCell.className = "nameToggleInput";
                nameCell.style.background = `linear-gradient(200deg, transparent, ${alphaColor})`;

                //Setup Health Inputs
                let hpCell = row.insertCell(2);
                const heartInputMin = document.createElement('input');
                heartInputMin.className = "HealthInput";
                heartInputMin.inputMode = "numeric";
                heartInputMin.id = `cHP${unitItem.id}`;
                heartInputMin.title = unitItem.cHp!.toString();
                heartInputMin.value = unitItem.cHp!.toString();
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

                    if (!target.value) return;

                    self.SendUpdate({
                        id: target.id.substring(3),
                        cHp: +target.value
                    });
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

                    if (!target.value) return;

                    self.SendUpdate({
                        id: target.id.substring(3),
                        cHp: +target.value
                    });
                }

                const heartInputMax = document.createElement('input');
                heartInputMax.className = "HealthInput";
                heartInputMax.inputMode = "numeric";
                heartInputMax.id = `mHP${unitItem.id}`;
                heartInputMax.value = unitItem.mHp!.toString();
                heartInputMax.size = 4;
                heartInputMax.maxLength = 4;
                heartInputMax.onblur = function (e)
                {
                    const target = e.currentTarget as HTMLInputElement;
                    if (!target.value) return;

                    self.SendUpdate({
                        id: target.id.substring(3),
                        mHp: +target.value
                    });
                };
                heartInputMax.onkeydown = function (e)
                {
                    if (e.key !== "Enter") return;

                    const target = e.currentTarget as HTMLInputElement;
                    if (!target.value) return;

                    self.SendUpdate({
                        id: target.id.substring(3),
                        mHp: +target.value
                    });
                };

                //Setup armor input
                let acCell = row.insertCell(3);
                const armorInput = document.createElement('input');
                armorInput.className = "ArmorInput";
                armorInput.inputMode = "numeric";
                armorInput.id = `aC${unitItem.id}`;
                armorInput.value = unitItem.aC!.toString();
                armorInput.size = 2;
                armorInput.maxLength = 2;
                armorInput.onblur = function (e)
                {
                    const target = e.currentTarget as HTMLInputElement;
                    if (!target.value) return;

                    self.SendUpdate({
                        id: target.id.substring(2),
                        aC: +target.value
                    });
                };
                armorInput.onkeydown = function (e)
                {
                    if (e.key !== "Enter") return;
                    
                    const target = e.currentTarget as HTMLInputElement;
                    if (!target.value) return;

                    self.SendUpdate({
                        id: target.id.substring(2),
                        aC: +target.value
                    });
                };

                // If the GM has the HP indicator turned off
                if (!trackerData.gmHideHp)
                {
                    if (unitItem.cHp! <= unitItem.mHp! / 4)
                    {
                        nameCell.className = nameCell.className + " unitHarmed";
                    }
                    else if (unitItem.cHp! <= unitItem.mHp! / 2)
                    {
                        nameCell.className = nameCell.className + " unitHurt";
                    }
                    else
                    {
                        nameCell.className = nameCell.className + " unitHappy";
                    }
                }

                //Append inputs
                initCell.appendChild(initiativeInput);
                initCell.style.width = "10%";
                nameCell.appendChild(document.createTextNode(unitItem.name!));
                nameCell.style.width = "58%";
                hpCell.appendChild(heartInputMin);
                hpCell.appendChild(document.createTextNode(`/`));
                hpCell.appendChild(heartInputMax);
                acCell.appendChild(armorInput);
                acCell.style.width = "8%";
            }
            else
            {
                if (unitItem.hidden)
                {
                    continue;
                }

                let initCell = row.insertCell(0);
                initCell.style.placeContent = "center";

                let nameCell = row.insertCell(1);
                nameCell.style.placeContent = "center";
                nameCell.style.textOverflow = "ellipsis";
                nameCell.style.overflow = "hidden";
                nameCell.style.whiteSpace = "nowrap";

                row.setAttribute("unit-id", unitItem.id!);

                const heartInputMin = document.createElement('input');
                heartInputMin.className = "HealthInput";
                heartInputMin.inputMode = "numeric";
                heartInputMin.id = "cHP" + unitItem.id;
                heartInputMin.value = unitItem.cHp!.toString();
                heartInputMin.size = 4;
                heartInputMin.maxLength = 4;

                // If the GM has the HP indicator turned off
                if (!trackerData.gmHideHp)
                {
                    if (unitItem.cHp! <= unitItem.mHp! / 4)
                    {
                        nameCell.className = "unitHarmed";
                    }
                    else if (unitItem.cHp! <= unitItem.mHp! / 2)
                    {
                        nameCell.className = "unitHurt";
                    }
                    else
                    {
                        nameCell.className = "unitHappy";
                    }
                }
                initCell.appendChild(document.createTextNode(unitItem.initiative!.toString()));
                initCell.style.width = "10%";
                nameCell.appendChild(document.createTextNode(unitItem.name!));
                nameCell.style.width = "58%";
            }
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
                if (currentTurnRow.innerHTML != '')
                {
                    currentTurnRow.className = "turnOutline";
    
                    const counterHtml = document.getElementById("roundCount")!;
                    counterHtml.innerText = `Round: ${this.roundCounter}`;
    
                    let ctu: ICurrentTurnUnit = await LabelLogic.GetCTUFromRow(currentTurnRow);
    
                    if (ctu.visible)
                    {
                        //Move the view
                        if (this.enableAutoFocus)
                        {
                            await ViewportFunctions.CenterViewportOnImage(ctu);
                        }
                    }
                }
            }
        }
    }

    private async SetupListeners(): Promise<void>
    {
        OBR.scene.onMetadataChange((metadata) => this.RefreshList(metadata));
        OBR.theme.onChange((theme) =>
        {
            Utilities.SetThemeMode(theme, document);
        });
        OBR.player.onChange((player) =>
        {
            this.playerColor = player.color;
        });
        OBR.party.onChange((party) =>
        {
            this.party = party;
        });
    }

    private async SendUpdate(PlayerUpdate: IUnitTrack): Promise<void>
    {
        PlayerUpdate.stamp = new Date().toISOString();
        const playerUpdateMeta: Metadata = {};
        playerUpdateMeta[`${Constants.EXTENSIONID}/metadata_playerItem`] = { PlayerUpdate };
        await OBR.player.setMetadata(playerUpdateMeta);
    }
}