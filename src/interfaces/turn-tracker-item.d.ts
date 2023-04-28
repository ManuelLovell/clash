interface IOBRTracker
{
    turn: number;
    round: number;
    gmHideHp: boolean;
    gmHideAll: boolean;
    gmReverseList: boolean;
    units: UnitTrack[];
}

interface IUnitTrack
{
    id: string;
    name: string;
    initiative: number;
    cHp: number;
    mHp: number;
}