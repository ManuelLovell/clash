import OBR from "@owlbear-rodeo/sdk";
import { Constants } from "./constants";
import UnitInfo from './unit-info';
import { db } from './local-database';


export function setupContextMenu()
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
		async onClick(context)
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
            });
        }
    });

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
            
            // const unit = context.items[0];
            // const unitInfo = await db.ActiveEncounter.get(unit.id);
            
            // if (!unitInfo)
            // {
            //     let unitInfo = new UnitInfo(unit.id, unit.name);
            //     await unitInfo.SaveToDB();
            // }

            let ids: { id: string; name: string; }[] = [];
			if (addToInitiative)
			{
				OBR.scene.items.updateItems(context.items, (items) =>
				{
					for (let item of items)
					{
                        ids.push({id: item.id, name: item.name});
						item.metadata[`${Constants.EXTENSIONID}/metadata_initiative`] = { initiative };
					}
				});

                ids.forEach(async item => 
                {
                    const checkUnit = await db.ActiveEncounter.get(item.id);
                    if (!checkUnit)
                    {
                        let unitInfo = new UnitInfo(item.id, item.name);
                        unitInfo.isActive = 1;
                        unitInfo.SaveToDB();
                    }
                    else
                    {
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
                        ids.push({id: item.id, name: item.name});
                        
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