import Dexie, { DexieOptions } from "dexie";
import * as FakeDB from "fake-indexeddb";
import { IUnitInfo } from "./interfaces/unit-info";
import UnitInfo from "./unit-info";

export default class DexieDatabase extends Dexie
{
    inMemory: boolean;

    ActiveEncounter!: Dexie.Table<IUnitInfo, string>;
    Creatures!: Dexie.Table<IUnitInfo, string>;
    Tracker!: Dexie.Table<ITracker, string>;
    Settings!: Dexie.Table<ISettingsData, string>;

    constructor(inMemory: boolean, options?: DexieOptions | undefined)
    {
        super("ClashDatabase", options);
        
        this.inMemory = inMemory;

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
        speedSwim,
        dataSlug
        `;

        const storedAttv3 = storedAttr + ", favorite";

        this.version(1).stores({
            ActiveEncounter: storedAttr,
            Creatures: storedAttr,
            Tracker: `id, currentTurn, currentRound`,
            Settings: `id, gmHideHp, gmHideAll, gmDisableLabel, disableFocus`,
        });

        this.version(2).stores({
            ActiveEncounter: storedAttr,
            Creatures: storedAttr,
            Tracker: `id, currentTurn, currentRound`,
            Settings: `id, gmHideHp, gmHideAll, gmDisableLabel, gmTurnText, disableFocus, gmReverseList`,
        });
        
        this.version(3).stores({
            ActiveEncounter: storedAttv3,
            Creatures: storedAttv3,
            Tracker: `id, currentTurn, currentRound`,
            Settings: `id, gmHideHp, gmHideAll, gmDisableLabel, gmTurnText, disableFocus, gmReverseList`,
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

    public Ready(): void
    {
        console.log("Setup is complete.");
    }
}

export interface ITracker
{
    id: string;
    currentTurn: number;
    currentRound: number;
}

let database: DexieDatabase;
async function getDatabase(): Promise<DexieDatabase>
{
    if (database)
    {
        return database;
    }
    else
    {
        database = await createDatabase();
        return database;
    }
}

async function createDatabase(): Promise<DexieDatabase>
{
    return new Promise((resolve) =>
    {
        // Create a test database to test whether indexedDB is enabled
        let testDBRequest = window.indexedDB.open("__test");

        testDBRequest.onsuccess = async function ()
        {
            console.log("DB for Clash running - Clearing local cache will remove stored data");
            testDBRequest.result.close();
            window.indexedDB.deleteDatabase("__test");
            resolve(new DexieDatabase(false));
        };
        // If indexedDB is disabled create an in memory database
        testDBRequest.onerror = async function ()
        {
            console.warn("IndexDB is disabled, no state will be saved");
            window.indexedDB.deleteDatabase("__test");
            resolve(new DexieDatabase(true, { indexedDB: FakeDB.indexedDB, IDBKeyRange: FakeDB.IDBKeyRange }));
        };
    });
}
export const db = await getDatabase();