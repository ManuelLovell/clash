import { Constants } from "./constants";

export class DiceRoller
{
    static RollString(string: string): number
    {
        const parsed = this.Parse(string);
        var rolled = this.Roll(parsed.number!, parsed.type!, Math.random);
        rolled.result += parsed.modifier!;
        return rolled.result;
    }
    
    static Dice(a: number, b: number, rnd: Function)
    {
        return this.RollMe(a, b, rnd).result;
    }
    static Roll(a: number, b: number, rnd: Function)
    {
        if (!rnd)
        {
            rnd = Math.random;
        }
        var rolls = [];
        var result = 0;
        for (var i = 0; i < a; i++)
        {
            var die = 0;
            die = Math.floor(rnd() * b) + 1;
            result += die;
            rolls.push(die);
        }
        return {
            rolls: rolls,
            result: result
        };
    }

    static RollMe(a: number, b: number, rnd: Function): RollResult
    {
        var msg = 'Invalid dice values.', toRoll: RollResult = {};
        if (typeof a === 'string')
        {
            toRoll = this.Parse(a);
        }
        else if (typeof a === 'number')
        {
            toRoll = {
                number: this.ValidNumber(a.toString(), msg),
                type: this.ValidNumber(b.toString(), msg),
                modifier: 0
            };
        } 
        else
        {
            throw new Error(msg);
        }
        if (typeof b === 'function')
        {
            rnd = b;
        }
        var rolled = this.Roll(toRoll.number!, toRoll.type!, rnd);
        rolled.result += toRoll.modifier!;
        Object.assign(toRoll, rolled);
        return toRoll;
    }

    static DetailedRoll(a: number, b: number, rnd: Function): RollResult
    {
        return this.RollMe(a, b, rnd);
    }
    static CompressNotation(notation: string): string
    {
        return notation.trim().replace(/\s+/g, '');
    }

    static ValidNumber(n: string, err: string): number
    {
        let num = Number(n);
        if (Number.isNaN(num) || !Number.isInteger(num) || num < 1)
        {
            throw new Error(err);
        }
        return num;
    }

    static Parse(notation: string): RollResult
    {
        var roll = this.CompressNotation(notation).match(Constants.DICENOTATION)!, mod = 0;
        var msg = 'Invalid notation: ' + notation + '';

        if (roll.length < 3)
        {
            throw new Error(msg);
        }
        if (roll[3] && Constants.DICEMODIFIER.test(roll[3]))
        {
            var modParts = roll[3].match(Constants.DICEMODIFIER)!;
            var basicMod = this.ValidNumber(modParts[2], msg);
            if (modParts[1].trim() === '-')
            {
                basicMod *= -1;
            }
            mod = basicMod;
        }

        const rollNumber = this.ValidNumber(roll[1], msg);
        const rollType = this.ValidNumber(roll[2], msg);
        return {
            number: rollNumber,
            type: rollType,
            modifier: mod
        };
    }
}

interface RollResult
{
    number?: number,
    type?: number,
    modifier?: number,
    result?: number
}