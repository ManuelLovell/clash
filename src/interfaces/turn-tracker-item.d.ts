export interface IOBRTracker
{
    turn: number;
    round: number;
    gmHideHp: boolean;
    gmHideAll: boolean;
    units: UnitTrack[];
}

export interface IUnitTrack
{
    id: string;
    name: string;
    initiative: number;
    cHp: number;
    mHp: number;
}