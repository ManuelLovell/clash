import{O as t,C as o}from"./constants-d8998271.js";const s=document.querySelector("#clash-whatsnew"),a=document.querySelector("#clash-whatsnew-notes");s.innerHTML=`
  <div>
    <h1>Clash! 8/27</h1>
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
`;t.onReady(async()=>{a.innerHTML=`
    <a href="https://discord.gg/ANZKDmWzr6" target="_blank">Join the OBR Discord!</a>
    <div class="timer" style="--duration: 10;--size: 35;">
    <div class="mask"></div>
    </div>
    <div class="close">⤬</div>`;const e=document.querySelector(".close");e.onclick=async()=>{await t.modal.close(o.EXTENSIONWHATSNEW)},setTimeout(()=>{e.click()},1e4)});
