import OBR from "@owlbear-rodeo/sdk";
import '/src/css/new-style.css'
import { Constants } from "./constants";


const whatsnew = document.querySelector<HTMLDivElement>('#clash-whatsnew')!;
const footer = document.querySelector<HTMLElement>('#clash-whatsnew-notes')!;

whatsnew.innerHTML = `
  <div>
    <h1>Clash! 10/26</h1>
    Updated time stamps to fall in line with Rumble's new logic. Should resolve some issues with player changes not showing on the GM list.
    </br>
    Also updated the Rollables on the StatBlock. You shouldn't need to refresh the sheet anymore to see changes, the button should appear once the control loses focus. (Meaning, you click a different element.)
    </br>
    </br>
    <h1>Clash! 10/7</h1>
    Fix for adding items as groups (non-characters/mounts were able to sneak in.)
    </br>
    Sorry for the absence, got married on 10/1! Regular updates again after the end of the month when I'm back home.
    </br>
    </br>
    <h1>Clash! 9/20</h1>
    Small fix to improve how saving works.
    </br>
    </br>
    <h1>Clash! 9/19</h1>
    Selecting a token now 'highlights' it in the list.
    </br>
    Should work from both GM and Player end. SHOULD.
    </br>
    </br>
    <h1>Clash! 9/16</h1>
    Minor bugfix for the iteration copying.
    </br>
    For now, I explain some features that aren't explicitly stated.
    </br>
    <b>1.</b> You can adjust HP in the main window by just throwing +/- in it. So if a creature has 40HP, and you type in -15, it'll update to 25HP.
    </br>
    <b>2.</b> If you have a token named Goblin, and a creature in your collection named Goblin - it'll automatically get set with those stats when that token is dragged into the scene.
    </br>
    <b>3.</b> If you right click a token in the main window, you can change the owner to a player. (Who can then set it's Initiative/HP/AC in their own window!)
    </br>
    </br>
    <h1>Clash! 9/14</h1>
    Fixed an issue with copying tokens that were not in initiative, but had data.
    While incremeneting.
    </br>
    Also added a "PIN" button to Unit Cards. This will leave a mini-window of the card open.
    Use it as a quick-reference, since you're allowed to click-away while it's up.
    </br>
    Only one can be visible at a time (because I haven't quite figured out placement issues) 
    and the position is static.
    </br>
    Also fixed a minor bug with the bottom border on the Unit Cards. It always bugged me.
    </br>
    </br>
    <h1>Clash! 9/3</h1>
    Hopefully fixed an issue with IndexedDB that was stopping Clash from working on Safari.
    Also <b>HIDDEN</b> units should no longer appear on the Player Initiative List.
    At all.
    </br>
    Let them live in fear.
    </br> (No unit in the list is highlighted when it's a hidden units turn.)
    </br>
    Also fixed a bug with the Rumble hook displaying rolls several times.
    </br>
    <h1>Clash! 8/28</h1>
    Just a minor fix for stopping the Settings>WhatsNew window from auto-closing.
    </br>
    <h1>Changes 8/27</h1>
    <div> If you ever want to see these updates again/later, click the 'i' in Settings!
    </br>
    </br>
    Hey there, just a few fixes today.
    There were some duplication errors when alt-copying tokens or alt-copying a token with an incrementor.
    </br>
    This looks to be resolved now, though if you have a group of Goblins labeled Goblin A through Goblin D, and Goblin C
    has unique stats.. and you went to copy Goblin C, the stats won't copy in precisely. This is in part to how
    OBR handles copying, and me not wanting to go down a rabbit hole for an edgecase.
    </br>
    </br>
    Also (this) What's New message now has a timer, so it'll autoclose after 10 seconds.
    Apparently Chromecast devices get the message but have no way to dismiss it. Oops.
    </br>
    </br>
    Some things I haven't mentioned, an earlier update added the ability for players to update
    the information of tokens in the Initiative List for tokens THEY OWN. So if they updated it? They can edit it's list values.
    </br>
    You can also (As the GM) change the ownership of a token by right-clicking it in the list.
    
    </br>
    </br>
    <h1>Changes! 8/23</h1>
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
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const timerParam = urlParams.get('timer')!;

    footer.innerHTML = `
    <a href="https://discord.gg/ANZKDmWzr6" target="_blank">Join the OBR Discord!</a>
    <div class="timer" style="--duration: ${timerParam};--size: 34;">
    <div class="mask"></div>
    </div>
    <div class="close">⤬</div>`;

    const closebutton = document.querySelector<HTMLElement>('.close')!;
    closebutton!.onclick = async () =>
    {
        await OBR.modal.close(Constants.EXTENSIONWHATSNEW);
    };

    // Close dialogue after 10 seconds
    setTimeout(() =>
    {
        closebutton.click();
    }, +timerParam * 1000); // 10000 milliseconds = 10 seconds
});
