import OBR, { Text, Item, Image, Label, buildLabel, buildText } from "@owlbear-rodeo/sdk";
import { Constants, SettingsConstants, UnitConstants } from "./../clashConstants";
import { ICurrentTurnUnit } from "./../interfaces/current-turn-unit";
import { Meta, Reta, GetImageBounds } from './bsUtilities';
import { BSCACHE } from "./bsSceneCache";
import { GMVIEW } from "../views/clashGMView";
import { PLVIEW } from "../views/clashPlayerView";

export class Labeler
{
    /**Creates/Updates the Label that says GO on the current turn unit; Utilizes OBR.ADDITEMS or OBR.UPDATEITEMS */
    static async UpdateLabel(): Promise<void>
    {
        const settingText = Reta(SettingsConstants.TURNTEXT) as string;
        const labelText = (settingText?.trim().length === 0 || settingText === undefined) ? "💡" : settingText;
        const disableLabel = Reta(SettingsConstants.DISABLELABEL) ? true : false;
        const currentUnit = BSCACHE.playerRole === "GM" ? GMVIEW.currentTurnUnit : PLVIEW.currentTurnUnit;
        const labelItemExists = await OBR.scene.local.getItems([Constants.LABEL]);

        await Labeler.CleanupHPBars();

        if (disableLabel || currentUnit === undefined)
        {
            if (labelItemExists)
            {
                await OBR.scene.local.deleteItems([Constants.LABEL]);
            }
        }
        else
        {

            if (labelItemExists.length === 0) // There is no current label item.
            {
                const label = buildLabel().fillColor("#ffffff").plainText(labelText).build();
                label.visible = false;
                label.type = "LABEL";
                label.id = Constants.LABEL;
                label.style = { backgroundColor: "#bb99ff", backgroundOpacity: .5, pointerDirection: "DOWN", pointerWidth: 15, pointerHeight: 15, cornerRadius: 10 };
                label.position = { x: currentUnit!.position.x, y: currentUnit!.position.y - 100 };
                label.visible = currentUnit!.visible ? true : false;
                label.text.plainText = label.visible ? labelText : labelText + "\r\n(Hidden)";
                label.attachedTo = currentUnit!.id;
                label.locked = true;
                await OBR.scene.local.addItems([label]);
            }
            else
            {
                await OBR.scene.local.updateItems(
                    (item: Item) => item.id == Constants.LABEL,
                    (items: Label[]) =>
                    {
                        const currentUnit = BSCACHE.playerRole === "GM" ? GMVIEW.currentTurnUnit : PLVIEW.currentTurnUnit;
                        for (let label of items)
                        {
                            label.position = { x: currentUnit!.position.x, y: currentUnit!.position.y - 100 };
                            label.visible = currentUnit!.visible ? true : false;
                            label.text.plainText = label.visible ? labelText : labelText + "\r\n(Hidden)";
                            label.attachedTo = currentUnit!.id;
                            label.locked = true;
                        }
                    }
                );
            }
        }
    }

    public static async CleanupHPBars(): Promise<void>
    {
        const existingBars = await OBR.scene.local.getItems(x => x.metadata[UnitConstants.HPBAR] === true);
        if (existingBars.length > 0)
        {
            const deleteThese: string[] = [];
            for (const bar of existingBars)
            {
                const parentStillExists = BSCACHE.sceneItems.some(item => item.id === bar.attachedTo);

                if (!parentStillExists)
                {
                    deleteThese.push(bar.id);
                }
            }
            if (deleteThese.length > 0)
            {
                await OBR.scene.local.deleteItems(deleteThese);
            }
        }
    }

    static async UpdateElevation(): Promise<void>
    {
        const activeUnits = BSCACHE.sceneItems.filter(unit => unit.metadata[UnitConstants.ONLIST] === true);
        const localItems = await OBR.scene.local.getItems(x => x.id.startsWith("ELE"));
        const localElevation = localItems.map(x => x.id);

        if (localItems.length > 0 || Reta(SettingsConstants.ELEVATEROW))
        {
            if (Reta(SettingsConstants.ELEVATEROW) === false) // Hide Elevation
            {
                if (localElevation.length > 0) await OBR.scene.local.deleteItems(localElevation);
            }
            else
            {
                await OBR.scene.local.deleteItems(localElevation);
                // Create bars for active units
                let newHeights: Text[] = [];
                for (const unit of activeUnits)
                {
                    const elevation = Labeler.GetElevation(unit);
                    if (elevation) newHeights.push(elevation);
                }

                //Update
                await OBR.scene.local.addItems(newHeights);
            }
        }
    }

    public static async UpdateHealthBars(): Promise<void>
    {
        // Find all Units who are active
        const activeUnits = BSCACHE.sceneItems.filter(unit => unit.metadata[UnitConstants.ONLIST] === true);

        // Flush any existing HP bars - Should be prepending with LBL
        const localItems = await OBR.scene.local.getItems(x => x.id.startsWith("LBL"));
        if (localItems.length > 0 || !Reta(SettingsConstants.HIDEHPBAR))
        {
            const localLabels = localItems.map(x => x.id);
            if (Reta(SettingsConstants.HIDEHPBAR) === true) // Hide Bars
            {
                if (localLabels.length > 0) await OBR.scene.local.deleteItems(localLabels);
            }
            else
            {
                await OBR.scene.local.deleteItems(localLabels);

                // Create bars for active units
                let newBars: Text[] = [];
                for (const unit of activeUnits)
                {
                    newBars.push(Labeler.GetHPBar(unit));
                }

                //Update
                await OBR.scene.local.addItems(newBars);
            }
        }

    }

    static GetElevation(unit: Item)
    {
        const unitImage = unit as Image;
        const bounds = GetImageBounds(unitImage, BSCACHE.gridDpi);
        const unitHeight = Meta(unit, UnitConstants.ELEVATION) ?? null;
        if (unitHeight === null || unitHeight === 0 || unitHeight === "0" || isNaN(unitHeight)) return;

        let indicator = "";
        if (Meta(unit, UnitConstants.ELEVATION) > 0) indicator = "🡹";
        else if (Meta(unit, UnitConstants.ELEVATION) < 0) indicator = "🡻";

        let positiveHeight = unitHeight < 0 ? -unitHeight : unitHeight;

        const elevationLabel = `${indicator}${positiveHeight}`;

        const label = buildText().plainText(elevationLabel).fontWeight(900).fillOpacity(.95).fillColor("white").strokeWidth(2).strokeColor("black").strokeOpacity(1).build();
        label.position = {
            x: bounds.min.x - 40,
            y: bounds.min.y
        };
        label.text.style.fontSize = 36;
        label.id = "ELE" + unit.id.slice(3);
        label.metadata[UnitConstants.ELEVATION] = true;
        label.metadata[UnitConstants.ID] = unit.id;
        label.type = "TEXT"; // Set Item Type
        label.attachedTo = unit.id; // Set Token Attached To
        label.visible = unit.visible ? true : false; // Set Visibility
        label.locked = true; // Set Lock, Don't want people to touch
        label.disableAttachmentBehavior = ["ROTATION", "SCALE"];
        label.text.style.fontFamily = "Segoe UI";
        label.text.type = "PLAIN";
        label.text.style.textAlign = "CENTER";

        return label;
    }

    static GetHPBar(unit: Item)
    {
        const unitImage = unit as Image;
        const bounds = GetImageBounds(unitImage, BSCACHE.gridDpi);

        const unitHealth = this.GetHealthInformation(unit);
        let label;
        if (Reta(SettingsConstants.HPBARNUMBERS) === true)
        {
            // Using NUMBERS
            label = buildText().plainText(unitHealth.health).fontWeight(900).fillOpacity(.95).fillColor(unitHealth.color).strokeWidth(2).strokeColor("black").strokeOpacity(1).build();
            label.position = {
                x: bounds.max.x - ((bounds.max.x - bounds.min.x) / 2) - 30,
                y: bounds.max.y - 55
            };
            label.text.style.fontSize = 36;
        }
        else
        {
            label = buildText().plainText(unitHealth.health).fontWeight(800).fillOpacity(.85).fillColor(unitHealth.color).strokeWidth(1).strokeColor("black").strokeOpacity(1).build();
            label.position = {
                x: bounds.max.x - ((bounds.max.x - bounds.min.x) / 2) - 85,
                y: bounds.max.y - 44
            };
            label.text.style.fontSize = 24;
        }
        label.id = "LBL" + unit.id.slice(3);
        label.metadata[UnitConstants.HPBAR] = true;
        label.metadata[UnitConstants.ID] = unit.id;
        label.type = "TEXT"; // Set Item Type
        label.attachedTo = unit.id; // Set Token Attached To
        label.visible = unit.visible ? true : false; // Set Visibility
        label.locked = true; // Set Lock, Don't want people to touch
        label.disableAttachmentBehavior = ["ROTATION", "SCALE"];
        label.text.style.fontFamily = "Segoe UI";
        label.text.type = "PLAIN";
        label.text.style.textAlign = "CENTER";

        return label;
    }

    private static GetHealthInformation(unit: Item): { health: string, color: string }
    {
        const cHp = Meta(unit, UnitConstants.CURRENTHP);
        const mHp = Meta(unit, UnitConstants.MAXHP);
        const tHp = Meta(unit, UnitConstants.TEMPHP);
        let healthBar = this.getHealthPercentageString(cHp, mHp);
        let tempHealthConvert = this.getTempHealthPercentageString(tHp, mHp, healthBar);
        return { color: this.getHealthColorString(cHp, mHp, tHp), health: tempHealthConvert };
    }

    private static getHealthPercentageString(currentHealth: number, maxHealth: number): string
    {
        const healthPercentage = (currentHealth / maxHealth) * 100;
        if (Reta(SettingsConstants.HPBARNUMBERS) === true)
        {
            return `${currentHealth}⫽${maxHealth}`;
        }

        switch (true)
        {
            case healthPercentage == 0:
                return '▱▱▱▱▱ 0%';
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

    private static getTempHealthPercentageString(tempHealth: number, maxHealth: number, healthBar: string): string
    {
        if (tempHealth > 0)
        {
            if (Reta(SettingsConstants.HPBARNUMBERS) === true)
            {
                return healthBar + `(${tempHealth})`;
            }
            const tempHealthPercent = (tempHealth / maxHealth) * 100;

            switch (true)
            {
                case tempHealthPercent == 0:
                    return '▱▱▱▱▱ 0%';
                case tempHealthPercent <= 20:
                    return '▮' + healthBar.substring(1);
                case tempHealthPercent <= 40:
                    return '▮▮' + healthBar.substring(2);
                case tempHealthPercent <= 60:
                    return '▮▮▮' + healthBar.substring(3);
                case tempHealthPercent <= 80:
                    return '▮▮▮▮' + healthBar.substring(4);
                default:
                    return '▮▮▮▮▮ 100%';
            }
        }
        return healthBar;
    }

    private static getHealthColorString(currentHealth: number, maxHealth: number, tempHealth: number): string
    {
        const healthPercentage = (currentHealth / maxHealth) * 100;

        switch (true)
        {
            case tempHealth > 0:
                return 'lightgrey';
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