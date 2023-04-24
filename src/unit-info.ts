import { IActionsEntity, IOpen5eMonsterResponse, IOpen5eSpellResponse } from './interfaces/api-response-open5e';
import { IUnitInfo } from './interfaces/unit-info';
import { db } from './local-database';

export default class UnitInfo implements IUnitInfo
{
    id: string;
    tokenId?: string;
    initiative: number;
    currentHP: number;
    isMonster?: number;
    isActive?: number;

    unitName: string;
    maxHP: number;
    armorClass: number;

    unitType: string;
    unitSize: string;

    strScore: number;
    strSave: number;

    dexScore: number;
    dexSave: number;

    conScore: number;
    conSave: number;

    intScore: number;
    intSave: number;

    wisScore: number;
    wisSave: number;

    chaScore: number;
    chaSave: number;

    damageVulnerabilities: string;
    damageImmunities: string;
    damageResistances: string;
    conditionImmunities: string;

    challengeRating: string;
    experiencePoints: number;
    alignment: string;

    standardActions: IActionsEntity[];
    legendaryActions?: IActionsEntity[];
    specialAbilities?: IActionsEntity[];
    spellActions?: IActionsEntity[];
    reactions?: IActionsEntity[];

    spellList?: string[];
    senses: string;
    //skills?: SkillSetObject;
    languages: string;

    speedWalk: number;
    speedFly: number;
    speedClimb: number;
    speedBurrow: number;
    speedSwim: number;

    // Set the base values that the form needs to not error out and display correctly.
    constructor(tokenId: string, name?: string)
    {
        this.id = tokenId;
        this.tokenId = tokenId;
        this.isActive = 0;
        this.unitName = name ??= "Default";
        this.initiative = 1;
        this.currentHP = 4;
        this.maxHP = 4;
        this.armorClass = 10;
        this.speedWalk = 30;
        this.speedBurrow = 0;
        this.speedSwim = 0;
        this.speedClimb = 0;
        this.speedFly = 0;
        this.strScore = 10;
        this.dexScore = 10;
        this.conScore = 10;
        this.intScore = 10;
        this.wisScore = 10;
        this.chaScore = 10;
        this.strSave = 2;
        this.dexSave = 2;
        this.conSave = 2;
        this.intSave = 2;
        this.wisSave = 2;
        this.chaSave = 2;
        this.senses = "No unique senses.";
        this.unitSize = "Medium";
        this.unitType = "Humanoid";
        this.alignment = "True Neutral";
        this.languages = "No known languages."
        this.damageVulnerabilities = "None."
        this.damageResistances = "None."
        this.damageImmunities = "None."
        this.conditionImmunities = "None."
        this.challengeRating = "0CR.";
        this.experiencePoints = 0;
        this.standardActions = [];
        this.specialAbilities = [];
        this.spellList = [];
    }

    /** Import Custom JSON data to a UnitInfo model */
    public ImportFromJSON(data: string): void
    {
        let clashData: IUnitInfo = JSON.parse(data);
        this.SetToModel(clashData);
    }

    /** Import via database ID to a UnitInfo model */
    public async ImportFromDatabase(dbId: string): Promise<void>
    {
        const dbUnit = await db.ActiveEncounter.get(dbId);
        if (!dbUnit)
        {
            console.log("Found no UnitInformation for " + dbId);
            return;
        }
        this.SetToModel(dbUnit);
        // If pulling from the database, it's an insystem load
        // transfer isActive status
        this.isActive = dbUnit.isActive;
    }

    private SetToModel(unit: IUnitInfo): void
    {
        this.initiative = unit.initiative;
        this.currentHP = unit.maxHP
        this.maxHP = unit.maxHP;

        this.isMonster = unit.isMonster;

        this.unitName = unit.unitName;
        this.armorClass = unit.armorClass;
        this.unitType = unit.unitType;
        this.unitSize = unit.unitSize;

        this.strScore = unit.strScore;
        this.strSave = unit.strSave;

        this.dexScore = unit.dexScore;
        this.dexSave = unit.dexSave;

        this.conScore = unit.conScore;
        this.conSave = unit.conSave;

        this.intScore = unit.intScore;
        this.intSave = unit.intSave;

        this.wisScore = unit.wisScore;
        this.wisSave = unit.wisSave;

        this.chaScore = unit.chaScore;
        this.chaSave = unit.chaSave;

        this.damageVulnerabilities = unit.damageVulnerabilities;
        this.damageImmunities = unit.damageImmunities;
        this.damageResistances = unit.damageResistances;
        this.conditionImmunities = unit.conditionImmunities;

        this.challengeRating = unit.challengeRating;
        this.experiencePoints = unit.experiencePoints;
        this.alignment = unit.alignment;

        this.standardActions = unit.standardActions;
        this.legendaryActions = unit.legendaryActions;
        this.specialAbilities = unit.specialAbilities;
        this.spellActions = unit.spellActions;
        this.reactions = unit.reactions;

        this.spellList = unit.spellList;
        this.senses = unit.senses;
        this.languages = unit.languages;

        this.speedWalk = unit.speedWalk;
        this.speedFly = unit.speedFly;
        this.speedClimb = unit.speedClimb;
        this.speedBurrow = unit.speedBurrow;
        this.speedSwim = unit.speedSwim;
    }

    // Import the values directly from the Document, go to default if anything is erroneous
    public ImportCustomFormInputs(document: Document): void
    {
        this.unitName = this.GetContent(document, "formUnitName");
        this.maxHP = parseFloat(this.GetContent(document, "formMaxHP")) || 4;
        this.armorClass = parseFloat(this.GetContent(document, "formArmorClass")) || 10;

        this.unitType = this.GetContent(document, "formUnitType");
        this.unitSize = this.GetContent(document, "formUnitSize");
        this.alignment = this.GetContent(document, "formAlignment");

        this.speedWalk = parseFloat(this.GetContent(document, "formSpeedWalk")) || 0;
        this.speedSwim = parseFloat(this.GetContent(document, "formSpeedSwim")) || 0;
        this.speedClimb = parseFloat(this.GetContent(document, "formSpeedClimb")) || 0;
        this.speedFly = parseFloat(this.GetContent(document, "formSpeedFly")) || 0;
        this.speedBurrow = parseFloat(this.GetContent(document, "formSpeedBurrow")) || 0;

        this.strScore = parseFloat(this.GetContent(document, "formStrScore")) || 1;
        this.dexScore = parseFloat(this.GetContent(document, "formDexScore")) || 1;
        this.conScore = parseFloat(this.GetContent(document, "formConScore")) || 1;
        this.intScore = parseFloat(this.GetContent(document, "formIntScore")) || 1;
        this.wisScore = parseFloat(this.GetContent(document, "formWisScore")) || 1;
        this.chaScore = parseFloat(this.GetContent(document, "formChaScore")) || 1;

        this.strSave = parseFloat(this.GetContent(document, "formStrSave")) || 0;
        this.dexSave = parseFloat(this.GetContent(document, "formDexSave")) || 0;
        this.conSave = parseFloat(this.GetContent(document, "formConSave")) || 0;
        this.intSave = parseFloat(this.GetContent(document, "formIntSave")) || 0;
        this.wisSave = parseFloat(this.GetContent(document, "formWisSave")) || 0;
        this.chaSave = parseFloat(this.GetContent(document, "formChaSave")) || 0;

        this.senses = this.GetContent(document, "formSenses");
        this.languages = this.GetContent(document, "formLanguages");
        this.challengeRating = this.GetContent(document, "formChallengeRating");
        this.experiencePoints = parseFloat(this.GetContent(document, "formEXP")) || 0;

        this.damageImmunities = this.GetContent(document, "formImmune");
        this.damageResistances = this.GetContent(document, "formResist");
        this.damageVulnerabilities = this.GetContent(document, "formVulnerable");
        this.conditionImmunities = this.GetContent(document, "formConditions");

        const attackContainers = document.querySelectorAll('#formAttackCollection > #formAttackContainer');
        this.standardActions = [];
        attackContainers.forEach((attack) =>
        {
            const aName = attack.querySelector("#formAttackName")?.textContent;
            const aDesc = attack.querySelector("#formAttackDesc")?.textContent;
            if (aName && aDesc)
            {
                let attackItem: IActionsEntity = { name: aName, desc: aDesc };
                this.standardActions?.push(attackItem);
            }
        });

        const reactionContainers = document.querySelectorAll('#formReactionCollection > #formReactionContainer');
        this.reactions = [];
        reactionContainers.forEach((reaction) =>
        {
            const aName = reaction.querySelector("#formReactionName")?.textContent;
            const aDesc = reaction.querySelector("#formReactionDesc")?.textContent;
            if (aName && aDesc)
            {
                let reactionItem: IActionsEntity = { name: aName, desc: aDesc };
                this.reactions?.push(reactionItem);
            }
        });

        const legendaryContainers = document.querySelectorAll('#formLegendaryCollection > #formLegendaryContainer');
        this.legendaryActions = [];
        legendaryContainers.forEach((legends) =>
        {
            const aName = legends.querySelector("#formLegendaryName")?.textContent;
            const aDesc = legends.querySelector("#formLegendaryDesc")?.textContent;
            if (aName && aDesc)
            {
                let legendItem: IActionsEntity = { name: aName, desc: aDesc };
                this.legendaryActions?.push(legendItem);
            }
        });

        const abilityContainers = document.querySelectorAll('#formAbilityCollection > #formAbilityContainer');
        this.specialAbilities = [];
        abilityContainers.forEach((ability) =>
        {
            const aName = ability.querySelector("#formAbilityName")?.textContent;
            const aDesc = ability.querySelector("#formAbilityDesc")?.textContent;
            if (aName && aDesc)
            {
                let abilityItem: IActionsEntity = { name: aName, desc: aDesc };
                this.specialAbilities?.push(abilityItem);
            }
        });

        const spellContainers = document.querySelectorAll('#formSpellCollection > #formSpellContainer');
        this.spellActions = [];
        spellContainers.forEach((ability) =>
        {
            const aName = ability.querySelector("#formSpellName")?.textContent;
            const aDesc = ability.querySelector("#formSpellDesc")?.textContent;
            if (aName && aDesc)
            {
                let spellItem: IActionsEntity = { name: aName, desc: aDesc };
                this.spellActions?.push(spellItem);
            }
        });

        this.CheckDefaults();
    }

    /**Helper: Set to default values if null/undefined so OBR can save */
    private CheckDefaults(): void
    {
        this.unitName ??= "Nameless";
        this.maxHP ??= 4;
        this.armorClass ??= 10;

        this.unitType ??= "Humanoid";
        this.unitSize ??= "Medium";
        this.alignment ??= "True Neutral";

        this.speedWalk ??= 30;
        this.speedSwim ??= 0;
        this.speedClimb ??= 0;
        this.speedFly ??= 0;
        this.speedBurrow ??= 0;

        this.strScore ??= 10;
        this.dexScore ??= 10;
        this.conScore ??= 10;
        this.intScore ??= 10;
        this.wisScore ??= 10;
        this.chaScore ??= 10;

        this.strSave ??= 2;
        this.dexSave ??= 2;
        this.conSave ??= 2;
        this.intSave ??= 2;
        this.wisSave ??= 2;
        this.chaSave ??= 2;

        this.senses ??= "No unique senses.";
        this.languages ??= "No known languages.";
        this.challengeRating ??= "0CR."
        this.experiencePoints ??= 0;

        this.damageImmunities ??= "None."
        this.damageResistances ??= "None."
        this.damageVulnerabilities ??= "None."
        this.conditionImmunities ??= "None."
    }

    /**Helper: Get Content from contentEditable div/span */
    private GetContent(document: Document, id: string): string
    {
        return (<HTMLInputElement>document.getElementById(id)).textContent!
    }

    /**Take Open5e Response and overwrite unit values */
    public async ImportOpen5eResponse(response: IOpen5eMonsterResponse): Promise<void>
    {
        this.unitName = response.name;
        this.maxHP = response.hit_points;
        this.armorClass = response.armor_class;

        this.unitType = response.type;
        this.unitSize = response.size;

        this.strScore = response.strength;
        this.strSave = response.strength_save;

        this.dexScore = response.dexterity;
        this.dexSave = response.dexterity_save;

        this.conScore = response.constitution;
        this.conSave = response.constitution_save;

        this.intScore = response.intelligence;
        this.intSave = response.intelligence_save;

        this.wisScore = response.wisdom;
        this.wisSave = response.wisdom_save;

        this.chaScore = response.charisma;
        this.chaSave = response.charisma_save;

        this.damageVulnerabilities = response.damage_vulnerabilities;
        this.damageImmunities = response.damage_immunities;
        this.damageResistances = response.damage_resistances;
        this.conditionImmunities = response.condition_immunities;

        this.challengeRating = response.challenge_rating;
        this.experiencePoints = 0;
        this.alignment = response.alignment;

        this.standardActions = response.actions;
        this.legendaryActions = response.legendary_actions;
        this.specialAbilities = response.special_abilities;
        this.reactions = response.reactions;

        this.spellList = response.spell_list;
        if (this.spellList != undefined && this.spellList?.length > 0)
        {
            this.spellActions = await this.ConvertSpellListtoSpellAction(this.spellList);
        }
        this.senses = response.senses;
        //skills = SkillSetObject;
        this.languages = response.languages;

        this.speedWalk = response.speed?.walk;
        this.speedFly = response.speed?.fly;
        this.speedClimb = response.speed?.walk;
        this.speedBurrow = response.speed?.burrow;
        this.speedSwim = response.speed?.swim;
        this.CheckDefaults();
    }

    private async ConvertSpellListtoSpellAction(spellList: string[]): Promise<IActionsEntity[]>
    {
        const spellActions: IActionsEntity[] = [];
        for (var i = 0, spell; spell = spellList[i]; i++) 
        {
            console.log(spell);
            await fetch(spell)
                .then(function (response)
                {
                    return response.json();
                }).then(function (data: IOpen5eSpellResponse)
                {
                    let importedSpell: IActionsEntity = { name: data.name, desc: data.desc };
                    spellActions.push(importedSpell);
                });
        }
        return spellActions;
    }

    public async SaveToDB(): Promise<string>
    {
        return await db.ActiveEncounter.add(this);
    }

    public async SaveToCreatureStorage(): Promise<string>
    {
        return await db.Creatures.add(this);
    }
}