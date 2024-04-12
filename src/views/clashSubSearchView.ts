import { Constants } from "../clashConstants";
import { IActionsEntity, IOpen5eMonsterListResponse, IOpen5eMonsterResponse } from "../interfaces/api-response-open5e";
import { db } from "../local-database";
import * as Utilities from "./../utilities/bsUtilities"
import UnitInfo from "../unitinfo/clashUnitInfo";
import { SUBVIEW } from "./clashSubView";
import { IUnitInfo } from "../interfaces/unit-info";
import { BuildUnitStatBlock } from './clashSubViewBuildBlock';

const favIcon = "♥";

export async function RenderSearchForm(): Promise<void>
{
    SUBVIEW.SUBSEARCHCARD.innerHTML = `
            <div id="searchResultsContainer"><ul id="monsterList"><div class="superCenter">No favorites to show.</div></ul></div>
           `;

    //Show favorites
    let favoriteSearch = await db.Creatures.filter(unit => unit.favorite == true).toArray();
    //Sort alphabetically
    favoriteSearch = favoriteSearch.sort((a, b) => a.unitName.localeCompare(b.unitName));

    if (favoriteSearch.length > 0)
    {
        const list = document.querySelector<HTMLDivElement>('#monsterList')!;
        let monsterInformationHtml = "";
        favoriteSearch.forEach((monster) =>
        {
            const fav = monster.favorite ? favIcon : "";
            const importCollection = document.createElement('input');
            importCollection.type = "button";
            importCollection.id = `${monster.id}`;
            importCollection.className = "collection-import-button-confirm"
            importCollection.value = "Import";
            importCollection.title = `Import ${monster.unitName} onto this Unit`;

            const removeCollection = document.createElement('input');
            removeCollection.type = "button";
            removeCollection.id = `del-${monster.id}`;
            removeCollection.className = "remove-collection-button-confirm";
            removeCollection.value = "⨉"
            removeCollection.title = `Remove ${monster.unitName} from Collection`;

            monsterInformationHtml += `<li id="listItem-${monster.id}" style="--tooltip-color:${Utilities.ColorName(monster.dataSlug)}" data-tag="🡆 from [Collection] User:${monster.dataSlug}">
            <div class='monster-name-list information' data-information='${TranslateCollectionToHelpText(monster)}'>${fav} ${Utilities.TruncateName(monster.unitName)}</div><div class="float-right">${removeCollection.outerHTML} ${importCollection.outerHTML}</div></li>`;
        });
        list.innerHTML = monsterInformationHtml;
        // Add collection buttons
        const collbBttns = document.querySelectorAll('.collection-import-button-confirm');
        collbBttns.forEach(btn =>
        {
            btn.addEventListener('click', async (e: Event) => await ImportCollectionMonsterInfo((e.currentTarget as Element).id));
        });

        // Add remove from collection buttons
        const removeBttns = document.querySelectorAll('.remove-collection-button-confirm');
        removeBttns.forEach(btn =>
        {
            btn.addEventListener('click', async (e: Event) => await DeleteCollectionMonsterInfo((e.currentTarget as Element).id));
        });
    }
}

export async function QueryMonsterDatabase()
{
    const list = document.querySelector<HTMLDivElement>('#monsterList')!;
    const searchValueButton = document.getElementById("searchValue") as HTMLInputElement;
    const collectionSearch = searchValueButton.value.toUpperCase() === "COLLECTION";

    list.innerHTML = `<div class="superCenter">Searching...</div>`;
    let monsterInformationHtml = "";

    if (!collectionSearch)
    {
        try
        {
            await fetch(`${Constants.OPEN5EAPI}${searchValueButton.value}`)
                .then(function (response)
                {
                    return response.json();
                }).then(function (data: IOpen5eMonsterListResponse)
                {
                    if (data.count > 0)
                    {
                        data.results.forEach((monster) =>
                        {
                            const importThis = document.createElement('input');
                            importThis.type = "button";
                            importThis.id = `${monster.slug}`;
                            importThis.classList.add("monster-import-button-confirm");
                            importThis.value = "Import";
                            importThis.title = `Import ${monster.name} onto this Unit`;

                            monsterInformationHtml += `<li style='--tooltip-color:${Utilities.ColorName(monster.document__slug)}' data-tag='🡆 from ${monster.document__slug}'>
                            <div class='monster-name-list information' data-information='${TranslateOpen5eToHelpText(monster)}'>${Utilities.TruncateName(monster.name)}</div>
                            <div class='float-right'>${importThis.outerHTML}</div></li>`;
                        });
                    }
                });
        } catch (error)
        {
            const importThis = document.createElement('input');
            importThis.type = "button";
            importThis.id = `open5eError`;
            importThis.classList.add("open-5e-error");
            importThis.value = "Import";
            importThis.title = `There was an error retrieving results from Open5e.com`;

            monsterInformationHtml += `<li><div class='monster-name-list information'>Error retrieving from Open5e, the service may be down. Please try again later. Only collection items will be shown.</div></li>`;
        }
    }

    const dexieSearch = collectionSearch ? await db.Creatures.toArray()
        : await db.Creatures.filter(unit => unit.unitName.toLowerCase().includes(searchValueButton.value.toLocaleLowerCase())).toArray();

    if (dexieSearch.length > 0)
    {
        dexieSearch.forEach((monster) =>
        {
            const fav = monster.favorite ? favIcon : "";
            const importCollection = document.createElement('input');
            importCollection.type = "button";
            importCollection.id = `${monster.id}`;
            importCollection.classList.add("collection-import-button-confirm");
            importCollection.value = "Import";
            importCollection.title = `Import ${monster.unitName} onto this Unit`;

            const removeCollection = document.createElement('input');
            removeCollection.type = "button";
            removeCollection.id = `del-${monster.id}`;
            removeCollection.className = "remove-collection-button-confirm";
            removeCollection.value = "⨉"
            removeCollection.title = `Remove ${monster.unitName} from Collection`;

            monsterInformationHtml += `<li id='listItem-${monster.id}' style='--tooltip-color:${Utilities.ColorName(monster.dataSlug)}' data-tag='🡆 from [Collection] User:${monster.dataSlug}'>
            <div class='monster-name-list information' data-information='${TranslateCollectionToHelpText(monster)}'>${fav} ${Utilities.TruncateName(monster.unitName)}</div>
            <div class='float-right'>${removeCollection.outerHTML} ${importCollection.outerHTML}</div></li>`;
        });
    }

    //If we have HTML, set up the buttons
    if (monsterInformationHtml != "Searching...")
    {
        list.innerHTML = monsterInformationHtml;
        // Add open 5e buttons
        const btns = document.querySelectorAll('.monster-import-button-confirm');
        btns.forEach(btn =>
        {
            btn.addEventListener('click', async (e: Event) => await ImportNewMonsterInfo((e.currentTarget as Element).id));
        });

        // Add collection buttons
        const collbBttns = document.querySelectorAll('.collection-import-button-confirm');
        collbBttns.forEach(btn =>
        {
            btn.addEventListener('click', async (e: Event) => await ImportCollectionMonsterInfo((e.currentTarget as Element).id));
        });

        // Add remove from collection buttons
        const removeBttns = document.querySelectorAll('.remove-collection-button-confirm');
        removeBttns.forEach(btn =>
        {
            btn.addEventListener('click', async (e: Event) => await DeleteCollectionMonsterInfo((e.currentTarget as Element).id));
        });
    }
    else
    {
        // Otherwise no results found
        list.innerHTML = "<div class='Nothing'>No results found.</div>";
    }
}

export async function ImportCollectionMonsterInfo(id: string): Promise<void>
{
    const unit = await db.Creatures.get(id);
    if (unit)
    {
        SUBVIEW.freshImport = true;
        SUBVIEW.currentUnit.SetToModel(unit);
        BuildUnitStatBlock(SUBVIEW.currentUnit);
    }
}

export async function DeleteCollectionMonsterInfo(id: string): Promise<void>
{
    // Syntax is 'del-[monsterid]'
    const cleanedId = id.substring(4);
    await db.Creatures.delete(cleanedId);
    let node = document.getElementById(`listItem-${cleanedId}`);
    node?.remove();
}

export async function ImportNewMonsterInfo(slug: string): Promise<void>
{
    await fetch(`https://api.open5e.com/monsters/${slug}/?format=json`)
        .then(function (response)
        {
            //Parse the data into a usable state
            return response.json();
        }).then(async function (data)
        {
            let importUnit = new UnitInfo(SUBVIEW.POPOVERSUBMENUID);

            const list = document.querySelector<HTMLDivElement>('#monsterList')!;
            list.innerHTML = `<div class="superCenter">Loading...</div>`;
            await importUnit.ImportOpen5eResponse(data);
            importUnit.isActive = SUBVIEW.currentUnit.isActive;
            importUnit.currentHP = importUnit.maxHP;
            SUBVIEW.freshImport = true;

            SUBVIEW.currentUnit = importUnit;
            BuildUnitStatBlock(SUBVIEW.currentUnit);
        });
}

function TranslateOpen5eToHelpText(item: IOpen5eMonsterResponse)
{
    const template =
        `↳ SIZE: ${item.size} | TYPE: ${item.type} | GROUP: ${item.group ?? "None"}
    ALIGN: ${item.alignment} | CR: ${item.challenge_rating}
    LANG: ${item.languages}
    HP: ${item.hit_points} | STR: ${item.strength} | DEX: ${item.dexterity} | CON: ${item.constitution}
    AC: ${item.armor_class} |  INT: ${item.intelligence} | WIS: ${item.wisdom} | CHA: ${item.charisma}
    PERCEPTION:${item.perception} | SENSE:${item.senses}
    PLACES: ${item.environments.length > 0 ? item.environments.join(", ") : "None listed"}
    
    ${FormatActions(item.actions)}
    
    Document Title: 5e Core Rules`;
    return template.replace(/[‘’‚‛‹›']/g, ""); // Escape all versions of apostrophes coming back.
}

function TranslateCollectionToHelpText(item: IUnitInfo)
{
    const template =
        `↳ SIZE: ${item.unitSize} | TYPE: ${item.unitType}
    ALIGN: ${item.alignment} | CR: ${item.challengeRating}
    LANG: ${item.languages}
    HP: ${item.maxHP} | STR: ${item.strScore} | DEX: ${item.dexScore} | CON: ${item.conScore}
    AC: ${item.armorClass} |  INT: ${item.intScore} | WIS: ${item.wisScore} | CHA: ${item.chaScore}
    SENSE:${item.senses}
    
    ${formatUnitActions(item)}
    
    Document Title: 5e Core Rules`;
    return template.replace(/[‘’‚‛‹›']/g, "");
}

/** Format based on Open5e returns */
function FormatActions(actions: IActionsEntity[]): string
{
    if (!actions || actions.length === 0)
    {
        return 'No actions available.';
    }

    let formattedActions = 'Actions:\n';
    actions.forEach((action, _index) =>
    {
        formattedActions += `- ${action.name}: ${action.desc}\n`;
        if (action.attack_bonus !== undefined)
        {
            formattedActions += `  Melee Weapon Attack: +${action.attack_bonus} to hit, `;
            formattedActions += `Hit: ${action.damage_dice} + ${action.damage_bonus} damage.\n`;
        }
    });

    return formattedActions.trim();
}

/* Format based on Clash Collection returns */
function formatUnitActions(unit: IUnitInfo): string
{
    let formattedActions = '';

    if (unit.standardActions && unit.standardActions.length > 0)
    {
        formattedActions += 'Standard Actions:\n';
        formattedActions += formatClashActions(unit.standardActions);
    }

    if (unit.legendaryActions && unit.legendaryActions.length > 0)
    {
        formattedActions += 'Legendary Actions:\n';
        formattedActions += formatClashActions(unit.legendaryActions);
    }

    if (unit.specialAbilities && unit.specialAbilities.length > 0)
    {
        formattedActions += 'Special Abilities:\n';
        formattedActions += formatClashActions(unit.specialAbilities);
    }

    if (unit.spellActions && unit.spellActions.length > 0)
    {
        formattedActions += 'Spell Actions:\n';
        formattedActions += formatClashActions(unit.spellActions);
    }

    if (unit.reactions && unit.reactions.length > 0)
    {
        formattedActions += 'Reactions:\n';
        formattedActions += formatClashActions(unit.reactions);
    }

    return formattedActions.trim();
}

function formatClashActions(actions: IActionsEntity[]): string
{
    let formattedActions = '';

    actions.forEach((action) =>
    {
        formattedActions += `- ${action.name}: ${action.desc}\n`;
        if (action.attack_bonus !== undefined)
        {
            formattedActions += `  Attack Bonus: +${action.attack_bonus}\n`;
            formattedActions += `  Damage: ${action.damage_dice} + ${action.damage_bonus}\n`;
        }
    });

    return formattedActions;
}