import OBR, { isImage, Image, Metadata } from "@owlbear-rodeo/sdk";
import { Constants, UnitConstants } from "../clashConstants";
import { db } from "../local-database";
import UnitInfo from "./../unitinfo/clashUnitInfo";
import { OpenSubMenu } from "./clashListButtons";

export function SetupContextMenu()
{
    OBR.contextMenu.create({
        id: `${Constants.EXTENSIONID}/context-menu`,
        icons: [
            {
                icon: "/addunit.svg",
                label: "[Clash!] Add to Initiative",
                filter: {
                    every: [{ key: ["metadata", UnitConstants.ONLIST], operator: "!=", value: true }],
                    some: [
                        { key: "layer", value: "CHARACTER", coordinator: "||" },
                        { key: "layer", value: "MOUNT" }],
                },
            },
            {
                icon: "/removeunit.svg",
                label: "[Clash!] Remove from Initiative",
                filter: {
                    every: [{ key: ["metadata", UnitConstants.ONLIST], operator: "==", value: true }],
                    some: [
                        { key: "layer", value: "CHARACTER", coordinator: "||" },
                        { key: "layer", value: "MOUNT" }],
                },
            },
        ],
        async onClick(context)
        {
            const removeFromInitiative = context.items.every(
                (item) => item.metadata[UnitConstants.ONLIST] === true
            );
            const contextImages = context.items.filter(item => isImage(item)) as Image[];

            if (removeFromInitiative)
            {
                const deleteBars = context.items.map(x => x.id + "_hpbar");
                await OBR.scene.items.deleteItems(deleteBars);

                await OBR.scene.items.updateItems(context.items, (items) =>
                {
                    for (let item of items)
                    {
                        delete item.metadata[UnitConstants.ONLIST];
                        delete item.metadata[UnitConstants.HPBAR];
                    }
                });
            }
            else
            {
                const metadataPack: Metadata[] = [];
                for (const item of contextImages)
                {
                    const itemName = item.text?.plainText || item.name;
                    if (item.metadata[UnitConstants.ID] !== undefined)
                    {
                        // If this is a unit with stats, but not in initiative - just slot them in.
                        const currentUnitMetadata: Metadata = {};
                        currentUnitMetadata[UnitConstants.ID] = item.id;
                        currentUnitMetadata[UnitConstants.ONLIST] = true;
                        metadataPack.push(currentUnitMetadata);
                        continue;
                    }
                    // Initialize Basic Metadata Stats on Token, then overwrite if we find a Match
                    // This ensures we have the base attributes no matter what
                    let unitInfo = new UnitInfo(item.id, itemName, item.createdUserId);

                    if (Constants.ALPHANUMERICTEXTMATCH.test(item.name))
                    {
                        // Trim any incrementers and try
                        const trimName = itemName.slice(0, -2);
                        const inCollection = await db.Creatures.get({ unitName: trimName });
                        if (inCollection)
                        {
                            unitInfo.SetToModel(inCollection);
                        }
                    }
                    else 
                    {
                        //Try with a normal name
                        const inCollection = await db.Creatures.get({ unitName: itemName });
                        if (inCollection)
                        {
                            unitInfo.SetToModel(inCollection);
                        }
                    }
                    const newData = unitInfo.GetMetadata();
                    newData[UnitConstants.ONLIST] = true;
                    metadataPack.push(newData);
                };

                await OBR.scene.items.updateItems(contextImages, (items) =>
                {
                    for (let item of items)
                    {
                        const mine = metadataPack.find(metadata => metadata[UnitConstants.ID] === item.id)
                        if (mine)
                        {
                            Object.assign(item.metadata, mine);
                        }
                    }
                });
            }
        }
    });

    OBR.contextMenu.create({
        id: `${Constants.EXTENSIONID}/context-menu-sheet`,
        icons: [
            {
                icon: "/sheet.svg",
                label: "[Clash!] View Info",
                filter: {
                    max: 1,
                    some: [
                        { key: "layer", value: "CHARACTER", coordinator: "||" },
                        { key: "layer", value: "MOUNT" }],
                },
            },
            {
                icon: "/multi-sheet.svg",
                label: "[Clash!] View Info",
                filter: {
                    min: 2,
                    some: [
                        { key: "layer", value: "CHARACTER", coordinator: "||" },
                        { key: "layer", value: "MOUNT" }],
                },
            },
        ],
        async onClick(context, elementId: string)
        {
            if (context.items.length == 1)
            {
                const metadataPack: Metadata[] = [];
                const unit = context.items[0] as Image;
                const uName = unit.text?.plainText || unit.name;

                // If there's no ID, make a blank stat block
                if (unit.metadata[UnitConstants.ID] === undefined)
                {
                    let unitInfo = new UnitInfo(unit.id, uName, unit.createdUserId);

                    if (Constants.ALPHANUMERICTEXTMATCH.test(unit.name))
                    {
                        // Trim any incrementers and try
                        const trimName = uName.slice(0, -2);
                        const inCollection = await db.Creatures.get({ unitName: trimName });
                        if (inCollection)
                        {
                            unitInfo.SetToModel(inCollection);
                        }
                    }
                    else 
                    {
                        //Try with a normal name
                        const inCollection = await db.Creatures.get({ unitName: uName });
                        if (inCollection)
                        {
                            unitInfo.SetToModel(inCollection);
                        }
                    }
                    const newData = unitInfo.GetMetadata();
                    metadataPack.push(newData);

                    await OBR.scene.items.updateItems([unit.id], (items) =>
                    {
                        for (let item of items)
                        {
                            const mine = metadataPack.find(metadata => metadata[UnitConstants.ID] === item.id)
                            if (mine)
                            {
                                Object.assign(item.metadata, mine);
                            }
                        }
                    });
                }

                await OpenSubMenu(unit.id, elementId);
            }
            else
            {
                const metadataPack: Metadata[] = [];
                // Go through the list and make sure everyone is in the DB first
                for (const item of context.items)
                {
                    const unit = item as Image;
                    const uName = unit.text?.plainText || unit.name;

                    // If there's no ID, make a blank stat block
                    if (unit.metadata[UnitConstants.ID] === undefined)
                    {
                        let unitInfo = new UnitInfo(unit.id, uName, unit.createdUserId);

                        if (Constants.ALPHANUMERICTEXTMATCH.test(unit.name))
                        {
                            // Trim any incrementers and try
                            const trimName = uName.slice(0, -2);
                            const inCollection = await db.Creatures.get({ unitName: trimName });
                            if (inCollection)
                            {
                                unitInfo.SetToModel(inCollection);
                            }
                        }
                        else 
                        {
                            //Try with a normal name
                            const inCollection = await db.Creatures.get({ unitName: uName });
                            if (inCollection)
                            {
                                unitInfo.SetToModel(inCollection);
                            }
                        }
                        const newData = unitInfo.GetMetadata();
                        metadataPack.push(newData);
                    }
                };

                await OBR.scene.items.updateItems(context.items, (items) =>
                {
                    for (let item of items)
                    {
                        const mine = metadataPack.find(metadata => metadata[UnitConstants.ID] === item.id)
                        if (mine)
                        {
                            Object.assign(item.metadata, mine);
                        }
                    }
                });

                const windowHeight = await OBR.viewport.getHeight();
                const modalBuffer = 100;
                const viewableHeight = windowHeight > 800 ? 700 : windowHeight - modalBuffer;

                await OBR.popover.open({
                    id: Constants.EXTENSIONSUBMENUID,
                    url: `/submenu/subindex.html?unitid=${context.items.map(item => item.id)}&multi=true`,
                    height: viewableHeight,
                    width: 350,
                    anchorElementId: elementId,
                    hidePaper: true
                });
            }
        }
    });
}