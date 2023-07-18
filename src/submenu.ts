import { Constants } from './constants';
import OBR, { Item, Image, Metadata } from '@owlbear-rodeo/sdk';
import UnitInfo from './unit-info';
import { IOpen5eMonsterListResponse } from './interfaces/api-response-open5e';
import { DiceRoller } from './dice-roller';
import { db } from './local-database';
import * as Utilities from './utilities';
import '/src/css/mini-style.css'
import { IUnitInfo } from './interfaces/unit-info';

export class SubMenu
{
    dbImport: IUnitInfo | undefined;
    currentUnit: UnitInfo;
    freshImport: boolean;
    favorite: boolean;
    userId: string | undefined;

    open5eApiString: string = "https://api.open5e.com/monsters/?format=json&search=";
    POPOVERSUBMENUID: string = "";
    multiSheet: boolean = false;
    multiActive: string[] = [];
    multiIds: string[] = [];

    importReturnContainer: HTMLElement;
    importBarContainer: HTMLElement;
    searchBarContainer: HTMLElement;
    mainFooterContainer: HTMLElement;

    constructor()
    {
        this.freshImport = false;
        this.favorite = false;

        this.importReturnContainer = document.getElementById("importReturnContainer")!;
        this.importBarContainer = document.getElementById("importFooterButtonContainer")!;
        this.searchBarContainer = document.getElementById("searchFooterButtonContainer")!;
        this.mainFooterContainer = document.getElementById("mainFooterContainer")!;

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const idParam = urlParams.get('unitid')!;
        // If found, it means multiple sheet updates
        const multiParam = urlParams.get('multi');
        const mActiveParam = urlParams.get('unitactive');

        if (multiParam && mActiveParam)
        {
            this.multiSheet = true;
            this.multiIds = idParam.split(",");
            this.multiActive = mActiveParam?.split(",");
            this.POPOVERSUBMENUID = Constants.MULTISHEETID;
            document.documentElement.style.borderColor = "deeppink";
            const subs = document.querySelectorAll<HTMLElement>("#submenu, #searchmenu, #importjsonmenu")!;
            subs.forEach((sub: HTMLElement) =>
            {
                sub.style.height = "90%";
            });
        }
        else
        {
            document.getElementById("groupEdit")!.hidden = true;
            this.POPOVERSUBMENUID = idParam;
        }

        this.currentUnit = new UnitInfo(this.POPOVERSUBMENUID, "Default");
    }

    public async renderUnitInfo(document: Document): Promise<void>
    {
        // If there's no ID, just give up.
        if (this.POPOVERSUBMENUID == undefined) return;

        this.ShowSearchMenu(false);
        this.ShowImportJSONMenu(false);
        this.ShowSubMenu(true);
        OBR.onReady(async () =>
        {
            // Set theme accordingly
            const theme = await OBR.theme.getTheme();
            Utilities.SetThemeMode(theme, document);
            OBR.theme.onChange((theme) =>
            {
                Utilities.SetThemeMode(theme, document);
            })
            this.userId = await OBR.player.getId(); // For rumble
            if (!this.freshImport && !this.multiSheet)
            {
                await this.currentUnit.ImportFromDatabase(this.POPOVERSUBMENUID);
            }

            this.freshImport = false;

            //Text formatters
            //Unit Alignment, Type, Size
            let unitTypeHtml = "";
            unitTypeHtml = '<div class="description">';
            unitTypeHtml += `<span id="formUnitSize" contentEditable="true">${this.currentUnit.unitSize}</span> `;
            unitTypeHtml += `<span id="formAlignment" contentEditable="true">${this.currentUnit.alignment}</span> `;
            unitTypeHtml += `<span id="formUnitType" contentEditable="true">${this.currentUnit.unitType}</span>`;
            unitTypeHtml += '</div>';

            //Unit AC, HP, Speed
            let unitHpAcHtml = `<div><span class="bold red">Hit Points </span><span id="formMaxHP" contentEditable="true">${this.currentUnit.maxHP}</span>
                            <span class="floatright"><span class="bold red">Armor Class </span><span id="formArmorClass" contentEditable="true">${this.currentUnit.armorClass}</span></span></div>`;
            let unitSpeedHtml = `<div><span class="bold red">Speed</span>  <span class="floatright"><img class ="Icon" src="/speedwalk.svg"> <span id="formSpeedWalk" contentEditable="true">${this.currentUnit.speedWalk}</span> 
                <img class ="Icon" src="/speedswim.svg"> <span id="formSpeedSwim" contentEditable="true">${this.currentUnit.speedSwim}</span> 
                <img class ="Icon" src="/speedburrow.svg"> <span id="formSpeedBurrow" contentEditable="true">${this.currentUnit.speedBurrow}</span> 
                <img class ="Icon" src="/speedclimb.svg"> <span id="formSpeedClimb" contentEditable="true">${this.currentUnit.speedClimb}</span> 
                <img class ="Icon" src="/speedfly.svg"> <span id="formSpeedFly" contentEditable="true">${this.currentUnit.speedFly}</span></span></div>`;

            //Unit Attribute Scores
            let unitScoresHtml = '<table>';
            unitScoresHtml += '<tr class="red"><th>STR    </th><th>DEX   </th><th>CON    </th><th>INT   </th><th>WIS   </th><th>CHA   </th></tr>';
            unitScoresHtml += `<tr><td><div class="rollableScore" data-name="Strength"><span id="formStrScore" contentEditable="true">${this.currentUnit.strScore}</span></div></td>
                            <td><div class="rollableScore" data-name="Dexterity"><span id="formDexScore" contentEditable="true">${this.currentUnit.dexScore}</span></div></td>
                            <td><div class="rollableScore" data-name="Constitution"><span id="formConScore" contentEditable="true">${this.currentUnit.conScore}</span></div></td>
                            <td><div class="rollableScore" data-name="Intelligence"><span id="formIntScore" contentEditable="true">${this.currentUnit.intScore}</span></div></td>
                            <td><div class="rollableScore" data-name="Wisdom"><span id="formWisScore" contentEditable="true">${this.currentUnit.wisScore}</span></div></td>
                            <td><div class="rollableScore" data-name="Charisma"><span id="formChaScore" contentEditable="true">${this.currentUnit.chaScore}</span></div></td></tr>`;
            unitScoresHtml += '</table>';

            //Unit Save Scores
            let unitSavesHtml = '<div class="center red bold">Saving Throws</div><table>';
            unitSavesHtml += `<tr><td><div class="rollableSave" data-name="Strength Save"><span id="formStrSave" contentEditable="true">${this.currentUnit.strSave}</span></div></td>
                            <td><div class="rollableSave" data-name="Dexterity Save"><span id="formDexSave" contentEditable="true">${this.currentUnit.dexSave}</span></div></td>
                            <td><div class="rollableSave" data-name="Constitution Save"><span id="formConSave" contentEditable="true">${this.currentUnit.conSave}</span></div></td>
                            <td><div class="rollableSave" data-name="Intelligence Save"><span id="formIntSave" contentEditable="true">${this.currentUnit.intSave}</span></div></td>
                            <td><div class="rollableSave" data-name="Wisdom Save"><span id="formWisSave" contentEditable="true">${this.currentUnit.wisSave}</span></div></td>
                            <td><div class="rollableSave" data-name="Charisma Save"><span id="formChaSave" contentEditable="true">${this.currentUnit.chaSave}</span></div></td></tr>`;
            unitSavesHtml += '</table>';

            //Unit Senses, Languages, ChallengeRating/XP
            let unitSensesHtml = `<div><span class="bold">Senses </span><span id="formSenses" contentEditable="true">${this.currentUnit.senses}</span></div>`;
            let unitLanguagesHtml = `<div><span class="bold">Languages </span><span id="formLanguages" contentEditable="true">${this.currentUnit.languages}</span></div>`;
            let unitChallengeHtml = `<div><span class="bold">Challenge </span>
                <span id="formChallengeRating" contentEditable="true">${this.currentUnit.challengeRating}</span>
                (<span id="formEXP" contentEditable="true">${this.currentUnit.experiencePoints}</span> EXP)</div>`;


            //Damage resist, vulnerable, immune, statuses
            let unitImmuneHtml = `<div><span class="bold">Immunity </span><span id="formImmune" contentEditable="true">${this.currentUnit.damageImmunities}</span></div>`;
            let unitResistHtml = `<div><span class="bold">Resistance </span><span id="formResist" contentEditable="true">${this.currentUnit.damageResistances}</span></div>`;
            let unitVulnerableHtml = `<div><span class="bold">Vulnerable </span><span id="formVulnerable" contentEditable="true">${this.currentUnit.damageVulnerabilities}</span></div>`;
            let unitConditionsHtml = `<div><span class="bold">Status Immune </span><span id="formConditions" contentEditable="true">${this.currentUnit.conditionImmunities}</span></div>`;

            //Unit Abilities
            let unitAbilitiesHtml = `<div id="formAbilityCollection">`;
            if (this.currentUnit.specialAbilities && this.currentUnit.specialAbilities?.length > 0)
            {
                for (let action of this.currentUnit.specialAbilities)
                {
                    unitAbilitiesHtml += `<div id="formAbilityContainer" class="Ability">`;
                    unitAbilitiesHtml += `<span id="formAbilityName" class="abilityname" contentEditable="true">${action.name}</span>.  `;
                    unitAbilitiesHtml += `<span id="formAbilityDesc" class="description" contentEditable="true">${this.SetClassOnRollable(action.desc!)}</span>`;
                    unitAbilitiesHtml += `</div>`;
                }
            }
            unitAbilitiesHtml += "</div>";

            //Unit Actions
            let unitActionsHtml = `<div id="formAttackCollection">`;
            if (this.currentUnit.standardActions && this.currentUnit.standardActions?.length > 0)
            {
                for (let action of this.currentUnit.standardActions)
                {
                    unitActionsHtml += `<div id="formAttackContainer" class="attack">`;
                    unitActionsHtml += `<span id="formAttackName" class="attackname" contentEditable="true">${action.name}</span>.  `;
                    unitActionsHtml += `<span id="formAttackDesc" class="description" contentEditable="true">${this.SetClassOnRollable(action.desc!)}</span>`;
                    unitActionsHtml += `</div>`;
                }
            }
            unitActionsHtml += "</div>";

            //Unit Reactions
            let unitReactionsHtml = `<div id="formReactionCollection">`;
            if (this.currentUnit.reactions && this.currentUnit.reactions?.length > 0)
            {
                for (let action of this.currentUnit.reactions)
                {
                    unitReactionsHtml += `<div id="formReactionContainer" class="Reaction">`;
                    unitReactionsHtml += `<span id="formReactionName" class="reactionname" contentEditable="true">${action.name}</span>.  `;
                    unitReactionsHtml += `<span id="formReactionDesc" class="description" contentEditable="true">${this.SetClassOnRollable(action.desc!)}</span>`;
                    unitReactionsHtml += `</div>`;
                }
            }
            unitReactionsHtml += "</div>";

            //Unit Legendary Actions
            let unitLegendaryHtml = `<div id="formLegendaryCollection">`;
            if (this.currentUnit.legendaryActions && this.currentUnit.legendaryActions?.length > 0)
            {
                for (let action of this.currentUnit.legendaryActions)
                {
                    unitLegendaryHtml += `<div id="formLegendaryContainer" class="Legendary">`;
                    unitLegendaryHtml += `<span id="formLegendaryName" class="legendaryname" contentEditable="true">${action.name}</span>.  `;
                    unitLegendaryHtml += `<span id="formLegendaryDesc" class="description" contentEditable="true">${this.SetClassOnRollable(action.desc!)}</span>`;
                    unitLegendaryHtml += `</div>`;
                }
            }
            unitLegendaryHtml += "</div>";

            //Spells Actions
            let unitSpellsHtml = `<div id="formSpellCollection">`;
            if (this.currentUnit.spellActions && this.currentUnit.spellActions?.length > 0)
            {
                for (let action of this.currentUnit.spellActions)
                {
                    unitSpellsHtml += `<div id="formSpellContainer" class="attack">`;
                    unitSpellsHtml += `<span id="formSpellName" class="attackname" contentEditable="true">${action.name}</span>.  `;
                    unitSpellsHtml += `<span id="formSpellDesc" class="description" contentEditable="true">${this.SetClassOnRollable(action.desc!)}</span>`;
                    unitSpellsHtml += `</div>`;
                }
            }
            unitSpellsHtml += "</div>";

            //Set to page
            document.querySelector<HTMLDivElement>('#submenu')!.innerHTML = `
            <div class="headline"><span id="formUnitName" class="name" contentEditable="true">${this.currentUnit.unitName}</span><span id="buttonContainer" class="floatright"></span></div>
            ${unitTypeHtml}
            <div class="gradient"></div>
            ${unitHpAcHtml}
            ${unitSpeedHtml}
            <div class="gradient"></div>
            ${unitScoresHtml}
            <div class="hr"></div>
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
            <div class="actions red">Abilities<span id="addAbilityButtonContainer" class="floatright"></span></div>
            <div class="hr"></div>
            ${unitAbilitiesHtml}
            <div class="actions red">Actions<span id="addAttackButtonContainer" class="floatright"></span></div>
            <div class="hr"></div>
            ${unitActionsHtml}
            <div class="actions red">Reactions<span id="addReactionButtonContainer" class="floatright"></span></div>
            <div class="hr"></div>
            ${unitReactionsHtml}
            <div class="actions red">Legendary Actions<span id="addLegendaryButtonContainer" class="floatright"></span></div>
            <div class="hr"></div>
            ${unitLegendaryHtml}
            <div class="actions red">Spell List<span id="addSpellButtonContainer" class="floatright"></span></div>
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

            this.AppendFavoriteButton();
            this.AppendCollectionSaveButton();
            this.AppendUnitExportButton();
            this.AppendUnitSaveButton();
            this.AppendAddActionButtons();
            this.AppendImportUnitButton();
            this.AppendSearchButtons();
            this.AppendJSONButton();

            const dmgRollables = document.querySelectorAll('.clickableRollerDmg');
            dmgRollables.forEach(roller =>
            {
                roller.addEventListener('click', async (e: Event) =>
                {
                    const element = roller as HTMLElement;
                    let attack = element?.parentElement?.previousElementSibling?.textContent;
                    attack = attack ? attack : "<Nameless>";
                    if (e && e.currentTarget)
                    {
                        e.preventDefault();
                        const value = e.currentTarget as Element;
                        value.parentElement?.blur();

                        const message = `${this.currentUnit.unitName} used ${attack} and rolled ${value.textContent} for ... ${DiceRoller.RollString(value.textContent!)}!`;
                        this.SendtoChatLog(message)
                        return await OBR.notification.show(message);
                    }
                    return null;
                });
            });

            const atkRollables = document.querySelectorAll('.clickableRollerAtk');
            atkRollables.forEach(roller =>
            {
                roller.addEventListener('click', async (e: Event) =>
                {
                    const element = roller as HTMLElement;
                    let attack = element?.parentElement?.previousElementSibling?.textContent;
                    attack = attack ? attack : "<Nameless>";
                    if (e && e.currentTarget)
                    {
                        e.preventDefault();
                        const value = e.currentTarget as Element;
                        value.parentElement?.blur();

                        let hitValue = value.textContent?.replace(/[()]/g, '');

                        const bonus = Number(hitValue?.substring(1));
                        const roll = bonus == 0 ? `(1d20)` : `(1d20 + ${bonus})`;
                        const result = DiceRoller.RollString(roll!);

                        const message = `${this.currentUnit.unitName} used ${attack} and rolled ${value.textContent} for ... ${result} to hit!`;
                        const critical = (result - bonus) == 20 ? true : false;
                        this.SendtoChatLog(message, critical);
                        return await OBR.notification.show(message);
                    }
                    return null;
                });
            });

            const clickablleScores = document.querySelectorAll('.rollableScore');
            clickablleScores.forEach(score =>
            {
                score.addEventListener('click', async (e: Event) =>
                {
                    const element = score as HTMLElement;
                    const attribute = element.dataset.name;
                    if (e && e.currentTarget && score.firstChild)
                    {
                        const number = Math.floor((Number(score.firstChild?.textContent) - 10) / 2);
                        let toRoll = number == 0 ? `(1d20)` : `(1d20 + ${number})`;

                        e.preventDefault();

                        const message = `${this.currentUnit.unitName} rolled ${attribute} ${toRoll} for ... ${DiceRoller.RollString(toRoll)}!`;
                        this.SendtoChatLog(message)
                        return await OBR.notification.show(message);
                    }
                    return null;
                });
            });

            const clickableSaves = document.querySelectorAll('.rollableSave');
            clickableSaves.forEach(save =>
            {
                save.addEventListener('click', async (e: Event) =>
                {
                    const element = save as HTMLElement;
                    const attribute = element.dataset.name;
                    if (e && e.currentTarget && save.firstChild)
                    {
                        const number = Number(save.firstChild?.textContent);
                        let toRoll = number == 0 ? `(1d20)` : `(1d20 + ${number})`;

                        e.preventDefault();

                        const message = `${this.currentUnit.unitName} rolled ${attribute} ${toRoll} for ... ${DiceRoller.RollString(toRoll)}!`;
                        this.SendtoChatLog(message)
                        return await OBR.notification.show(message);
                    }
                    return null;
                });
            });
        });
    }

    private async renderSearchForm(document: Document): Promise<void>
    {
        const favIcon = "♥";
        var self = this;

        const searchButton = document.querySelector<HTMLInputElement>('#searchValue')!;
        searchButton.addEventListener("keypress", async function (event)
        {
            if (event.key === "Enter")
            {
                await DoASearch();
            }
        });

        const searchConfirmButton = document.querySelector<HTMLInputElement>("#searchConfirm")!;
        searchConfirmButton.onclick = async function () 
        {
            await DoASearch();
        };

        document.querySelector<HTMLDivElement>('#searchmenu')!.innerHTML = `
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
                importCollection.className = "collectionImportButtonConfirm"
                importCollection.value = "Import";
                importCollection.title = `Import ${monster.unitName} onto this Unit`;

                const removeCollection = document.createElement('input');
                removeCollection.type = "button";
                removeCollection.id = `del-${monster.id}`;
                removeCollection.className = "removeCollectionButtonConfirm";
                removeCollection.value = "⨉"
                removeCollection.title = `Remove ${monster.unitName} from Collection`;

                monsterInformationHtml += `<li id="listItem-${monster.id}" style="--tooltip-color:${ColorName(monster.dataSlug)}" data-tag="🡆 from [Collection] User:${monster.dataSlug}"><div class="monsterNameList">${fav} ${TruncateName(monster.unitName)}</div><div class="monsterImportButtonContainer">${removeCollection.outerHTML} ${importCollection.outerHTML}</div></li>`;
            });
            list.innerHTML = monsterInformationHtml;
            // Add collection buttons
            const collbBttns = document.querySelectorAll('.collectionImportButtonConfirm');
            collbBttns.forEach(btn =>
            {
                btn.addEventListener('click', async (e: Event) => await self.ImportCollectionMonsterInfo((e.currentTarget as Element).id));
            });
            // Add remove from collection buttons
            const removeBttns = document.querySelectorAll('.removeCollectionButtonConfirm');
            removeBttns.forEach(btn =>
            {
                btn.addEventListener('click', async (e: Event) => await self.DeleteCollectionMonsterInfo((e.currentTarget as Element).id));
            });
        }

        async function DoASearch()
        {
            const list = document.querySelector<HTMLDivElement>('#monsterList')!;

            list.innerHTML = `<div class="superCenter">Searching...</div>`;
            let monsterInformationHtml = "";

            await fetch(`${self.open5eApiString}${searchButton.value}`)
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
                            importThis.className = "monsterImportButtonConfirm"
                            importThis.value = "Import";
                            importThis.title = `Import ${monster.name} onto this Unit`;

                            monsterInformationHtml += `<li style="--tooltip-color:${ColorName(monster.document__slug)}" data-tag="🡆 from ${monster.document__slug}"><div class="monsterNameList">${TruncateName(monster.name)}</div><div class="monsterImportButtonContainer">${importThis.outerHTML}</div></li>`;
                        });
                    }
                });

            const dexieSearch = await db.Creatures.filter(unit => unit.unitName.toLowerCase().includes(searchButton.value.toLocaleLowerCase())).toArray();
            if (dexieSearch.length > 0)
            {
                dexieSearch.forEach((monster) =>
                {
                    const fav = monster.favorite ? favIcon : "";
                    const importCollection = document.createElement('input');
                    importCollection.type = "button";
                    importCollection.id = `${monster.id}`;
                    importCollection.className = "collectionImportButtonConfirm";
                    importCollection.value = "Import";
                    importCollection.title = `Import ${monster.unitName} onto this Unit`;

                    const removeCollection = document.createElement('input');
                    removeCollection.type = "button";
                    removeCollection.id = `del-${monster.id}`;
                    removeCollection.className = "removeCollectionButtonConfirm";
                    removeCollection.value = "⨉"
                    removeCollection.title = `Remove ${monster.unitName} from Collection`;


                    monsterInformationHtml += `<li id="listItem-${monster.id}" style="--tooltip-color:${ColorName(monster.dataSlug)}" data-tag="🡆 from [Collection] User:${monster.dataSlug}"><div class="monsterNameList">${fav} ${TruncateName(monster.unitName)}</div><div class="monsterImportButtonContainer">${removeCollection.outerHTML} ${importCollection.outerHTML}</div></li>`;
                });
            }

            //If we have HTML, set up the buttons
            if (monsterInformationHtml != "Searching...")
            {
                list.innerHTML = monsterInformationHtml;
                // Add open 5e buttons
                const btns = document.querySelectorAll('.monsterImportButtonConfirm');
                btns.forEach(btn =>
                {
                    btn.addEventListener('click', async (e: Event) => await self.ImportNewMonsterInfo((e.currentTarget as Element).id));
                });

                // Add collection buttons
                const collbBttns = document.querySelectorAll('.collectionImportButtonConfirm');
                collbBttns.forEach(btn =>
                {
                    btn.addEventListener('click', async (e: Event) => await self.ImportCollectionMonsterInfo((e.currentTarget as Element).id));
                });

                // Add remove from collection buttons
                const removeBttns = document.querySelectorAll('.removeCollectionButtonConfirm');
                removeBttns.forEach(btn =>
                {
                    btn.addEventListener('click', async (e: Event) => await self.DeleteCollectionMonsterInfo((e.currentTarget as Element).id));
                });
            }
            else
            {
                // Otherwise no results found
                list.innerHTML = "<div class='Nothing'>No results found.</div>";
            }
        }


        function TruncateName(name: string): string
        {
            if (name.length > 30)
            {
                return name.substring(0, 30) + "...";
            }
            return name;
        }

        function ColorName(name: string): string
        {
            if (!name || name === "")
            {
                return "white";
            }

            const letter = name.substring(0, 1).toLowerCase();
            switch (letter)
            {
                case "a":
                case "e":
                case "i":
                case "o":
                case "u":
                    return "red";
                case "b":
                case "c":
                case "d":
                    return "pink";
                case "f":
                case "g":
                case "h":
                    return "cyan";
                case "j":
                case "k":
                case "l":
                case "m":
                    return "#747bff"; //purple
                case "n":
                case "p":
                case "q":
                    return "green";
                case "r":
                case "s":
                case "t":
                case "v":
                    return "orange";
                case "w":
                case "x":
                case "y":
                case "z":
                    return "yellow";
                default:
                    return "white";
            }
        }
    }

    private async renderCustomImportForm(document: Document): Promise<void>
    {
        document.querySelector<HTMLDivElement>('#importjsonmenu')!.innerHTML = `
            <h2>Import Custom JSON</h2>
            <div id="importDataContainer"></div>
            <div class="hr"></div>
            <div class = "red" id="exampleLine>Example Input</div>
            <div id="instructionsContainer"></div>
            <h3>Formatting Help</h3>
            ${this.exampleInterfaceString()}
            <div class="hr"></div>
            <h3>Sub Types</h3>
            ${this.exampleTypesString()}
           `;

        const importDataContainer = document.getElementById("importDataContainer");

        //Create import Input Button
        const importValueButton = document.createElement('textarea');
        importValueButton.id = "customJsonValueBox";
        importValueButton.className = "";
        importValueButton.title = "Type custom monster information here"

        importDataContainer?.append(importValueButton);
        this.AppendImportCustomButtons();
    }

    private exampleInterfaceString(): string
    {
        let exampleInterface = `Below are the type definitions for importing.</br>
        If you need an easier example, click Export on an existing Unit and change the values.</br>
        When adding clickable dice rolls, the format is '(#d#+#)' ex; (2d6+2)</br>
        If it's detected in an Action description, it should create a roller button.</br></br>
        <b>CustomEntity</b> </br>
        {</br>
            unitName: string;</br> 
            initiative: number;</br> 
            currentHP: number;</br> 
            maxHP: number;</br> 
            armorClass: number;</br> 
        
            unitType: string;</br> 
            unitSize: string;</br> 
        
            strScore: number;</br> 
            strSave: number;</br> 
        
            dexScore: number;</br> 
            dexSave: number;</br> 
        
            conScore: number;</br> 
            conSave: number;</br> 
        
            intScore: number;</br> 
            intSave: number;</br> 
        
            wisScore: number;</br> 
            wisSave: number;</br> 
        
            chaScore: number;</br> 
            chaSave: number;</br> 
        
            damageVulnerabilities: string;</br> 
            damageImmunities: string;</br> 
            damageResistances: string;</br> 
            conditionImmunities: string;</br> 
        
            challengeRating: string;</br> 
            experiencePoints: number;</br> 
            alignment: string;</br> 
        
            standardActions: ActionsEntity[];</br> 
            legendaryActions?: ActionsEntity[];</br> 
            specialAbilities?: ActionsEntity[];</br> 
            spellActions?: ActionsEntity[];</br> 
            reactions?: ActionsEntity[];</br> 
        
            senses: string;</br> 
            languages: string;</br> 
        
            speedWalk: number;</br> 
            speedFly: number;</br> 
            speedClimb: number;</br> 
            speedBurrow: number;</br> 
            speedSwim: number;</br> 

            dataSlug: string;</br>
        }`;

        return exampleInterface;
    }

    private exampleTypesString(): string
    {
        const exampleType = `      
        <b>ActionsEntity</b> </br>
        {   name?: string;</br>
          desc?: string;</br>   }</br>
        `;

        return exampleType;
    }
    private AppendImportUnitButton(): void
    {
        var self = this;

        const buttonFound = document.getElementById("gotoMonsterSearchButton");
        if (buttonFound) return;

        const gotoSearchButton = document.createElement('input');
        gotoSearchButton.type = "button";
        gotoSearchButton.id = "gotoMonsterSearchButton";
        gotoSearchButton.value = "Search Monster Data"
        gotoSearchButton.className = "chalkBorder";
        gotoSearchButton.style.marginRight = "4px";
        gotoSearchButton.title = "Search Monster Data from Free Open5e"
        gotoSearchButton.onclick = async function () 
        {
            self.ShowSubMenu(false);
            self.ShowSearchMenu(true);
            self.renderSearchForm(document);
        }

        this.mainFooterContainer.appendChild(gotoSearchButton);
    }

    private AppendSearchButtons(): void
    {
        var self = this;

        const buttonFound = document.getElementById("returnButton");
        if (buttonFound) return;

        //Create Return Button
        const goBackButton = document.createElement('input');
        goBackButton.type = "button";
        goBackButton.id = "returnButton";
        goBackButton.className = "chalkBorder";
        goBackButton.style.marginRight = "4px";
        goBackButton.title = "Go back to Unit Information";
        goBackButton.value = "Return";
        goBackButton.onclick = async function () 
        {
            self.ShowSearchMenu(false);
            self.ShowSubMenu(true);
        }

        //Create Search Input Button
        const searchValueButton = document.createElement('input');
        searchValueButton.type = "search";
        searchValueButton.id = "searchValue";
        searchValueButton.className = "textInput";
        searchValueButton.title = "Type a value to filter monsters by";

        //Create Search Confirm Button
        const searchConfirmButton = document.createElement('input');
        searchConfirmButton.type = "button";
        searchConfirmButton.id = "searchConfirm";
        searchConfirmButton.value = "Search";
        searchConfirmButton.className = "chalkBorder";
        searchConfirmButton.style.marginLeft = "4px";
        searchConfirmButton.title = "Click to send Search";

        this.searchBarContainer?.append(goBackButton);
        this.searchBarContainer?.append(searchValueButton);
        this.searchBarContainer?.append(searchConfirmButton);
    }

    private AppendImportCustomButtons(): void
    {
        var self = this;

        const buttonFound = document.getElementById("importConfirm");
        if (buttonFound) return;

        //Create JSON Return Button
        const goBackButton = document.createElement('input');
        goBackButton.type = "button";
        goBackButton.id = "returnButton";
        goBackButton.className = "chalkBorder";
        goBackButton.style.marginRight = "4px";
        goBackButton.title = "Go back to Unit Information";
        goBackButton.value = "Return";
        goBackButton.onclick = async function () 
        {
            self.ShowImportJSONMenu(false);
            self.ShowSubMenu(true);
        }

        const importValueButton = <HTMLTextAreaElement>document.getElementById("customJsonValueBox")!;

        //Create import Confirm Button
        const importConfirmButton = document.createElement('input');
        importConfirmButton.type = "button";
        importConfirmButton.id = "importConfirm";
        importConfirmButton.value = "Confirm Import";
        importConfirmButton.className = "chalkBorder";
        importConfirmButton.style.marginLeft = "4px";
        importConfirmButton.title = "Click to import custom data"
        importConfirmButton.onclick = async function () 
        {
            const customData = importValueButton.value;

            try 
            {
                subMenu.freshImport = true;
                //TODO: Add UnitCheck to see if UnitID still exists in OBR
                //Delete hook will remove it from DB

                subMenu.currentUnit.ImportFromJSON(customData);
                subMenu.renderUnitInfo(document);
            }
            catch (error) 
            {
                alert(`The import failed - ${error}`);
            }
        }

        this.importReturnContainer?.append(goBackButton);
        this.importBarContainer?.append(importConfirmButton);
    }

    private AppendJSONButton(): void
    {
        var self = this;

        const buttonFound = document.getElementById("gotoImportMonsterButton");
        if (buttonFound) return;

        const gotoImportJSONButton = document.createElement('input');
        gotoImportJSONButton.type = "button";
        gotoImportJSONButton.id = "gotoImportMonsterButton";
        gotoImportJSONButton.value = "Import Custom JSON"
        gotoImportJSONButton.className = "chalkBorder";
        gotoImportJSONButton.style.marginLeft = "4px";
        gotoImportJSONButton.title = "Import Custom Monster JSON Data"
        gotoImportJSONButton.onclick = async function () 
        {
            self.ShowSubMenu(false);
            self.ShowImportJSONMenu(true);
            self.renderCustomImportForm(document);
        }

        this.mainFooterContainer.appendChild(gotoImportJSONButton);
    }

    private AppendUnitSaveButton(): void
    {
        var self = this;
        //Get Button Container
        const buttonContainer = document.getElementById("buttonContainer");

        //Create Save Button
        const saveButton = document.createElement('input');
        saveButton.type = "image";
        saveButton.id = "saveButton";
        saveButton.className = "clickable";
        saveButton.onclick = async function () 
        {
            //Validate form inputs
            self.currentUnit.ImportCustomFormInputs(document);
            //Save to DB
            if (self.multiSheet)
            {
                const baseName = self.currentUnit.unitName;
                let unitSaveList: IUnitInfo[] = [];
                for (var i = 0, id; id = self.multiIds[i]; i++) 
                {
                    self.currentUnit.id = id;
                    self.currentUnit.tokenId = id;
                    self.currentUnit.isActive = self.multiActive[i] === "true" ? 1 : 0;
                    self.currentUnit.unitName = baseName + ` ${String.fromCharCode('A'.charCodeAt(0) + i)}`;
                    const copyStart = JSON.stringify(self.currentUnit);
                    const copyEnd = JSON.parse(copyStart);
                    unitSaveList.push(copyEnd);
                }

                await OBR.scene.items.updateItems(
                    (item: Item) => item.id === unitSaveList.find(unit => unit.id === item.id)?.id,
                    (items: Image[]) =>
                    {
                        for (let item of items)
                        {
                            item.text.plainText = unitSaveList.find(unit => unit.id === item.id)!.unitName!;
                        };
                    });
                await db.ActiveEncounter.bulkPut(unitSaveList);
            }
            else
            {
                await db.ActiveEncounter.put(self.currentUnit, self.POPOVERSUBMENUID);

                //Update name in OBR
                await OBR.scene.items.updateItems(
                    (item: Item) => item.id == self.currentUnit.id,
                    (items: Image[]) =>
                    {
                        for (let item of items)
                        {
                            item.text.plainText = self.currentUnit.unitName;
                        };
                    });
            }
        }
        saveButton.src = "/save.svg";
        saveButton.title = "Save Changes";
        saveButton.height = 20;
        saveButton.width = 20;

        buttonContainer?.appendChild(saveButton);
    }

    private AppendFavoriteButton(): void
    {
        var self = this;
        //Get Button Container
        const buttonContainer = document.getElementById("buttonContainer");

        //Create Favorite Button
        const favoriteButton = document.createElement('input');
        favoriteButton.type = "image";
        favoriteButton.id = "favoriteButton";
        favoriteButton.value = "false";
        favoriteButton.className = "clickable";
        favoriteButton.onclick = async function () 
        {
            const collectionButton = <HTMLInputElement>document.getElementById("collectionButton");
            if (favoriteButton.value == "false")
            {
                favoriteButton.value = "true";
                favoriteButton.src = "/favorite.svg";
                favoriteButton.className = "clickable favorite";
                collectionButton.className = "clickable favorite";
                collectionButton.title = "Save to Collection & Favorite";
                self.favorite = true;
            }
            else
            {
                favoriteButton.value = "false";
                favoriteButton.src = "/favoriteline.svg";
                favoriteButton.className = "clickable";
                collectionButton.className = "clickable";
                collectionButton.title = "Save to Collection";
                self.favorite = false;
            }
        }
        favoriteButton.src = "/favoriteline.svg";
        favoriteButton.title = "Toggle Favorite on Export";
        favoriteButton.height = 20;
        favoriteButton.width = 20;

        buttonContainer?.appendChild(favoriteButton);
    }

    private AppendCollectionSaveButton(): void
    {
        var self = this;
        //Get Button Container
        const buttonContainer = document.getElementById("buttonContainer");

        //Create Collect Button
        const saveButton = document.createElement('input');
        saveButton.type = "image";
        saveButton.id = "collectionButton";
        saveButton.className = "clickable";
        saveButton.onclick = async function () 
        {
            //Validate form inputs
            self.currentUnit.ImportCustomFormInputs(document);
            const authorName = await OBR.player.getName();

            //Clean Unit and remove Ids
            let cleanCopy: UnitInfo = JSON.parse(JSON.stringify(self.currentUnit));
            cleanCopy.id = "";
            cleanCopy.tokenId = "";
            cleanCopy.dataSlug = authorName;

            //Check DB for Creature by same name
            const dupe = await db.Creatures.get({ unitName: self.currentUnit.unitName, dataSlug: authorName });
            if (dupe)
            {
                if (confirm(`Unit named '${self.currentUnit.unitName}' already found in Collection. Overwrite?`))
                {
                    // Has permission to save
                    cleanCopy.id = dupe.id;
                    cleanCopy.favorite = self.favorite;
                    await db.Creatures.put(cleanCopy, dupe.id);
                }
            }
            else
            {
                // Doesn't need permission
                const freshGuid = Utilities.GetGUID();
                cleanCopy.id = freshGuid;
                cleanCopy.favorite = self.favorite;
                await db.Creatures.put(cleanCopy, freshGuid);
            }
        }
        saveButton.src = "/collection.svg";
        saveButton.title = "Save to Collection";
        saveButton.height = 20;
        saveButton.width = 20;

        buttonContainer?.appendChild(saveButton);
    }

    private AppendUnitExportButton(): void
    {
        var self = this;
        //Get Button Container
        const buttonContainer = document.getElementById("buttonContainer");

        //Create Export Button
        const exportButton = document.createElement('input');
        exportButton.type = "image";
        exportButton.id = "exportButton";
        exportButton.className = "clickable";
        exportButton.onclick = async function () 
        {
            //Validate form inputs
            self.currentUnit.ImportCustomFormInputs(document);
            self.currentUnit.id = "";
            self.currentUnit.tokenId = "";
            try
            {
                await navigator.clipboard.writeText(JSON.stringify(self.currentUnit));
                window.alert("JSON Copied to clipboard.");
            }
            catch
            {
                window.alert("Unable to copy; Please try again.");
            }
        }
        exportButton.src = "/export.svg";
        exportButton.title = "Export to JSON";
        exportButton.height = 20;
        exportButton.width = 20;

        buttonContainer?.appendChild(exportButton);
    }

    private AppendAddActionButtons(): void
    {
        //Get Button Container
        const legendaryButtonContainer = document.getElementById("addLegendaryButtonContainer");

        //Create Add Legendary Button
        const addLegendaryButton = document.createElement('input');
        addLegendaryButton.type = "image";
        addLegendaryButton.id = "addButton";
        addLegendaryButton.title = "Add new Legendary Action"
        addLegendaryButton.className = "clickable";
        addLegendaryButton.onclick = async function () 
        {
            //Add a blank action
            const legendCollection = <HTMLElement>document.getElementById("formLegendaryCollection");
            const baseLegendHtml = `<div id="formLegendaryContainer" class="Legendary"><span id="formLegendaryName" class="legendaryname" contentEditable="true">Legend-Name.</span>.
                <span id="formLegendaryDesc" class="description" contentEditable="true">Legend-Desc</span></div>`;
            legendCollection.insertAdjacentHTML('beforeend', baseLegendHtml);
        }
        addLegendaryButton.src = "/add.svg";
        addLegendaryButton.height = 20;
        addLegendaryButton.width = 20;

        legendaryButtonContainer?.appendChild(addLegendaryButton);

        //Get Button Container
        const reactionButtonContainer = document.getElementById("addReactionButtonContainer");

        //Create Add Reaction Button
        const addReactionButton = document.createElement('input');
        addReactionButton.type = "image";
        addReactionButton.id = "addButton";
        addReactionButton.title = "Add new Reaction"
        addReactionButton.className = "clickable";
        addReactionButton.onclick = async function () 
        {
            //Add a blank action
            const reactCollection = <HTMLElement>document.getElementById("formReactionCollection");
            const baseReactHtml = `<div id="formReactionContainer" class="Reaction"><span id="formReactionName" class="reactionname" contentEditable="true">React-Name.</span>.
                <span id="formReactionDesc" class="description" contentEditable="true">React-Desc</span></div>`;
            reactCollection.insertAdjacentHTML('beforeend', baseReactHtml);
        }
        addReactionButton.src = "/add.svg";
        addReactionButton.height = 20;
        addReactionButton.width = 20;

        reactionButtonContainer?.appendChild(addReactionButton);

        //Get Button Container
        const attackButtonContainer = document.getElementById("addAttackButtonContainer");

        //Create Add Attack Button
        const addAttackButton = document.createElement('input');
        addAttackButton.type = "image";
        addAttackButton.id = "addButton";
        addAttackButton.title = "Add new Attack"
        addAttackButton.className = "clickable";
        addAttackButton.onclick = async function () 
        {
            //Add a blank action
            const attackCollection = <HTMLElement>document.getElementById("formAttackCollection");
            const baseAttackHtml = `<div id="formAttackContainer" class="attack"><span id="formAttackName" class="attackname" contentEditable="true">Atk-Name.</span>.
                <span id="formAttackDesc" class="description" contentEditable="true">Atk-Desc</span></div>`;
            attackCollection.insertAdjacentHTML('beforeend', baseAttackHtml);
        }
        addAttackButton.src = "/add.svg";
        addAttackButton.height = 20;
        addAttackButton.width = 20;

        attackButtonContainer?.appendChild(addAttackButton);


        //Get Button Container
        const abilityButtonContainer = document.getElementById("addAbilityButtonContainer");

        //Create Add Ability Button
        const addAbilityButton = document.createElement('input');
        addAbilityButton.type = "image";
        addAbilityButton.id = "addButton";
        addAbilityButton.className = "clickable";
        addAbilityButton.title = "Add new Ability";
        addAbilityButton.onclick = async function () 
        {

            //Add a blank ability
            const abilityCollection = <HTMLElement>document.getElementById("formAbilityCollection");
            const baseabilityHtml = `<div id="formAbilityContainer" class="ability"><span id="formAbilityName" class="abilityname" contentEditable="true">Act-Name.</span>.
                <span id="formAbilityDesc" class="description" contentEditable="true">Act-Desc</span></div>`;
            abilityCollection.insertAdjacentHTML('beforeend', baseabilityHtml);
        }
        addAbilityButton.src = "/add.svg";
        addAbilityButton.height = 20;
        addAbilityButton.width = 20;

        abilityButtonContainer?.appendChild(addAbilityButton);


        //Get Button Container
        const spellButtonContainer = document.getElementById("addSpellButtonContainer");

        //Create Add SPELL Button
        const addSpellButton = document.createElement('input');
        addSpellButton.type = "image";
        addSpellButton.id = "addButton";
        addSpellButton.title = "Add new Spell";
        addSpellButton.className = "clickable";
        addSpellButton.onclick = async function () 
        {
            //Add a blank SPELL
            const abilityCollection = <HTMLElement>document.getElementById("formSpellCollection");
            const baseabilityHtml = `<div id="formSpellContainer" class="spell"><span id="formSpellName" class="spellname" contentEditable="true">Spell-Name.</span>.
                <span id="formSpellDesc" class="description" contentEditable="true">Spell-Desc</span></div>`;
            abilityCollection.insertAdjacentHTML('beforeend', baseabilityHtml);
        }
        addSpellButton.src = "/add.svg";
        addSpellButton.height = 20;
        addSpellButton.width = 20;

        spellButtonContainer?.appendChild(addSpellButton);
    }

    private ShowSubMenu(show: boolean): void
    {
        const page = document.querySelector<HTMLDivElement>('#submenu')!;
        page.hidden = !show;

        this.importReturnContainer.hidden = true;
        this.importBarContainer.hidden = true;
        this.searchBarContainer.hidden = true;
        this.mainFooterContainer.hidden = false;
    }

    private ShowSearchMenu(show: boolean): void
    {
        const page = document.querySelector<HTMLDivElement>('#searchmenu')!;
        page.hidden = !show;

        this.importReturnContainer.hidden = true;
        this.importBarContainer.hidden = true;
        this.searchBarContainer.hidden = false;
        this.mainFooterContainer.hidden = true;
    }

    private ShowImportJSONMenu(show: boolean): void
    {
        const page = document.querySelector<HTMLDivElement>('#importjsonmenu')!;
        page.hidden = !show;

        this.importReturnContainer.hidden = false;
        this.importBarContainer.hidden = false;
        this.searchBarContainer.hidden = true;
        this.mainFooterContainer.hidden = true;
    }

    private async ImportNewMonsterInfo(slug: string): Promise<void>
    {
        await fetch(`https://api.open5e.com/monsters/${slug}/?format=json`)
            .then(function (response)
            {
                //Parse the data into a usable state
                return response.json();
            }).then(async function (data)
            {
                let importUnit = new UnitInfo(subMenu.POPOVERSUBMENUID);

                const list = document.querySelector<HTMLDivElement>('#monsterList')!;
                list.innerHTML = `<div class="superCenter">Loading...</div>`;
                await importUnit.ImportOpen5eResponse(data);
                importUnit.isActive = subMenu.currentUnit.isActive;
                importUnit.currentHP = importUnit.maxHP;
                subMenu.freshImport = true;

                subMenu.currentUnit = importUnit;
                subMenu.renderUnitInfo(document);
            });
    }

    private async ImportCollectionMonsterInfo(id: string): Promise<void>
    {
        const unit = await db.Creatures.get(id);
        if (unit)
        {
            subMenu.freshImport = true;
            subMenu.currentUnit.SetToModel(unit);
            subMenu.renderUnitInfo(document);
        }
    }

    private async DeleteCollectionMonsterInfo(id: string): Promise<void>
    {
        // Syntax is 'del-[monsterid]'
        const cleanedId = id.substring(4);
        await db.Creatures.delete(cleanedId);
        let node = document.getElementById(`listItem-${cleanedId}`);
        node?.remove();
    }

    private SetClassOnRollable(desc: string): string
    {
        let string = "";
        string = desc.replaceAll(Constants.PARENTHESESMATCH, "<span class='clickableRollerDmg' contenteditable='false'>($1)</span>");
        string = string.replaceAll(Constants.PLUSMATCH, "<span class='clickableRollerAtk' contenteditable='false'> $1 </span>");
        return string;
    }

    private async SendtoChatLog(message: string, crit = false): Promise<void>
    {
        const settingData = await db.Settings.get(Constants.SETTINGSID);
        const targetId = settingData?.gmRumbleLog ? this.userId : "0000";

        const now = new Date().toISOString();
        const metadata: Metadata = {};
        metadata[`${Constants.EXTENSIONID}/metadata_chatlog`] = { chatlog: message, sender: "Clash!", targetId: targetId, created: now, color: "#ff9294", critical: crit };
        return await OBR.player.setMetadata(metadata);
    }
}

// Render from main list
const subMenu = new SubMenu();
subMenu.renderUnitInfo(document);