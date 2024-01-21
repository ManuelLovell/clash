import OBR, { Item, Metadata } from "@owlbear-rodeo/sdk";
import { SUBVIEW } from '../views/clashSubView';
import { Constants, UnitConstants } from "../clashConstants";
import { QueryMonsterDatabase, RenderSearchForm } from "../views/clashSubSearchView";
import { db } from "../local-database";
import * as Utilities from './../utilities/bsUtilities';
import { RenderImportForm } from "../views/clashSubImportView";
import { BuildUnitStatBlock } from '../views/clashSubViewBuildBlock';
import UnitInfo from "../unitinfo/clashUnitInfo";

export function AppendSubMainFooterButtons(): void
{
    const gotoSearchButton = document.createElement('input');
    gotoSearchButton.type = "button";
    gotoSearchButton.id = "gotoMonsterSearchButton";
    gotoSearchButton.value = "Search Monster Data"
    gotoSearchButton.className = "footer-button ";
    gotoSearchButton.style.marginRight = "4px";
    gotoSearchButton.title = "Search Monster Data from Free Open5e"
    gotoSearchButton.onclick = async function () 
    {
        SUBVIEW.ShowSearchMenu();
        RenderSearchForm();
    }

    const gotoImportJSONButton = document.createElement('input');
    gotoImportJSONButton.type = "button";
    gotoImportJSONButton.id = "gotoImportMonsterButton";
    gotoImportJSONButton.value = "Import Custom JSON"
    gotoImportJSONButton.className = "footer-button ";
    gotoImportJSONButton.style.marginLeft = "4px";
    gotoImportJSONButton.title = "Import Custom Monster JSON Data"
    gotoImportJSONButton.onclick = async function () 
    {
        SUBVIEW.ShowImportMenu();
        RenderImportForm();
    }

    SUBVIEW.SUBMAINFOOTER.appendChild(gotoSearchButton);
    SUBVIEW.SUBMAINFOOTER.appendChild(gotoImportJSONButton);
}

export function AppendSearchButtons(): void
{
    //Create Return Button
    const goBackButton = document.createElement('input');
    goBackButton.type = "button";
    goBackButton.id = "returnButton";
    goBackButton.className = "footer-button ";
    goBackButton.style.marginRight = "4px";
    goBackButton.title = "Go back to Unit Information";
    goBackButton.value = "Return";
    goBackButton.onclick = async function () 
    {
        SUBVIEW.ShowSubMenu();
    }

    //Create Search Input Button
    const searchValueButton = document.createElement('input');
    searchValueButton.type = "search";
    searchValueButton.id = "searchValue";
    searchValueButton.className = "text-input footer-button";
    searchValueButton.title = "Type a value to filter monsters by";
    searchValueButton.placeholder = "'Collection' shows Saved";
    searchValueButton.onkeydown = async function (e)
    {
        if (e.key !== "Enter") return;

        const target = e.currentTarget as HTMLInputElement;
        if (!target.value) return;

        await QueryMonsterDatabase();
    };

    //Create Search Confirm Button
    const searchConfirmButton = document.createElement('input');
    searchConfirmButton.type = "button";
    searchConfirmButton.id = "searchConfirm";
    searchConfirmButton.value = "Search";
    searchConfirmButton.className = "footer-button ";
    searchConfirmButton.style.marginLeft = "4px";
    searchConfirmButton.title = "Click to send Search";
    searchConfirmButton.onclick = async function () 
    {
        await QueryMonsterDatabase();
    };

    SUBVIEW.SUBSEARCHFOOTER.append(goBackButton);
    SUBVIEW.SUBSEARCHFOOTER.append(searchValueButton);
    SUBVIEW.SUBSEARCHFOOTER.append(searchConfirmButton);
}

export function AppendImportButtons(): void
{
    //Create JSON Return Button
    const goBackButton = document.createElement('input');
    goBackButton.type = "button";
    goBackButton.id = "returnButton";
    goBackButton.classList.add("footer-button");
    goBackButton.title = "Go back to Unit Information";
    goBackButton.value = "Return";
    goBackButton.onclick = async function () 
    {
        SUBVIEW.ShowSubMenu();
    }

    
    //Create import Confirm Button
    const importConfirmButton = document.createElement('input');
    importConfirmButton.type = "button";
    importConfirmButton.id = "importConfirm";
    importConfirmButton.value = "Confirm Import";
    importConfirmButton.classList.add("footer-button");
    importConfirmButton.title = "Click to import custom data"
    importConfirmButton.onclick = async function () 
    {
        const importValueButton = SUBVIEW.SUBIMPORTCARD.querySelector("#customJsonValueBox") as HTMLTextAreaElement;
        const customData = importValueButton.value;

        try 
        {
            SUBVIEW.freshImport = true;
            //TODO: Add UnitCheck to see if UnitID still exists in OBR
            //Delete hook will remove it from DB

            SUBVIEW.currentUnit.ImportFromJSON(customData);
            BuildUnitStatBlock(SUBVIEW.currentUnit);
        }
        catch (error) 
        {
            await OBR.notification.show(`The import failed - ${error}`, "ERROR");
        }
    }

    SUBVIEW.SUBIMPORTFOOTER.appendChild(goBackButton);
    SUBVIEW.SUBIMPORTFOOTER.appendChild(importConfirmButton);
}

export function AppendUnitSaveButton(): void
{
    //Get Button Container
    const buttonContainer = document.getElementById("buttonContainer");

    //Create Save Button
    const saveButton = document.createElement('input');
    saveButton.type = "image";
    saveButton.id = "saveButton";
    saveButton.classList.add("clickable");
    saveButton.onclick = async function () 
    {
        //Validate form inputs
        SUBVIEW.currentUnit.ImportCustomFormInputs(document);
        if (SUBVIEW.multiSheet)
        {
            const baseName = SUBVIEW.currentUnit.unitName;
            const metadataPack: Metadata[] = [];
            for (var i = 0, id; id = SUBVIEW.multiIds[i]; i++) 
            {
                SUBVIEW.currentUnit.id = id;
                SUBVIEW.currentUnit.tokenId = id;
                SUBVIEW.currentUnit.unitName = baseName + ` ${String.fromCharCode('A'.charCodeAt(0) + i)}`;

                const newData = SUBVIEW.currentUnit.GetMetadata();
                metadataPack.push(newData);
            }

            await OBR.scene.items.updateItems(SUBVIEW.multiIds, (items) =>
            {
                for (let item of items)
                {
                    const mine = metadataPack.find(metadata => metadata[UnitConstants.ID] === item.id)
                    if (mine)
                    {
                        item.name = mine[UnitConstants.UNITNAME] as string;
                        Object.assign(item.metadata, mine);
                    }
                }
            });
        }
        else
        {
            const newData = SUBVIEW.currentUnit.GetMetadata();

            await OBR.scene.items.updateItems(
                (item: Item) => item.id == SUBVIEW.currentUnit.id,
                (items: Item[]) =>
                {
                    for (let item of items)
                    {
                        item.name = newData[UnitConstants.UNITNAME] as string;
                        Object.assign(item.metadata, newData);
                    };
                });
        }
        // Test
        SUBVIEW.SUBMAINCARD.innerHTML = "";
        SUBVIEW.RenderUnitInfo()
    }
    saveButton.src = "/save.svg";
    saveButton.title = "Save Changes";
    saveButton.height = 20;
    saveButton.width = 20;

    buttonContainer?.appendChild(saveButton);
}

export function AppendFavoriteButton(): void
{
    //Get Button Container
    const buttonContainer = document.getElementById("buttonContainer");

    //Create Favorite Button
    const favoriteButton = document.createElement('input');
    favoriteButton.type = "image";
    favoriteButton.id = "favoriteButton";
    favoriteButton.value = "false";
    favoriteButton.classList.add("clickable");
    favoriteButton.onclick = async function () 
    {
        const collectionButton = <HTMLInputElement>document.getElementById("collectionButton");
        if (favoriteButton.value == "false")
        {
            favoriteButton.value = "true";
            favoriteButton.src = "/favorite.svg";
            favoriteButton.classList.add("favorite");
            collectionButton.classList.add("favorite");
            collectionButton.title = "Save to Collection & Favorite";
            SUBVIEW.favorite = true;
        }
        else
        {
            favoriteButton.value = "false";
            favoriteButton.src = "/favoriteline.svg";
            favoriteButton.classList.remove("favorite");
            collectionButton.classList.remove("favorite");
            collectionButton.title = "Save to Collection";
            SUBVIEW.favorite = false;
        }
    }
    favoriteButton.src = "/favoriteline.svg";
    favoriteButton.title = "Toggle Favorite on Export";
    favoriteButton.height = 20;
    favoriteButton.width = 20;

    buttonContainer?.appendChild(favoriteButton);
}

export function AppendCollectionSaveButton(): void
{
    //Get Button Container
    const buttonContainer = document.getElementById("buttonContainer");

    //Create Collect Button
    const saveButton = document.createElement('input');
    saveButton.type = "image";
    saveButton.id = "collectionButton";
    saveButton.classList.add("clickable");
    saveButton.onclick = async function () 
    {
        //Validate form inputs
        SUBVIEW.currentUnit.ImportCustomFormInputs(document);
        const authorName = await OBR.player.getName();

        //Clean Unit and remove Ids
        let cleanCopy: UnitInfo = JSON.parse(JSON.stringify(SUBVIEW.currentUnit));
        cleanCopy.id = "";
        cleanCopy.tokenId = "";
        cleanCopy.dataSlug = authorName;

        //Check DB for Creature by same name
        const dupe = await db.Creatures.get({ unitName: SUBVIEW.currentUnit.unitName, dataSlug: authorName });
        if (dupe)
        {
            if (confirm(`Unit named '${SUBVIEW.currentUnit.unitName}' already found in Collection. Overwrite?`))
            {
                // Has permission to save
                cleanCopy.id = dupe.id;
                cleanCopy.favorite = SUBVIEW.favorite;
                await db.Creatures.put(cleanCopy, dupe.id);
            }
        }
        else
        {
            // Doesn't need permission
            const freshGuid = Utilities.GetGUID();
            cleanCopy.id = freshGuid;
            cleanCopy.favorite = SUBVIEW.favorite;
            await db.Creatures.put(cleanCopy, freshGuid);
        }
    }
    saveButton.src = "/collection.svg";
    saveButton.title = "Save to Collection";
    saveButton.height = 20;
    saveButton.width = 20;

    buttonContainer?.appendChild(saveButton);
}

export function AppendUnitExportButton(): void
{
    //Get Button Container
    const buttonContainer = document.getElementById("buttonContainer");

    //Create Export Button
    const exportButton = document.createElement('input');
    exportButton.type = "image";
    exportButton.id = "exportButton";
    exportButton.classList.add("clickable");
    exportButton.onclick = async function () 
    {
        //Validate form inputs
        SUBVIEW.currentUnit.ImportCustomFormInputs(document);
        SUBVIEW.currentUnit.id = "";
        SUBVIEW.currentUnit.tokenId = "";
        try
        {
            await navigator.clipboard.writeText(JSON.stringify(SUBVIEW.currentUnit));
            await OBR.notification.show("JSON Copied to clipboard.", "SUCCESS");
        }
        catch
        {
            window.alert("Unable to copy; Please try again.");
        }
    }
    exportButton.src = "/export.svg";
    exportButton.title = "Export to JSON";
    exportButton.height = 20;
    exportButton.width = 20;

    buttonContainer?.appendChild(exportButton);
}

export function AppendWindowPinButton(): void
{
    //Get Button Container
    const buttonContainer = document.getElementById("buttonContainer");

    //Create Export Button
    const pinButton = document.createElement('input');
    pinButton.type = "image";
    pinButton.id = "pinButton";
    pinButton.classList.add("clickable");
    pinButton.onclick = async function () 
    {
        if (!SUBVIEW.pinned)
        {
            const width = await OBR.viewport.getWidth() - 70;

            // Close any existing windows before pinning something
            await OBR.modal.close(Constants.EXTENSIONSUBMENUID);
            await OBR.popover.close(Constants.EXTENSIONSUBMENUID);
            await OBR.popover.open({
                id: `POP_${SUBVIEW.POPOVERSUBMENUID}`,
                url: `/submenu/subindex.html?unitid=${SUBVIEW.POPOVERSUBMENUID}&pinned=true`,
                height: 300,
                width: 325,
                anchorPosition: { top: 50, left: width },
                anchorReference: "POSITION",
                anchorOrigin: {
                    vertical: "CENTER",
                    horizontal: "RIGHT",
                },
                transformOrigin: {
                    vertical: "CENTER",
                    horizontal: "RIGHT",
                },
                hidePaper: true,
                disableClickAway: true
            });
        }
        else
        {
            await OBR.popover.close(`POP_${SUBVIEW.POPOVERSUBMENUID}`);
        }
    }
    pinButton.src = SUBVIEW.pinned ? "/pinfill.svg" : "/pin.svg";
    pinButton.title = "Pin to Window";
    pinButton.height = 20;
    pinButton.width = 20;

    buttonContainer?.appendChild(pinButton);
}

export function AppendAddActionButtons(): void
{
    //Get Button Container
    const legendaryButtonContainer = document.getElementById("addLegendaryButtonContainer");

    //Create Add Legendary Button
    const addLegendaryButton = document.createElement('input');
    addLegendaryButton.type = "image";
    addLegendaryButton.id = "addButton";
    addLegendaryButton.title = "Add new Legendary Action"
    addLegendaryButton.classList.add("clickable");
    addLegendaryButton.onclick = async function () 
    {
        //Add a blank action
        const legendCollection = <HTMLElement>document.getElementById("formLegendaryCollection");
        const baseLegendHtml = `<div id="formLegendaryContainer" class="Legendary"><span id="formLegendaryName" class="legendaryname" contentEditable="true">Legend-Name.</span>.
                <span id="formLegendaryDesc" class="description" onblur="handleBlur(event)" contentEditable="true">Legend-Desc</span></div>`;
        legendCollection.insertAdjacentHTML('beforeend', baseLegendHtml);
    }
    addLegendaryButton.src = "/add.svg";
    addLegendaryButton.height = 20;
    addLegendaryButton.width = 20;
    legendaryButtonContainer?.appendChild(addLegendaryButton);

    //Get Button Container
    const reactionButtonContainer = document.getElementById("addReactionButtonContainer");

    //Create Add Reaction Button
    const addReactionButton = document.createElement('input');
    addReactionButton.type = "image";
    addReactionButton.id = "addButton";
    addReactionButton.title = "Add new Reaction"
    addReactionButton.classList.add("clickable");
    addReactionButton.onclick = async function () 
    {
        //Add a blank action
        const reactCollection = <HTMLElement>document.getElementById("formReactionCollection");
        const baseReactHtml = `<div id="formReactionContainer" class="Reaction"><span id="formReactionName" class="reactionname" contentEditable="true">React-Name.</span>.
                <span id="formReactionDesc" class="description" onblur="handleBlur(event)" contentEditable="true">React-Desc</span></div>`;
        reactCollection.insertAdjacentHTML('beforeend', baseReactHtml);
    }
    addReactionButton.src = "/add.svg";
    addReactionButton.height = 20;
    addReactionButton.width = 20;
    reactionButtonContainer?.appendChild(addReactionButton);

    //Get Button Container
    const attackButtonContainer = document.getElementById("addAttackButtonContainer");

    //Create Add Attack Button
    const addAttackButton = document.createElement('input');
    addAttackButton.type = "image";
    addAttackButton.id = "addButton";
    addAttackButton.title = "Add new Attack"
    addAttackButton.classList.add("clickable");
    addAttackButton.onclick = async function () 
    {
        //Add a blank action
        const attackCollection = <HTMLElement>document.getElementById("formAttackCollection");
        const baseAttackHtml = `<div id="formAttackContainer" class="attack"><span id="formAttackName" class="attackname" contentEditable="true">Atk-Name.</span>.
                <span id="formAttackDesc" class="description" onblur="handleBlur(event)" contentEditable="true">Atk-Desc</span></div>`;
        attackCollection.insertAdjacentHTML('beforeend', baseAttackHtml);
    }
    addAttackButton.src = "/add.svg";
    addAttackButton.height = 20;
    addAttackButton.width = 20;
    attackButtonContainer?.appendChild(addAttackButton);

    //Get Button Container
    const abilityButtonContainer = document.getElementById("addAbilityButtonContainer");

    //Create Add Ability Button
    const addAbilityButton = document.createElement('input');
    addAbilityButton.type = "image";
    addAbilityButton.id = "addButton";
    addAbilityButton.classList.add("clickable");
    addAbilityButton.title = "Add new Ability";
    addAbilityButton.onclick = async function () 
    {

        //Add a blank ability
        const abilityCollection = <HTMLElement>document.getElementById("formAbilityCollection");
        const baseabilityHtml = `<div id="formAbilityContainer" class="ability"><span id="formAbilityName" class="abilityname" contentEditable="true">Act-Name.</span>.
                <span id="formAbilityDesc" class="description" onblur="handleBlur(event)" contentEditable="true">Act-Desc</span></div>`;
        abilityCollection.insertAdjacentHTML('beforeend', baseabilityHtml);
    }
    addAbilityButton.src = "/add.svg";
    addAbilityButton.height = 20;
    addAbilityButton.width = 20;
    abilityButtonContainer?.appendChild(addAbilityButton);

    //Get Button Container
    const spellButtonContainer = document.getElementById("addSpellButtonContainer");

    //Create Add SPELL Button
    const addSpellButton = document.createElement('input');
    addSpellButton.type = "image";
    addSpellButton.id = "addButton";
    addSpellButton.title = "Add new Spell";
    addSpellButton.classList.add("clickable");
    addSpellButton.onclick = async function () 
    {
        //Add a blank SPELL
        const abilityCollection = <HTMLElement>document.getElementById("formSpellCollection");
        const baseabilityHtml = `<div id="formSpellContainer" class="spell"><span id="formSpellName" class="spellname" contentEditable="true">Spell-Name.</span>.
                <span id="formSpellDesc" class="description" onblur="handleBlur(event)" contentEditable="true">Spell-Desc</span></div>`;
        abilityCollection.insertAdjacentHTML('beforeend', baseabilityHtml);
    }
    addSpellButton.src = "/add.svg";
    addSpellButton.height = 20;
    addSpellButton.width = 20;
    spellButtonContainer?.appendChild(addSpellButton);
}