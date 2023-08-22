import UnitInfo from '../unit-info';

export interface IUnitInfo
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

    standardActions: ActionsEntity[];
    legendaryActions?: ActionsEntity[];
    specialAbilities?: ActionsEntity[];
    spellActions?: ActionsEntity[];
    reactions?: ActionsEntity[];

    spellList?: string[];
    senses: string;
    //skills: SkillSetObject;
    languages: string;

    speedWalk: number;
    speedFly: number;
    speedClimb: number;
    speedBurrow: number;
    speedSwim: number;

    dataSlug: string;
    favorite: boolean;

    ownerId?: string;
    sceneId?: string;
}