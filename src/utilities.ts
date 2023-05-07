import { Theme } from "@owlbear-rodeo/sdk";

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

export function SetThemeMode(theme: Theme, document: Document): void
{
    for (var s = 0; s < document.styleSheets.length; s++)
    {
        for (var i = 0; i < document.styleSheets[s].cssRules.length; i++)
        {
            let rule = document.styleSheets[s].cssRules[i] as CSSMediaRule;

            if (rule && rule.media && rule.media.mediaText.includes("prefers-color-scheme"))
            {
                if (theme.mode == "LIGHT")
                {
                    //document.documentElement.setAttribute("data-theme", "dark");
                    rule.media.appendMedium("(prefers-color-scheme: dark)");
                    if (rule.media.mediaText.includes("light"))
                    {
                        rule.media.deleteMedium("(prefers-color-scheme: light)");
                    }
                }
                else if (theme.mode == "DARK")
                {
                    //document.documentElement.setAttribute("data-theme", "light");
                    rule.media.appendMedium("(prefers-color-scheme: light)");
                    if (rule.media.mediaText.includes("dark"))
                    {
                        rule.media.deleteMedium("(prefers-color-scheme: dark)");
                    }
                }
            }
        }
    }
}