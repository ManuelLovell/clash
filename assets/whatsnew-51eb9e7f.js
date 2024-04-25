import{O as o,C as a}from"./clashConstants-ff1486f5.js";const l=document.querySelector("#bs-whatsnew"),h=document.querySelector("#bs-whatsnew-notes");l.innerHTML=`
  <div id="newsContainer">
    <h1>Clash! 4/25</h1>
    QoL Time! Slowly working through it all.
    </br> As suggested by a user, clicking the UnitInfo button in the Initiative List while that unit's card is open will now close the window.
    </br> Also, the close button is now 'static' so even if you scroll down, it's always easily accessible.
    </br> Since Bones! is now in the OBR store, I've enabled the integration for it incase you want to use that roller with Clash.
    </br> Some general stability updates, some seeing some extensions are loading before scenes are fully in.
    </br> Enjoy!
    <h1>Clash! 4/13</h1>
    Allowed up to four 'characters' in the Initiative Input. In case you need to do a 12.3 and 12.4.
    </br>
    <h1>Clash! 4/12</h1>
    Minor bug fix for Open5e not being available; It'll now show an error message if that's the case and not just tank your search. So you can still use the collection. Sorry!
    </br>
    <h1>Clash! 2/16</h1>
    Minor fix for the 'Remove Unit' contextmenu item disappearing when a player joined/left the room.
    </br>
    <h1>Clash! 2/8</h1>
    Minor fix for Pinned windows, where clicking close would close the wrong window.
    </br>
    <h1>Clash! 2/8</h1>
    Some people hate fun.
    </br> So I added a toggle to turn off randomizing name descriptors. 
    </br> Enjoy your five identical goblins.
    </br>
    <h1>Clash! 2/5</h1>
    Minor update. 
    </br>Added a setting to change the Initiative Roller to any value 1-99.
    <li> So if your game uses D10s for initiatve, just change it to 10.
    </br>
    </br>Added a setting to turn off adding your DEX bonus to the initiative roll.
    </br>
    </br> The stat block no longer closes on click-away. I should've done this awhile ago, but in some ways it seemed 'faster' to me. A close button is now in the top-right. No more accidentally losing changes.
    </br>
    <h1>Clash! 2/5</h1>
    Sorry for the hiccup! Some weird bugs made it through release. Should be resolved..
    </br>
    <h1>Clash! 2/5</h1>
    Lots of new things. Check Patreon link for details.
    </br> Highlights:
    <li> New Setting: Show Names
    <li> New Column: Elevation
    <li> New Column: Effects
    <li> New Function: Right-Click Remove Unit
    <li> Updated Function: Reset Initiative List (Resets Current HP, Effects, Elevation)
    </br>
    <h1>Clash! 2/5</h1>
    I was informed the duplicating behavior was busted. Meaning, if you copied a token - it was no longer being appended with an indexer like A, B C..1, 2 3..
    </br> Which, turns out it was busted for awhile. A lot of the new logic didn't allow for this to work the way it did before, so I clearly scrapped it and forgot.
    </br> Luckily, I've been wanting to change this behavior for awhile to not indicate to players how many creatures there are.
    <img class="news-image" src="/goblins.png" alt="Goblins!">
    </br> So now it should randomly choose from a list of adjectives and slap that on there. I cleaned it up a bit to make sure nothing made your creatures seem TOO strong, but it should allow for some fun.
    </br> You should see this behavior when duplicating tokens and they have the same name, or doing group edits.
    <h1>Clash! 1/20</h1>
    GameJam was a bust. Life consumed too much free time, so we'll try again next month.
    </br>
    Changes!
    <li> I fixed the instant-refresh on roller text. So you should not have to save/refresh to see the results for adding rolls to statblocks. Instant (Just click off the element)!
    <li> Removed some of the strictness on toHit-rolls. So '+9' should format for a roll just fine, and not just ' +9 '.
    <li> Added a ChatGPT Template button to the 'Import Custom JSON' button.
    </br> This will copy a template to your clipboard that you can paste into ChatGPT, and just swap the word '<BLANK>' with whatever you want. And it'll give you some Clash JSON.
    </br> I've been using this for awhile, so it seemed smart to share as it's pretty simple and speeds up prep work by alot.  I've used this for custom creatures by saying, "Give me a ROBOT NINJA" and I've used it for converting stat blocks from Lamenting Lighthouse.
    <li> Added Discord logging directly to Clash. You no longer need to do this through Rumble! (In case you don't want to use Rumble!) Find it in Settings.
    </br>
    </br>
    Minor bug fixes.
    <li> Fixed the double-render of the list on the player-end. No more duplicate entries.
    <li> Fixed the turn-marker just not showing. Oops.
    <li> Fixed the HP Bar/Numbers staying after a token was deleted. This was dependent on who-deleted it before.. so just added better garbage collection.
    <li> Fixed the turn indication on the list not showing if the list only had one unit.
    </br>
    </br>
    <h1>Clash! 1/16</h1>
    Minor bug fixes.
    </br> - Group adding tokens to initiative wasn't filtering out non character/mounts properly.
    </br>
    </br>
    <h1>Clash! 1/14</h1>
    Minor bug fixes.
    </br> - The current unit wasn't being reset when changing scenes, resulting in your camera going off to look for it when swapping scenes. This was fixed.
    </br> - Also the initiative list turn tracker wasn't displaying correctly if you loaded into a scene with only one unit. Also fixed.
    </br>
    </br>
    Okay now back to 'taking a break' and 'not updating things' like I said for this week.
    </br>
    </br>
    <h1>Clash! 1/13</h1>
    Minor bug fix.
    </br> - The stylings on the roll log were all wrong, causing it to look funky when there was a lot of information.
    </br>
    <h1>Clash! 1/8</h1>
    Minor change.
    </br> - Hidden units will now say "(Hidden)" in the Initiative List for the GM.
    </br>
    More bug fixes.
    </br> - When loading into a fresh room, some settings weren't initializing correctly. Turn/Round counter - which wouldn't increment until you refreshed. The Roller column, which you would need to toggle off/on. Label-Text, which.. would just throw an error. Oops.  This was all corrected.
  </div>
`;o.onReady(async()=>{const n=window.location.search,t=new URLSearchParams(n).get("subscriber")==="true";h.innerHTML=`
        <div id="footButtonContainer">
            <button id="discordButton" type="button" title="Join the Owlbear-Rodeo Discord"><embed class="svg discord" src="/w-discord.svg" /></button>
            <button id="patreonButton" type="button" ${t?'title="Thank you for subscribing!"':'title="Check out the Battle-System Patreon"'}>
            ${t?'<embed id="patreonLogo" class="svg thankyou" src="/thankyou.svg" />':'<embed id="patreonLogo" class="svg patreon" src="/w-patreon.png" />'}</button>
        </div>
        <button id="closeButton" type="button" title="Close this window"><embed class="svg close" src="/w-close.svg" /></button>
        `;const i=document.getElementById("closeButton");i.onclick=async()=>{await o.modal.close(a.EXTENSIONWHATSNEW)};const s=document.getElementById("discordButton");s.onclick=async e=>{e.preventDefault(),window.open("https://discord.gg/ANZKDmWzr6","_blank")};const r=document.getElementById("patreonButton");r.onclick=async e=>{e.preventDefault(),window.open("https://www.patreon.com/battlesystem","_blank")}});
