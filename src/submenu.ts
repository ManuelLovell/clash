import { Constants } from './constants';
import '/src/css/mini-style.css'
import OBR, { Metadata } from '@owlbear-rodeo/sdk';
import UnitInfo from './unit-info';
import { Open5eMonsterListResponse, Open5eMonsterResponse } from './interfaces/api-response-open5e';

export class SubMenu
{
    currentUnit: UnitInfo = new UnitInfo();
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
                const items = await OBR.scene.items.getItems([this.POPOVERSUBMENUID]);
                const metadata = items[0].metadata[`${Constants.EXTENSIONID}/metadata`] as Metadata;
                this.currentUnit = metadata.unitInfo as UnitInfo;
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
                    unitActionsHtml += `<span id="formAttackDesc" class="description" contentEditable="true">${action.desc}</span>`;
                    if (action.attack_bonus)
                    {
                        unitActionsHtml += `DOATHING${action.attack_bonus}`;
                    }
                    if (action.damage_dice)
                    {
                        unitActionsHtml += `DOATHING${action.damage_dice}`;
                    }
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
            </div>
            <footer id="footerButtonContainer">
            </footer>
           `;

            this.AppendUnitSaveButton();
            this.AppendAddActionButtons();
            this.AppendImportUnitButton();
            this.AppendJSONButton();
        });
    }

    public async renderSearchForm(document: Document): Promise<void>
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
        searchValueButton.onclick = function async() 
        {
        }

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
                    console.log(data);
                    const list = document.querySelector<HTMLDivElement>('#monsterList')!;
                    list.innerHTML = "";
                    let monsterInformationHtml = "";
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

    public async renderCustomImportForm(document: Document): Promise<void>
    {
        var self = this;
        document.querySelector<HTMLDivElement>('#importjsonmenu')!.innerHTML = `
            <h2>Import Custom JSON</h2>
            <div id="importDataContainer"></div>
            <div class="hr"></div>
            <div class = "red" id="exampleLine>Example Input</div>
            <div id="instructionsContainer"></div>
            <h3>Format</h3>
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
            console.log(`I'm importing this; ${importValueButton.value}`);
            const customData = importValueButton.value;

            let importUnit = new UnitInfo();
            try 
            {
                let jsonData: Open5eMonsterResponse = JSON.parse(customData);
                importUnit.ImportOpen5eResponse(jsonData);
    
                subMenu.freshImport = true;
    
                subMenu.currentUnit = importUnit;
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
        let exampleInterface = `{</br>
            name: string;</br>
            size: string;</br>
            type: string;</br>
            alignment: string;</br>
            armor_class: number;</br>
            hit_points: number;</br>
            speed: Speed;</br>
            strength: number;</br>
            dexterity: number;</br>
            constitution: number;</br>
            intelligence: number;</br>
            wisdom: number;</br>
            charisma: number;</br>
            strength_save: number;</br>
            dexterity_save: number;</br>
            constitution_save: number;</br>
            intelligence_save: number;</br>
            wisdom_save: number;</br>
            charisma_save?: number;</br>
            perception: number;</br>
            damage_vulnerabilities: string;</br>
            damage_resistances: string;</br>
            damage_immunities: string;</br>
            condition_immunities: string;</br>
            senses: string;</br>
            languages: string;</br>
            challenge_rating: string;</br>
            actions: ActionsEntity[];</br>
            reactions: ActionsEntity[];</br>
            legendary_actions: ActionsEntity[];</br>
            special_abilities: ActionsEntity[];</br>
          }`;

        return exampleInterface;
    }

    private exampleTypesString(): string
    {
        const exampleType = `
        <b>Speed</b></br>
        {</br>
          swim: number;</br>
          burrow: number;</br>
          walk: number;</br>
          fly: number;</br>
          climb: number;</br>
        }</br>
      
        <b>ActionsEntity</b> </br>
        {</br>
          name?: string;</br>
          desc?: string;</br>
        }</br>
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
        gotoSearchButton.onclick = function async() 
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
        gotoImportJSONButton.onclick = function async() 
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
        saveButton.onclick = function async() 
        {
            OBR.onReady(async () =>
            {
                //Validate form inputs
                let unitInfo = new UnitInfo();
                unitInfo.ImportCustomFormInputs(document);

                //Save new unit information to OBR
                await OBR.scene.items.updateItems(
                    (item) => item.id === self.POPOVERSUBMENUID,
                    (items) =>
                    {
                        for (let item of items)
                        {
                            item.name = unitInfo.unitName;
                            item.metadata[`${Constants.EXTENSIONID}/metadata`] = { unitInfo };
                        }
                    }
                );
            });
        }
        saveButton.src = "/save.svg";
        saveButton.title = "Save Changes";
        saveButton.height = 20;
        saveButton.width = 20;

        buttonContainer?.appendChild(saveButton);
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
        addAttackButton.onclick = function async() 
        {

            //Add a blank action
            const attackCollection = <HTMLElement>document.getElementById("formAttackCollection");
            const baseAttackHtml = `<div id="formAttackContainer" class="attack"><span id="formAttackName" class="attackname" contentEditable="true">Act-Name.</span>.
                <span id="formAttackDesc" class="description" contentEditable="true">Act-Desc</span></div>`;
            attackCollection.insertAdjacentHTML('beforeend', baseAttackHtml);
        }
        addAttackButton.src = "/add.svg";
        addAttackButton.height = 20;
        addAttackButton.width = 20;

        attackButtonContainer?.appendChild(addAttackButton);


        //Get Button Container
        const buttonContainer = document.getElementById("addAbilityButtonContainer");

        //Create Add Ability Button
        const addAbilityButton = document.createElement('input');
        addAbilityButton.type = "image";
        addAbilityButton.id = "addButton";
        addAbilityButton.title = "Add new Ability";
        addAbilityButton.onclick = function async() 
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

        buttonContainer?.appendChild(addAbilityButton);
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

    public ImportNewMonsterInfo(slug: string): void
    {
        fetch(`https://api.open5e.com/monsters/${slug}/?format=json`)
            .then(function (response)
            {
                // The response is a Response instance.
                // You parse the data into a useable format using `.json()`
                return response.json();
            }).then(function (data)
            {
                // `data` is the parsed version of the JSON returned from the above endpoint.
                console.log(data);  // { "userId": 1, "id": 1, "title": "...", "body": "..." }

                let importUnit = new UnitInfo();
                importUnit.ImportOpen5eResponse(data);
                subMenu.freshImport = true;

                subMenu.currentUnit = importUnit;
                subMenu.renderUnitInfo(document);
            });
    }
}

// Render from main list
const subMenu = new SubMenu();
subMenu.renderUnitInfo(document);