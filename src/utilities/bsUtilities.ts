import { Item, Image, Theme } from "@owlbear-rodeo/sdk";
import { BSCACHE } from "./bsSceneCache";

export function GetGUID(): string
{
    let d = new Date().getTime();
    const guid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) =>
    {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return guid;
}

export function FindUniqueIds(array1: string[], array2: string[]): string[]
{
    const set1 = new Set(array1);
    const set2 = new Set(array2);

    const uniqueIds: string[] = [];

    for (const id of array1)
    {
        if (!set2.has(id))
        {
            uniqueIds.push(id);
        }
    }

    for (const id of array2)
    {
        if (!set1.has(id))
        {
            uniqueIds.push(id);
        }
    }

    return uniqueIds;
}

export function HexToRgba(hex: string, alpha: number): string
{
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function Debounce(func: () => any, delay: number): () => void
{
    let timeoutId: number;

    return function debounced(): void
    {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() =>
        {
            func();
        }, delay);
    };
}

export function isObjectEmpty(obj: Record<string, any>): boolean
{
    for (const key in obj)
    {
        if (obj.hasOwnProperty(key))
        {
            return false;
        }
    }
    return true;
}

export function TestEnvironment()
{
    try
    {
        localStorage.setItem("STORAGECHECK", "test");
    }
    catch (error)
    {
        const storageWarningElement = document.getElementById("localStorageWarning")!;
        storageWarningElement.innerText = "Local Storage disabled. Some features will not function.";
    }
}

export function evaluateMathExpression(command: string): number | string
{
    // Remove the "/math" part and any leading/trailing whitespaces
    const expression = command.replace("/math", "").trim();

    // Validate the expression
    const validExpressionRegex = /^[-+*/()\d\s]+$/;
    if (!validExpressionRegex.test(expression))
    {
        return "That's not math. (Invalid expression.)";
    }

    try
    {
        // Evaluate the expression using the eval() function
        const result = eval(expression);
        return `The answer to ${expression} is ${result}.`;
    }
    catch (e)
    {
        return `Error: ${e}`;
    }
}

export function TruncateName(name: string): string
{
    if (name.length > 30)
    {
        return name.substring(0, 30) + "...";
    }
    return name;
}

export function InvertColor(hex: string)
{
    const bw = true;
    if (hex.indexOf('#') === 0)
    {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3)
    {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6)
    {
        throw new Error('Invalid HEX color.');
    }
    var r: any = parseInt(hex.slice(0, 2), 16),
        g: any = parseInt(hex.slice(2, 4), 16),
        b: any = parseInt(hex.slice(4, 6), 16);
    if (bw)
    {
        // https://stackoverflow.com/a/3943023/112731
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str: string, len: number = 0)
{
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}

export function ColorName(name: string): string
{
    if (!name || name === "")
    {
        return "white";
    }

    const letter = name.substring(0, 1).toLowerCase();
    switch (letter)
    {
        case "a":
        case "e":
        case "i":
        case "o":
        case "u":
            return "red";
        case "b":
        case "c":
        case "d":
            return "pink";
        case "f":
        case "g":
        case "h":
            return "cyan";
        case "j":
        case "k":
        case "l":
        case "m":
            return "#747bff"; //purple
        case "n":
        case "p":
        case "q":
            return "green";
        case "r":
        case "s":
        case "t":
        case "v":
            return "orange";
        case "w":
        case "x":
        case "y":
        case "z":
            return "yellow";
        default:
            return "white";
    }
}

export function SetThemeMode(theme: Theme, document: Document): void
{
    const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");

    const darkTheme = darkThemeMq.matches ? "dark" : "light";
    const lightTheme = darkThemeMq.matches ? "light" : "dark";

    for (var s = 0; s < document.styleSheets.length; s++)
    {
        for (var i = 0; i < document.styleSheets[s].cssRules.length; i++)
        {
            let rule = document.styleSheets[s].cssRules[i] as CSSMediaRule;

            if (rule && rule.media && rule.media.mediaText.includes("prefers-color-scheme"))
            {
                if (theme.mode == "LIGHT")
                {
                    rule.media.appendMedium(`(prefers-color-scheme: ${darkTheme})`);

                    if (rule.media.mediaText.includes(lightTheme))
                    {
                        rule.media.deleteMedium(`(prefers-color-scheme: ${lightTheme})`);
                    }
                }
                else if (theme.mode == "DARK")
                {
                    rule.media.appendMedium(`(prefers-color-scheme: ${lightTheme})`);

                    if (rule.media.mediaText.includes(darkTheme))
                    {
                        rule.media.deleteMedium(`(prefers-color-scheme: ${darkTheme})`);
                    }
                }
            }
        }
    }
}

export function GetImageBounds(item: Image, dpi: any)
{
    const dpiScale = dpi / item.grid.dpi;
    const width = item.image.width * dpiScale * item.scale.x;
    const height = item.image.height * dpiScale * item.scale.y;
    const offsetX = (item.grid.offset.x / item.image.width) * width;
    const offsetY = (item.grid.offset.y / item.image.height) * height;
    const min = {
        x: item.position.x - offsetX,
        y: item.position.y - offsetY,
    };
    const max = { x: min.x + width, y: min.y + height };
    return { min, max };
}

export function Meta(unit: Item, key: string): any
{
    return unit.metadata[key] as any;
}

export function Reta(key: string): any
{
    return BSCACHE.roomMetadata[key] as any;
}

export function Seta(key: string): any
{
    return BSCACHE.sceneMetadata[key] as any;
}