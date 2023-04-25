import OBR, { Image } from "@owlbear-rodeo/sdk";
import { Constants } from "./constants";
import UnitInfo from './unit-info';
import { db } from './local-database';


export function setupContextMenu()
{
    // Disable info card for people who have localstorage turned off
    // It doesn't work for how the inmemory window is setup
    // Plus have the functionality is to save things
    if (!db.inMemory)
    {
        OBR.contextMenu.create({
            id: `${Constants.EXTENSIONID}/context-menu-sheet`,
            icons: [
                {
                    icon: "/sheet.svg",
                    label: "[Clash!] View Info",
                    filter: {
                        max: 1,
                        every: [{ key: "layer", value: "CHARACTER" }],
                    },
                },
            ],
            async onClick(context, elementId: string)
            {
                const unit = context.items[0];
                const dbUnitInfo = await db.ActiveEncounter.get(unit.id);

                if (!dbUnitInfo)
                {
                    let unitInfo = new UnitInfo(unit.id, unit.name);
                    await unitInfo.SaveToDB();
                }

                await OBR.popover.open({
                    id: Constants.EXTENSIONSUBMENUID,
                    url: `/submenu/subindex.html?unitid=${unit.id}`,
                    height: 700,
                    width: 325,
                    anchorElementId: elementId
                });
            }
        });
    }
    OBR.contextMenu.create({
        id: `${Constants.EXTENSIONID}/context-menu`,
        icons: [
            {
                icon: "/addunit.svg",
                label: "[Clash!] Add to Initiative",
                filter: {
                    every: [
                        { key: "layer", value: "CHARACTER" },
                        { key: ["metadata", `${Constants.EXTENSIONID}/metadata_initiative`], value: undefined },
                    ],
                },
            },
            {
                icon: "/removeunit.svg",
                label: "[Clash!] Remove from Initiative",
                filter: {
                    every: [{ key: "layer", value: "CHARACTER" }],
                },
            },
        ],
        async onClick(context)
        {
            const initiative = true;
            const addToInitiative = context.items.every(
                (item) => item.metadata[`${Constants.EXTENSIONID}/metadata_initiative`] === undefined
            );
            
            //Convert items over to images to access Text fields
            const contextImages = context.items as Image[];

            let ids: { id: string; name: string; }[] = [];
            if (addToInitiative)
            {
                //Add units to OBR metadata for contextmenu update
                OBR.scene.items.updateItems(contextImages, (items) =>
                {
                    for (let item of items)
                    {
                        //Add to ID list for DB update
                        ids.push({ id: item.id, name: item.text.plainText || item.name });
                        item.metadata[`${Constants.EXTENSIONID}/metadata_initiative`] = { initiative };
                    }
                });

                ids.forEach(async item => 
                {
                    //Check if unit is in our ActiveList (via menu Info Card), if not - activate and add
                    const checkUnit = await db.ActiveEncounter.get(item.id);
                    if (!checkUnit)
                    {
                        let unitInfo = new UnitInfo(item.id, item.name);
                        unitInfo.isActive = 1;
                        unitInfo.SaveToDB();
                    }
                    else
                    {
                        //If not-active, but is in Active Encountres (menu info card) activate this unit
                        await db.ActiveEncounter.update(item.id, { isActive: 1 });
                    }
                });
            }
            else
            {
                OBR.scene.items.updateItems(context.items, (items) =>
                {
                    for (let item of items)
                    {
                        ids.push({ id: item.id, name: item.name });

                        delete item.metadata[`${Constants.EXTENSIONID}/metadata_initiative`];
                    }
                });

                ids.forEach(async item => 
                {
                    await db.ActiveEncounter.update(item.id, { isActive: 0 });
                });
            }
        },
    });
}