interface IOBRTracker
{
    turn: number;
    round: number;
    gmHideHp: boolean;
    gmHideAll: boolean;
    gmReverseList: boolean;
    units: IUnitTrack[];
    lastUpdate: string;
}

interface IUnitTrack
{
    id?: string;
    name?: string;
    initiative?: number;
    cHp?: number;
    mHp?: number;
    aC?: number;
    owner?: string;
    hidden?: boolean;
    stamp?: string;
}

interface IWebhook
{
    url: string;
}