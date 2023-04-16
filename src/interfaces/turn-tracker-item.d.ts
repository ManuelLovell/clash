export interface Tracker
{
    turn: number;
    round: number;
    units: UnitTrack[];
}

export interface UnitTrack
{
    id: string;
    name: string;
    initiative: number;
    cHp: number;
    mHp: number;
}