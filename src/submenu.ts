import { Constants } from './constants';
import OBR from '@owlbear-rodeo/sdk';
import UnitInfo from './unit-info';
import { Open5eMonsterListResponse } from './interfaces/api-response-open5e';
import { DiceRoller } from './dice-roller';
import { db } from './local-database';
import '/src/css/mini-style.css'

export class SubMenu
{
    currentUnit: any;
    freshImport: boolean = false;
    open5eApiString: string = "https://api.open5e.com/monsters/?format=json&search=";
    POPOVERSUBMENUID: string = "";

    public async renderUnitInfo(document: Document): Promise<void>
    {
        // If there's no ID, just give up.
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        this.POPOVERSUBMENUID = urlParams.get('unitid')!;

        if (this.POPOVERSUBMENUID == undefined) return;
   
        this.ShowSearchMenu(false);
        this.ShowImportJSONMenu(false);
        this.ShowSubMenu(true);
        OBR.onReady(async () =>
        {
            if (!this.freshImport)
            {
                this.currentUnit = await db.ActiveEncounter.get(this.POPOVERSUBMENUID);
                if (this.currentUnit == undefined)
                {
                    console.log("Found no UnitInformation for " + this.POPOVERSUBMENUID);
                    return;
                }
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
            unitScoresHtml += '<tr><th>STR    </th><th>DEX   </th><th>CON    </th><th>INT   </th><th>WIS   </th><th>CHA   </th></tr>';
            unitScoresHtml += `<tr><td><span id="formStrScore" contentEditable="true">${this.currentUnit.strScore}</span></td>
                            <td><span id="formDexScore" contentEditable="true">${this.currentUnit.dexScore}</span></td>
                            <td><span id="formConScore" contentEditable="true">${this.currentUnit.conScore}</span></td>
                            <td><span id="formIntScore" contentEditable="true">${this.currentUnit.intScore}</span></td>
                            <td><span id="formWisScore" contentEditable="true">${this.currentUnit.wisScore}</span></td>
                            <td><span id="formChaScore" contentEditable="true">${this.currentUnit.chaScore}</span></td></tr>`;
            unitScoresHtml += '</table>';

            //Unit Save Scores
            let unitSavesHtml = '<div class="center red bold">Saving Throws</div><table>';
            unitSavesHtml += `<tr><td><span id="formStrSave" contentEditable="true">${this.currentUnit.strSave}</span></td>
                            <td><span id="formDexSave" contentEditable="true">${this.currentUnit.dexSave}</span></td>
                            <td><span id="formConSave" contentEditable="true">${this.currentUnit.conSave}</span></td>
                            <td><span id="formIntSave" contentEditable="true">${this.currentUnit.intSave}</span></td>
                            <td><span id="formWisSave" contentEditable="true">${this.currentUnit.wisSave}</span></td>
                            <td><span id="formChaSave" contentEditable="true">${this.currentUnit.chaSave}</span></td></tr>`;
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
                    unitAbilitiesHtml += `<span id="formAbilityDesc" class="description" contentEditable="true">${action.desc}</span>`;
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
            let unitReactionsHtml = "";
            if (this.currentUnit.reactions && this.currentUnit.reactions?.length > 0)
            {
                unitReactionsHtml += `<div id="formReactionCollection"><div class="actions red">Reactions</div><div class="hr"></div>`;
                for (let action of this.currentUnit.reactions)
                {
                    unitReactionsHtml += `<div id="formReactionContainer" class="Reaction">`;
                    unitReactionsHtml += `<span id="formReactionName" class="reactionname">${action.name}</span>.  `;
                    unitReactionsHtml += `<span id="formReactionDesc" class="description">${action.desc}</span>`;
                    unitReactionsHtml += `</div>`;
                }
                unitReactionsHtml += "</div>";
            }

            //Unit Legendary Actions
            let unitLegendaryHtml = "";
            if (this.currentUnit.legendaryActions && this.currentUnit.legendaryActions?.length > 0)
            {
                unitLegendaryHtml += `<div id="formLegendaryCollection"><div class="actions red">Legendary Actions</div><div class="hr"></div>`;
                for (let action of this.currentUnit.legendaryActions)
                {
                    unitLegendaryHtml += `<div id="formLegendaryContainer" class="Legendary">`;
                    unitLegendaryHtml += `<span id="formLegendaryName" class="legendaryname">${action.name}</span>.  `;
                    unitLegendaryHtml += `<span id="formLegendaryDesc" class="description">${action.desc}</span>`;
                    unitLegendaryHtml += `</div>`;
                }
                unitLegendaryHtml += "</div>";
            }

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
            ${unitReactionsHtml}
            ${unitLegendaryHtml}
            <div class="actions red">Spell List<span id="addSpellButtonContainer" class="floatright"></span></div>
            <div class="hr"></div>
            ${unitSpellsHtml}
            </div>
            <footer id="footerButtonContainer">
            </footer>
           `;

            this.AppendUnitExportButton();
            this.AppendUnitSaveButton();
            this.AppendAddActionButtons();
            this.AppendImportUnitButton();
            this.AppendJSONButton();

            const rollables = document.querySelectorAll('.clickableRoller');
            rollables.forEach(roller =>
            {
                roller.addEventListener('click', async (e: Event) =>
                {
                    if (e && e.currentTarget)
                    {
                        e.preventDefault();
                        const value = e.currentTarget as Element;
                        value.parentElement?.blur();
                        return await OBR.notification.show(`Rolled ${value.textContent} for ... ${DiceRoller.RollString(value.textContent!)}!`);
                    }
                    return null;
                });
            });
        });
    }

    private async renderSearchForm(document: Document): Promise<void>
    {
        var self = this;
        document.querySelector<HTMLDivElement>('#searchmenu')!.innerHTML = `
            <div id="searchResultsContainer"><ol id="monsterList"></ol></div>
            <footer><span class="returnFloatLeft" id="searchReturnContainer"></span><span class="returnFloatRight" id="searchFooterButtonContainer"></span></footer>
           `;

        const searchReturnContainer = document.getElementById("searchReturnContainer");
        const searchBarContainer = document.getElementById("searchFooterButtonContainer");

        //Create Return Button
        const goBackButton = document.createElement('input');
        goBackButton.type = "image";
        goBackButton.id = "returnButton";
        goBackButton.className = "Icon";
        goBackButton.title = "Go back to Unit Information"
        goBackButton.onclick = function async() 
        {
            self.ShowSearchMenu(false);
            self.ShowSubMenu(true);
        }
        goBackButton.src = "/return.svg";
        goBackButton.height = 20;
        goBackButton.width = 20;

        //Create Search Input Button
        const searchValueButton = document.createElement('input');
        searchValueButton.type = "search";
        searchValueButton.id = "searchValue";
        searchValueButton.className = "";
        searchValueButton.title = "Type a value to filter monsters by"

        //Create Search Confirm Button
        const searchConfirmButton = document.createElement('input');
        searchConfirmButton.type = "button";
        searchConfirmButton.id = "searchConfirm";
        searchConfirmButton.value = "Search";
        searchConfirmButton.className = "";
        searchConfirmButton.title = "Click to send Search"
        searchConfirmButton.onclick = function async() 
        {
            fetch(`${self.open5eApiString}${searchValueButton.value}`)
                .then(function (response)
                {
                    return response.json();
                }).then(function (data: Open5eMonsterListResponse)
                {
                    const list = document.querySelector<HTMLDivElement>('#monsterList')!;
                    list.innerHTML = "";
                    let monsterInformationHtml = "";

                    if (data.count == 0)
                    {
                        list.innerHTML = "<div class='Nothing'>No results found.</div>";
                    }
                    else
                    {
                        data.results.forEach((monster) =>
                        {
                            const importThis = document.createElement('input');
                            importThis.type = "button";
                            importThis.id = `${monster.slug}`;
                            importThis.className = "monsterImportButtonConfirm"
                            importThis.value = "Import";
                            importThis.title = `Import ${monster.name} onto this Unit`;

                            monsterInformationHtml += `<li><div class="monsterNameList">${TruncateName(monster.name)}</div><div class="monsterImportButtonContainer">${importThis.outerHTML}</div></li>`;
                        });
                        list.innerHTML = monsterInformationHtml;
                        const btns = document.querySelectorAll('.monsterImportButtonConfirm');
                        btns.forEach(btn =>
                        {
                            btn.addEventListener('click', (e: Event) => self.ImportNewMonsterInfo((e.currentTarget as Element).id));
                        });
                    }

                });
        }

        searchReturnContainer?.append(goBackButton);
        searchBarContainer?.append(searchValueButton);
        searchBarContainer?.append(searchConfirmButton);

        function TruncateName(name: string): string
        {
            if (name.length > 20)
            {
                return name.substring(0, 20) + "...";
            }
            return name;
        }
    }

    private async renderCustomImportForm(document: Document): Promise<void>
    {
        var self = this;
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
            <footer><span class="returnFloatLeft" id="importReturnContainer"></span><span class="returnFloatRight" id="importFooterButtonContainer"></span></footer>
           `;

        const importDataContainer = document.getElementById("importDataContainer");
        const importReturnContainer = document.getElementById("importReturnContainer");
        const importBarContainer = document.getElementById("importFooterButtonContainer");

        //Create Return Button
        const goBackButton = document.createElement('input');
        goBackButton.type = "image";
        goBackButton.id = "returnButton";
        goBackButton.className = "Icon";
        goBackButton.title = "Go back to Unit Information"
        goBackButton.onclick = function async() 
        {
            self.ShowImportJSONMenu(false);
            self.ShowSubMenu(true);
        }
        goBackButton.src = "/return.svg";
        goBackButton.height = 20;
        goBackButton.width = 20;

        //Create import Input Button
        const importValueButton = document.createElement('textarea');
        importValueButton.id = "customJsonValueBox";
        importValueButton.className = "";
        importValueButton.title = "Type custom monster information here"

        //Create import Confirm Button
        const importConfirmButton = document.createElement('input');
        importConfirmButton.type = "button";
        importConfirmButton.id = "importConfirm";
        importConfirmButton.value = "Confirm Import";
        importConfirmButton.className = "";
        importConfirmButton.title = "Click to import custom data"
        importConfirmButton.onclick = function async() 
        {
            const customData = importValueButton.value;

            try 
            {
                let clashData: UnitInfo = JSON.parse(customData);
                clashData.id = subMenu.POPOVERSUBMENUID;
                clashData.tokenId = subMenu.POPOVERSUBMENUID;

                subMenu.freshImport = true;

                subMenu.currentUnit = clashData;
                subMenu.renderUnitInfo(document);

            }
            catch (error) 
            {
                alert(`The import failed - ${error}`);
            }
        }

        importReturnContainer?.append(goBackButton);
        importDataContainer?.append(importValueButton);
        importBarContainer?.append(importConfirmButton);
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

        //Get footer Container
        const footerContainer = document.getElementById("footerButtonContainer");

        const gotoSearchButton = document.createElement('input');
        gotoSearchButton.type = "button";
        gotoSearchButton.id = "gotoMonsterSearchButton";
        gotoSearchButton.value = "Search Monster Data"
        gotoSearchButton.className = "";
        gotoSearchButton.title = "Search Monster Data from Free Open5e"
        gotoSearchButton.onclick = async function() 
        {
            self.ShowSubMenu(false);
            self.ShowSearchMenu(true);
            self.renderSearchForm(document);
        }

        footerContainer?.appendChild(gotoSearchButton);
    }

    private AppendJSONButton(): void
    {
        var self = this;

        //Get footer Container
        const footerContainer = document.getElementById("footerButtonContainer");

        const gotoImportJSONButton = document.createElement('input');
        gotoImportJSONButton.type = "button";
        gotoImportJSONButton.id = "gotoImportMonsterButton";
        gotoImportJSONButton.value = "Import Custom JSON"
        gotoImportJSONButton.className = "";
        gotoImportJSONButton.title = "Import Custom Monster JSON Data"
        gotoImportJSONButton.onclick = async function() 
        {
            self.ShowSubMenu(false);
            self.ShowImportJSONMenu(true);
            self.renderCustomImportForm(document);
        }

        footerContainer?.appendChild(gotoImportJSONButton);
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
            let unitInfo = new UnitInfo(self.POPOVERSUBMENUID);
            unitInfo.ImportCustomFormInputs(document);
            unitInfo.isActive = self.currentUnit.isActive;

            //Save to DB
            await db.ActiveEncounter.put(unitInfo, self.POPOVERSUBMENUID);
        }
        saveButton.src = "/save.svg";
        saveButton.title = "Save Changes";
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
        exportButton.onclick = async function() 
        {
            //Validate form inputs
            let unitInfo = new UnitInfo(self.POPOVERSUBMENUID);
            unitInfo.ImportCustomFormInputs(document);
            unitInfo.id = "";
            unitInfo.tokenId = "";

            await navigator.clipboard.writeText(JSON.stringify(unitInfo));
            window.alert("JSON Copied to clipboard.");
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
        const attackButtonContainer = document.getElementById("addAttackButtonContainer");

        //Create Add Attack Button
        const addAttackButton = document.createElement('input');
        addAttackButton.type = "image";
        addAttackButton.id = "addButton";
        addAttackButton.title = "Add new Attack"
        addAttackButton.className = "clickable";
        addAttackButton.onclick = async function() 
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
        addAbilityButton.onclick = async function() 
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
        addSpellButton.onclick = async function() 
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
    }

    private ShowSearchMenu(show: boolean): void
    {
        const page = document.querySelector<HTMLDivElement>('#searchmenu')!;
        page.hidden = !show;
    }

    private ShowImportJSONMenu(show: boolean): void
    {
        const page = document.querySelector<HTMLDivElement>('#importjsonmenu')!;
        page.hidden = !show;
    }

    private ImportNewMonsterInfo(slug: string): void
    {
        fetch(`https://api.open5e.com/monsters/${slug}/?format=json`)
            .then(function (response)
            {
                //Parse the data into a usable state
                return response.json();
            }).then(async function (data)
            {
                let importUnit = new UnitInfo(subMenu.POPOVERSUBMENUID);
                await importUnit.ImportOpen5eResponse(data);
                importUnit.isActive = subMenu.currentUnit.isActive;
                subMenu.freshImport = true;

                subMenu.currentUnit = importUnit;
                subMenu.renderUnitInfo(document);
            });
    }

    private SetClassOnRollable(desc: string): string
    {
        return desc.replaceAll(Constants.PARENTHESESMATCH, "<span class='clickableRoller' contenteditable='false'>($1)</span>");
    }
}

// Render from main list
const subMenu = new SubMenu();
subMenu.renderUnitInfo(document);