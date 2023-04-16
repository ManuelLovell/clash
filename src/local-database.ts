import Dexie from "dexie";
import { IUnitInfo } from "./interfaces/unit-info";
import UnitInfo from "./unit-info";

export default class DexieDatabase extends Dexie
{
    ActiveEncounter!: Dexie.Table<IUnitInfo, string>;
    Creatures!: Dexie.Table<IUnitInfo, string>;
    Tracker!: Dexie.Table<ITracker, string>;

    constructor()
    {
        super("ClashDatabase");
        
        const storedAttr = `
        id,
        tokenId,
        initiative,
        currentHp,
        isMonster,
        isActive,
        unitName,
        maxHP,
        armorClass,
        unitType,
        unitSize,
        strScore,
        strSave,
        dexScore,
        dexSave,
        conScore,
        conSave,
        intScore,
        intSave,
        wisScore,
        wisSave,
        chaScore,
        chaSave,
        damageVulnerabilities,
        damageImmunities,
        damageResistances,
        conditionImmunities,
        challengeRating,
        experiencePoints,
        alignment,
        standardActions,
        legendaryActions,
        specialAbilities,
        spellActions,
        reactions,
        spellList,
        senses,
        skills,
        languages,
        speedWalk,
        speedFly,
        speedClimb,
        speedBurrow,
        speedSwim
        `;

        this.version(1).stores({
            ActiveEncounter: storedAttr,
            Creatures: storedAttr,
            Tracker: `id, currentTurn, currentRound`
        });
    }

    public async SaveToCreatureStorage(unit: UnitInfo): Promise<string>
    {
        return await db.Creatures.add(unit);
    }

    public async DeleteFromCreatureStorage(id: string): Promise<void>
    {
        return await db.Creatures.delete(id);
    }

    public async SaveToActiveList(unit: UnitInfo): Promise<string>
    {
        return await db.ActiveEncounter.add(unit);
    }

    public async DeleteFromActiveList(id: string): Promise<void>
    {
        return await db.ActiveEncounter.delete(id);
    }

    public Warning(): void
    {
        console.log("DB for Clash running - Clearing local cache will remove stored data");
    }
}

export interface ITracker
{
    id: string;
    currentTurn: number;
    currentRound: number;
}

export const db = new DexieDatabase();