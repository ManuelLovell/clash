import OBR, { Item, Image, Label, buildLabel, buildText } from "@owlbear-rodeo/sdk";
import { Constants } from "./constants";
import { ICurrentTurnUnit } from "./interfaces/current-turn-unit";

export class LabelLogic
{
    /**Creates/Updates the Label that says GO on the current turn unit; Utilizes OBR.ADDITEMS or OBR.UPDATEITEMS */
    static async UpdateLabel(ctu: ICurrentTurnUnit, settingsText: string): Promise<void>
    {
        const labelItemExists = await OBR.scene.items.getItems([Constants.LABEL]);

        const labelText = settingsText ? settingsText : "« Go! »";
        let foundRow = false;

        // Keep calls separate to minimize the amount of calls - Only one ADD or one UPDATE.
        if (labelItemExists.length == 0 || labelItemExists[0].id != Constants.LABEL) // There is no current label item.
        {
            const label = buildLabel().fillColor("#ffffff").plainText(labelText).build();
            label.visible = false;
            label.type = "LABEL";
            label.id = Constants.LABEL;
            label.style = { backgroundColor: "#bb99ff", backgroundOpacity: .5, pointerDirection: "DOWN", pointerWidth: 15, pointerHeight: 15, cornerRadius: 10 };
            const table = <HTMLTableElement>document.getElementById("initiative-list");
            if (table.rows?.length > 1)
            {
                for (var i = 0, row; row = table.rows[i]; i++) 
                {
                    if (row.className == "turnOutline")
                    {

                        label.position = { x: ctu.xpos, y: ctu.ypos - 100 };
                        label.visible = ctu.visible ? true : false;
                        label.text.plainText = label.visible ? labelText : labelText + "\r\n(Hidden)";
                        label.attachedTo = ctu.id;
                        label.locked = true;
                        foundRow = true;
                    }
                }
                if (!foundRow)
                {
                    label.visible = false;
                }
            }
            await OBR.scene.items.addItems([label]);
        }
        else
        {
            await OBR.scene.items.updateItems(
                (item: Item) => item.id == Constants.LABEL,
                (items: Label[]) =>
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

                                    label.position = { x: ctu.xpos, y: ctu.ypos - 100 };
                                    label.visible = ctu.visible ? true : false;
                                    label.text.plainText = label.visible ? labelText : labelText + "\r\n(Hidden)";
                                    label.attachedTo = ctu.id;
                                    label.locked = true;
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

    static UpdateHPBar(image: Image, cHP: number, mHP: number)
    {
        const hpbarId = image.id + "_hpbar";

        const health = LabelLogic.getHealthPercentageString(cHP, mHP);
        const hColor = LabelLogic.getHealthColorString(cHP, mHP);

        const label = buildText().plainText(health).fontWeight(800).fillOpacity(.75).fillColor(hColor).strokeWidth(1).strokeColor("black").strokeOpacity(1).build();
        label.id = hpbarId;
        label.type = "TEXT"; // Set Item Type
        label.attachedTo = image.id; // Set Token Attached To
        label.visible = image.visible ? true : false; // Set Visibility
        label.locked = true; // Set Lock, Don't want people to touch
        label.position = {x: image.position.x - 85, y: image.position.y + 25};
        label.disableAttachmentBehavior = ["ROTATION", "SCALE"];
        label.text.style.fontFamily = "Segoe UI";
        label.text.style.fontSize = 24;
        label.text.type = "PLAIN";
        label.text.style.textAlign = "CENTER";

        return label;
    }

    static getHealthPercentageString(currentHealth: number, maxHealth: number): string
    {
        const healthPercentage = (currentHealth / maxHealth) * 100;

        switch (true)
        {
            case healthPercentage <= 20:
                return '▰▱▱▱▱ 20%';
            case healthPercentage <= 40:
                return '▰▰▱▱▱ 40%';
            case healthPercentage <= 60:
                return '▰▰▰▱▱ 60%';
            case healthPercentage <= 80:
                return '▰▰▰▰▱ 80%';
            default:
                return '▰▰▰▰▰ 100%';
        }
    }

    static getHealthColorString(currentHealth: number, maxHealth: number): string
    {
        const healthPercentage = (currentHealth / maxHealth) * 100;

        switch (true)
        {
            case healthPercentage <= 25:
                return 'red';
            case healthPercentage <= 50:
                return 'yellow';
            default:
                return 'white';
        }
    }

    /** Retrieve the CurrentTurnUnit from a Row, which holds its unit information between get calls */
    static async GetCTUFromRow(currentTurnRow: HTMLTableRowElement): Promise<ICurrentTurnUnit>
    {
        let ctu: ICurrentTurnUnit = {
            id: "",
            visible: false,
            xpos: 0,
            ypos: 0,
            dpi: 0,
            width: 0,
            height: 0,
            offsetx: 0,
            offsety: 0
        };
        const id = currentTurnRow.getAttribute("unit-id")!
        const items = await OBR.scene.items.getItems([id]);

        for (let item of items)
        {
            const image = item as Image;
            ctu = {
                id: image.id!,
                visible: image.visible,
                xpos: image.position.x,
                ypos: image.position.y,
                dpi: image.grid.dpi,
                width: image.image.width,
                height: image.image.height,
                offsetx: image.grid.offset.x,
                offsety: image.grid.offset.y
            };
        }
        return ctu;
    }
}