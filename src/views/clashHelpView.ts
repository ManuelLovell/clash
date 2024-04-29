import { ShowHelpMenu } from "../buttons/clashListButtons";
import { Constants } from "../clashConstants";
import * as showdown from 'showdown';

export async function RenderHelp(): Promise<void>
{
    Constants.MAINHELP!.innerHTML = `
        <div id="helpWindowContainer">
            <div id="helpMarkdownContainer"></div>
        <footer>
            <span id="helpReturnContainer"></span>
        </footer>
        </div>
        `;

    const converter = new showdown.Converter();
    const helpHtml = converter.makeHtml(Constants.MARKDOWNHELP);
    const helpElement = document.getElementById("helpMarkdownContainer") as HTMLDivElement;
    helpElement.innerHTML = helpHtml;

    const helpReturnContainer = document.getElementById("helpReturnContainer");
    const goBackButton = document.createElement('input');
    goBackButton.type = "button";
    goBackButton.id = "returnButton";
    goBackButton.title = "Return to Initiative List"
    goBackButton.value = "Return"
    goBackButton.onclick = async function () 
    {
        ShowHelpMenu(false);
    };
    helpReturnContainer?.append(goBackButton);

}