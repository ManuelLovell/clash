export class Constants
{
    static EXTENSIONID = "com.battle-system.clash";
    static DISCORDID = "com.battle-system.discord";
    static MOBILEWIDTH = 495;  //Below this use mobile sizing
    static EXTENSIONSUBMENUID = "com.battle-system.clash-submenu";
    static EXTENSIONWHATSNEW = "com.battle-system.clash-whatsnew";
    static EXTENSIONSCENEID = "com.battle-system.clash-scene";
    static EXTENSIONLOGID = "com.battle-system.clash-chatlog";
    static TURNTRACKER = '47d6b2c4-cd17-11ed-afa1-0242ac120002';
    static SETTINGSID = '0be56e49-9551-40c1-8847-e620470c33dc';
    static MULTISHEETID = '999999999';
    static LABEL = '56d6b2c4-cd17-11ed-afa1-0242ac120002';
    static DICENOTATION = /(\d+)[dD](\d+)(.*)$/i;
    static DICEMODIFIER = /([+-])(\d+)/;
    static PARENTHESESMATCH = /\((\d*d\d+\s*([+-]\s*\d+)?)\)/g;
    static PLUSMATCH = /\s(\+\d+)\s/g;
    static ALPHANUMERICTEXTMATCH = /\s[\da-zA-Z]$/;
}