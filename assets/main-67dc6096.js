import{O as p,C as m,b as X,a as _,d as C,U as B,G,I as q,S as U,H as P,W}from"./utilities-e103c5f6.js";class M{static async CenterViewportOnImage(e){const i=await p.scene.grid.getDpi(),r=await p.viewport.getScale(),a=await p.viewport.getWidth(),o=await p.viewport.getHeight(),s={x:a/2,y:o/2},t={x:s.x/r,y:s.y/r},n=await this.GetImageCenter(e,i),l={x:n.x-t.x,y:n.y-t.y},c={x:l.x*r*-1,y:l.y*r*-1};await p.viewport.animateTo({position:c,scale:r})}static async GetImageCenter(e,i){const r=i/e.dpi,a=e.width*r,o=e.height*r,s=e.offsetx/e.width*a,t=e.offsety/e.height*o;return{x:e.xpos-s+a/2,y:e.ypos-t+o/2}}}class L{static async UpdateLabel(e,i){const r=await p.scene.items.getItems([m.LABEL]),a=i||"« Go! »";let o=!1;if(r.length==0||r[0].id!=m.LABEL){const n=X().fillColor("#ffffff").plainText(a).build();n.visible=!1,n.type="LABEL",n.id=m.LABEL,n.style={backgroundColor:"#bb99ff",backgroundOpacity:.5,pointerDirection:"DOWN",pointerWidth:15,pointerHeight:15,cornerRadius:10};const l=document.getElementById("initiative-list");if(l.rows?.length>1){for(var s=0,t;t=l.rows[s];s++)t.className=="turnOutline"&&(n.position={x:e.xpos,y:e.ypos-100},n.visible=!!e.visible,n.text.plainText=n.visible?a:a+`\r
(Hidden)`,n.attachedTo=e.id,n.locked=!0,o=!0);o||(n.visible=!1)}await p.scene.items.addItems([n])}else await p.scene.items.updateItems(n=>n.id==m.LABEL,n=>{for(let h of n){const v=document.getElementById("initiative-list");if(v.rows?.length>1){for(var l=0,c;c=v.rows[l];l++)c.className=="turnOutline"&&(h.position={x:e.xpos,y:e.ypos-100},h.visible=!!e.visible,h.text.plainText=h.visible?a:a+`\r
(Hidden)`,h.attachedTo=e.id,h.locked=!0,o=!0);o||(h.visible=!1)}}})}static UpdateHPBar(e,i,r){const a=e.id+"_hpbar",o=L.getHealthPercentageString(i,r),s=L.getHealthColorString(i,r),t=_().plainText(o).fontWeight(800).fillOpacity(.75).fillColor(s).strokeWidth(1).strokeColor("black").strokeOpacity(1).build();return t.id=a,t.type="TEXT",t.attachedTo=e.id,t.visible=!!e.visible,t.locked=!0,t.position={x:e.position.x-85,y:e.position.y+25},t.disableAttachmentBehavior=["ROTATION","SCALE"],t.text.style.fontFamily="Segoe UI",t.text.style.fontSize=24,t.text.type="PLAIN",t.text.style.textAlign="CENTER",t}static getHealthPercentageString(e,i){const r=e/i*100;switch(!0){case r==0:return"▱▱▱▱▱ 0%";case r<=20:return"▰▱▱▱▱ 20%";case r<=40:return"▰▰▱▱▱ 40%";case r<=60:return"▰▰▰▱▱ 60%";case r<=80:return"▰▰▰▰▱ 80%";default:return"▰▰▰▰▰ 100%"}}static getHealthColorString(e,i){const r=e/i*100;switch(!0){case r<=25:return"red";case r<=50:return"yellow";default:return"white"}}static async GetCTUFromRow(e){let i={id:"",visible:!1,xpos:0,ypos:0,dpi:0,width:0,height:0,offsetx:0,offsety:0};const r=e.getAttribute("unit-id"),a=await p.scene.items.getItems([r]);for(let o of a){const s=o;i={id:s.id,visible:s.visible,xpos:s.position.x,ypos:s.position.y,dpi:s.grid.dpi,width:s.image.width,height:s.image.height,offsetx:s.grid.offset.x,offsety:s.grid.offset.y}}return i}}async function z(d,e){var i=e;const r='<hr style="height:5px; margin-top: 4px; margin-bottom: 4px; visibility:hidden;" />';d.querySelector("#clash-main-body-settings").innerHTML=`
        <div id="settingsContainer">
        <h2 style="margin-top: 10px;">Settings</h2>
        <div><span id="exportAllContainer"></span>Export Collection Data </div>
        <i><small>This will save Collection data to a Text/JSON file</small></i>
        </br>
        ${r}
        <div><span id="importSubmitContainer"></span>Import Collection Data </div>
        <div><span id="importAllContainer"></span></div>
        <i><small>This will overwrite keys with the same Name/Author</small></i>
        </br>
        ${r}
        <div><span id="clearAllContainer"></span>Clear All Data </div>
        <i><small>This will delete the database.</small></i>
        </br>
        ${r}
        <div>${I("hideHp")}</span>&emsp;Hide HP Indication from Players </div>
        ${r}
        <div>${I("hideAll")}</span>&emsp;Hide All from Players </div>
        ${r}
        <div>${I("reverseList")}</span>&emsp;Reverse Initiative </div>
        ${r}
        <div>${I("noFocus")}</span>&emsp;Disable Camera Focus </div>
        ${r}
        <div>${I("noLabel")}</span>&emsp;Disable Turn Label </div>
        <div id="turnLabelTextContainer">&emsp;&emsp;&emsp;&emsp;</div>
        ${r}
        <div>${I("logToGM")}</span>&emsp;[Rumble!] Send Log to GM Only </div>
        <footer><span class="returnFloatLeft" id="settingsReturnContainer"></span></footer>
        </div>
       `,u(d,"hideHp",e.gmHideHp,e),u(d,"hideAll",e.gmHideAll,e),u(d,"reverseList",e.gmReverseList,e),u(d,"noFocus",e.gmDisableFocus,e),u(d,"noLabel",e.gmDisableLabel,e),u(d,"logToGM",e.gmRumbleLog,e);const a=d.getElementById("turnLabelTextContainer"),o=d.createElement("input");o.type="text",o.id="textLabelButton",o.title="Change your Turn Label's text",o.placeholder="« Go! »",o.maxLength=40,o.value=e.gmTurnText?e.gmTurnText:"",o.size=30,o.className="textInput",a?.appendChild(o);const s=d.getElementById("importAllContainer"),t=d.createElement("input");t.type="file",t.id="importButton",t.title="Choose a file to import",t.className="tinyType";const n=d.createElement("input");n.type="checkbox",n.id="favBox",n.title="Unfavorite during Upload";const l=d.getElementById("importSubmitContainer"),c=d.createElement("input");c.type="button",c.id="importSubmitButton",c.value="IMPORT DATA",c.title="Import Clash Collection Data",c.className="tinyType",c.onclick=async function(){if(t.files&&t.files.length>0){let T=t.files[0],w=new FileReader;w.readAsText(T),w.onload=async function(){try{const E=JSON.parse(w.result);await x(E),p.notification.show("Import Complete!","SUCCESS")}catch(E){alert(`The import failed - ${E}`)}},w.onerror=function(){console.log(w.error)}}},s?.appendChild(n),s?.appendChild(d.createTextNode("Un-Favorite  ˣ  ")),s?.appendChild(t),l?.appendChild(c);const h=d.getElementById("exportAllContainer"),v=d.createElement("input");v.type="button",v.id="exportButton",v.value="EXPORT DATA",v.title="Export Clash Collection Data",v.className="tinyType",v.onclick=async function(){await y()},h?.appendChild(v);const b=d.getElementById("clearAllContainer"),g=d.createElement("input");g.type="button",g.id="resetButton",g.value="DELETE DATA",g.title="Clear all Clash! Data",g.className="tinyType",g.onclick=async function(){if(confirm("Delete EVERYTHING? (Deletes Database and Refreshes Window)")){i.turnCounter=1,i.roundCounter=1;const T=d.getElementById("roundCount");T.innerText=`Round: ${i.roundCounter}`,await p.scene.items.deleteItems([m.LABEL]),await p.scene.items.updateItems(w=>w.metadata[`${m.EXTENSIONID}/metadata_initiative`]!=null||w.id===m.LABEL,w=>{for(let E of w)delete E.metadata[`${m.EXTENSIONID}/metadata_initiative`]}),await C.delete(),window.location.reload()}},b?.appendChild(g);const f=d.getElementById("settingsReturnContainer"),S=d.createElement("input");S.type="button",S.id="returnButton",S.className="turnColor chalkBorder turnIndicator",S.title="Save and return to Initiative List",S.value="Return",S.onclick=async function(){e.gmTurnText=o.value,await C.Settings.update(m.SETTINGSID,{gmHideHp:e.gmHideHp,gmHideAll:e.gmHideAll,gmDisableLabel:e.gmDisableLabel,gmReverseList:e.gmReverseList,gmTurnText:e.gmTurnText,gmRumbleLog:e.gmRumbleLog,disableFocus:e.gmDisableFocus}),e.gmDisableLabel&&p.scene.items.deleteItems([m.LABEL]),i.ShowSettingsMenu(!1),i.ShowMainMenu(!0)},f?.append(S);function I(T){return`<label class="switch" id="setting${T}Container">
            <span class="slider round"></span>
            </label>`}function u(T,w,E,N){const H=T.getElementById(`setting${w}Container`),A=T.createElement("input");A.type="checkbox",A.value=String(E),A.checked=E,A.onclick=async function(k){const R=k.target;switch(A.value=String(R.checked),w){case"hideHp":N.gmHideHp=R.checked;break;case"hideAll":N.gmHideAll=R.checked;break;case"noFocus":N.gmDisableFocus=R.checked;break;case"noLabel":N.gmDisableLabel=R.checked;break;case"reverseList":N.gmReverseList=R.checked;break;case"logToGM":N.gmRumbleLog=R.checked;break}},H?.insertBefore(A,H.firstChild)}async function y(){const T=await C.Creatures.toArray();var w=d.createElement("a"),E=new Blob([JSON.stringify(T)],{type:"text/plain"});w.href=URL.createObjectURL(E),w.download=`ClashCollectionExport-${Date.now()}`,d.body.appendChild(w),w.click(),d.body.removeChild(w)}async function x(T){const w=await C.Creatures.toArray();let E=[];T.forEach(N=>{let H=new B("","Default");H.SetToModel(N,!n.checked),H.tokenId="";const A=w.find(k=>k.unitName==N.unitName&&k.dataSlug==N.dataSlug);A?H.id=A.id:H.id=G(),E.push(H)}),await C.Creatures.bulkPut(E)}}function V(d,e){var i=e;const r=d.getElementById("saveButtonContainer"),a=d.createElement("input");a.type="image",a.className="Icon clickable",a.id="saveButton",a.onclick=async function(){await i.Save()},a.src="/save.svg",a.title="Save Changes",a.height=20,a.width=20,r.appendChild(a)}function K(d){const e=d.getElementById("rollAllContainer"),i=d.createElement("input");i.type="image",i.className="Icon RollerButton clickable",i.id="rollAllButton",i.onclick=async function(){p.notification.show("Rolled Initiative for all Monsters."),d.querySelectorAll(".isMonster").forEach(a=>{const s=a.id.substring(2),t=d.querySelector(`#iI${s}`),n=parseFloat(t.getAttribute("unit-dexbonus"));t.value=(n+Math.floor(Math.random()*(20-1)+1)).toString()})},i.src="/dice.svg",i.title="Roll Initiative for all Monsters",i.height=20,i.width=20,e.appendChild(i)}function J(d,e){var i=e;const r=d.getElementById("prevContainer"),a=d.getElementById("nextContainer"),o=d.createElement("input");o.type="button",o.id="previousButton",o.value="Previous",o.className="turnColor chalkBorder turnIndicator",o.title="Previous Turn",o.onclick=async function(){const t=d.getElementById("initiative-list");if(t.rows?.length>1){i.turnCounter--;for(var n=0,l;l=t.rows[n];n++)l.className=="turnOutline"&&l.parentElement?.firstElementChild===l&&(i.roundCounter--,i.roundCounter<1&&(i.roundCounter=1),i.turnCounter=l.parentElement.childElementCount);await i.FocusOnCurrentTurnUnit(t),await i.Save()}};const s=d.createElement("input");s.type="button",s.id="nextButton",s.value="Next",s.className="turnColor chalkBorder turnIndicator",s.title="Next Turn",s.onclick=async function(){const t=d.getElementById("initiative-list");if(t.rows?.length>1){i.turnCounter++;for(var n=0,l;l=t.rows[n];n++)l.className=="turnOutline"&&l.parentElement?.lastElementChild===l&&(i.roundCounter++,i.turnCounter=1);await i.FocusOnCurrentTurnUnit(t),await i.Save()}},r?.appendChild(o),a?.appendChild(s)}function Y(d,e){var i=e;const r=d.getElementById("resetContainer"),a=d.createElement("input");a.type="button",a.id="resetTurnButton",a.value="Reset Round",a.title="Reset Round",a.className="tinyType",a.onclick=async function(){i.turnCounter=1,i.roundCounter=1;const t=d.getElementById("roundCount");t.innerText=`Round: ${i.roundCounter}`,await C.Tracker.clear(),await C.Tracker.add({id:m.TURNTRACKER,currentRound:1,currentTurn:1}),await p.scene.items.deleteItems([m.LABEL]),await e.ShowTurnSelection(),await e.Save()},r.appendChild(a);const o=d.createElement("input");o.type="button",o.id="clearButton",o.value="CLEAR LIST",o.title="Clear List",o.className="tinyType",o.onclick=async function(){if(confirm("Clear the Initiative List (This will leave unit info)?")){i.turnCounter=1,i.roundCounter=1;const t=d.getElementById("roundCount");t.innerText=`Round: ${i.roundCounter}`,await C.Tracker.clear(),await C.Tracker.add({id:m.TURNTRACKER,currentRound:1,currentTurn:1}),await C.ActiveEncounter.where("isActive").equals(1).modify({isActive:0}),await p.scene.items.deleteItems([m.LABEL]),await p.scene.items.updateItems(n=>n.metadata[`${m.EXTENSIONID}/metadata_initiative`]!=null||n.id===m.LABEL,n=>{for(let l of n)delete l.metadata[`${m.EXTENSIONID}/metadata_initiative`]}),await e.Save()}},r.appendChild(o);const s=d.createElement("input");s.type="button",s.id="settingsButton",s.value="Settings",s.title="View Settings",s.className="tinyType",s.onclick=async function(){i.ShowMainMenu(!1),i.ShowSettingsMenu(!0),z(d,e)},r.appendChild(s)}class j{inSceneUnits=[];roundCounter=1;turnCounter=1;activeUnits=[];party=[];gmHideHp=!1;gmHideAll=!1;gmDisableLabel=!1;gmDisableFocus=!1;gmReverseList=!1;gmRumbleLog=!1;gmTurnText="";async RenderInitiativeList(e){this.setupContextMenu(this),this.ShowSettingsMenu(!1),this.ShowMainMenu(!0);const i=e.querySelector("#clash-main-body-app");if(i.innerHTML=`
        <div id="contextMenu" class="context-menu" style="display: none">
            <ul id="playerListing"></ul>
        </div>
        <table id="initiative-list">
        <thead>
            <tr>
            <th style="width: 8%"><img class="Icon" title="Initiative" src="/queue.svg"></th>
            <th style="width: 8%"><div id="rollAllContainer"></div></th>
            <th style="width: 42%">Name</th>
            <th style="width: 24%"><img class="Icon" title="Hit Points" src="/heart.svg"></th>
            <th style="width: 8%"><img class="Icon" title="Armor Class" src="/shield.svg"></th>
            <th style="width: 10%"><span id="saveButtonContainer"></span></th>
            </tr>
        </thead>
        <tbody id="unit-list"></tbody>
        </table>
        <footer>
        <div id="roundCounter" class="bottom"><span id="prevContainer"></span><span id="roundCount" class="centerish">Round: ${this.roundCounter}</span><span id="nextContainer"></span></div>
        <div id="bombContainer" class="bombBottom"><span id="resetContainer" class=""></span></div>
        </footer>
        `,C.inMemory){const n=e.createElement("div");n.innerText="Local Storage Disabled - Features Limited",n.className="noDatabase",i.prepend(n)}V(e,this),J(e,this),Y(e,this),K(e);const r=await C.Settings.get(m.SETTINGSID);r?(this.gmHideHp=r.gmHideHp,this.gmHideAll=r.gmHideAll,this.gmDisableLabel=r.gmDisableLabel,this.gmDisableFocus=r.disableFocus,this.gmReverseList=r.gmReverseList,this.gmRumbleLog=r.gmRumbleLog,this.gmTurnText=r.gmTurnText):await C.Settings.add({id:m.SETTINGSID,gmHideHp:!1,gmHideAll:!1,gmDisableLabel:!1,gmTurnText:"",gmReverseList:!1,gmRumbleLog:!1,disableFocus:!1});const a=await C.Tracker.get(m.TURNTRACKER);a?(this.turnCounter=a.currentTurn,this.roundCounter=a.currentRound):await C.Tracker.add({id:m.TURNTRACKER,currentRound:1,currentTurn:1});const o=e.getElementById("playerListing");this.party=await p.party.getPlayers(),o.appendChild(D()),this.party.forEach(n=>{const l=e.createElement("li");l.id=n.id,l.textContent=n.name,l.style.color=n.color,o.appendChild(l)}),p.party.onChange(n=>{o.innerHTML="",o.appendChild(D()),this.party=n,n.forEach(async l=>{const c=e.createElement("li");c.id=l.id,c.textContent=l.name,c.style.color=l.color,o.appendChild(c);const h=l.metadata;if(h[`${m.EXTENSIONID}/metadata_playerItem`]!=null){const b=h[`${m.EXTENSIONID}/metadata_playerItem`].PlayerUpdate;q(b.stamp)||(b.initiative?await C.ActiveEncounter.update(b.id,{initiative:b.initiative}):b.cHp?await C.ActiveEncounter.update(b.id,{currentHP:b.cHp}):b.mHp?await C.ActiveEncounter.update(b.id,{maxHP:b.mHp}):b.aC&&await C.ActiveEncounter.update(b.id,{armorClass:b.aC}),await this.UpdateTrackerForPlayers())}})}),p.scene.onReadyChange(async n=>{n&&await this.CheckIniativeList()});const s=await p.theme.getTheme();U(s,e),p.theme.onChange(n=>{U(n,e)}),p.scene.items.onChange(async n=>{n.forEach(async c=>{if(c.layer!=="CHARACTER")return;const h=c,v=h.text?.plainText||h.name,b=this.activeUnits.find(g=>g.id===h.id);if(b&&b.unitName!==v&&await C.ActiveEncounter.update(b.id,{unitName:v}),c.metadata[`${m.EXTENSIONID}/metadata_initiative`]!==void 0&&b?.isActive==0&&await C.ActiveEncounter.update(b.id,{isActive:1}),c.metadata[`${m.EXTENSIONID}/metadata_initiative`]!==void 0&&!b){const g=this.activeUnits.find(f=>f.unitName===v);if(m.ALPHANUMERICTEXTMATCH.test(v)){const f=v.slice(0,-2),S=await C.ActiveEncounter.where("unitName").startsWith(f).first();if(S){S.id=c.id;let I=new B(c.id,v,c.createdUserId);I.SetToModel(S),I.unitName=v,I.tokenId=c.id,I.isActive=1,await I.SaveToDB(),this.inSceneUnits.push(c.id)}}else if(g){g.id=c.id;let f=new B(c.id,v,c.createdUserId);f.SetToModel(g),f.unitName=v,f.tokenId=c.id,f.isActive=1,await f.SaveToDB(),this.inSceneUnits.push(c.id)}else await p.scene.items.updateItems(f=>f.id===c.id,f=>{for(let S of f)delete S.metadata[`${m.EXTENSIONID}/metadata_initiative`],delete S.metadata[`${m.EXTENSIONID}/metadata_hpbar`]})}}),this.activeUnits.filter(({id:c})=>!n.some(({id:h})=>h===c)).forEach(async c=>{await C.ActiveEncounter.update(c.id,{isActive:0})})}),await W(async()=>await C.ActiveEncounter.toArray()).subscribe({next:async n=>{this.RefreshList(n)},error:n=>console.log("Error refreshing list: "+n)}),await this.CheckIniativeList()}async CheckIniativeList(){const e=await p.scene.items.getItems(r=>r.layer==="CHARACTER"&&r.metadata[`${m.EXTENSIONID}/metadata_initiative`]!==void 0);let i=[];e.length>0&&(this.inSceneUnits=e.map(a=>a.id),i=await(await C.ActiveEncounter.toCollection()).toArray(),this.activeUnits=i.filter(a=>this.inSceneUnits.includes(a.id)),this.activeUnits.forEach(async a=>{await C.ActiveEncounter.update(a.id,{isActive:1})})),await this.RefreshList(i)}RefreshList(e){const i=document.querySelector("#unit-list"),r=this,a=e.filter(s=>s.isActive==1);this.activeUnits=a.filter(s=>this.inSceneUnits.includes(s.id));const o=this.gmReverseList?this.activeUnits.sort((s,t)=>s.initiative-t.initiative||s.unitName.localeCompare(t.unitName)):this.activeUnits.sort((s,t)=>t.initiative-s.initiative||s.unitName.localeCompare(t.unitName));for(;i?.rows.length>0;)i.deleteRow(0);for(const s of o){let t;if(s.ownerId){const w=this.party.find(E=>E.id===s.ownerId)?.color;w&&(t=P(w,.4))}let n=i.insertRow(-1),l=n.insertCell(0),c=n.insertCell(1),h=n.insertCell(2),v=n.insertCell(3),b=n.insertCell(4),g=n.insertCell(5);n.setAttribute("unit-id",s.id);const f=document.createElement("input");f.className="InitiativeInput",f.inputMode="numeric",f.setAttribute("unit-dexbonus",Math.floor((s.dexScore-10)/2).toString()),f.value=s.initiative.toString(),f.id=`iI${s.id}`,f.size=2,f.min="0",f.max="99",f.maxLength=2;const S=document.createElement("input");S.type="image",S.title="Roll this Unit's Iniative",S.id=`rB${s.id}`,S.className="clickable",S.onclick=async function(){const w=parseFloat(f.getAttribute("unit-dexbonus"));f.value=(w+Math.floor(Math.random()*(20-1)+1)).toString()},S.src="/dice.svg",S.height=20,S.width=20;const I=document.createElement("input");I.type="button",I.value=s.isMonster?`ʳ ${s.unitName} ʴ`:s.unitName,I.title="Change between Player and Monster groups",I.id=`nT${s.id}`,I.style.width="100%",I.style.textOverflow="ellipsis",I.style.overflow="hidden",t&&(I.style.background=`linear-gradient(200deg, transparent, ${t})`),I.className=s.isMonster?"isMonster nameToggleInput":"nameToggleInput",I.onclick=async function(){I.className=="isMonster nameToggleInput"?(I.value=s.unitName,I.className="nameToggleInput"):(I.value=`ʳ ${s.unitName} ʴ`,I.className="isMonster nameToggleInput")},I.oncontextmenu=async function(w){w.preventDefault();const E=document.getElementById("contextMenu");E.addEventListener("click",async H=>{H.stopPropagation();const A=H.target,k=E.getAttribute("currentUnit");await C.ActiveEncounter.update(k,{ownerId:A.id})}),E.setAttribute("currentUnit",s.id);const N=()=>{E.style.display="none",document.removeEventListener("click",N)};document.addEventListener("click",N),E.style.display=="block"?Q():(E.style.display="block",E.style.left=w.pageX+"px",E.style.top=w.pageY+"px")};const u=document.createElement("input");u.className="HealthInput",u.inputMode="numeric",u.id=`cHP${s.id}`,u.title=s.currentHP.toString(),u.value=s.currentHP.toString(),u.size=4,u.maxLength=4,u.onblur=function(w){const N=w.currentTarget.value;if(N.substring(0,1)=="+"){const H=N.substring(N.indexOf("+")+1);u.value=(+H+ +u.title).toString(),u.title=u.value,w.preventDefault()}else if(N.substring(0,1)=="-"){const H=N.substring(N.indexOf("-")+1);u.value=(+u.title-+H).toString(),u.title=u.value,w.preventDefault()}r.Save()},u.onkeydown=function(w){if(w.key!=="Enter")return;const N=w.currentTarget.value;if(N.substring(0,1)=="+"){const H=N.substring(N.indexOf("+")+1);u.value=(+H+ +u.title).toString(),u.title=u.value,w.preventDefault()}else if(N.substring(0,1)=="-"){const H=N.substring(N.indexOf("-")+1);u.value=(+u.title-+H).toString(),u.title=u.value,w.preventDefault()}r.Save()};const y=document.createElement("input");y.className="HealthInput",y.inputMode="numeric",y.id=`mHP${s.id}`,y.value=s.maxHP.toString(),y.size=4,y.maxLength=4;const x=document.createElement("input");x.className="ArmorInput",x.inputMode="numeric",x.id=`aC${s.id}`,x.value=s.armorClass.toString(),x.size=2,x.maxLength=2;const T=document.createElement("input");T.type="image",T.title="View/Edit this Unit's Stats",T.id=`tB${s.id}`,T.className="clickable",T.onclick=async function(w){const E=w.currentTarget;await r.OpenSubMenu(E.id.substring(2))},T.src="/triangle.svg",T.height=20,T.width=20,T.style.marginLeft="5px",l.appendChild(f),l.style.width="8%",c.appendChild(S),c.style.width="8%",h.appendChild(I),h.style.width="42%",v.appendChild(u),v.appendChild(document.createTextNode("/")),v.appendChild(y),v.style.width="24%",b.appendChild(x),b.style.width="8%",C.inMemory||(g.appendChild(T),g.style.width="10%")}this.AttachFocusListeners(),this.ShowTurnSelection()}AttachFocusListeners(){const e=document.getElementById("initiative-list");e&&e.addEventListener("dblclick",i);async function i(r){r.preventDefault();const a=r.target.closest("tr"),o=await L.GetCTUFromRow(a);await M.CenterViewportOnImage(o)}}ShowTurnSelection(){const e=document.getElementById("initiative-list");if(e.rows?.length>1){for(var i=0,r;r=e.rows[i];i++)r.classList.remove("turnOutline");if(this.turnCounter>=e.rows.length&&(this.turnCounter=e.rows.length-1),e.rows[this.turnCounter]){const a=e.rows[this.turnCounter];a.className="turnOutline";const o=document.getElementById("roundCount");o.innerText=`Round: ${this.roundCounter}`}}}async Save(){document.querySelectorAll(".InitiativeInput").forEach(async i=>{const r=i,a=r.id.substring(2),o=r.value,s=document.querySelector(`#cHP${a}`),t=s.value?s.value:"0",n=document.querySelector(`#mHP${a}`),l=n.value?n.value:"1",c=document.querySelector(`#aC${a}`),h=c.value?c.value:"10",b=document.querySelector(`#nT${a}`).className=="isMonster nameToggleInput";if(!a||!o)return;let g=this.activeUnits?.find(f=>f.id==a);g&&await C.ActiveEncounter.update(g.id,{initiative:parseFloat(o),currentHP:parseFloat(t),maxHP:parseFloat(l),armorClass:parseFloat(h),isMonster:b})}),await C.Tracker.update(m.TURNTRACKER,{id:m.TURNTRACKER,currentTurn:this.turnCounter,currentRound:this.roundCounter}),await this.CheckIniativeList(),await this.UpdateTrackerForPlayers()}async UpdateTrackerForPlayers(){const e=[],i=new Date().toISOString(),r=[];(await p.scene.items.getItems(t=>t.id.endsWith("_hpbar"))).forEach(t=>{const n=t,l=this.activeUnits.find(c=>c.id===n.id.replace("_hpbar",""));l&&(n.text.plainText=L.getHealthPercentageString(l.currentHP,l.maxHP),n.text.style.fillColor=L.getHealthColorString(l.currentHP,l.maxHP),r.push(n))}),await p.scene.items.addItems(r);for(const t of this.activeUnits)e.push({id:t.id,name:t.unitName,initiative:t.initiative,cHp:t.currentHP,mHp:t.maxHP,aC:t.armorClass,owner:t.ownerId});const o={turn:this.turnCounter,round:this.roundCounter,units:e,gmHideHp:this.gmHideHp,gmHideAll:this.gmHideAll,gmReverseList:this.gmReverseList,lastUpdate:i},s={};s[`${m.EXTENSIONID}/metadata_trackeritem`]={Tracker:o},await p.scene.setMetadata(s)}async FocusOnCurrentTurnUnit(e){const i=e.rows[this.turnCounter],r=await L.GetCTUFromRow(i);this.gmDisableFocus||await M.CenterViewportOnImage(r),this.gmDisableLabel||await L.UpdateLabel(r,this.gmTurnText)}ShowSettingsMenu(e){const i=document.querySelector("#clash-main-body-settings");i.hidden=!e}ShowMainMenu(e){const i=document.querySelector("#clash-main-body-app");i.hidden=!e}async OpenSubMenu(e){const r=window.innerWidth<m.MOBILEWIDTH,a=window.outerHeight-150,o=a>800?700:a-100;r?await p.popover.open({id:m.EXTENSIONSUBMENUID,url:`/submenu/subindex.html?unitid=${e}`,height:o,width:325,hidePaper:!0}):await p.modal.open({id:m.EXTENSIONSUBMENUID,url:`/submenu/subindex.html?unitid=${e}`,height:o,width:350})}setupContextMenu(e){C.inMemory||p.contextMenu.create({id:`${m.EXTENSIONID}/context-menu-sheet`,icons:[{icon:"/sheet.svg",label:"[Clash!] View Info",filter:{max:1,every:[{key:"layer",value:"CHARACTER"}]}},{icon:"/multi-sheet.svg",label:"[Clash!] View Info",filter:{min:2,every:[{key:"layer",value:"CHARACTER"}]}}],async onClick(i,r){if(i.items.length==1){const a=i.items[0],o=a.text?.plainText||a.name;if(!await C.ActiveEncounter.get(a.id)){let c=new B(a.id,o);if(m.ALPHANUMERICTEXTMATCH.test(o)){const h=o.slice(0,-2),v=await C.Creatures.get({unitName:h});v&&c.SetToModel(v)}else{const h=await C.Creatures.get({unitName:o});h&&c.SetToModel(h)}await c.SaveToDB()}const t=100,n=window.outerHeight-150,l=n>800?700:n-t;await p.popover.open({id:m.EXTENSIONSUBMENUID,url:`/submenu/subindex.html?unitid=${a.id}`,height:l,width:325,anchorElementId:r,hidePaper:!0})}else{i.items.forEach(async l=>{const c=l,h=c.text?.plainText||c.name;if(!await C.ActiveEncounter.get(l.id)){let b=new B(l.id,h);if(m.ALPHANUMERICTEXTMATCH.test(h)){const g=h.slice(0,-2),f=await C.Creatures.get({unitName:g});f&&b.SetToModel(f)}else{const g=await C.Creatures.get({unitName:h});g&&b.SetToModel(g)}await b.SaveToDB()}});const a=i.items.map(l=>l.id).toString(),o=i.items.map(l=>l.metadata[`${m.EXTENSIONID}/metadata_initiative`]!==void 0).toString(),s=100,t=window.outerHeight-150,n=t>800?700:t-s;await p.popover.open({id:m.EXTENSIONSUBMENUID,url:`/submenu/subindex.html?unitid=${a}&unitactive=${o}&multi=true`,height:n,width:325,anchorElementId:r,hidePaper:!0})}}}),p.contextMenu.create({id:`${m.EXTENSIONID}/context-hp-menu`,icons:[{icon:"/health.svg",label:"[Clash!] Show HP Bar",filter:{every:[{key:"layer",value:"CHARACTER"},{key:["metadata",`${m.EXTENSIONID}/metadata_hpbar`],value:void 0},{key:["metadata",`${m.EXTENSIONID}/metadata_initiative`],value:void 0,operator:"!="}]}},{icon:"/health-black.svg",label:"[Clash!] Hide HP Bar",filter:{every:[{key:"layer",value:"CHARACTER"},{key:["metadata",`${m.EXTENSIONID}/metadata_hpbar`],value:void 0,operator:"!="}]}}],async onClick(i){if(i.items.every(a=>a.metadata[`${m.EXTENSIONID}/metadata_hpbar`]===void 0)){const o=[];await p.scene.items.updateItems(i.items,s=>{for(let t of s){const n=t,l=e.activeUnits.find(c=>c.id===t.id);l&&(t.metadata[`${m.EXTENSIONID}/metadata_hpbar`]={showHpBars:!0},o.push(L.UpdateHPBar(n,l.currentHP,l.maxHP)))}}),await p.scene.items.addItems(o)}else{const a=i.items.map(o=>o.id+"_hpbar");await p.scene.items.deleteItems(a),p.scene.items.updateItems(i.items,o=>{for(let s of o)delete s.metadata[`${m.EXTENSIONID}/metadata_hpbar`]})}}}),p.contextMenu.create({id:`${m.EXTENSIONID}/context-menu`,icons:[{icon:"/addunit.svg",label:"[Clash!] Add to Initiative",filter:{every:[{key:"layer",value:"CHARACTER"},{key:["metadata",`${m.EXTENSIONID}/metadata_initiative`],value:void 0}]}},{icon:"/removeunit.svg",label:"[Clash!] Remove from Initiative",filter:{every:[{key:"layer",value:"CHARACTER"}]}}],async onClick(i){const a=i.items.every(t=>t.metadata[`${m.EXTENSIONID}/metadata_initiative`]===void 0),o=i.items;let s=[];if(a)p.scene.items.updateItems(o,t=>{for(let n of t)s.push({id:n.id,name:n.text?.plainText||n.name,ownerId:n.createdUserId}),n.metadata[`${m.EXTENSIONID}/metadata_initiative`]={initiative:!0}}),s.forEach(async t=>{if(await C.ActiveEncounter.get(t.id))await C.ActiveEncounter.update(t.id,{isActive:1});else{let l=new B(t.id,t.name,t.ownerId);if(m.ALPHANUMERICTEXTMATCH.test(t.name)){const c=t.name.slice(0,-2),h=await C.Creatures.get({unitName:c});h&&l.SetToModel(h)}else{const c=await C.Creatures.get({unitName:t.name});c&&l.SetToModel(c)}l.isActive=1,l.SaveToDB()}e.inSceneUnits.push(t.id)});else{const t=i.items.map(n=>n.id+"_hpbar");await p.scene.items.deleteItems(t),p.scene.items.updateItems(i.items,n=>{for(let l of n)s.push({id:l.id,name:l.name}),delete l.metadata[`${m.EXTENSIONID}/metadata_initiative`],delete l.metadata[`${m.EXTENSIONID}/metadata_hpbar`]}),s.forEach(async n=>{await C.ActiveEncounter.update(n.id,{isActive:0}),e.inSceneUnits=e.inSceneUnits.filter(l=>l!=n.id)})}}})}}function D(){const d=document.createElement("li");return d.id="",d.textContent="No Owner",d}function Q(){document.getElementById("contextMenu").style.display="none"}class Z{roundCounter=1;turnCounter=1;enableAutoFocus=!1;lastUpdate="";playerId="";playerColor="";party=[];async Render(e){e.querySelector("#clash-main-body-app").innerHTML=`
            <table id="initiative-list">
            <thead>
                <tr>
                <th style="width: 10%"><img class="Icon" title="Initiative" src="/queue.svg"></th>
                <th style="width: 58%">Name</th>
                <th style="width: 24%"><img class="Icon" title="Hit Points" src="/heart.svg"></th>
                <th style="width: 8%"><img class="Icon" title="Armor Class" src="/shield.svg"></th>
                </tr>
            </thead>
            <tbody id="unit-list"></tbody>
            </table>
            <footer>
            <div id="roundCounter" class="playerBottom">
            <label class="switch" id="settingnoFocusContainer">
            <span class="slider round"></span>
            </label> AutoFocus
            <span id="roundCount" class="playerCenterish">Round: ${this.roundCounter}</span>
            </div>
            </footer>
            `;var i=this;const r=e.getElementById("settingnoFocusContainer"),a=e.createElement("input");a.type="checkbox",a.value=String(this.enableAutoFocus),a.checked=this.enableAutoFocus,a.onclick=async function(t){const n=t.target;a.value=String(n.checked),i.enableAutoFocus=n.checked},r?.insertBefore(a,r.firstChild),this.playerId=await p.player.getId(),this.playerColor=await p.player.getColor(),this.party=await p.party.getPlayers();const o=await p.theme.getTheme();U(o,e),this.SetupListeners();const s=await p.scene.getMetadata();await this.RefreshList(s)}async RefreshList(e){const i=this,a=e[`${m.EXTENSIONID}/metadata_trackeritem`]?.Tracker;if(!a||!a.units||a.lastUpdate==this.lastUpdate)return;this.lastUpdate=a.lastUpdate;const o=document.querySelector("#unit-list");if(a.gmHideAll){o.innerHTML="";return}const s=a.gmReverseList?a.units.sort((t,n)=>t.initiative-n.initiative||t.name.localeCompare(n.name)):a.units.sort((t,n)=>n.initiative-t.initiative||t.name.localeCompare(n.name));for(this.roundCounter=a.round,this.turnCounter=a.turn;o.rows.length>0;)o.deleteRow(0);for(const t of s){let n=o.insertRow(-1);if(t.owner===this.playerId){const l=P(this.playerColor,.4);n.setAttribute("unit-id",t.id);let c=n.insertCell(0);c.style.placeContent="center";const h=document.createElement("input");h.className="InitiativeInput wide",h.inputMode="numeric",h.value=t.initiative.toString(),h.id=`iI${t.id}`,h.size=2,h.min="0",h.max="99",h.maxLength=2,h.onblur=function(u){const y=u.currentTarget;y.value&&i.SendUpdate({id:y.id.substring(2),initiative:+y.value})},h.onkeydown=function(u){if(u.key!=="Enter")return;const y=u.currentTarget;y.value&&i.SendUpdate({id:y.id.substring(2),initiative:+y.value})};let v=n.insertCell(1);v.style.placeContent="center",v.style.textOverflow="ellipsis",v.style.overflow="hidden",v.style.whiteSpace="nowrap",v.className="nameToggleInput",v.style.background=`linear-gradient(200deg, transparent, ${l})`;let b=n.insertCell(2);const g=document.createElement("input");g.className="HealthInput",g.inputMode="numeric",g.id=`cHP${t.id}`,g.title=t.cHp.toString(),g.value=t.cHp.toString(),g.size=4,g.maxLength=4,g.onblur=function(u){const y=u.currentTarget,x=y.value;if(x.substring(0,1)=="+"){const T=x.substring(x.indexOf("+")+1);g.value=(+T+ +g.title).toString(),g.title=g.value,u.preventDefault()}else if(x.substring(0,1)=="-"){const T=x.substring(x.indexOf("-")+1);g.value=(+g.title-+T).toString(),g.title=g.value,u.preventDefault()}y.value&&i.SendUpdate({id:y.id.substring(3),cHp:+y.value})},g.onkeydown=function(u){if(u.key!=="Enter")return;const y=u.currentTarget,x=y.value;if(x.substring(0,1)=="+"){const T=x.substring(x.indexOf("+")+1);g.value=(+T+ +g.title).toString(),g.title=g.value,u.preventDefault()}else if(x.substring(0,1)=="-"){const T=x.substring(x.indexOf("-")+1);g.value=(+g.title-+T).toString(),g.title=g.value,u.preventDefault()}y.value&&i.SendUpdate({id:y.id.substring(3),cHp:+y.value})};const f=document.createElement("input");f.className="HealthInput",f.inputMode="numeric",f.id=`mHP${t.id}`,f.value=t.mHp.toString(),f.size=4,f.maxLength=4,f.onblur=function(u){const y=u.currentTarget;y.value&&i.SendUpdate({id:y.id.substring(3),mHp:+y.value})},f.onkeydown=function(u){if(u.key!=="Enter")return;const y=u.currentTarget;y.value&&i.SendUpdate({id:y.id.substring(3),mHp:+y.value})};let S=n.insertCell(3);const I=document.createElement("input");I.className="ArmorInput",I.inputMode="numeric",I.id=`aC${t.id}`,I.value=t.aC.toString(),I.size=2,I.maxLength=2,I.onblur=function(u){const y=u.currentTarget;y.value&&i.SendUpdate({id:y.id.substring(2),aC:+y.value})},I.onkeydown=function(u){if(u.key!=="Enter")return;const y=u.currentTarget;y.value&&i.SendUpdate({id:y.id.substring(2),aC:+y.value})},a.gmHideHp||(t.cHp<=t.mHp/4?v.className=v.className+" unitHarmed":t.cHp<=t.mHp/2?v.className=v.className+" unitHurt":v.className=v.className+" unitHappy"),c.appendChild(h),c.style.width="10%",v.appendChild(document.createTextNode(t.name)),v.style.width="58%",b.appendChild(g),b.appendChild(document.createTextNode("/")),b.appendChild(f),S.appendChild(I),S.style.width="8%"}else{let l=n.insertCell(0);l.style.placeContent="center";let c=n.insertCell(1);c.style.placeContent="center",c.style.textOverflow="ellipsis",c.style.overflow="hidden",c.style.whiteSpace="nowrap",n.setAttribute("unit-id",t.id);const h=document.createElement("input");h.className="HealthInput",h.inputMode="numeric",h.id="cHP"+t.id,h.value=t.cHp.toString(),h.size=4,h.maxLength=4,a.gmHideHp||(t.cHp<=t.mHp/4?c.className="unitHarmed":t.cHp<=t.mHp/2?c.className="unitHurt":c.className="unitHappy"),l.appendChild(document.createTextNode(t.initiative.toString())),l.style.width="10%",c.appendChild(document.createTextNode(t.name)),c.style.width="58%"}}this.AttachFocusListeners(),await this.ShowTurnSelection()}AttachFocusListeners(){const e=document.getElementById("initiative-list");e&&e.addEventListener("dblclick",i);async function i(r){r.preventDefault();const a=r.target.closest("tr"),o=await L.GetCTUFromRow(a);await M.CenterViewportOnImage(o)}}async ShowTurnSelection(){const e=document.getElementById("initiative-list");if(e.rows?.length>1){for(var i=0,r;r=e.rows[i];i++)r.classList.remove("turnOutline");if(this.turnCounter>=e.rows.length&&(this.turnCounter=e.rows.length-1),e.rows[this.turnCounter]){const a=e.rows[this.turnCounter];a.className="turnOutline";const o=document.getElementById("roundCount");o.innerText=`Round: ${this.roundCounter}`;let s=await L.GetCTUFromRow(a);s.visible&&this.enableAutoFocus&&await M.CenterViewportOnImage(s)}}}async SetupListeners(){p.scene.onMetadataChange(e=>this.RefreshList(e)),p.theme.onChange(e=>{U(e,document)}),p.player.onChange(e=>{this.playerColor=e.color}),p.party.onChange(e=>{this.party=e})}async SendUpdate(e){e.stamp=new Date().toISOString();const i={};i[`${m.EXTENSIONID}/metadata_playerItem`]={PlayerUpdate:e},await p.player.setMetadata(i)}}const ee=new j,te=new Z;let O=!1;const F=document.querySelector("#clash-main-body-app"),ie=C;ie.Ready();F.innerHTML=`
  <div>
    <h1>Loading...</h1>
  </div>
`;p.onReady(async()=>{O=await p.scene.isReady(),$(O),p.scene.onReadyChange(async d=>{$(d)})});async function $(d){const e=await p.player.getRole();d?e==="GM"?await ee.RenderInitiativeList(document):await te.Render(document):F.innerHTML=`
            <div>
            <h1>Waiting for Scene...</h1>
            <div class="imageContainer">
            <img class="resize_fit_center" src="logo.png" alt="Clash!" class="center">
            </div>
            </div>`}
