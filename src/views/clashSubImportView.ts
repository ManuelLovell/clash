import { SUBVIEW } from "./clashSubView";

export async function RenderImportForm(): Promise<void>
{
    SUBVIEW.SUBIMPORTCARD!.innerHTML = `
            <h2>Import Custom JSON</h2>
            <div id="importDataContainer"></div>
            <div class="hr"></div>
            <div class ="red" id="exampleLine">Example Input</div>
            <div id="instructionsContainer"></div>
            <h3>Formatting Help</h3>
            ${exampleInterfaceString()}
            <div class="hr"></div>
            <h3>Sub Types</h3>
            ${exampleTypesString()}
           `;

    const importDataContainer = document.getElementById("importDataContainer");

    //Create import Input Button
    const importValueButton = document.createElement('textarea');
    importValueButton.id = "customJsonValueBox";
    importValueButton.title = "Type custom monster information here"

    importDataContainer?.append(importValueButton);
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