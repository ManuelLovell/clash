import OBR from "@owlbear-rodeo/sdk";
import { SUBVIEW } from "./clashSubView";

export async function RenderImportForm(): Promise<void>
{
    SUBVIEW.SUBIMPORTCARD!.innerHTML = `
            <h2>Import Custom JSON</h2>
            <div id="importDataContainer"></div>
            <div class="hr"></div>
            <div id="instructionsContainer"></div>
            <h3 style="text-align: center;">ChatGPT Help</br><span id="chatGptExampleButtonContainer"></span></h3> 
            ${exampleChatGPTString()}
            <h3 style="text-align: center;">Formatting Help</h3>
            ${exampleInterfaceString()}
            <div class="hr"></div>
            <h3>Sub Types</h3>
            ${exampleTypesString()}
           `;

    const importDataContainer = document.getElementById("importDataContainer");
    const gptButtonContainer = document.getElementById("chatGptExampleButtonContainer");

    //Create import Input Button
    const importValueButton = document.createElement('textarea');
    importValueButton.id = "customJsonValueBox";
    importValueButton.title = "Type custom monster information here"

    //Create chatgpt example Button
    const gptButton = document.createElement('input');
    gptButton.id = "chatGptExampleButton";
    gptButton.type = "button";
    gptButton.value = "Template Prompt";
    gptButton.classList.add("clickable-roller-attack");
    gptButton.title = "Click this for a prompt to be copied to your clipboard";
    gptButton.onclick = async () =>
    {
        const chatGptPrompt = `Here is a CLASH! JSON for an Evil Cleric.

        {"id":"","tokenId":"","initiative":1,"currentHP":18,"isActive":0,"unitName":"Evil Cleric","maxHP":18,"armorClass":15,"unitType":"Humanoid","unitSize":"Small ","strScore":12,"strSave":1,"dexScore":16,"dexSave":3,"conScore":13,"conSave":1,"intScore":12,"intSave":1,"wisScore":13,"wisSave":1,"chaScore":7,"chaSave":-2,"damageVulnerabilities":"Fire","damageImmunities":"Poison","damageResistances":"Radiant","conditionImmunities":"Charm","challengeRating":"1/4","experiencePoints":0,"alignment":"Chaotic Evil ","standardActions":[{"name":"Bite","desc":"Melee Weapon Attack  +3  to hit, reach 5 ft., one target. 4  (1d6 + 1)  piercing damage."}],"legendaryActions":[],"specialAbilities":[],"spellActions":[{"name":"Spellcasting","desc":"The ixitxachitl is a 5th-level spellcaster that uses Wisdom as its spellcasting ability (spell save DC 11,  +3  to hit with spell attacks). The ixitxachitl has the following cleric spells prepared:"},{"name":"Level 0 Spells (undefined Slots)","desc":"Guidance, Thaumaturgy"},{"name":"Level 1 Spells (4 Slots)","desc":"Charm Person, Create Or Destroy Water"},{"name":"Level 2 Spells (3 Slots)","desc":"Hold Person, Silence"},{"name":"Level 3 Spells (2 Slots)","desc":"Dispel Magic, Tongues"}],"reactions":[{"name":"Barbed Tail","desc":"When a creature provokes an opportunity attack from the ixitxachitl, the ixitxachitl can make the following attack instead of using its bite."}],"spellList":[],"senses":"Darkvision 60 ft.","languages":"Abyssal, Ixitxachitl","speedWalk":0,"speedFly":0,"speedClimb":0,"speedBurrow":0,"speedSwim":30,"dataSlug":"ChatGPT","favorite":false,"sceneId":""}
        
        Create a <BLANK> in this format.`;
        
        try
        {
            await navigator.clipboard.writeText(chatGptPrompt);
            await OBR.notification.show("Prompt Copied to clipboard.", "SUCCESS");
        }
        catch
        {
            window.alert("Something went wrong; Please try again.");
        }
    };
    gptButtonContainer?.append(gptButton);
    importDataContainer?.append(importValueButton);
}

function exampleChatGPTString(): string
{
    return `
    Using a free ChatGPT account, you can click the button above to have a prompt copied to your clipboard.</br>
    Just paste that in to ChatGPT and change the '<BLANK>' to whatever you want.</br>
    Whether it's a random name, or a stat block from some other system.</br>
    Then copy/paste the result here and hit Import.`;
}

function exampleInterfaceString(): string
{
    let exampleInterface = `Below are the type definitions for importing.</br>
        If you need an easier example, click Export on an existing Unit and change the values.</br>
        When adding clickable dice rolls, the format is '(#d#+#)' ex; (2d6+2)</br>
        If it's detected in an Action description, it should create a roller button.</br></br>
        <b>CustomEntity</b> </br>
        {</br>
            unitName: string;</br> 
            initiative: number;</br> 
            currentHP: number;</br> 
            maxHP: number;</br> 
            armorClass: number;</br> 
        
            unitType: string;</br> 
            unitSize: string;</br> 
        
            strScore: number;</br> 
            strSave: number;</br> 
        
            dexScore: number;</br> 
            dexSave: number;</br> 
        
            conScore: number;</br> 
            conSave: number;</br> 
        
            intScore: number;</br> 
            intSave: number;</br> 
        
            wisScore: number;</br> 
            wisSave: number;</br> 
        
            chaScore: number;</br> 
            chaSave: number;</br> 
        
            damageVulnerabilities: string;</br> 
            damageImmunities: string;</br> 
            damageResistances: string;</br> 
            conditionImmunities: string;</br> 
        
            challengeRating: string;</br> 
            experiencePoints: number;</br> 
            alignment: string;</br> 
        
            standardActions: ActionsEntity[];</br> 
            legendaryActions?: ActionsEntity[];</br> 
            specialAbilities?: ActionsEntity[];</br> 
            spellActions?: ActionsEntity[];</br> 
            reactions?: ActionsEntity[];</br> 
        
            senses: string;</br> 
            languages: string;</br> 
        
            speedWalk: number;</br> 
            speedFly: number;</br> 
            speedClimb: number;</br> 
            speedBurrow: number;</br> 
            speedSwim: number;</br> 

            dataSlug: string;</br>
        }`;

    return exampleInterface;
}

function exampleTypesString(): string
{
    const exampleType = `      
        <b>ActionsEntity</b> </br>
        {   name?: string;</br>
          desc?: string;</br>   }</br>
        `;

    return exampleType;
}