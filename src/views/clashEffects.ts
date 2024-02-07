import OBR from "@owlbear-rodeo/sdk";
import { Constants, SettingsConstants, UnitConstants } from "../clashConstants";
import '/src/css/effects-style.css'

OBR.onReady(async () =>
{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const idParam = urlParams.get('unitid')!;

    const units = await OBR.scene.items.getItems([idParam]);
    const scene = await OBR.scene.getMetadata();
    if (units.length > 0)
    {
        const table = document.getElementById('clashEffectsTableBody') as HTMLTableElement;
        const footer = document.getElementById('clashEffectsButtons') as HTMLDivElement;
        const effectData = units[0].metadata[UnitConstants.EFFECTS] as TurnEffect[];
        const currentRound = scene[SettingsConstants.ROUNDCOUNT] as number ?? 1;

        for (let i = 0; i < 5; i++)
        {
            SetupTableRows(table, i);
        }

        if (effectData?.length > 0)
        {
            for (let i = 0; i < effectData.length; i++)
            {
                const nameButton = document.getElementById(`nameInput_${i}`) as HTMLInputElement;
                const rndButton = document.getElementById(`roundInput_${i}`) as HTMLInputElement;
                const endButton = document.getElementById(`startInput_${i}`) as HTMLButtonElement;
                nameButton.value = effectData[i].Name;
                nameButton.disabled = true;
                nameButton.dataset.name = effectData[i].Name;
                rndButton.value = (effectData[i].EndingRound - currentRound).toString();
                rndButton.disabled = true;
                endButton.textContent = effectData[i].StartOfTurn;
                endButton.disabled = true;
            }
        }

        const saveButton = document.createElement('input');
        saveButton.type = "button";
        saveButton.id = "effectSaveButton";
        saveButton.value = "Save Effects"
        saveButton.classList.add("footer-button");
        saveButton.title = "Save all changes to effects"
        saveButton.onclick = async function () 
        {
            const saveThese: TurnEffect[] = [];
            for (let i = 0; i < 5; i++)
            {
                const nameButton = document.getElementById(`nameInput_${i}`) as HTMLInputElement;
                const rndButton = document.getElementById(`roundInput_${i}`) as HTMLInputElement;
                const endButton = document.getElementById(`startInput_${i}`) as HTMLButtonElement;
                if (nameButton && nameButton.value !== "")
                {
                    if (nameButton.disabled === true)
                    {
                        // If it's old data, dont change it. Add from the initial get
                        const oldData = effectData.find(effect => effect.Name === nameButton.value);
                        if (oldData) saveThese.push(oldData);
                    }
                    else
                    {
                        const newData: TurnEffect = {
                            Name: nameButton.value,
                            EndingRound: currentRound + (parseInt(rndButton.value) ?? 1),
                            Rounds: parseInt(rndButton.value) ?? 1,
                            StartOfTurn: endButton.textContent!
                        }
                        saveThese.push(newData);
                    }
                }
            }
            if (saveThese.length > 0)
            {
                await OBR.scene.items.updateItems([idParam], (items) =>
                {
                    for (const item of items)
                    {
                        item.metadata[UnitConstants.EFFECTS] = saveThese;
                    }
                });
            }
            else if (saveThese.length === 0 && effectData.length > 0)
            {
                await OBR.scene.items.updateItems([idParam], (items) =>
                {
                    for (const item of items)
                    {
                        item.metadata[UnitConstants.EFFECTS] = undefined;
                    }
                });
            }

            await OBR.popover.close(Constants.EXTENSIONEFFECTSID);
        }
        footer.appendChild(saveButton);
    }
    else
    {
        await OBR.popover.close(Constants.EXTENSIONEFFECTSID);
    }

    function SetupTableRows(table: HTMLTableElement, index: number)
    {
        // Create a new row
        const newRow = table.insertRow();

        // Add cells to the row
        const nameCell = newRow.insertCell();
        const numberCell = newRow.insertCell();
        const booleanCell = newRow.insertCell();
        const deleteCell = newRow.insertCell();

        // Create inputs for each cell
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.id = `nameInput_${index}`;
        nameInput.style.width = "120px";
        nameInput.style.height = "20px";
        nameCell.appendChild(nameInput);

        const roundInput = document.createElement('input');
        roundInput.type = 'number';
        roundInput.maxLength = 2;
        roundInput.width = 2;
        roundInput.style.width = "40px";
        roundInput.style.height = "20px";
        roundInput.id = `roundInput_${index}`;
        numberCell.appendChild(roundInput);

        const booleanInput = document.createElement('button');
        booleanInput.textContent = 'Start';
        booleanInput.style.width = "100%";
        booleanInput.style.cursor = "pointer";
        booleanInput.id = `startInput_${index}`;
        booleanInput.style.height = "100%";
        booleanInput.onclick = () =>
        {
            if (booleanInput.textContent === 'Start')
            {
                booleanInput.textContent = 'End';
            } else
            {
                booleanInput.textContent = 'Start';
            }
        };
        booleanCell.appendChild(booleanInput);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Clear';
        deleteButton.id = `clearButton_${index}`;
        deleteButton.style.height = "100%";
        deleteButton.style.cursor = "pointer";
        deleteButton.onclick = () =>
        {
            // Clear input values when delete button is clicked
            nameInput.value = '';
            nameInput.disabled = false;
            nameInput.dataset.name = '';
            roundInput.value = '';
            roundInput.disabled = false;
            // Reset boolean button to default
            booleanInput.textContent = 'Start';
            booleanInput.disabled = false;
        };
        deleteCell.appendChild(deleteButton);
    }
});