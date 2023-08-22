import{O as p,C as m,b as q,a as W,d as C,U as B,G as z,I as V,S as U,H as G,W as K}from"./utilities-e103c5f6.js";class M{static async CenterViewportOnImage(e){const i=await p.scene.grid.getDpi(),o=await p.viewport.getScale(),s=await p.viewport.getWidth(),r=await p.viewport.getHeight(),n={x:s/2,y:r/2},t={x:n.x/o,y:n.y/o},a=await this.GetImageCenter(e,i),c={x:a.x-t.x,y:a.y-t.y},l={x:c.x*o*-1,y:c.y*o*-1};await p.viewport.animateTo({position:l,scale:o})}static async GetImageCenter(e,i){const o=i/e.dpi,s=e.width*o,r=e.height*o,n=e.offsetx/e.width*s,t=e.offsety/e.height*r;return{x:e.xpos-n+s/2,y:e.ypos-t+r/2}}}class L{static async UpdateLabel(e,i){const o=await p.scene.items.getItems([m.LABEL]),s=i||"« Go! »";let r=!1;if(o.length==0||o[0].id!=m.LABEL){const a=q().fillColor("#ffffff").plainText(s).build();a.visible=!1,a.type="LABEL",a.id=m.LABEL,a.style={backgroundColor:"#bb99ff",backgroundOpacity:.5,pointerDirection:"DOWN",pointerWidth:15,pointerHeight:15,cornerRadius:10};const c=document.getElementById("initiative-list");if(c.rows?.length>1){for(var n=0,t;t=c.rows[n];n++)t.className=="turnOutline"&&(a.position={x:e.xpos,y:e.ypos-100},a.visible=!!e.visible,a.text.plainText=a.visible?s:s+`\r
(Hidden)`,a.attachedTo=e.id,a.locked=!0,r=!0);r||(a.visible=!1)}await p.scene.items.addItems([a])}else await p.scene.items.updateItems(a=>a.id==m.LABEL,a=>{for(let h of a){const v=document.getElementById("initiative-list");if(v.rows?.length>1){for(var c=0,l;l=v.rows[c];c++)l.className=="turnOutline"&&(h.position={x:e.xpos,y:e.ypos-100},h.visible=!!e.visible,h.text.plainText=h.visible?s:s+`\r
(Hidden)`,h.attachedTo=e.id,h.locked=!0,r=!0);r||(h.visible=!1)}}})}static UpdateHPBar(e,i,o){const s=e.id+"_hpbar",r=L.getHealthPercentageString(i,o),n=L.getHealthColorString(i,o),t=W().plainText(r).fontWeight(800).fillOpacity(.75).fillColor(n).strokeWidth(1).strokeColor("black").strokeOpacity(1).build();return t.id=s,t.type="TEXT",t.attachedTo=e.id,t.visible=!!e.visible,t.locked=!0,t.position={x:e.position.x-85,y:e.position.y+25},t.disableAttachmentBehavior=["ROTATION","SCALE"],t.text.style.fontFamily="Segoe UI",t.text.style.fontSize=24,t.text.type="PLAIN",t.text.style.textAlign="CENTER",t}static getHealthPercentageString(e,i){const o=e/i*100;switch(!0){case o==0:return"▱▱▱▱▱ 0%";case o<=20:return"▰▱▱▱▱ 20%";case o<=40:return"▰▰▱▱▱ 40%";case o<=60:return"▰▰▰▱▱ 60%";case o<=80:return"▰▰▰▰▱ 80%";default:return"▰▰▰▰▰ 100%"}}static getHealthColorString(e,i){const o=e/i*100;switch(!0){case o<=25:return"red";case o<=50:return"yellow";default:return"white"}}static async GetCTUFromRow(e){let i={id:"",visible:!1,xpos:0,ypos:0,dpi:0,width:0,height:0,offsetx:0,offsety:0};const o=e.getAttribute("unit-id"),s=await p.scene.items.getItems([o]);for(let r of s){const n=r;i={id:n.id,visible:n.visible,xpos:n.position.x,ypos:n.position.y,dpi:n.grid.dpi,width:n.image.width,height:n.image.height,offsetx:n.grid.offset.x,offsety:n.grid.offset.y}}return i}}async function J(d,e){var i=e;const o='<hr style="height:5px; margin-top: 4px; margin-bottom: 4px; visibility:hidden;" />';d.querySelector("#clash-main-body-settings").innerHTML=`
        <div id="settingsContainer">
        <h2 style="margin-top: 10px;">Settings</h2>
        <div><span id="exportAllContainer"></span>Export Collection Data </div>
        <i><small>This will save Collection data to a Text/JSON file</small></i>
        </br>
        ${o}
        <div><span id="importSubmitContainer"></span>Import Collection Data </div>
        <div><span id="importAllContainer"></span></div>
        <i><small>This will overwrite keys with the same Name/Author</small></i>
        </br>
        ${o}
        <div><span id="clearAllContainer"></span>Clear All Data </div>
        <i><small>This will delete the database.</small></i>
        </br>
        ${o}
        <div>${I("hideHp")}</span>&emsp;Hide HP Indication from Players </div>
        ${o}
        <div>${I("hideAll")}</span>&emsp;Hide All from Players </div>
        ${o}
        <div>${I("reverseList")}</span>&emsp;Reverse Initiative </div>
        ${o}
        <div>${I("noFocus")}</span>&emsp;Disable Camera Focus </div>
        ${o}
        <div>${I("noLabel")}</span>&emsp;Disable Turn Label </div>
        <div id="turnLabelTextContainer">&emsp;&emsp;&emsp;&emsp;</div>
        ${o}
        <div>${I("logToGM")}</span>&emsp;[Rumble!] Send Log to GM Only </div>
        <footer><span class="returnFloatLeft" id="settingsReturnContainer"></span></footer>
        </div>
       `,u(d,"hideHp",e.gmHideHp,e),u(d,"hideAll",e.gmHideAll,e),u(d,"reverseList",e.gmReverseList,e),u(d,"noFocus",e.gmDisableFocus,e),u(d,"noLabel",e.gmDisableLabel,e),u(d,"logToGM",e.gmRumbleLog,e);const s=d.getElementById("turnLabelTextContainer"),r=d.createElement("input");r.type="text",r.id="textLabelButton",r.title="Change your Turn Label's text",r.placeholder="« Go! »",r.maxLength=40,r.value=e.gmTurnText?e.gmTurnText:"",r.size=30,r.className="textInput",s?.appendChild(r);const n=d.getElementById("importAllContainer"),t=d.createElement("input");t.type="file",t.id="importButton",t.title="Choose a file to import",t.className="tinyType";const a=d.createElement("input");a.type="checkbox",a.id="favBox",a.title="Unfavorite during Upload";const c=d.getElementById("importSubmitContainer"),l=d.createElement("input");l.type="button",l.id="importSubmitButton",l.value="IMPORT DATA",l.title="Import Clash Collection Data",l.className="tinyType",l.onclick=async function(){if(t.files&&t.files.length>0){let T=t.files[0],w=new FileReader;w.readAsText(T),w.onload=async function(){try{const E=JSON.parse(w.result);await x(E),p.notification.show("Import Complete!","SUCCESS")}catch(E){alert(`The import failed - ${E}`)}},w.onerror=function(){console.log(w.error)}}},n?.appendChild(a),n?.appendChild(d.createTextNode("Un-Favorite  ˣ  ")),n?.appendChild(t),c?.appendChild(l);const h=d.getElementById("exportAllContainer"),v=d.createElement("input");v.type="button",v.id="exportButton",v.value="EXPORT DATA",v.title="Export Clash Collection Data",v.className="tinyType",v.onclick=async function(){await y()},h?.appendChild(v);const b=d.getElementById("clearAllContainer"),g=d.createElement("input");g.type="button",g.id="resetButton",g.value="DELETE DATA",g.title="Clear all Clash! Data",g.className="tinyType",g.onclick=async function(){if(confirm("Delete EVERYTHING? (Deletes Database and Refreshes Window)")){i.turnCounter=1,i.roundCounter=1;const T=d.getElementById("roundCount");T.innerText=`Round: ${i.roundCounter}`,await p.scene.items.deleteItems([m.LABEL]),await p.scene.items.updateItems(w=>w.metadata[`${m.EXTENSIONID}/metadata_initiative`]!=null||w.id===m.LABEL,w=>{for(let E of w)delete E.metadata[`${m.EXTENSIONID}/metadata_initiative`]}),await C.delete(),window.location.reload()}},b?.appendChild(g);const f=d.getElementById("settingsReturnContainer"),S=d.createElement("input");S.type="button",S.id="returnButton",S.className="turnColor chalkBorder turnIndicator",S.title="Save and return to Initiative List",S.value="Return",S.onclick=async function(){e.gmTurnText=r.value,await C.Settings.update(m.SETTINGSID,{gmHideHp:e.gmHideHp,gmHideAll:e.gmHideAll,gmDisableLabel:e.gmDisableLabel,gmReverseList:e.gmReverseList,gmTurnText:e.gmTurnText,gmRumbleLog:e.gmRumbleLog,disableFocus:e.gmDisableFocus}),e.gmDisableLabel&&p.scene.items.deleteItems([m.LABEL]),i.ShowSettingsMenu(!1),i.ShowMainMenu(!0)},f?.append(S);function I(T){return`<label class="switch" id="setting${T}Container">
            <span class="slider round"></span>
            </label>`}function u(T,w,E,N){const H=T.getElementById(`setting${w}Container`),A=T.createElement("input");A.type="checkbox",A.value=String(E),A.checked=E,A.onclick=async function(k){const R=k.target;switch(A.value=String(R.checked),w){case"hideHp":N.gmHideHp=R.checked;break;case"hideAll":N.gmHideAll=R.checked;break;case"noFocus":N.gmDisableFocus=R.checked;break;case"noLabel":N.gmDisableLabel=R.checked;break;case"reverseList":N.gmReverseList=R.checked;break;case"logToGM":N.gmRumbleLog=R.checked;break}},H?.insertBefore(A,H.firstChild)}async function y(){const T=await C.Creatures.toArray();var w=d.createElement("a"),E=new Blob([JSON.stringify(T)],{type:"text/plain"});w.href=URL.createObjectURL(E),w.download=`ClashCollectionExport-${Date.now()}`,d.body.appendChild(w),w.click(),d.body.removeChild(w)}async function x(T){const w=await C.Creatures.toArray();let E=[];T.forEach(N=>{let H=new B("","Default");H.SetToModel(N,!a.checked),H.tokenId="";const A=w.find(k=>k.unitName==N.unitName&&k.dataSlug==N.dataSlug);A?H.id=A.id:H.id=z(),E.push(H)}),await C.Creatures.bulkPut(E)}}function Y(d,e){var i=e;const o=d.getElementById("saveButtonContainer"),s=d.createElement("input");s.type="image",s.className="Icon clickable",s.id="saveButton",s.onclick=async function(){await i.Save()},s.src="/save.svg",s.title="Save Changes",s.height=20,s.width=20,o.appendChild(s)}function j(d){const e=d.getElementById("rollAllContainer"),i=d.createElement("input");i.type="image",i.className="Icon RollerButton clickable",i.id="rollAllButton",i.onclick=async function(){p.notification.show("Rolled Initiative for all Monsters."),d.querySelectorAll(".isMonster").forEach(s=>{const n=s.id.substring(2),t=d.querySelector(`#iI${n}`),a=parseFloat(t.getAttribute("unit-dexbonus"));t.value=(a+Math.floor(Math.random()*(20-1)+1)).toString()})},i.src="/dice.svg",i.title="Roll Initiative for all Monsters",i.height=20,i.width=20,e.appendChild(i)}function Q(d,e){var i=e;const o=d.getElementById("prevContainer"),s=d.getElementById("nextContainer"),r=d.createElement("input");r.type="button",r.id="previousButton",r.value="Previous",r.className="turnColor chalkBorder turnIndicator",r.title="Previous Turn",r.onclick=async function(){const t=d.getElementById("initiative-list");if(t.rows?.length>1){i.turnCounter--;for(var a=0,c;c=t.rows[a];a++)c.className=="turnOutline"&&c.parentElement?.firstElementChild===c&&(i.roundCounter--,i.roundCounter<1&&(i.roundCounter=1),i.turnCounter=c.parentElement.childElementCount);await i.FocusOnCurrentTurnUnit(t),await i.Save()}};const n=d.createElement("input");n.type="button",n.id="nextButton",n.value="Next",n.className="turnColor chalkBorder turnIndicator",n.title="Next Turn",n.onclick=async function(){const t=d.getElementById("initiative-list");if(t.rows?.length>1){i.turnCounter++;for(var a=0,c;c=t.rows[a];a++)c.className=="turnOutline"&&c.parentElement?.lastElementChild===c&&(i.roundCounter++,i.turnCounter=1);await i.FocusOnCurrentTurnUnit(t),await i.Save()}},o?.appendChild(r),s?.appendChild(n)}function Z(d,e){var i=e;const o=d.getElementById("resetContainer"),s=d.createElement("input");s.type="button",s.id="resetTurnButton",s.value="Reset Round",s.title="Reset Round",s.className="tinyType",s.onclick=async function(){i.turnCounter=1,i.roundCounter=1;const t=d.getElementById("roundCount");t.innerText=`Round: ${i.roundCounter}`,await C.Tracker.clear(),await C.Tracker.add({id:m.TURNTRACKER,currentRound:1,currentTurn:1}),await p.scene.items.deleteItems([m.LABEL]),await e.ShowTurnSelection(),await e.Save()},o.appendChild(s);const r=d.createElement("input");r.type="button",r.id="clearButton",r.value="CLEAR LIST",r.title="Clear List",r.className="tinyType",r.onclick=async function(){if(confirm("Clear the Initiative List (This will leave unit info)?")){i.turnCounter=1,i.roundCounter=1;const t=d.getElementById("roundCount");t.innerText=`Round: ${i.roundCounter}`,await C.Tracker.clear(),await C.Tracker.add({id:m.TURNTRACKER,currentRound:1,currentTurn:1}),await C.ActiveEncounter.where("isActive").equals(1).modify({isActive:0}),await p.scene.items.deleteItems([m.LABEL]),await p.scene.items.updateItems(a=>a.metadata[`${m.EXTENSIONID}/metadata_initiative`]!=null||a.id===m.LABEL,a=>{for(let c of a)delete c.metadata[`${m.EXTENSIONID}/metadata_initiative`]}),await e.Save()}},o.appendChild(r);const n=d.createElement("input");n.type="button",n.id="settingsButton",n.value="Settings",n.title="View Settings",n.className="tinyType",n.onclick=async function(){i.ShowMainMenu(!1),i.ShowSettingsMenu(!0),J(d,e)},o.appendChild(n)}class ee{inSceneUnits=[];roundCounter=1;turnCounter=1;activeUnits=[];party=[];gmHideHp=!1;gmHideAll=!1;gmDisableLabel=!1;gmDisableFocus=!1;gmReverseList=!1;gmRumbleLog=!1;gmTurnText="";rendered=!1;async RenderInitiativeList(e){this.setupContextMenu(this),this.ShowSettingsMenu(!1),this.ShowMainMenu(!0);const i=e.querySelector("#clash-main-body-app");if(i.innerHTML=`
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
        `,C.inMemory){const a=e.createElement("div");a.innerText="Local Storage Disabled - Features Limited",a.className="noDatabase",i.prepend(a)}Y(e,this),Q(e,this),Z(e,this),j(e);const o=await C.Settings.get(m.SETTINGSID);o?(this.gmHideHp=o.gmHideHp,this.gmHideAll=o.gmHideAll,this.gmDisableLabel=o.gmDisableLabel,this.gmDisableFocus=o.disableFocus,this.gmReverseList=o.gmReverseList,this.gmRumbleLog=o.gmRumbleLog,this.gmTurnText=o.gmTurnText):await C.Settings.add({id:m.SETTINGSID,gmHideHp:!1,gmHideAll:!1,gmDisableLabel:!1,gmTurnText:"",gmReverseList:!1,gmRumbleLog:!1,disableFocus:!1});const s=await C.Tracker.get(m.TURNTRACKER);s?(this.turnCounter=s.currentTurn,this.roundCounter=s.currentRound):await C.Tracker.add({id:m.TURNTRACKER,currentRound:1,currentTurn:1});const r=e.getElementById("playerListing");this.party=await p.party.getPlayers(),r.appendChild($()),this.party.forEach(a=>{const c=e.createElement("li");c.id=a.id,c.textContent=a.name,c.style.color=a.color,r.appendChild(c)}),p.party.onChange(a=>{r.innerHTML="",r.appendChild($()),this.party=a,a.forEach(async c=>{const l=e.createElement("li");l.id=c.id,l.textContent=c.name,l.style.color=c.color,r.appendChild(l);const h=c.metadata;if(h[`${m.EXTENSIONID}/metadata_playerItem`]!=null){const b=h[`${m.EXTENSIONID}/metadata_playerItem`].PlayerUpdate;V(b.stamp)||(b.initiative?await C.ActiveEncounter.update(b.id,{initiative:b.initiative}):b.cHp?await C.ActiveEncounter.update(b.id,{currentHP:b.cHp}):b.mHp?await C.ActiveEncounter.update(b.id,{maxHP:b.mHp}):b.aC&&await C.ActiveEncounter.update(b.id,{armorClass:b.aC}),await this.UpdateTrackerForPlayers())}})}),p.scene.onReadyChange(async a=>{a&&await this.CheckIniativeList()});const n=await p.theme.getTheme();U(n,e),p.theme.onChange(a=>{U(a,e)}),p.scene.items.onChange(async a=>{await this.UpdateActiveUnits(a),a.forEach(async l=>{if(l.layer!=="CHARACTER")return;const h=l,v=h.text?.plainText||h.name,b=this.activeUnits.find(g=>g.id===h.id);if(b&&b.unitName!==v&&await C.ActiveEncounter.update(b.id,{unitName:v}),l.metadata[`${m.EXTENSIONID}/metadata_initiative`]!==void 0&&b?.isActive==0&&await C.ActiveEncounter.update(b.id,{isActive:1}),l.metadata[`${m.EXTENSIONID}/metadata_initiative`]!==void 0&&!b){const g=this.activeUnits.find(f=>f.unitName===v);if(m.ALPHANUMERICTEXTMATCH.test(v)){const f=v.slice(0,-2),S=await C.ActiveEncounter.where("unitName").startsWith(f).first();if(S){S.id=l.id;let I=new B(l.id,v,l.createdUserId);I.SetToModel(S),I.unitName=v,I.tokenId=l.id,I.isActive=1,await I.SaveToDB(),this.inSceneUnits.push(l.id)}}else if(g){g.id=l.id;let f=new B(l.id,v,l.createdUserId);f.SetToModel(g),f.unitName=v,f.tokenId=l.id,f.isActive=1,await f.SaveToDB(),this.inSceneUnits.push(l.id)}else await p.scene.items.updateItems(f=>f.id===l.id,f=>{for(let S of f)delete S.metadata[`${m.EXTENSIONID}/metadata_initiative`],delete S.metadata[`${m.EXTENSIONID}/metadata_hpbar`]})}}),this.activeUnits.filter(({id:l})=>!a.some(({id:h})=>h===l)).forEach(async l=>{await C.ActiveEncounter.update(l.id,{isActive:0})})}),await K(async()=>await C.ActiveEncounter.toArray()).subscribe({next:async a=>{this.RefreshList(a)},error:a=>console.log("Error refreshing list: "+a)}),await this.CheckIniativeList(),this.AttachFocusListeners(),this.rendered=!0}async UpdateActiveUnits(e){if(e.length>0){let i=[];this.inSceneUnits=e.map(s=>s.id),i=await(await C.ActiveEncounter.toCollection()).toArray(),this.activeUnits=i.filter(s=>this.inSceneUnits.includes(s.id)),this.activeUnits.forEach(async s=>{await C.ActiveEncounter.update(s.id,{isActive:1});const r=i.find(n=>n.id===s.id);r.isActive=1})}}async CheckIniativeList(){const e=await p.scene.items.getItems(i=>i.layer==="CHARACTER"&&i.metadata[`${m.EXTENSIONID}/metadata_initiative`]!==void 0);await this.UpdateActiveUnits(e),await this.RefreshList(this.activeUnits)}RefreshList(e){const i=document.querySelector("#unit-list"),o=this,s=e.filter(n=>n.isActive==1);this.activeUnits=s.filter(n=>this.inSceneUnits.includes(n.id));const r=this.gmReverseList?this.activeUnits.sort((n,t)=>n.initiative-t.initiative||n.unitName.localeCompare(t.unitName)):this.activeUnits.sort((n,t)=>t.initiative-n.initiative||n.unitName.localeCompare(t.unitName));for(;i?.rows.length>0;)i.deleteRow(0);for(const n of r){let t;if(n.ownerId){const w=this.party.find(E=>E.id===n.ownerId)?.color;w&&(t=G(w,.4))}let a=i.insertRow(-1),c=a.insertCell(0),l=a.insertCell(1),h=a.insertCell(2),v=a.insertCell(3),b=a.insertCell(4),g=a.insertCell(5);a.setAttribute("unit-id",n.id);const f=document.createElement("input");f.className="InitiativeInput",f.inputMode="numeric",f.setAttribute("unit-dexbonus",Math.floor((n.dexScore-10)/2).toString()),f.value=n.initiative.toString(),f.id=`iI${n.id}`,f.size=2,f.min="0",f.max="99",f.maxLength=2;const S=document.createElement("input");S.type="image",S.title="Roll this Unit's Iniative",S.id=`rB${n.id}`,S.className="clickable",S.onclick=async function(){const w=parseFloat(f.getAttribute("unit-dexbonus"));f.value=(w+Math.floor(Math.random()*(20-1)+1)).toString()},S.src="/dice.svg",S.height=20,S.width=20;const I=document.createElement("input");I.type="button",I.value=n.isMonster?`ʳ ${n.unitName} ʴ`:n.unitName,I.title="Change between Player and Monster groups",I.id=`nT${n.id}`,I.style.width="100%",I.style.textOverflow="ellipsis",I.style.overflow="hidden",t&&(I.style.background=`linear-gradient(200deg, transparent, ${t})`),I.className=n.isMonster?"isMonster nameToggleInput":"nameToggleInput",I.onclick=async function(){I.className=="isMonster nameToggleInput"?(I.value=n.unitName,I.className="nameToggleInput"):(I.value=`ʳ ${n.unitName} ʴ`,I.className="isMonster nameToggleInput")},I.oncontextmenu=async function(w){w.preventDefault();const E=document.getElementById("contextMenu");E.addEventListener("click",async H=>{H.stopPropagation();const A=H.target,k=E.getAttribute("currentUnit");await C.ActiveEncounter.update(k,{ownerId:A.id})}),E.setAttribute("currentUnit",n.id);const N=()=>{E.style.display="none",document.removeEventListener("click",N)};document.addEventListener("click",N),E.style.display=="block"?te():(E.style.display="block",E.style.left=w.pageX+"px",E.style.top=w.pageY+"px")};const u=document.createElement("input");u.className="HealthInput",u.inputMode="numeric",u.id=`cHP${n.id}`,u.title=n.currentHP.toString(),u.value=n.currentHP.toString(),u.size=4,u.maxLength=4,u.onblur=function(w){const N=w.currentTarget.value;if(N.substring(0,1)=="+"){const H=N.substring(N.indexOf("+")+1);u.value=(+H+ +u.title).toString(),u.title=u.value,w.preventDefault()}else if(N.substring(0,1)=="-"){const H=N.substring(N.indexOf("-")+1);u.value=(+u.title-+H).toString(),u.title=u.value,w.preventDefault()}o.Save()},u.onkeydown=function(w){if(w.key!=="Enter")return;const N=w.currentTarget.value;if(N.substring(0,1)=="+"){const H=N.substring(N.indexOf("+")+1);u.value=(+H+ +u.title).toString(),u.title=u.value,w.preventDefault()}else if(N.substring(0,1)=="-"){const H=N.substring(N.indexOf("-")+1);u.value=(+u.title-+H).toString(),u.title=u.value,w.preventDefault()}o.Save()};const y=document.createElement("input");y.className="HealthInput",y.inputMode="numeric",y.id=`mHP${n.id}`,y.value=n.maxHP.toString(),y.size=4,y.maxLength=4;const x=document.createElement("input");x.className="ArmorInput",x.inputMode="numeric",x.id=`aC${n.id}`,x.value=n.armorClass.toString(),x.size=2,x.maxLength=2;const T=document.createElement("input");T.type="image",T.title="View/Edit this Unit's Stats",T.id=`tB${n.id}`,T.className="clickable",T.onclick=async function(w){const E=w.currentTarget;await o.OpenSubMenu(E.id.substring(2))},T.src="/triangle.svg",T.height=20,T.width=20,T.style.marginLeft="5px",c.appendChild(f),c.style.width="8%",l.appendChild(S),l.style.width="8%",h.appendChild(I),h.style.width="42%",v.appendChild(u),v.appendChild(document.createTextNode("/")),v.appendChild(y),v.style.width="24%",b.appendChild(x),b.style.width="8%",C.inMemory||(g.appendChild(T),g.style.width="10%")}this.ShowTurnSelection()}AttachFocusListeners(){const e=document.getElementById("initiative-list");e&&e.addEventListener("dblclick",i);async function i(o){o.preventDefault();const s=o.target.closest("tr");if(!s)return;const r=await L.GetCTUFromRow(s);await M.CenterViewportOnImage(r)}}ShowTurnSelection(){const e=document.getElementById("initiative-list");if(e&&e.rows?.length>1){for(var i=0,o;o=e.rows[i];i++)o.classList.remove("turnOutline");if(this.turnCounter>=e.rows.length&&(this.turnCounter=e.rows.length-1),e.rows[this.turnCounter]){const s=e.rows[this.turnCounter];s.className="turnOutline";const r=document.getElementById("roundCount");r.innerText=`Round: ${this.roundCounter}`}}}async Save(){document.querySelectorAll(".InitiativeInput").forEach(async i=>{const o=i,s=o.id.substring(2),r=o.value,n=document.querySelector(`#cHP${s}`),t=n.value?n.value:"0",a=document.querySelector(`#mHP${s}`),c=a.value?a.value:"1",l=document.querySelector(`#aC${s}`),h=l.value?l.value:"10",b=document.querySelector(`#nT${s}`).className=="isMonster nameToggleInput";if(!s||!r)return;let g=this.activeUnits?.find(f=>f.id==s);g&&await C.ActiveEncounter.update(g.id,{initiative:parseFloat(r),currentHP:parseFloat(t),maxHP:parseFloat(c),armorClass:parseFloat(h),isMonster:b})}),await C.Tracker.update(m.TURNTRACKER,{id:m.TURNTRACKER,currentTurn:this.turnCounter,currentRound:this.roundCounter}),await this.CheckIniativeList(),await this.UpdateTrackerForPlayers()}async UpdateTrackerForPlayers(){const e=[],i=new Date().toISOString(),o=[];(await p.scene.items.getItems(t=>t.id.endsWith("_hpbar"))).forEach(t=>{const a=t,c=this.activeUnits.find(l=>l.id===a.id.replace("_hpbar",""));c&&(a.text.plainText=L.getHealthPercentageString(c.currentHP,c.maxHP),a.text.style.fillColor=L.getHealthColorString(c.currentHP,c.maxHP),o.push(a))}),await p.scene.items.addItems(o);for(const t of this.activeUnits)e.push({id:t.id,name:t.unitName,initiative:t.initiative,cHp:t.currentHP,mHp:t.maxHP,aC:t.armorClass,owner:t.ownerId});const r={turn:this.turnCounter,round:this.roundCounter,units:e,gmHideHp:this.gmHideHp,gmHideAll:this.gmHideAll,gmReverseList:this.gmReverseList,lastUpdate:i},n={};n[`${m.EXTENSIONID}/metadata_trackeritem`]={Tracker:r},await p.scene.setMetadata(n)}async FocusOnCurrentTurnUnit(e){const i=e.rows[this.turnCounter],o=await L.GetCTUFromRow(i);this.gmDisableFocus||await M.CenterViewportOnImage(o),this.gmDisableLabel||await L.UpdateLabel(o,this.gmTurnText)}ShowSettingsMenu(e){const i=document.querySelector("#clash-main-body-settings");i.hidden=!e}ShowMainMenu(e){const i=document.querySelector("#clash-main-body-app");i.hidden=!e}async OpenSubMenu(e){const o=window.innerWidth<m.MOBILEWIDTH,s=window.outerHeight-150,r=s>800?700:s-100;o?await p.popover.open({id:m.EXTENSIONSUBMENUID,url:`/submenu/subindex.html?unitid=${e}`,height:r,width:325,hidePaper:!0}):await p.modal.open({id:m.EXTENSIONSUBMENUID,url:`/submenu/subindex.html?unitid=${e}`,height:r,width:350})}setupContextMenu(e){C.inMemory||p.contextMenu.create({id:`${m.EXTENSIONID}/context-menu-sheet`,icons:[{icon:"/sheet.svg",label:"[Clash!] View Info",filter:{max:1,every:[{key:"layer",value:"CHARACTER"}]}},{icon:"/multi-sheet.svg",label:"[Clash!] View Info",filter:{min:2,every:[{key:"layer",value:"CHARACTER"}]}}],async onClick(i,o){if(i.items.length==1){const s=i.items[0],r=s.text?.plainText||s.name;if(!await C.ActiveEncounter.get(s.id)){let l=new B(s.id,r);if(m.ALPHANUMERICTEXTMATCH.test(r)){const h=r.slice(0,-2),v=await C.Creatures.get({unitName:h});v&&l.SetToModel(v)}else{const h=await C.Creatures.get({unitName:r});h&&l.SetToModel(h)}await l.SaveToDB()}const t=100,a=window.outerHeight-150,c=a>800?700:a-t;await p.popover.open({id:m.EXTENSIONSUBMENUID,url:`/submenu/subindex.html?unitid=${s.id}`,height:c,width:325,anchorElementId:o,hidePaper:!0})}else{i.items.forEach(async c=>{const l=c,h=l.text?.plainText||l.name;if(!await C.ActiveEncounter.get(c.id)){let b=new B(c.id,h);if(m.ALPHANUMERICTEXTMATCH.test(h)){const g=h.slice(0,-2),f=await C.Creatures.get({unitName:g});f&&b.SetToModel(f)}else{const g=await C.Creatures.get({unitName:h});g&&b.SetToModel(g)}await b.SaveToDB()}});const s=i.items.map(c=>c.id).toString(),r=i.items.map(c=>c.metadata[`${m.EXTENSIONID}/metadata_initiative`]!==void 0).toString(),n=100,t=window.outerHeight-150,a=t>800?700:t-n;await p.popover.open({id:m.EXTENSIONSUBMENUID,url:`/submenu/subindex.html?unitid=${s}&unitactive=${r}&multi=true`,height:a,width:325,anchorElementId:o,hidePaper:!0})}}}),p.contextMenu.create({id:`${m.EXTENSIONID}/context-hp-menu`,icons:[{icon:"/health.svg",label:"[Clash!] Show HP Bar",filter:{every:[{key:"layer",value:"CHARACTER"},{key:["metadata",`${m.EXTENSIONID}/metadata_hpbar`],value:void 0},{key:["metadata",`${m.EXTENSIONID}/metadata_initiative`],value:void 0,operator:"!="}]}},{icon:"/health-black.svg",label:"[Clash!] Hide HP Bar",filter:{every:[{key:"layer",value:"CHARACTER"},{key:["metadata",`${m.EXTENSIONID}/metadata_hpbar`],value:void 0,operator:"!="}]}}],async onClick(i){if(i.items.every(s=>s.metadata[`${m.EXTENSIONID}/metadata_hpbar`]===void 0)){const r=[];await p.scene.items.updateItems(i.items,n=>{for(let t of n){const a=t,c=e.activeUnits.find(l=>l.id===t.id);c&&(t.metadata[`${m.EXTENSIONID}/metadata_hpbar`]={showHpBars:!0},r.push(L.UpdateHPBar(a,c.currentHP,c.maxHP)))}}),await p.scene.items.addItems(r)}else{const s=i.items.map(r=>r.id+"_hpbar");await p.scene.items.deleteItems(s),await p.scene.items.updateItems(i.items,r=>{for(let n of r)delete n.metadata[`${m.EXTENSIONID}/metadata_hpbar`]})}}}),p.contextMenu.create({id:`${m.EXTENSIONID}/context-menu`,icons:[{icon:"/addunit.svg",label:"[Clash!] Add to Initiative",filter:{every:[{key:"layer",value:"CHARACTER"},{key:["metadata",`${m.EXTENSIONID}/metadata_initiative`],value:void 0}]}},{icon:"/removeunit.svg",label:"[Clash!] Remove from Initiative",filter:{every:[{key:"layer",value:"CHARACTER"}]}}],async onClick(i){const s=i.items.every(n=>n.metadata[`${m.EXTENSIONID}/metadata_initiative`]===void 0),r=i.items;if(s)r.forEach(async n=>{const t=n.text?.plainText||n.name,a=await C.ActiveEncounter.get(n.id);if(e.inSceneUnits.push(n.id),a)await C.ActiveEncounter.update(n.id,{isActive:1});else{let c=new B(n.id,t,n.createdUserId);if(m.ALPHANUMERICTEXTMATCH.test(n.name)){const l=t.slice(0,-2),h=await C.Creatures.get({unitName:l});h&&c.SetToModel(h)}else{const l=await C.Creatures.get({unitName:t});l&&c.SetToModel(l)}c.isActive=1,e.activeUnits.push(c),c.SaveToDB()}}),await p.scene.items.updateItems(r,n=>{for(let t of n)t.metadata[`${m.EXTENSIONID}/metadata_initiative`]={initiative:!0}});else{const n=i.items.map(t=>t.id+"_hpbar");await p.scene.items.deleteItems(n),await p.scene.items.updateItems(i.items,t=>{for(let a of t)delete a.metadata[`${m.EXTENSIONID}/metadata_initiative`],delete a.metadata[`${m.EXTENSIONID}/metadata_hpbar`]}),r.forEach(async t=>{await C.ActiveEncounter.update(t.id,{isActive:0}),e.inSceneUnits=e.inSceneUnits.filter(a=>a!=t.id)})}}})}}function $(){const d=document.createElement("li");return d.id="",d.textContent="No Owner",d}function te(){document.getElementById("contextMenu").style.display="none"}class ie{roundCounter=1;turnCounter=1;enableAutoFocus=!1;lastUpdate="";playerId="";playerColor="";party=[];rendered=!1;async Render(e){e.querySelector("#clash-main-body-app").innerHTML=`
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
            `;var i=this;const o=e.getElementById("settingnoFocusContainer"),s=e.createElement("input");s.type="checkbox",s.value=String(this.enableAutoFocus),s.checked=this.enableAutoFocus,s.onclick=async function(t){const a=t.target;s.value=String(a.checked),i.enableAutoFocus=a.checked},o?.insertBefore(s,o.firstChild),this.playerId=await p.player.getId(),this.playerColor=await p.player.getColor(),this.party=await p.party.getPlayers();const r=await p.theme.getTheme();U(r,e),this.SetupListeners();const n=await p.scene.getMetadata();await this.RefreshList(n),this.rendered=!0}async RefreshList(e){const i=this,s=e[`${m.EXTENSIONID}/metadata_trackeritem`]?.Tracker;if(!s||!s.units||s.lastUpdate==this.lastUpdate)return;this.lastUpdate=s.lastUpdate;const r=document.querySelector("#unit-list");if(s.gmHideAll){r.innerHTML="";return}const n=s.gmReverseList?s.units.sort((t,a)=>t.initiative-a.initiative||t.name.localeCompare(a.name)):s.units.sort((t,a)=>a.initiative-t.initiative||t.name.localeCompare(a.name));for(this.roundCounter=s.round,this.turnCounter=s.turn;r.rows.length>0;)r.deleteRow(0);for(const t of n){let a=r.insertRow(-1);if(t.owner===this.playerId){const c=G(this.playerColor,.4);a.setAttribute("unit-id",t.id);let l=a.insertCell(0);l.style.placeContent="center";const h=document.createElement("input");h.className="InitiativeInput wide",h.inputMode="numeric",h.value=t.initiative.toString(),h.id=`iI${t.id}`,h.size=2,h.min="0",h.max="99",h.maxLength=2,h.onblur=function(u){const y=u.currentTarget;y.value&&i.SendUpdate({id:y.id.substring(2),initiative:+y.value})},h.onkeydown=function(u){if(u.key!=="Enter")return;const y=u.currentTarget;y.value&&i.SendUpdate({id:y.id.substring(2),initiative:+y.value})};let v=a.insertCell(1);v.style.placeContent="center",v.style.textOverflow="ellipsis",v.style.overflow="hidden",v.style.whiteSpace="nowrap",v.className="nameToggleInput",v.style.background=`linear-gradient(200deg, transparent, ${c})`;let b=a.insertCell(2);const g=document.createElement("input");g.className="HealthInput",g.inputMode="numeric",g.id=`cHP${t.id}`,g.title=t.cHp.toString(),g.value=t.cHp.toString(),g.size=4,g.maxLength=4,g.onblur=function(u){const y=u.currentTarget,x=y.value;if(x.substring(0,1)=="+"){const T=x.substring(x.indexOf("+")+1);g.value=(+T+ +g.title).toString(),g.title=g.value,u.preventDefault()}else if(x.substring(0,1)=="-"){const T=x.substring(x.indexOf("-")+1);g.value=(+g.title-+T).toString(),g.title=g.value,u.preventDefault()}y.value&&i.SendUpdate({id:y.id.substring(3),cHp:+y.value})},g.onkeydown=function(u){if(u.key!=="Enter")return;const y=u.currentTarget,x=y.value;if(x.substring(0,1)=="+"){const T=x.substring(x.indexOf("+")+1);g.value=(+T+ +g.title).toString(),g.title=g.value,u.preventDefault()}else if(x.substring(0,1)=="-"){const T=x.substring(x.indexOf("-")+1);g.value=(+g.title-+T).toString(),g.title=g.value,u.preventDefault()}y.value&&i.SendUpdate({id:y.id.substring(3),cHp:+y.value})};const f=document.createElement("input");f.className="HealthInput",f.inputMode="numeric",f.id=`mHP${t.id}`,f.value=t.mHp.toString(),f.size=4,f.maxLength=4,f.onblur=function(u){const y=u.currentTarget;y.value&&i.SendUpdate({id:y.id.substring(3),mHp:+y.value})},f.onkeydown=function(u){if(u.key!=="Enter")return;const y=u.currentTarget;y.value&&i.SendUpdate({id:y.id.substring(3),mHp:+y.value})};let S=a.insertCell(3);const I=document.createElement("input");I.className="ArmorInput",I.inputMode="numeric",I.id=`aC${t.id}`,I.value=t.aC.toString(),I.size=2,I.maxLength=2,I.onblur=function(u){const y=u.currentTarget;y.value&&i.SendUpdate({id:y.id.substring(2),aC:+y.value})},I.onkeydown=function(u){if(u.key!=="Enter")return;const y=u.currentTarget;y.value&&i.SendUpdate({id:y.id.substring(2),aC:+y.value})},s.gmHideHp||(t.cHp<=t.mHp/4?v.className=v.className+" unitHarmed":t.cHp<=t.mHp/2?v.className=v.className+" unitHurt":v.className=v.className+" unitHappy"),l.appendChild(h),l.style.width="10%",v.appendChild(document.createTextNode(t.name)),v.style.width="58%",b.appendChild(g),b.appendChild(document.createTextNode("/")),b.appendChild(f),S.appendChild(I),S.style.width="8%"}else{let c=a.insertCell(0);c.style.placeContent="center";let l=a.insertCell(1);l.style.placeContent="center",l.style.textOverflow="ellipsis",l.style.overflow="hidden",l.style.whiteSpace="nowrap",a.setAttribute("unit-id",t.id);const h=document.createElement("input");h.className="HealthInput",h.inputMode="numeric",h.id="cHP"+t.id,h.value=t.cHp.toString(),h.size=4,h.maxLength=4,s.gmHideHp||(t.cHp<=t.mHp/4?l.className="unitHarmed":t.cHp<=t.mHp/2?l.className="unitHurt":l.className="unitHappy"),c.appendChild(document.createTextNode(t.initiative.toString())),c.style.width="10%",l.appendChild(document.createTextNode(t.name)),l.style.width="58%"}}this.AttachFocusListeners(),await this.ShowTurnSelection()}AttachFocusListeners(){const e=document.getElementById("initiative-list");e&&e.addEventListener("dblclick",i);async function i(o){o.preventDefault();const s=o.target.closest("tr"),r=await L.GetCTUFromRow(s);await M.CenterViewportOnImage(r)}}async ShowTurnSelection(){const e=document.getElementById("initiative-list");if(e.rows?.length>1){for(var i=0,o;o=e.rows[i];i++)o.classList.remove("turnOutline");if(this.turnCounter>=e.rows.length&&(this.turnCounter=e.rows.length-1),e.rows[this.turnCounter]){const s=e.rows[this.turnCounter];s.className="turnOutline";const r=document.getElementById("roundCount");r.innerText=`Round: ${this.roundCounter}`;let n=await L.GetCTUFromRow(s);n.visible&&this.enableAutoFocus&&await M.CenterViewportOnImage(n)}}}async SetupListeners(){p.scene.onMetadataChange(e=>this.RefreshList(e)),p.theme.onChange(e=>{U(e,document)}),p.player.onChange(e=>{this.playerColor=e.color}),p.party.onChange(e=>{this.party=e})}async SendUpdate(e){e.stamp=new Date().toISOString();const i={};i[`${m.EXTENSIONID}/metadata_playerItem`]={PlayerUpdate:e},await p.player.setMetadata(i)}}const P=new ee,F=new ie;let X=!1;const D=document.querySelector("#clash-main-body-app"),O=document.querySelector("#clash-main-body-loading"),ne=C;ne.Ready();D.innerHTML=`
  <div>
    <h1>Loading...</h1>
  </div>
`;O.innerHTML=`
<div>
<h1>Waiting for Scene...</h1>
<div class="imageContainer">
<img class="resize_fit_center" src="logo.png" alt="Clash!" class="center">
</div>
</div>`;p.onReady(async()=>{X=await p.scene.isReady(),_(X),p.scene.onReadyChange(async d=>{_(d)})});async function _(d){const e=await p.player.getRole();d?(e==="GM"?P.rendered||await P.RenderInitiativeList(document):F.rendered||await F.Render(document),D.hidden=!1,O.hidden=!0):(D.hidden=!0,O.hidden=!1)}
