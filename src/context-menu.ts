import OBR from "@owlbear-rodeo/sdk";
import { Constants } from "./constants";
import UnitInfo from './unit-info';


export function setupContextMenu()
{
	OBR.contextMenu.create({
		id: `${Constants.EXTENSIONID}/context-menu`,
		icons: [
			{
				icon: "/addunit.svg",
				label: "Add to Initiative",
				filter: {
					every: [
						{ key: "layer", value: "CHARACTER" },
						{ key: ["metadata", `${Constants.EXTENSIONID}/metadata_initiative`], value: undefined },
					],
				},
			},
			{
				icon: "/removeunit.svg",
				label: "Remove from Initiative",
				filter: {
					every: [{ key: "layer", value: "CHARACTER" }],
				},
			},
		],
		onClick(context)
		{
			const addToInitiative = context.items.every(
				(item) => item.metadata[`${Constants.EXTENSIONID}/metadata_initiative`] === undefined
			);
			if (addToInitiative)
			{
				OBR.scene.items.updateItems(context.items, (items) =>
				{
					for (let item of items)
					{
                        let unitInfo = new UnitInfo(item.name);
                        let initiative = 1;
						item.metadata[`${Constants.EXTENSIONID}/metadata`] = { unitInfo	};
						item.metadata[`${Constants.EXTENSIONID}/metadata_initiative`] = { initiative };
					}
				});
			} else
			{
				OBR.scene.items.updateItems(context.items, (items) =>
				{
					for (let item of items)
					{
						delete item.metadata[`${Constants.EXTENSIONID}/metadata`];
						delete item.metadata[`${Constants.EXTENSIONID}/metadata_initiative`];
					}
				});
			}
		},
	});
}