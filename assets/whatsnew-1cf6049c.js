import{O as e,C as o}from"./clashConstants-55f5c5ac.js";const n=document.querySelector("#clash-whatsnew"),i=document.querySelector("#clash-whatsnew-notes");n.innerHTML=`
  <div id="newsContainer">
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
`;e.onReady(async()=>{i.innerHTML=`
    <a href="https://www.patreon.com/battlesystem" target="_blank">Patreon!</a>
    <a href="https://discord.gg/ANZKDmWzr6" target="_blank">Join the OBR Discord!</a>
    <div class="close"><img style="height:40px; width:40px;" src="/close-button.svg"</div>`;const t=document.querySelector(".close");t.onclick=async()=>{await e.modal.close(o.EXTENSIONWHATSNEW)}});
