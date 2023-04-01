import OBR, { Item, buildLabel } from "@owlbear-rodeo/sdk";
import { Constants } from "./constants";
import { CurrentTurnUnit } from "./interfaces/current-turn-unit";

export class LabelLogic
{
    /**Creates/Updates the Label that says GO on the current turn unit; Utilizes OBR.ADDITEMS or OBR.UPDATEITEMS */
    static async UpdateLabel(): Promise<void>
    {
        const labelItemExists = await OBR.scene.items.getItems([Constants.LABEL]);

        let foundRow = false;

        // Keep calls separate to minimize the amount of calls - Only one ADD or one UPDATE.
        if (labelItemExists.length == 0 || labelItemExists[0].id != Constants.LABEL) // There is no current label item.
        {
            const label = buildLabel().fillColor("#ffffff").plainText("« Go! »").build();
            label.visible = false;
            label.type = "LABEL";
            label.id = Constants.LABEL;
            label.style = { backgroundColor: "#A73335", backgroundOpacity: .5, pointerDirection: "UP", pointerWidth: 15, pointerHeight: 15, cornerRadius: 10 };
            const table = <HTMLTableElement>document.getElementById("initiative-list");
            if (table.rows?.length > 1)
            {
                for (var i = 0, row; row = table.rows[i]; i++) 
                {
                    if (row.className == "turnOutline")
                    {
                        console.log("Updating label");
                        const xpos = parseFloat(row.getAttribute("unit-xpos")!);
                        const ypos = parseFloat(row.getAttribute("unit-ypos")!);
                        label.position = { x: xpos, y: ypos + 50 };
                        label.visible = true;
                        label.attachedTo = row.getAttribute("unit-id")!;
                        foundRow = true;
                    }
                }
                if (!foundRow)
                {
                    label.visible = false;
                }
            }
            await OBR.scene.items.addItems([label]);
            console.log("Created label");
        }
        else
        {
            await OBR.scene.items.updateItems(
                (item: Item) => item.id == Constants.LABEL,
                (items) =>
                {
                    for (let label of items)
                    {
                        const table = <HTMLTableElement>document.getElementById("initiative-list");
                        if (table.rows?.length > 1)
                        {
                            for (var i = 0, row; row = table.rows[i]; i++) 
                            {
                                if (row.className == "turnOutline")
                                {
                                    console.log("Updating label");
                                    const xpos = parseFloat(row.getAttribute("unit-xpos")!);
                                    const ypos = parseFloat(row.getAttribute("unit-ypos")!);
                                    label.position = { x: xpos, y: ypos + 50 };
                                    label.visible = true;
                                    label.attachedTo = row.getAttribute("unit-id")!;
                                    foundRow = true;
                                }
                            }
                            if (!foundRow)
                            {
                                label.visible = false;
                            }
                        }
                    }
                }
            );
        }
    }

    /** Retrieve the CurrentTurnUnit from a Row, which holds its unit information between get calls */
    static GetCTUFromRow(currentTurnRow: HTMLTableRowElement): CurrentTurnUnit
    {
        let ctu: CurrentTurnUnit = {
            id: currentTurnRow.getAttribute("unit-id")!,
            xpos: parseFloat(currentTurnRow.getAttribute("unit-xpos")!),
            ypos: parseFloat(currentTurnRow.getAttribute("unit-ypos")!),
            dpi: parseFloat(currentTurnRow.getAttribute("unit-dpi")!),
            width: parseFloat(currentTurnRow.getAttribute("unit-width")!),
            height: parseFloat(currentTurnRow.getAttribute("unit-height")!),
            offsetx: parseFloat(currentTurnRow.getAttribute("unit-offsetx")!),
            offsety: parseFloat(currentTurnRow.getAttribute("unit-offsety")!)
        };

        return ctu;
    }
}