import OBR from "@owlbear-rodeo/sdk";
import '/src/css/new-style.css'
import { Constants } from "./constants";


const whatsnew = document.querySelector<HTMLDivElement>('#clash-whatsnew');

whatsnew!.innerHTML = `
  <div>
    <h1>Clash! 8/23</h1>
    <div>Sorry for the confusion lately!
    Clash has grown quite a bit since I started and some of the older logic
    for handling how tokens are tracked per scene just.. couldn't cut it anymore.
    </br>
    This caused some stability issues and I've been working on getting it resolved
    back to a stable status.  Which has likely messed with your data.
    </br>
    </br>
    <b>THE WORST SHOULD BE OVER.</b> I've tossed the old tracking and implemented something new
    with a few speed/stability fixes to go with.
    </br>
    </br>
    If you're having data issues, it's because you have tokens that were added to the scene
    before this update went live.  Any tokens that are added to scenes AFTER the update should
    behave correctly.
    </br>
    </br>
    <b>If you're still having issues</b>; </br>
    1. Select all of your character tokens. Copy/Paste them into the scene. Delete the old ones. (This should
        instantiate all of the new ones correctly, and keep your positioning since they would be pasted as a group.)</br>
    2. Export your collection file, nuke the databse, import your collection file. (This will wipe the slate clean, but also
        remove everything from your scene data. So you would need to add the data back to those tokens.</div>
    </br>
    </br>
    If for some reason this doesn't resolve your issues, hop on Discord. There's only so much testing I can do.
  </div>
`;

OBR.onReady(async () =>
{
    const closebutton = document.querySelector<HTMLElement>('.close');
    closebutton!.onclick = async () =>
    {
        await OBR.modal.close(Constants.EXTENSIONWHATSNEW);
    };
});
