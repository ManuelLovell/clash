export class Constants
{
    static VERSION = "whatsnew-clash-235";
    static EXTENSIONID = "com.battle-system.clash";
    static DISCORDID = "com.battle-system.discord";
    static DICEWINDOW = "com.battle-system.dicewindow";
    
    static BONESID = "com.battle-system.bones";
    static EXTENSIONSUBMENUID = "com.battle-system.clash-submenu";
    static EXTENSIONEFFECTSID = "com.battle-system.clash-effects";
    static EXTENSIONWHATSNEW = "com.battle-system.clash-whatsnew";
    static EXTENSIONSCENEID = "com.battle-system.clash-scene";
    static EXTENSIONLOGID = "com.battle-system.clash-chatlog";
    static SETTINGSID = '0be56e49-9551-40c1-8847-e620470c33dc';
    static MULTISHEETID = '999999999';
    static LABEL = '56d6b2c4-cd17-11ed-afa1-0242ac120002';
    static OPEN5EAPI = "https://api.open5e.com/monsters/?format=json&search=";

    static OBRBLUE = 'rgba(30, 34, 49, 0.5)';

    static DICENOTATION = /(\d+)[dD](\d+)(.*)$/i;
    static DICEMODIFIER = /([+-])(\d+)/;
    static PARENTHESESMATCH = /\((\d*d\d+\s*([+-]\s*\d+)?)\)/g;
    static PLUSMATCH = /\s?((?<!\d)\+\d+)\s?/g;
    static ALPHANUMERICTEXTMATCH = /\s[\da-zA-Z]$/;


    static MAINAPP = document.querySelector<HTMLDivElement>('#clash-main-body-app') as HTMLDivElement;
    static MAINLOAD = document.querySelector<HTMLDivElement>('#clash-main-body-loading') as HTMLDivElement;
    static MAINDISABLED = document.querySelector<HTMLDivElement>('#clash-main-disabled') as HTMLDivElement;
    static MAINSETTINGS = document.querySelector<HTMLDivElement>('#clash-main-body-settings') as HTMLDivElement;
    static MAINLOG = document.querySelector<HTMLDivElement>('#clash-main-body-log') as HTMLDivElement;

    static ADJECTIVES: string[] = [
        "Grizzled",
        "Wily",
        "Stoic",
        "Mellow",
        "Pensive",
        "Shrewd",
        "Cautious",
        "Hardy",
        "Nimble",
        "Tenacious",
        "Gritty",
        "Tolerant",
        "Hardy",
        "Adroit",
        "Resilient",
        "Slight",
        "Stout",
        "Durable",
        "Subtle",
        "Sober",
        "Clever",
        "Brave",
        "Calm",
        "Wise",
        "Cunning",
        "Alert",
        "Swift",
        "Agile",
        "Loyal",
        "Sturdy",
        "Stable",
        "Sneaky",
        "Clever",
        "Resourceful",
        "Shady",
        "Stalwart",
        "Vigilant",
        "Staunch",
        "Fierce",
        "Vigorous",
        "Robust",
        "Fearless",
        "Dauntless",
        "Resolute",
        "Sagacious",
        "Prudent",
        "Judicious",
        "Astute",
        "Savvy",
        "Sharp",
        "Quick",
        "Witty",
        "Smart",
        "Snippy",
        "Crafty",
        "Deft",
        "Sly",
        "Artful",
        "Clever",
        "Sneering",
        "Tough",
        "Rugged",
        "Solid",
        "Strong",
        "Sturdy",
        "Tough",
        "Gritty",
        "Rough",
        "Hardened",
        "Burly",
        "Muscular",
        "Brawny",
        "Rowdy",
        "Forceful",
        "Snorting",
        "Potent",
        "Martial",
        "Speckled",
        "Mottled",
        "Disheveled"
    ];
    
    
    static BASELIST = `
    <div id="contextMenu" class="context-menu" style="display: none">
        <ul id="playerListing"></ul>
    </div>
    <table id="clashGMTable">
        <thead id="clashGMViewHeader">
            <tr class="row-view-header"></tr>
        </thead>
        <tbody id="clashGMViewBody"></tbody>
    </table>
    <footer id="ClashGMViewFooter">
        <div id="clashGMViewButtons">
            <table id="footerTable" class="no-line-height">
                <tr>
                    <td id="previousContainer"></td>
                    <td id="roundCounter" colspan="4"></td>
                    <td id="nextContainer"></td>
                </tr>
                <tr>
                    <td id="showLogContainer" colspan="3"></td>
                    <td id="settingsContainer" colspan="3"></td>
                </tr>
            </table>
        </div>
    </footer>
    `;

    static PLAYERLIST = `
    <table id="clashPLTable">
        <thead id="clashPLViewHeader">
            <tr class="row-view-header"></tr>
        </thead>
        <tbody id="clashPLViewBody"></tbody>
    </table>
    <footer id="ClashPLViewFooter">
        <div id="clashPLViewButtons">
            <table id="footerTable" class="no-line-height">
                <tr class="player-footer-row">
                    <td id="showLogContainer"></td>
                    <td id="roundCounter"></td>
                    <td id="disableAutoFocus">
                        <label class="switch" id="settingnoFocusContainer">
                            <span class="slider round"></span>
                        </label> AutoFocus
                    </td>
                </tr>
            </table>
        </div>
    </footer>
    `;
    
    static ROLLLOG = `
    <div id="logContainer">
        <section id="rollLogContainer" class="roll-log">
            <ul id="rollLog">
            </ul>
        </section>
        <footer>
            <span id="rollLogReturnContainer"></span>
        </footer>
    </div>`;
}

export class SettingsConstants
{
    // Settings
    static HIDEHP = `${Constants.EXTENSIONID}/setting_hidehp`;
    static HIDEALL = `${Constants.EXTENSIONID}/setting_hideall`;
    static HIDEHPBAR = `${Constants.EXTENSIONID}/setting_hpbar`;
    static HIDEENEMYINFO = `${Constants.EXTENSIONID}/setting_hide_enemy_info`;
    static HPBARNUMBERS = `${Constants.EXTENSIONID}/setting_hpbar_numbers`;
    static DISABLELABEL = `${Constants.EXTENSIONID}/setting_disablelabel`;
    static DISABLEFOCUS = `${Constants.EXTENSIONID}/setting_disablefocus`;
    static REVERSELIST = `${Constants.EXTENSIONID}/setting_reverselist`;
    static RUMBLELOG = `${Constants.EXTENSIONID}/setting_rumblelog`;
    static VISUALDICE = `${Constants.EXTENSIONID}/setting_visualdice`;
    static DICENOTIFICATION = `${Constants.EXTENSIONID}/setting_dicenotification`;
    static DICEEVERYONE = `${Constants.EXTENSIONID}/setting_dicetoall`;
    static DISCORDHOOK = `${Constants.EXTENSIONID}/setting_discordhook`;
    static DISCORDURL = `${Constants.EXTENSIONID}/setting_discordurl`;
    static TURNTEXT = `${Constants.EXTENSIONID}/setting_turntext`;
    static NAMELABELS = `${Constants.EXTENSIONID}/setting_namelabel`;
    static RANDOMNAME = `${Constants.EXTENSIONID}/setting_randomname`;
    static INITIATIVEDICE = `${Constants.EXTENSIONID}/setting_initdice`;
    static INITBONUS = `${Constants.EXTENSIONID}/setting_initbonus`;

    static HPROW = `${Constants.EXTENSIONID}/setting_hpcol`;
    static ROLLERROW = `${Constants.EXTENSIONID}/setting_rollercol`;
    static TEMPHPROW = `${Constants.EXTENSIONID}/setting_tempcol`;
    static ACROW = `${Constants.EXTENSIONID}/setting_accol`;
    static MOVEROW = `${Constants.EXTENSIONID}/setting_movecol`;
    static BLOCKROW = `${Constants.EXTENSIONID}/setting_blockcol`;
    static EFXROW = `${Constants.EXTENSIONID}/setting_efxcol`;
    static ELEVATEROW = `${Constants.EXTENSIONID}/setting_elevcol`;

    static TURNCOUNT = `${Constants.EXTENSIONID}/setting_turncounter`;
    static ROUNDCOUNT = `${Constants.EXTENSIONID}/setting_roundcounter`;
}

export class UnitConstants
{
    static HPBAR = `${Constants.EXTENSIONID}/hpbar_active`;

    static ONLIST = `${Constants.EXTENSIONID}/clash`;
    static ID = `${Constants.EXTENSIONID}/clash_id`;
    static OWNERID = `${Constants.EXTENSIONID}/clash_ownerid`;
    static INITIATIVE = `${Constants.EXTENSIONID}/clash_initiative`;
    static ISMONSTER = `${Constants.EXTENSIONID}/clash_isMonster`;

    static TEMPHP = `${Constants.EXTENSIONID}/clash_tempHP`;
    static CURRENTHP = `${Constants.EXTENSIONID}/clash_currentHP`;
    static MAXHP = `${Constants.EXTENSIONID}/clash_maxHP`;
    static ARMORCLASS = `${Constants.EXTENSIONID}/clash_armorClass`;

    static UNITNAME = `${Constants.EXTENSIONID}/clash_unitName`;
    static UNITTYPE = `${Constants.EXTENSIONID}/clash_unitType`;
    static UNITSIZE = `${Constants.EXTENSIONID}/clash_unitSize`;

    static STRSCORE = `${Constants.EXTENSIONID}/clash_strScore`;
    static STRSAVE = `${Constants.EXTENSIONID}/clash_strSave`;

    static DEXSCORE = `${Constants.EXTENSIONID}/clash_dexScore`;
    static DEXSAVE = `${Constants.EXTENSIONID}/clash_dexSave`;

    static CONSCORE = `${Constants.EXTENSIONID}/clash_conScore`;
    static CONSAVE = `${Constants.EXTENSIONID}/clash_conSave`;

    static INTSCORE = `${Constants.EXTENSIONID}/clash_intScore`;
    static INTSAVE = `${Constants.EXTENSIONID}/clash_intSave`;

    static WISSCORE = `${Constants.EXTENSIONID}/clash_wisScore`;
    static WISSAVE = `${Constants.EXTENSIONID}/clash_wisSave`;

    static CHASCORE = `${Constants.EXTENSIONID}/clash_chaScore`;
    static CHASAVE = `${Constants.EXTENSIONID}/clash_chaSave`;

    static DAMAGEVULNERABILITIES = `${Constants.EXTENSIONID}/clash_damageVulnerabilities`;
    static DAMAGEIMMUNITIES = `${Constants.EXTENSIONID}/clash_damageImmunities`;
    static DAMAGERESISTANCES = `${Constants.EXTENSIONID}/clash_damageResistances`;
    static CONDITIONIMMUNITIES = `${Constants.EXTENSIONID}/clash_conditionImmunities`;

    static CHALLENGERATING = `${Constants.EXTENSIONID}/clash_challengeRating`;
    static EXPERIENCEPOINTS = `${Constants.EXTENSIONID}/clash_experiencePoints`;
    static ALIGNMENT = `${Constants.EXTENSIONID}/clash_alignment`;

    static STANDARDACTIONS = `${Constants.EXTENSIONID}/clash_standardActions`;
    static LEGENDARYACTIONS = `${Constants.EXTENSIONID}/clash_legendaryActions`;
    static SPECIALABILITIES = `${Constants.EXTENSIONID}/clash_specialAbilities`;
    static SPELLACTIONS = `${Constants.EXTENSIONID}/clash_spellActions`;
    static REACTIONS = `${Constants.EXTENSIONID}/clash_reactions`;

    static SPELLLIST = `${Constants.EXTENSIONID}/clash_spellList`;
    static SENSES = `${Constants.EXTENSIONID}/clash_senses`;
    static SKILLS = `${Constants.EXTENSIONID}/clash_skills`;
    static LANGUAGES = `${Constants.EXTENSIONID}/clash_languages`;

    static SPEEDWALK = `${Constants.EXTENSIONID}/clash_speedWalk`;
    static SPEEDFLY = `${Constants.EXTENSIONID}/clash_speedFly`;
    static SPEEDCLIMB = `${Constants.EXTENSIONID}/clash_speedClimb`;
    static SPEEDBURROW = `${Constants.EXTENSIONID}/clash_speedBurrow`;
    static SPEEDSWIM = `${Constants.EXTENSIONID}/clash_speedSwim`;

    static ELEVATION = `${Constants.EXTENSIONID}/clash_elevation`;
    static EFFECTS = `${Constants.EXTENSIONID}/clash_effects`;
}