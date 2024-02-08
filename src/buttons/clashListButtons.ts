import OBR, { Item } from "@owlbear-rodeo/sdk";
import { Constants, SettingsConstants, UnitConstants } from "../clashConstants";
import { BSCACHE } from "../utilities/bsSceneCache";
import { GMVIEW } from "../views/clashGMView";
import * as Utilities from '../utilities/bsUtilities';

const smallColWidth = "10%";
const smallColMinWidth = "25px";
const smediumWidth = "15%";
const smediumColMinWidth = "40px";
const mediumColWidth = "40%";
const mediumColMinWidth = "60px";
const largeColWidth = "80%";
const largeColMinWidth = "100px";

export function GetInitativeHeader()
{
    const initiativeHeader = document.createElement('th');
    initiativeHeader.style.width = smallColWidth;
    initiativeHeader.style.minWidth = smallColMinWidth;
    const imgElement = document.createElement('img');
    imgElement.setAttribute('class', 'icon');
    imgElement.setAttribute('title', 'Initiative');
    imgElement.setAttribute('src', '/queue.svg');
    initiativeHeader.appendChild(imgElement);

    return initiativeHeader;
}

export function GetRollerHeader()
{
    const rollHeader = document.createElement('th');
    rollHeader.style.width = smallColWidth;
    rollHeader.style.minWidth = smallColMinWidth;
    const rollImgElement = document.createElement('input');
    rollImgElement.type = "image";
    rollImgElement.className = "icon roller-button clickable";
    rollImgElement.title = 'Roll For All (Purple) Units';
    rollImgElement.src = '/dice.svg';
    rollImgElement.onclick = async function ()
    {
        OBR.notification.show("Rolled Initiative for all selected.");

        const unitsInOrder = document.querySelectorAll(".isMonster");
        const unitsUpdated: { key: string, value: string }[] = [];
        unitsInOrder.forEach((unit) =>
        {
            const unitNameInput = unit as HTMLInputElement;
            const unitId = unitNameInput.id.substring(2);

            const initElement = document.querySelector(`#iI${unitId}`) as HTMLInputElement;
            const useDex = Utilities.Reta(SettingsConstants.INITBONUS) ?? true;
            const dexBonus = useDex ? parseFloat(initElement.getAttribute("unit-dexbonus")!) : 0;

            const dice = Utilities.Reta(SettingsConstants.INITIATIVEDICE) ?? 20;

            const result = (dexBonus + Math.floor(Math.random() * (dice - 1) + 1)).toString();
            initElement.value = result;
            unitsUpdated.push({ key: unitId, value: result })
        });

        await OBR.scene.items.updateItems(unitsUpdated.map(item => item.key), (items) =>
        {
            for (let item of items)
            {
                item.metadata[UnitConstants.INITIATIVE] = unitsUpdated.find(x => x.key === item.id)?.value;
            }
        });
    };
    rollHeader.appendChild(rollImgElement);

    return rollHeader;
}

export function GetNameHeader()
{
    const nameHeader = document.createElement('th');
    nameHeader.style.width = largeColWidth;
    nameHeader.style.minWidth = largeColMinWidth;
    nameHeader.innerText = "NAME";

    return nameHeader;
}

export function GetHPHeader()
{
    const hpHeader = document.createElement('th');
    hpHeader.style.width = mediumColWidth;
    hpHeader.style.minWidth = mediumColMinWidth;
    const hpImgElement = document.createElement('img');
    hpImgElement.setAttribute('class', 'icon');
    hpImgElement.setAttribute('title', 'Hit Points');
    hpImgElement.setAttribute('src', '/health.svg');
    hpHeader.appendChild(hpImgElement);
    return hpHeader;
}

export function GetTempHPHeader()
{
    const tempHeader = document.createElement('th');
    tempHeader.style.width = smallColWidth;
    tempHeader.style.minWidth = smallColMinWidth;
    const tempImgElement = document.createElement('img');
    tempImgElement.setAttribute('class', 'icon');
    tempImgElement.setAttribute('title', 'Temporary Health');
    tempImgElement.setAttribute('src', '/temphp.svg');
    tempHeader.appendChild(tempImgElement);

    return tempHeader;
}

export function GetACHeader()
{
    const acHeader = document.createElement('th');
    acHeader.style.width = smallColWidth;
    acHeader.style.minWidth = smallColMinWidth;
    const acImgElement = document.createElement('img');
    acImgElement.setAttribute('class', 'icon');
    acImgElement.setAttribute('title', 'Armor Class');
    acImgElement.setAttribute('src', '/shield.svg');
    acHeader.appendChild(acImgElement);

    return acHeader;
}

export function GetMoveHeader()
{
    const moveHeader = document.createElement('th');
    moveHeader.style.width = smediumWidth;
    moveHeader.style.minWidth = smediumColMinWidth;
    const moveImgElement = document.createElement('img');
    moveImgElement.setAttribute('class', 'icon');
    moveImgElement.setAttribute('title', 'Highest Move Speed');
    moveImgElement.setAttribute('src', '/speedwalk.svg');
    moveHeader.appendChild(moveImgElement);

    return moveHeader;
}

export function GetElevateHeader()
{
    const elevateHeader = document.createElement('th');
    elevateHeader.style.width = smediumWidth;
    elevateHeader.style.minWidth = smediumColMinWidth;
    const elevateElement = document.createElement('img');
    elevateElement.setAttribute('class', 'icon');
    elevateElement.setAttribute('title', 'Unit Elevation');
    elevateElement.setAttribute('src', '/elevation.svg');
    elevateHeader.appendChild(elevateElement);

    return elevateHeader;
}

export function GetEFXHeader()
{
    const efxHeader = document.createElement('th');
    efxHeader.style.width = smediumWidth;
    efxHeader.style.minWidth = smediumColMinWidth;
    const efxElement = document.createElement('img');
    efxElement.setAttribute('class', 'icon');
    efxElement.setAttribute('title', 'Effects');
    efxElement.setAttribute('src', '/effectheader.svg');
    efxHeader.appendChild(efxElement);

    return efxHeader;
}

export function GetWhatsNewHeader()
{
    const whatsNewHeader = document.createElement('th');
    whatsNewHeader.style.width = smallColWidth;
    const newImgElement = document.createElement('img');
    newImgElement.id = "whatsNewButton";
    newImgElement.setAttribute('class', 'icon');
    newImgElement.classList.add('clickable');
    newImgElement.setAttribute('title', 'Whats New?');
    newImgElement.setAttribute('src', '/info.svg');
    newImgElement.onclick = async function ()
    {
        try
        {
            localStorage.setItem(Constants.VERSION, "true");
            newImgElement.classList.remove('whats-new-shine');
        } catch (error)
        {
            // Oh well.
        }
        await OBR.modal.open({
            id: Constants.EXTENSIONWHATSNEW,
            url: `/submenu/whatsnew.html?timer=300`,
            height: 500,
            width: 350,
        });
    };

    try
    {
        const glow = localStorage.getItem(Constants.VERSION);
        if (glow !== "true") newImgElement.classList.add('whats-new-shine');
    } catch (error)
    {
        // Oh well.
    }

    whatsNewHeader.appendChild(newImgElement);

    return whatsNewHeader;
}

export function GetInitiativeInput(unit: Item): HTMLInputElement
{
    const element = document.createElement('input');
    element.classList.add("text-input");
    element.classList.add("unit-initiative");
    element.inputMode = "numeric";
    element.setAttribute("unit-dexbonus", Math.floor((Meta(unit, UnitConstants.DEXSCORE) - 10) / 2).toString());
    element.value = Meta(unit, UnitConstants.INITIATIVE).toString();
    element.id = `iI${unit.id}`;
    element.size = 2;
    element.min = "0";
    element.max = "99";
    element.maxLength = 2;
    element.style.width = smallColWidth;
    element.style.minWidth = "25px";
    element.onblur = async (event: Event) =>
    {
        const target = event.currentTarget as HTMLInputElement;
        await UpdateUnit(target.id, [{ key: UnitConstants.INITIATIVE, value: target.value }]);
    };

    return element;
}

export function GetRollInput(unit: Item): HTMLInputElement
{
    const element = document.createElement('input');
    element.type = "image";
    element.title = "Roll this Unit's Initiative";
    element.id = `rB${unit.id}`;
    element.className = "clickable";
    element.onclick = async (event: Event) =>
    {
        const target = event.currentTarget as HTMLInputElement;
        const unitId = target.id.substring(2);
        const unit = BSCACHE.sceneItems.find(item => item.id === unitId)!;

        const dex = unit.metadata[UnitConstants.DEXSCORE] as number;
        const useDex = Utilities.Reta(SettingsConstants.INITBONUS) ?? true;
        const dexBonus = useDex ? Math.floor(((+dex) - 10) / 2) : 0;

        const dice = Utilities.Reta(SettingsConstants.INITIATIVEDICE) ?? 20;

        const rollResult = (dexBonus + Math.floor(Math.random() * (dice - 1) + 1)).toString();

        await UpdateUnit(target.id, [{ key: UnitConstants.INITIATIVE, value: rollResult }]);
    };
    element.src = "/dice.svg";
    element.height = 20;
    element.width = 20;
    element.style.width = smallColWidth;
    element.style.minWidth = "25px";

    return element;
}

export function GetNameInput(unit: Item): HTMLInputElement
{
    let alphaColor;
    if (Meta(unit, UnitConstants.OWNERID))
    {
        //Find the owner
        const ownerColor = BSCACHE.party.find(player => player.id === Meta(unit, UnitConstants.OWNERID))?.color;
        if (ownerColor)
        {
            alphaColor = Utilities.HexToRgba(ownerColor, 0.9);
        }
    }

    const element = document.createElement('input');
    element.type = "button";
    element.value = Meta(unit, UnitConstants.ISMONSTER) ? `ʳ ${Meta(unit, UnitConstants.UNITNAME)} ʴ` : Meta(unit, UnitConstants.UNITNAME);
    element.title = "Change between Player and Monster groups";
    element.id = `nT${unit.id}`;
    element.style.width = "100%";
    element.classList.add("text-input");
    element.classList.add("unit-name-input");
    element.style.textOverflow = "ellipsis";
    element.style.overflow = "hidden";

    if (alphaColor)
    {
        element.style.borderColor = alphaColor;
        element.style.borderWidth = "2px";
    }
    element.onclick = async function ()
    {
        if (element.classList.contains("isMonster"))
        {
            element.value = Meta(unit, UnitConstants.UNITNAME);
            element.classList.remove("isMonster");
        }
        else
        {
            element.value = `ʳ ${Meta(unit, UnitConstants.UNITNAME)} ʴ`;
            element.classList.add("isMonster");
        }
    };
    element.oncontextmenu = async function (e)
    {
        e.preventDefault();

        const contextMenu = document.getElementById("contextMenu")!;

        const onClickContext = (e: Event) =>
        {
            e.preventDefault();
        };

        // Add event listener for CTXMenu selection
        const onClickListItem = async (e: MouseEvent) =>
        {
            const target = e.target as HTMLUListElement;
            if (target.id === "REMOVE")
            {
                await OBR.scene.items.updateItems([element.id.substring(2)], (items) =>
                {
                    for (let item of items)
                    {
                        delete item.metadata[UnitConstants.ONLIST];
                        delete item.metadata[UnitConstants.HPBAR];
                    }
                });
            }
            else
            {
                await UpdateUnit(element.id, [{ key: UnitConstants.OWNERID, value: target.id }]);
            }

            contextMenu.style.display = "none";
            e.stopPropagation();

            window.removeEventListener("click", onClickOutside);
            contextMenu.removeEventListener("click", onClickListItem);
            contextMenu.removeEventListener("contextmenu", onClickContext);
        };

        // Store unit ID
        contextMenu.setAttribute("currentUnit", unit.id);

        // Add listener to click away
        const onClickOutside = () =>
        {
            contextMenu.style.display = "none";
            window.removeEventListener("click", onClickOutside);
            contextMenu.removeEventListener("click", onClickListItem);
            contextMenu.removeEventListener("contextmenu", onClickContext);
        };

        contextMenu.addEventListener("click", onClickListItem);
        contextMenu.addEventListener("contextmenu", onClickContext);
        window.addEventListener("click", onClickOutside);

        if (contextMenu.style.display == "block")
        {
            HideMenu();
        }
        else
        {
            // Don't let the menu go off window, it'll cut
            const adjustedLeft = Math.min(e.pageX, window.innerWidth - 150);
            const adjustedTop = Math.min(e.pageY, (window.innerHeight > 300 ? window.innerHeight - 50 : window.innerHeight) - 120);

            contextMenu.style.display = 'block';
            contextMenu.style.left = adjustedLeft + "px";
            contextMenu.style.top = adjustedTop + "px";
        }
    }
    return element;
}

export function GetMinHPInput(unit: Item): HTMLInputElement
{
    const element = document.createElement('input');
    element.classList.add("text-input");
    element.inputMode = "numeric";
    element.id = `cH${unit.id}`;
    element.title = Meta(unit, UnitConstants.CURRENTHP).toString();
    element.value = Meta(unit, UnitConstants.CURRENTHP).toString();
    element.size = 4;
    element.style.width = "30px";
    element.maxLength = 4;
    element.style.width = (+mediumColWidth / 2).toString();
    element.style.minWidth = "25px";
    element.onblur = async function (e)
    {
        const target = e.currentTarget as HTMLInputElement;
        const value = target.value;
        if (value.substring(0, 1) == "+")
        {
            const addThis = value.substring(value.indexOf('+') + 1);
            const result = (+addThis + +Meta(unit, UnitConstants.CURRENTHP)).toString();

            await UpdateUnit(target.id, [{ key: UnitConstants.CURRENTHP, value: result }]);
            e.preventDefault();
        }
        else if (value.substring(0, 1) == "-")
        {
            const minusThis = value.substring(value.indexOf('-') + 1);
            const result = (+Meta(unit, UnitConstants.CURRENTHP) - +minusThis).toString();

            await UpdateUnit(target.id, [{ key: UnitConstants.CURRENTHP, value: result }]);
            e.preventDefault();
        }
        else
        {
            await UpdateUnit(target.id, [{ key: UnitConstants.CURRENTHP, value: element.value }]);
        }
    };
    element.onkeydown = async function (e)
    {
        if (e.key !== "Enter") return;
        const target = e.currentTarget as HTMLInputElement;
        const value = target.value;
        if (value.substring(0, 1) == "+")
        {
            const addThis = value.substring(value.indexOf('+') + 1);
            const result = (+addThis + +Meta(unit, UnitConstants.CURRENTHP)).toString();

            await UpdateUnit(target.id, [{ key: UnitConstants.CURRENTHP, value: result }]);
            e.preventDefault();
        }
        else if (value.substring(0, 1) == "-")
        {
            const minusThis = value.substring(value.indexOf('-') + 1);
            const result = (+Meta(unit, UnitConstants.CURRENTHP) - +minusThis).toString();

            await UpdateUnit(target.id, [{ key: UnitConstants.CURRENTHP, value: result }]);
            e.preventDefault();
        }
        else
        {
            await UpdateUnit(target.id, [{ key: UnitConstants.CURRENTHP, value: target.value }]);
        }
    }

    return element;
}

export function GetMaxHPInput(unit: Item): HTMLInputElement
{
    const element = document.createElement('input');
    element.classList.add("text-input");
    element.inputMode = "numeric";
    element.id = `mH${unit.id}`;
    element.value = Meta(unit, UnitConstants.MAXHP).toString();
    element.style.width = "30px";
    element.size = 4;
    element.maxLength = 4;
    element.style.width = (+mediumColWidth / 2).toString();
    element.style.minWidth = "25px";
    element.onblur = async (event: Event) =>
    {
        const target = event.currentTarget as HTMLInputElement;
        await UpdateUnit(target.id, [{ key: UnitConstants.MAXHP, value: target.value }]);
    };

    return element;
}

export function GetTempHPInput(unit: Item): HTMLInputElement
{
    const element = document.createElement('input');
    element.classList.add("text-input");
    element.inputMode = "numeric";
    element.id = `tH${unit.id}`;
    element.title = Meta(unit, UnitConstants.TEMPHP) ?? 0;
    element.value = Meta(unit, UnitConstants.TEMPHP) ?? 0;
    element.size = 3;
    element.maxLength = 3;
    element.style.width = smallColWidth;
    element.style.minWidth = "25px";
    element.onblur = async function (e)
    {
        const target = e.currentTarget as HTMLInputElement;
        const currentHp = (document.getElementById(`cH${target.id.substring(2)}`) as HTMLInputElement);
        let newCurrentHp = currentHp.value;
        const tempHp = target.value;
        if (tempHp.substring(0, 1) == "+")
        {
            const addThis = tempHp.substring(tempHp.indexOf('+') + 1);
            let result = (+addThis + +element.title).toString();

            await UpdateUnit(target.id, [{ key: UnitConstants.TEMPHP, value: result }]);
            e.preventDefault();
        }
        else if (tempHp.substring(0, 1) == "-")
        {
            const minusThis = tempHp.substring(tempHp.indexOf('-') + 1);
            let result = (+element.title - +minusThis);
            if (result < 0)
            {
                newCurrentHp = ((+currentHp.value) + result).toString();
                result = 0;
            }

            await UpdateUnit(target.id, [{ key: UnitConstants.TEMPHP, value: result.toString() }, { key: UnitConstants.CURRENTHP, value: newCurrentHp }]);
            e.preventDefault();
        }
        else
        {
            await UpdateUnit(target.id, [{ key: UnitConstants.TEMPHP, value: tempHp }]);
        }
    };
    element.onkeydown = async function (e)
    {
        if (e.key !== "Enter") return;

        const target = e.currentTarget as HTMLInputElement;
        const currentHp = (document.getElementById(`cH${target.id.substring(2)}`) as HTMLInputElement);
        let newCurrentHp = currentHp.value;
        const tempHp = target.value;
        if (tempHp.substring(0, 1) == "+")
        {
            const addThis = tempHp.substring(tempHp.indexOf('+') + 1);
            let result = (+addThis + +element.title).toString();

            await UpdateUnit(target.id, [{ key: UnitConstants.TEMPHP, value: result }]);
            e.preventDefault();
        }
        else if (tempHp.substring(0, 1) == "-")
        {
            const minusThis = tempHp.substring(tempHp.indexOf('-') + 1);
            let result = (+element.title - +minusThis);
            if (result < 0)
            {
                newCurrentHp = ((+currentHp.value) + result).toString();
                result = 0;
            }

            await UpdateUnit(target.id, [{ key: UnitConstants.TEMPHP, value: result.toString() }, { key: UnitConstants.CURRENTHP, value: newCurrentHp }]);
            e.preventDefault();
        }
        else
        {
            await UpdateUnit(target.id, [{ key: UnitConstants.TEMPHP, value: tempHp }]);
        }
    }

    return element;
}

export function GetArmorInput(unit: Item): HTMLInputElement
{
    const element = document.createElement('input');
    element.classList.add("text-input");
    element.inputMode = "numeric";
    element.id = `aC${unit.id}`;
    element.value = Meta(unit, UnitConstants.ARMORCLASS);
    element.size = 2;
    element.maxLength = 2;
    element.style.width = smallColWidth;
    element.style.minWidth = "25px";
    element.onblur = async (event: Event) =>
    {
        const target = event.currentTarget as HTMLInputElement;
        await UpdateUnit(target.id, [{ key: UnitConstants.ARMORCLASS, value: target.value }]);
    };

    return element;
}

export function GetElevationInput(unit: Item): HTMLInputElement
{
    const element = document.createElement('input');
    element.classList.add("text-input");
    element.inputMode = "numeric";
    element.id = `eL${unit.id}`;
    element.value = Meta(unit, UnitConstants.ELEVATION) ?? "-";
    element.size = 3;
    element.maxLength = 3;
    element.style.width = smallColWidth;
    element.style.minWidth = "25px";
    element.onblur = async (event: Event) =>
    {
        const target = event.currentTarget as HTMLInputElement;
        await UpdateUnit(target.id, [{ key: UnitConstants.ELEVATION, value: target.value }]);
    };

    return element;
}

export function GetEFXInput(unit: Item): HTMLInputElement
{
    const element = document.createElement('input');
    element.type = 'image';
    element.src = Meta(unit, UnitConstants.EFFECTS) ? '/effect-on.svg' : '/effect-off.svg';
    element.classList.add("text-input");
    element.classList.add("icon");
    element.classList.add("clickable");
    element.id = `eX${unit.id}`;
    element.style.width = smallColWidth;
    element.style.minWidth = "25px";
    element.onclick = async (_event: Event) =>
    {
        await OBR.popover.open({
            id: Constants.EXTENSIONEFFECTSID,
            url: `/submenu/effects.html?unitid=${unit.id}`,
            height: 220,
            width: 300,
            hidePaper: true
        });
    };

    const unitEffects = Meta(unit, UnitConstants.EFFECTS) as TurnEffect[];
    if (unitEffects?.length > 0)
    {
        const tooltips = [];
        for (const effect of unitEffects)
        {
            const message = `'${effect.Name}' til ${effect.StartOfTurn.toLowerCase()} of Round ${effect.EndingRound}`;
            tooltips.push(message);
        }
        element.title = tooltips.join("\r\n");
    }
    else
    {
        element.title = "No active effects";
    }
    return element;
}

export function GetMoveInput(unit: Item): HTMLDivElement
{
    const walkSpeed = Meta(unit, UnitConstants.SPEEDWALK) as number;
    let fastestMove = walkSpeed
    let fastestType = "/speedwalk.svg";

    const climbSpeed = Meta(unit, UnitConstants.SPEEDCLIMB) as number;
    if (climbSpeed > fastestMove)
    {
        fastestMove = climbSpeed;
        fastestType = "/speedclimb.svg";
    }
    const swimSpeed = Meta(unit, UnitConstants.SPEEDSWIM) as number;
    if (swimSpeed > fastestMove)
    {
        fastestMove = swimSpeed;
        fastestType = "/speedswim.svg";
    }
    const flySpeed = Meta(unit, UnitConstants.SPEEDFLY) as number;
    if (flySpeed > fastestMove)
    {
        fastestMove = flySpeed;
        fastestType = "/speedfly.svg";
    }
    const burrowSpeed = Meta(unit, UnitConstants.SPEEDBURROW) as number;
    if (burrowSpeed > fastestMove)
    {
        fastestMove = burrowSpeed;
        fastestType = "/speedburrow.svg";
    }

    const information = `Walk:${walkSpeed}\nClimb:${climbSpeed}\nSwim:${swimSpeed}\nFly:${flySpeed}\nBurrow:${burrowSpeed}`;

    const element = document.createElement('div');
    element.classList.add("text-input");
    element.classList.add("disabled");
    element.classList.add("information");
    element.inputMode = "numeric";
    element.id = `mV${unit.id}`;
    element.style.width = smediumWidth;
    element.style.minWidth = smediumColMinWidth
    element.innerText = fastestMove.toString();
    element.setAttribute('data-information', information);

    const moveImgElement = document.createElement('img');
    moveImgElement.setAttribute('class', 'icon');
    moveImgElement.setAttribute('title', 'Highest Move Speed');
    moveImgElement.setAttribute('src', fastestType);
    moveImgElement.style.paddingLeft = "2px";
    element.appendChild(moveImgElement);

    return element;
}

export function GetStatInput(unit: Item): HTMLInputElement
{
    const element = document.createElement('input');
    element.type = "image";
    element.title = "View/Edit this Unit's Stats";
    element.id = `tB${unit.id}`;
    element.className = "clickable";
    element.onclick = async function (e)
    {
        const currentTarget = e.currentTarget as HTMLInputElement;
        await OpenSubMenu(currentTarget.id.substring(2));
    };
    element.src = "/triangle.svg";
    element.height = 20;
    element.width = 20;
    element.style.marginLeft = "5px";

    return element;
}

/// View Footer Buttons

export function ConfigureViewFooterButtons()
{
    // Configure Setting Buttons
    document.getElementById("previousContainer")?.appendChild(GetPreviousButton());
    document.getElementById("nextContainer")?.appendChild(GetNextButton());
    document.getElementById("settingsContainer")?.appendChild(GetSettingsButton());
    document.getElementById("showLogContainer")?.appendChild(GetShowRollLogButton());
}

export function ConfigureViewFooterPlayerButtons()
{
    document.getElementById("showLogContainer")?.appendChild(GetShowRollLogButton());
}

function GetPreviousButton(): HTMLInputElement
{
    const element = document.createElement('input');
    element.type = "button";
    element.id = "previousButton";
    element.value = "Previous"
    element.classList.add("footer-button");
    element.title = "Previous Turn"
    element.onclick = async function () 
    {
        if (GMVIEW.roundCounter === 1 && GMVIEW.turnCounter === 0) return;
        if (GMVIEW.viewBody!.rows?.length > 1)
        {
            GMVIEW.turnCounter--;
            for (var i = 0, row; row = GMVIEW.viewBody!.rows[i]; i++) 
            {
                if (row.className.includes("turn-outline"))
                {
                    if (row.parentElement?.firstElementChild === row)
                    {
                        GMVIEW.roundCounter--;
                        if (GMVIEW.roundCounter < 1) GMVIEW.roundCounter = 1;
                        GMVIEW.turnCounter = row.parentElement.childElementCount;
                    }
                }
            }
            await OBR.scene.setMetadata({
                [SettingsConstants.TURNCOUNT]: GMVIEW.turnCounter,
                [SettingsConstants.ROUNDCOUNT]: GMVIEW.roundCounter
            });
        }
    }

    return element;
}

function GetNextButton(): HTMLInputElement
{
    const element = document.createElement('input');
    element.type = "button";
    element.id = "nextButton";
    element.value = "Next";
    element.classList.add("footer-button");
    element.title = "Next Turn"
    element.onclick = async function () 
    {
        if (GMVIEW.currentTurnUnit) GMVIEW.HandleEffects(GMVIEW.currentTurnUnit, "End");
        if (GMVIEW.viewBody!.rows?.length > 1)
        {
            GMVIEW.turnCounter++;
            for (var i = 0, row; row = GMVIEW.viewBody!.rows[i]; i++) 
            {
                if (row.className.includes("turn-outline"))
                {
                    if (row.parentElement?.lastElementChild === row)
                    {
                        GMVIEW.roundCounter++;
                        GMVIEW.turnCounter = 0;
                    }
                }
            }
            GMVIEW.startEffectsDone = false;
            await OBR.scene.setMetadata({
                [SettingsConstants.TURNCOUNT]: GMVIEW.turnCounter,
                [SettingsConstants.ROUNDCOUNT]: GMVIEW.roundCounter
            });
        }
    }

    return element;
}

function GetShowRollLogButton(): HTMLInputElement
{
    const element = document.createElement('input');
    element.type = "button";
    element.id = "showLogButton";
    element.value = "Show Log"
    element.title = "Show Log"
    element.classList.add("footer-button");
    element.onclick = async function () 
    {
        ShowRollLog(true);
    }

    return element;
}

export function RenderRollLog(): void
{
    Constants.MAINLOG.innerHTML = Constants.ROLLLOG;
    GetReturnRollLogButton();
}

function GetReturnRollLogButton(): void
{
    const logReturnContainer = document.getElementById("rollLogReturnContainer");
    const goBackButton = document.createElement('input');
    goBackButton.type = "button";
    goBackButton.classList.add("footer-button");
    goBackButton.id = "returnButton";
    goBackButton.title = "Return to Initiative List"
    goBackButton.value = "Return"
    goBackButton.onclick = async function () 
    {
        ShowRollLog(false);
    };
    logReturnContainer?.append(goBackButton);
}

function GetSettingsButton(): HTMLInputElement
{
    const element = document.createElement('input');
    element.type = "button";
    element.id = "settingsButton";
    element.value = "Settings"
    element.title = "View Settings"
    element.classList.add("footer-button");
    element.onclick = async function () 
    {
        ShowSettingsMenu(true);
    }

    return element;
}

export function ShowSettingsMenu(show: boolean): void
{
    Constants.MAINSETTINGS.style.display = show ? "contents" : "none";
    Constants.MAINAPP.style.display = !show ? "block" : "none";
}

export function ShowRollLog(show: boolean): void
{
    Constants.MAINLOG.style.display = show ? "contents" : "none";
    Constants.MAINAPP.style.display = !show ? "block" : "none";
}

export function ShowMainMenu(show: boolean): void
{
    Constants.MAINSETTINGS.style.display = !show ? "contents" : "none";
    Constants.MAINLOG.style.display = !show ? "contents" : "none";
    Constants.MAINAPP.style.display = show ? "block" : "none";
}

function HideMenu()
{
    document.getElementById("contextMenu")!
        .style.display = "none"
}

function Meta(unit: Item, key: string): any
{
    return unit.metadata[key] as any;
}

async function UpdateUnit(id: string, values: { key: string, value: string }[]): Promise<void>
{
    const unitId = id.substring(2);
    await OBR.scene.items.updateItems((item) => item.id === unitId, (items) =>
    {
        for (let item of items)
        {
            for (let value of values)
            {
                item.metadata[value.key] = value.value;
                if (value.key === UnitConstants.OWNERID)
                {
                    item.createdUserId = value.value;
                }
            }
        }
    });
}

export async function OpenSubMenu(unitId: string, elementId?: string): Promise<void>
{
    const windowHeight = await OBR.viewport.getHeight();
    const modalBuffer = 100;
    const viewableHeight = windowHeight > 800 ? 700 : windowHeight - modalBuffer; // Using 100 as a buffer to account for padding.

    if (elementId)
    {
        await OBR.popover.close(`POP_${unitId}`);
        await OBR.popover.open({
            id: Constants.EXTENSIONSUBMENUID,
            url: `/submenu/subindex.html?unitid=${unitId}`,
            height: viewableHeight,
            width: 350,
            anchorElementId: elementId,
            hidePaper: true,
            disableClickAway: true
        });
    }
    else
    {
        await OBR.popover.close(`POP_${unitId}`);
        await OBR.popover.open({
            id: Constants.EXTENSIONSUBMENUID,
            url: `/submenu/subindex.html?unitid=${unitId}`,
            height: viewableHeight,
            width: 350,
            hidePaper: true,
            disableClickAway: true

        });
        //}
    }
}
