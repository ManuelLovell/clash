import{O as o,C as i}from"./clashConstants-35a65084.js";const l=document.querySelector("#bs-whatsnew"),c=document.querySelector("#bs-whatsnew-notes");l.innerHTML=`
  <div id="newsContainer">
    <h1>Clash! 6/17</h1>
    Changes ahoy.
    Minor bug was fixed when closing the subcard and trying to re-open the same one (Required double clicking.)
    </br>
    Larger change, expanded the base size of the 'Pinned' Window to make it a bit more different than the regular subcard. (Which now doesn't close by default anyway.)
    </br> This was to make way for adding tabs, so you don't need to open/close/click-too-far to get to the next monster when doing your rolls.
    </br> The new size isn't HUGE, and likely won't be until I find a clever way to allow for resizing.
    </br> Enjoy.
    <h1>Clash! 4/29</h1>
    Minor fix; Stopped the turn label from scaling/spinning with it's parent token.
    </br>
    <h1>Clash! 4/29</h1>
    Minor fix; Apparently negative 'to-hit' rolls didn't work when you put '-5'.
    </br> Thank you Wisdom Hunter for the report. I never knew about it. 😬
    <h1>Clash! 4/28</h1>
    After .. months. And months. And months.
    </br>I finally updated the help documents.
    </br>The documents will be updated on the OBR store page after they do their next refresh.
    </br>But for now you can access it via a new help button on the bottom on the list.
    </br>Hope this helps!
    </br>
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
  </div>
`;o.onReady(async()=>{const n=window.location.search,t=new URLSearchParams(n).get("subscriber")==="true";c.innerHTML=`
        <div id="footButtonContainer">
            <button id="discordButton" type="button" title="Join the Owlbear-Rodeo Discord"><embed class="svg discord" src="/w-discord.svg" /></button>
            <button id="patreonButton" type="button" ${t?'title="Thank you for subscribing!"':'title="Check out the Battle-System Patreon"'}>
            ${t?'<embed id="patreonLogo" class="svg thankyou" src="/thankyou.svg" />':'<embed id="patreonLogo" class="svg patreon" src="/w-patreon.png" />'}</button>
        </div>
        <button id="closeButton" type="button" title="Close this window"><embed class="svg close" src="/w-close.svg" /></button>
        `;const s=document.getElementById("closeButton");s.onclick=async()=>{await o.modal.close(i.EXTENSIONWHATSNEW)};const r=document.getElementById("discordButton");r.onclick=async e=>{e.preventDefault(),window.open("https://discord.gg/ANZKDmWzr6","_blank")};const a=document.getElementById("patreonButton");a.onclick=async e=>{e.preventDefault(),window.open("https://www.patreon.com/battlesystem","_blank")}});
