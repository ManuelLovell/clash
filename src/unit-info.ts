import { ActionsEntity, Open5eMonsterResponse } from './interfaces/api-response-open5e';

export default class UnitInfo
{
    unitName: string;
    maxHP: number;
    armorClass: number;

    unitType?: string;
    unitSize?: string;

    strScore?: number;
    strSave?: number;

    dexScore?: number;
    dexSave?: number;

    conScore?: number;
    conSave?: number;

    intScore?: number;
    intSave?: number;

    wisScore?: number;
    wisSave?: number;

    chaScore?: number;
    chaSave?: number;

    damageVulnerabilities?: string;
    damageImmunities?: string;
    damageResistances?: string;
    conditionImmunities?: string;

    challengeRating?: string;
    experiencePoints?: number;
    alignment?: string;

    standardActions?: ActionsEntity[];
    legendaryActions?: ActionsEntity[];
    specialAbilities?: ActionsEntity[];
    reactions?: ActionsEntity[];

    spellList?: string[];
    senses?: string;
    //skills?: SkillSetObject;
    languages?: string;

    speedWalk?: number;
    speedFly?: number;
    speedClimb?: number;
    speedBurrow?: number;
    speedSwim?: number;

    constructor(name?: string)
    {
        this.unitName = name ??= "Default";
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
    }

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
        attackContainers.forEach((attack) =>
        {
            const aName = attack.querySelector("#formAttackName")?.textContent;
            const aDesc = attack.querySelector("#formAttackDesc")?.textContent;
            if (aName && aDesc)
            {
                let attackItem: ActionsEntity = { name : aName, desc : aDesc };
                this.standardActions?.push(attackItem);
            }
        });

        const abilityContainers = document.querySelectorAll('#formAbilityCollection > #formAbilityContainer');
        abilityContainers.forEach((ability) =>
        {
            const aName = ability.querySelector("#formAbilityName")?.textContent;
            const aDesc = ability.querySelector("#formAbilityDesc")?.textContent;
            if (aName && aDesc)
            {
                let abilityItem: ActionsEntity = { name : aName, desc : aDesc };
                this.specialAbilities?.push(abilityItem);
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
    public ImportOpen5eResponse(response: Open5eMonsterResponse): void
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
}