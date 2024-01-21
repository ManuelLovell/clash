import { Constants } from "../clashConstants";
import UnitInfo from "../unitinfo/clashUnitInfo";
import { SUBVIEW } from "./clashSubView";
import { AppendAddActionButtons, AppendCollectionSaveButton, AppendFavoriteButton, AppendUnitExportButton, AppendUnitSaveButton, AppendWindowPinButton } from "../buttons/clashSubviewButtons";
import { HandleDiceRoll } from "../dice/bsDiceHandler";

const attributeArray: string[] = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];
export function BuildUnitStatBlock(clashUnit: UnitInfo)
{
    //Text formatters
    //Unit Alignment, Type, Size
    let unitTypeHtml = "";
    unitTypeHtml = '<div class="typeDescription">';
    unitTypeHtml += `<span id="formUnitSize" contentEditable="true">${clashUnit.unitSize}</span> `;
    unitTypeHtml += `<span id="formAlignment" contentEditable="true">${clashUnit.alignment}</span> `;
    unitTypeHtml += `<span id="formUnitType" contentEditable="true">${clashUnit.unitType}</span>`;
    unitTypeHtml += '</div>';

    //Unit AC, HP, Speed
    let unitHpAcHtml = `<div><span class="bold red">Hit Points </span><span id="formMaxHP" contentEditable="true">${clashUnit.maxHP}</span>
                            <span class="float-right"><span class="bold red">Armor Class </span><span id="formArmorClass" contentEditable="true">${clashUnit.armorClass}</span></span></div>`;
    let unitSpeedHtml = `<div><span class="bold red">Speed</span>  <span class="float-right"><img class ="Icon" src="/speedwalk.svg"> <span id="formSpeedWalk" contentEditable="true">${clashUnit.speedWalk}</span> 
                <img class ="Icon" src="/speedswim.svg"> <span id="formSpeedSwim" contentEditable="true">${clashUnit.speedSwim}</span> 
                <img class ="Icon" src="/speedburrow.svg"> <span id="formSpeedBurrow" contentEditable="true">${clashUnit.speedBurrow}</span> 
                <img class ="Icon" src="/speedclimb.svg"> <span id="formSpeedClimb" contentEditable="true">${clashUnit.speedClimb}</span> 
                <img class ="Icon" src="/speedfly.svg"> <span id="formSpeedFly" contentEditable="true">${clashUnit.speedFly}</span></span></div>`;

    //Unit Attribute Scores
    let unitScoresHtml = '<table>';
    unitScoresHtml += '<tr class="red"><th>STR    </th><th>DEX   </th><th>CON    </th><th>INT   </th><th>WIS   </th><th>CHA   </th></tr>';
    unitScoresHtml += `<tr><td><div class="rollable-score" data-score="true" data-name="Strength"><span id="formStrScore" data-name="Strength" contentEditable="false">${clashUnit.strScore}</span></div></td>
                            <td><div class="rollable-score" data-score="true" data-name="Dexterity"><span id="formDexScore" data-name="Dexterity" contentEditable="false">${clashUnit.dexScore}</span></div></td>
                            <td><div class="rollable-score" data-score="true" data-name="Constitution"><span id="formConScore" data-name="Constitution" contentEditable="false">${clashUnit.conScore}</span></div></td>
                            <td><div class="rollable-score" data-score="true" data-name="Intelligence"><span id="formIntScore" data-name="Intelligence" contentEditable="false">${clashUnit.intScore}</span></div></td>
                            <td><div class="rollable-score" data-score="true" data-name="Wisdom"><span id="formWisScore" data-name="Wisdom" contentEditable="false">${clashUnit.wisScore}</span></div></td>
                            <td><div class="rollable-score" data-score="true" data-name="Charisma"><span id="formChaScore" data-name="Charisma" contentEditable="false">${clashUnit.chaScore}</span></div></td></tr>`;
    unitScoresHtml += '</table>';

    //Unit Save Scores
    let unitSavesHtml = '<div class="center red bold">Saving Throws</div><table>';
    unitSavesHtml += `<tr><td><div class="rollable-save" data-name="Strength Save"><span id="formStrSave" data-name="Strength Save" contentEditable="false">${clashUnit.strSave}</span></div></td>
                            <td><div class="rollable-save" data-name="Dexterity Save"><span id="formDexSave" data-name="Dexterity Save" contentEditable="false">${clashUnit.dexSave}</span></div></td>
                            <td><div class="rollable-save" data-name="Constitution Save"><span id="formConSave" data-name="Constitution Save" contentEditable="false">${clashUnit.conSave}</span></div></td>
                            <td><div class="rollable-save" data-name="Intelligence Save"><span id="formIntSave" data-name="Intelligence Save" contentEditable="false">${clashUnit.intSave}</span></div></td>
                            <td><div class="rollable-save" data-name="Wisdom Save"><span id="formWisSave" data-name="Wisdom Save" contentEditable="false">${clashUnit.wisSave}</span></div></td>
                            <td><div class="rollable-save" data-name="Charisma Save"><span id="formChaSave" data-name="Charisma Save" contentEditable="false">${clashUnit.chaSave}</span></div></td></tr>`;
    unitSavesHtml += '</table>';

    //Unit Senses, Languages, ChallengeRating/XP
    let unitSensesHtml = `<div><span class="bold">Senses </span><span id="formSenses" contentEditable="true">${clashUnit.senses}</span></div>`;
    let unitLanguagesHtml = `<div><span class="bold">Languages </span><span id="formLanguages" contentEditable="true">${clashUnit.languages}</span></div>`;
    let unitChallengeHtml = `<div><span class="bold">Challenge </span>
                <span id="formChallengeRating" contentEditable="true">${clashUnit.challengeRating}</span>
                (<span id="formEXP" contentEditable="true">${clashUnit.experiencePoints}</span> EXP)</div>`;


    //Damage resist, vulnerable, immune, statuses
    let unitImmuneHtml = `<div><span class="bold">Immunity </span><span id="formImmune" contentEditable="true">${clashUnit.damageImmunities}</span></div>`;
    let unitResistHtml = `<div><span class="bold">Resistance </span><span id="formResist" contentEditable="true">${clashUnit.damageResistances}</span></div>`;
    let unitVulnerableHtml = `<div><span class="bold">Vulnerable </span><span id="formVulnerable" contentEditable="true">${clashUnit.damageVulnerabilities}</span></div>`;
    let unitConditionsHtml = `<div><span class="bold">Status Immune </span><span id="formConditions" contentEditable="true">${clashUnit.conditionImmunities}</span></div>`;

    //Unit Abilities
    let unitAbilitiesHtml = `<div id="formAbilityCollection">`;
    if (clashUnit.specialAbilities && clashUnit.specialAbilities?.length > 0)
    {
        for (let action of clashUnit.specialAbilities)
        {
            unitAbilitiesHtml += `<div id="formAbilityContainer" class="Ability">`;
            unitAbilitiesHtml += `<span id="formAbilityName" class="ability-name" contentEditable="true">${action.name}</span>.  `;
            unitAbilitiesHtml += `<span id="formAbilityDesc" class="description" onblur="handleBlur(event)" contentEditable="true">${SetClassOnRollable(action.desc!)}</span>`;
            unitAbilitiesHtml += `</div>`;
        }
    }
    unitAbilitiesHtml += "</div>";

    //Unit Actions
    let unitActionsHtml = `<div id="formAttackCollection">`;
    if (clashUnit.standardActions && clashUnit.standardActions?.length > 0)
    {
        for (let action of clashUnit.standardActions)
        {
            unitActionsHtml += `<div id="formAttackContainer" class="attack">`;
            unitActionsHtml += `<span id="formAttackName" class="attack-name" contentEditable="true">${action.name}</span>.  `;
            unitActionsHtml += `<span id="formAttackDesc" class="description" onblur="handleBlur(event)" contentEditable="true">${SetClassOnRollable(action.desc!)}</span>`;
            unitActionsHtml += `</div>`;
        }
    }
    unitActionsHtml += "</div>";

    //Unit Reactions
    let unitReactionsHtml = `<div id="formReactionCollection">`;
    if (clashUnit.reactions && clashUnit.reactions?.length > 0)
    {
        for (let action of clashUnit.reactions)
        {
            unitReactionsHtml += `<div id="formReactionContainer" class="Reaction">`;
            unitReactionsHtml += `<span id="formReactionName" class="reaction-name" contentEditable="true">${action.name}</span>.  `;
            unitReactionsHtml += `<span id="formReactionDesc" class="description" onblur="handleBlur(event)" contentEditable="true">${SetClassOnRollable(action.desc!)}</span>`;
            unitReactionsHtml += `</div>`;
        }
    }
    unitReactionsHtml += "</div>";

    //Unit Legendary Actions
    let unitLegendaryHtml = `<div id="formLegendaryCollection">`;
    if (clashUnit.legendaryActions && clashUnit.legendaryActions?.length > 0)
    {
        for (let action of clashUnit.legendaryActions)
        {
            unitLegendaryHtml += `<div id="formLegendaryContainer" class="Legendary">`;
            unitLegendaryHtml += `<span id="formLegendaryName" class="legendary-name" contentEditable="true">${action.name}</span>.  `;
            unitLegendaryHtml += `<span id="formLegendaryDesc" class="description" onblur="handleBlur(event)" contentEditable="true">${SetClassOnRollable(action.desc!)}</span>`;
            unitLegendaryHtml += `</div>`;
        }
    }
    unitLegendaryHtml += "</div>";

    //Spells Actions
    let unitSpellsHtml = `<div id="formSpellCollection">`;
    if (clashUnit.spellActions && clashUnit.spellActions?.length > 0)
    {
        for (let action of clashUnit.spellActions)
        {
            unitSpellsHtml += `<div id="formSpellContainer" class="attack">`;
            unitSpellsHtml += `<span id="formSpellName" class="attack-name" contentEditable="true">${action.name}</span>.  `;
            unitSpellsHtml += `<span id="formSpellDesc" class="description" onblur="handleBlur(event)" contentEditable="true">${SetClassOnRollable(action.desc!)}</span>`;
            unitSpellsHtml += `</div>`;
        }
    }
    unitSpellsHtml += "</div>";

    //Set to page
    SUBVIEW.SUBMAINCARD.innerHTML = `
        <div class="headline"><span id="formUnitName" class="name" contentEditable="true">${clashUnit.unitName}</span><span id="buttonContainer" class="float-right"></span></div>
        ${unitTypeHtml}
        <div class="gradient"></div>
        ${unitHpAcHtml}
        ${unitSpeedHtml}
        <div class="gradient"></div>
        ${unitScoresHtml}
        ${unitSavesHtml}
        <div class="gradient"></div>
        ${unitSensesHtml}
        ${unitLanguagesHtml}
        ${unitChallengeHtml}
        <div class="gradient"></div>
        ${unitVulnerableHtml}
        ${unitResistHtml}
        ${unitImmuneHtml}
        ${unitConditionsHtml}
        <div class="actions red">Abilities<span id="addAbilityButtonContainer" class="float-right"></span></div>
        <div class="hr"></div>
        ${unitAbilitiesHtml}
        <div class="actions red">Actions<span id="addAttackButtonContainer" class="float-right"></span></div>
        <div class="hr"></div>
        ${unitActionsHtml}
        <div class="actions red">Reactions<span id="addReactionButtonContainer" class="float-right"></span></div>
        <div class="hr"></div>
        ${unitReactionsHtml}
        <div class="actions red">Legendary Actions<span id="addLegendaryButtonContainer" class="float-right"></span></div>
        <div class="hr"></div>
        ${unitLegendaryHtml}
        <div class="actions red">Spell List<span id="addSpellButtonContainer" class="float-right"></span></div>
        <div class="hr"></div>
        ${unitSpellsHtml}
        </div>
        `;

    // Stop linebreaks in contenteditables
    const editables = document.querySelectorAll('[contenteditable=true]');
    editables.forEach(edits =>
    {
        edits.addEventListener('keypress', function (event): void
        {
            let kbEvent = event as KeyboardEvent;
            if (kbEvent.key === 'Enter')
            {
                event.preventDefault();
            }
        });
    });

    SetupDamageRollables();

    SetupAttackRollables();

    const clickablleScores = document.querySelectorAll('.rollable-score') as NodeListOf<HTMLDivElement>;
    clickablleScores.forEach((score) =>
    {
        score.addEventListener('click', async (e: Event) =>
        {
            e.preventDefault();
            await HandleDiceFormula(e.currentTarget as HTMLElement);
        });
        score.oncontextmenu = async function (e)
        {
            // Prevent the default context menu
            e.preventDefault();

            await HandleContextMenu(e);
        };
    });

    const clickableSaves = document.querySelectorAll('.rollable-save') as NodeListOf<HTMLDivElement>;
    clickableSaves.forEach(save =>
    {
        save.addEventListener('click', async (e: Event) =>
        {
            e.preventDefault();
            await HandleDiceFormula(e.currentTarget as HTMLElement);
        });
        save.oncontextmenu = async function (e)
        {
            // Prevent the default context menu
            e.preventDefault();

            await HandleContextMenu(e);
        };
    });

    (window as any).handleBlur = (event: any) =>
    {
        const targetElement = event.target as HTMLDivElement;
        const blurredDescription = targetElement.innerText;
        targetElement.innerHTML = SetClassOnRollable(blurredDescription);

        SetupDamageRollables(targetElement);

        SetupAttackRollables(targetElement);
    };

    AppendAddActionButtons();
    AppendWindowPinButton();
    AppendFavoriteButton();
    AppendCollectionSaveButton();
    AppendUnitExportButton();
    AppendUnitSaveButton();
    SUBVIEW.ShowSubMenu();
}

function SetupDamageRollables(element?: HTMLDivElement)
{
    const target = element ? element : document;
    const dmgRollables = target.querySelectorAll('.clickable-roller-damage');
    dmgRollables.forEach(roller =>
    {
        roller.addEventListener('contextmenu', async (e: Event) =>
        {
            e.preventDefault();
        });
        roller.addEventListener('mousedown', async (e: Event) =>
        {
            e.preventDefault();
            const thisEle = e.currentTarget as HTMLDivElement;
            let attack = thisEle?.parentElement?.previousElementSibling?.textContent;
            attack = attack ? attack : "<Nameless>";
            thisEle.dataset.name = attack;

            const eventMouse = e as MouseEvent;
            if (eventMouse.button === 0)
            {
                await HandleDiceFormula(e.currentTarget as HTMLElement);
            } else if (eventMouse.button === 2)
            {

                await HandleContextMenu(eventMouse);
            }
        });
    });
}

function SetupAttackRollables(element?: HTMLDivElement)
{
    const target = element ? element : document;
    const atkRollables = target.querySelectorAll('.clickable-roller-attack');
    atkRollables.forEach(roller =>
    {
        roller.addEventListener('contextmenu', async (e: Event) =>
        {
            e.preventDefault();
        });
        roller.addEventListener('mousedown', async (e: Event) =>
        {
            e.preventDefault();
            const thisEle = e.currentTarget as HTMLDivElement;
            let attack = thisEle?.parentElement?.previousElementSibling?.textContent;
            attack = attack ? attack : "<Nameless>";
            thisEle.dataset.name = attack;

            const eventMouse = e as MouseEvent;
            if (eventMouse.button === 0)
            {
                await HandleDiceFormula(e.currentTarget as HTMLElement);
            } else if (eventMouse.button === 2)
            {

                await HandleContextMenu(eventMouse);
            }
        });
    });
}

function HideMenu()
{
    document.getElementById("contextMenu")!
        .style.display = "none"
}

async function HandleDiceFormula(target: HTMLElement, advantange?: boolean)
{
    const attribute = target.dataset.name;
    const scoreRoll = attributeArray.includes(attribute as string);
    const flatNumber = target.firstChild?.textContent as string;
    let rollFormula = "";
    let number;

    if (/\(|\)/.test(flatNumber)) // If parenthesis, damage roll
    {
        rollFormula = flatNumber;
    }
    else
    {
        number = scoreRoll ? Math.floor((+flatNumber - 10) / 2) : +flatNumber;
        rollFormula = number == 0 ? `1d20` : `1d20 + ${number}`;
    }

    await HandleDiceRoll(rollFormula, SUBVIEW.userName!, SUBVIEW.userColor!, SUBVIEW.currentUnit.unitName, attribute!, number, advantange);
}

function HandleContextMenu(event: MouseEvent)
{
    const element = event.target as HTMLDivElement;
    const contextMenu = document.getElementById("contextMenu")!;

    // Hide ADV/DIS for damage rolls
    const advs = contextMenu.querySelectorAll<HTMLElement>(".to-hit-adv");
    advs.forEach((listItem: HTMLElement) =>
    {
        listItem.style.display = element.classList.contains("clickable-roller-damage") ? "none" : "list-item";
    });

    const onClickContext = (e: Event) =>
    {
        e.preventDefault();
    };
    const onClickListItem = async (e: MouseEvent) =>
    {
        const target = e.target as HTMLLIElement;
        if (target.id === "advantage")
        {
            await HandleDiceFormula(element, true);
        }
        else if (target.id === "disadvantage")
        {
            await HandleDiceFormula(element, false);
        }
        else if (target.id === "editValue")
        {
            HandleRollerStats(element);
        }
        contextMenu.style.display = "none";
        event.stopPropagation();

        window.removeEventListener("click", onClickOutside);
        contextMenu.removeEventListener("click", onClickListItem);
        contextMenu.removeEventListener("contextmenu", onClickContext);
    }

    // Add listener to click away
    const onClickOutside = () =>
    {
        contextMenu.style.display = "none";
        window.removeEventListener("click", onClickOutside);
        contextMenu.removeEventListener("click", onClickListItem);
        contextMenu.removeEventListener("contextmenu", onClickContext);
    };

    contextMenu.addEventListener("click", onClickListItem);
    contextMenu.addEventListener("contextmenu", onClickContext);
    window.addEventListener("click", onClickOutside);


    if (contextMenu.style.display == "block")
    {
        HideMenu();
    }
    else
    {
        // Don't let the menu go off window, it'll cut
        const adjustedLeft = Math.min(event.pageX, window.innerWidth - 130);
        const adjustedTop = Math.min(event.pageY, (window.innerHeight > 300 ? window.innerHeight - 50 : window.innerHeight) - 120);

        contextMenu.style.display = 'block';
        contextMenu.style.left = adjustedLeft + "px";
        contextMenu.style.top = adjustedTop + "px";
    }
}

function HandleRollerStats(element: HTMLDivElement)
{
    let childElement = element.firstElementChild! as HTMLElement;
    if (!childElement) childElement = element;
    // Toggle the contenteditable attribute on right-click
    childElement.contentEditable = "true";

    const range = document.createRange();
    range.selectNodeContents(childElement);

    const selection = window.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);
    childElement.addEventListener('blur', () => HandleBlur(childElement));
}

function HandleBlur(childElement: any): void
{
    // Disable contenteditable on blur
    childElement.contentEditable = "false";
    // Remove the event listener after the first blur
    childElement.removeEventListener('blur', HandleBlur);
}

export function SetClassOnRollable(desc: string): string
{
    desc = desc.replace(/\s+/g, ' ');

    // Cleanse all tags before setting the lines refresh
    desc = desc.split('<span class="clickable-roller-damage" contenteditable="false">').join("");
    desc = desc.split('<span class="clickable-roller-attack" contenteditable="false">').join("");
    desc = desc.split('</span>').join("");

    let string = "";
    string = desc.replaceAll(Constants.PARENTHESESMATCH, "<span class='clickable-roller-damage' contenteditable='false'> ($1) </span>");
    string = string.replaceAll(Constants.PLUSMATCH, " <span class='clickable-roller-attack' contenteditable='false'> $1 </span> ");
    return string;
}