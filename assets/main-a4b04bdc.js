import{O as p,C as m,b as z,a as K}from"./constants-d8998271.js";import{d as f,U as M,G as W,I as J,S as O,F as Y,H as V,W as j}from"./utilities-3c1303fb.js";class U{static async CenterViewportOnImage(e){const i=await p.scene.grid.getDpi(),r=await p.viewport.getScale(),s=await p.viewport.getWidth(),l=await p.viewport.getHeight(),a={x:s/2,y:l/2},t={x:a.x/r,y:a.y/r},n=await this.GetImageCenter(e,i),o={x:n.x-t.x,y:n.y-t.y},d={x:o.x*r*-1,y:o.y*r*-1};await p.viewport.animateTo({position:d,scale:r})}static async GetImageCenter(e,i){const r=i/e.dpi,s=e.width*r,l=e.height*r,a=e.offsetx/e.width*s,t=e.offsety/e.height*l;return{x:e.xpos-a+s/2,y:e.ypos-t+l/2}}}class L{static async UpdateLabel(e,i){const r=await p.scene.items.getItems([m.LABEL]),s=i||"« Go! »";let l=!1;if(r.length==0||r[0].id!=m.LABEL){const n=z().fillColor("#ffffff").plainText(s).build();n.visible=!1,n.type="LABEL",n.id=m.LABEL,n.style={backgroundColor:"#bb99ff",backgroundOpacity:.5,pointerDirection:"DOWN",pointerWidth:15,pointerHeight:15,cornerRadius:10};const o=document.getElementById("initiative-list");if(o.rows?.length>1){for(var a=0,t;t=o.rows[a];a++)t.className=="turnOutline"&&(n.position={x:e.xpos,y:e.ypos-100},n.visible=!!e.visible,n.text.plainText=n.visible?s:s+`\r
(Hidden)`,n.attachedTo=e.id,n.locked=!0,l=!0);l||(n.visible=!1)}await p.scene.items.addItems([n])}else await p.scene.items.updateItems(n=>n.id==m.LABEL,n=>{for(let c of n){const I=document.getElementById("initiative-list");if(I.rows?.length>1){for(var o=0,d;d=I.rows[o];o++)d.className=="turnOutline"&&(c.position={x:e.xpos,y:e.ypos-100},c.visible=!!e.visible,c.text.plainText=c.visible?s:s+`\r
(Hidden)`,c.attachedTo=e.id,c.locked=!0,l=!0);l||(c.visible=!1)}}})}static UpdateHPBar(e,i,r){const s=e.id+"_hpbar",l=L.getHealthPercentageString(i,r),a=L.getHealthColorString(i,r),t=K().plainText(l).fontWeight(800).fillOpacity(.75).fillColor(a).strokeWidth(1).strokeColor("black").strokeOpacity(1).build();return t.id=s,t.type="TEXT",t.attachedTo=e.id,t.visible=!!e.visible,t.locked=!0,t.position={x:e.position.x-85,y:e.position.y+25},t.disableAttachmentBehavior=["ROTATION","SCALE"],t.text.style.fontFamily="Segoe UI",t.text.style.fontSize=24,t.text.type="PLAIN",t.text.style.textAlign="CENTER",t}static getHealthPercentageString(e,i){const r=e/i*100;switch(!0){case r==0:return"▱▱▱▱▱ 0%";case r<=20:return"▰▱▱▱▱ 20%";case r<=40:return"▰▰▱▱▱ 40%";case r<=60:return"▰▰▰▱▱ 60%";case r<=80:return"▰▰▰▰▱ 80%";default:return"▰▰▰▰▰ 100%"}}static getHealthColorString(e,i){const r=e/i*100;switch(!0){case r<=25:return"red";case r<=50:return"yellow";default:return"white"}}static async GetCTUFromRow(e){let i={id:"",visible:!1,xpos:0,ypos:0,dpi:0,width:0,height:0,offsetx:0,offsety:0};const r=e.getAttribute("unit-id"),s=await p.scene.items.getItems([r]);for(let l of s){const a=l;i={id:a.id,visible:a.visible,xpos:a.position.x,ypos:a.position.y,dpi:a.grid.dpi,width:a.image.width,height:a.image.height,offsetx:a.grid.offset.x,offsety:a.grid.offset.y}}return i}}async function Q(u,e){var i=e;const r='<hr style="height:5px; margin-top: 4px; margin-bottom: 4px; visibility:hidden;" />';u.querySelector("#clash-main-body-settings").innerHTML=`
        <div id="settingsContainer">
        <h2 style="margin-top: 10px;">Settings
        <div class="tooltip" id="whatsnewbutton">&#x1F6C8;
        <span class="tooltiptext"></span>
        </div>
        </h2>
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
        <div>${h("hideHp")}</span>&emsp;Hide HP Indication from Players </div>
        ${r}
        <div>${h("hideAll")}</span>&emsp;Hide All from Players </div>
        ${r}
        <div>${h("reverseList")}</span>&emsp;Reverse Initiative </div>
        ${r}
        <div>${h("noFocus")}</span>&emsp;Disable Camera Focus </div>
        ${r}
        <div>${h("noLabel")}</span>&emsp;Disable Turn Label </div>
        <div id="turnLabelTextContainer">&emsp;&emsp;&emsp;&emsp;</div>
        ${r}
        <div>${h("logToGM")}</span>&emsp;[Rumble!] Send Log to GM Only </div>
        <footer><span class="returnFloatLeft" id="settingsReturnContainer"></span></footer>
        </div>
       `,g(u,"hideHp",e.gmHideHp,e),g(u,"hideAll",e.gmHideAll,e),g(u,"reverseList",e.gmReverseList,e),g(u,"noFocus",e.gmDisableFocus,e),g(u,"noLabel",e.gmDisableLabel,e),g(u,"logToGM",e.gmRumbleLog,e);const s=u.getElementById("whatsnewbutton");s.onclick=async function(){await p.modal.open({id:m.EXTENSIONWHATSNEW,url:"/submenu/whatsnew.html?timer=600",height:500,width:350})};const l=u.getElementById("turnLabelTextContainer"),a=u.createElement("input");a.type="text",a.id="textLabelButton",a.title="Change your Turn Label's text",a.placeholder="« Go! »",a.maxLength=40,a.value=e.gmTurnText?e.gmTurnText:"",a.size=30,a.className="textInput",l?.appendChild(a);const t=u.getElementById("importAllContainer"),n=u.createElement("input");n.type="file",n.id="importButton",n.title="Choose a file to import",n.className="tinyType";const o=u.createElement("input");o.type="checkbox",o.id="favBox",o.title="Unfavorite during Upload";const d=u.getElementById("importSubmitContainer"),c=u.createElement("input");c.type="button",c.id="importSubmitButton",c.value="IMPORT DATA",c.title="Import Clash Collection Data",c.className="tinyType",c.onclick=async function(){if(n.files&&n.files.length>0){let T=n.files[0],w=new FileReader;w.readAsText(T),w.onload=async function(){try{const E=JSON.parse(w.result);await x(E),p.notification.show("Import Complete!","SUCCESS")}catch(E){alert(`The import failed - ${E}`)}},w.onerror=function(){console.log(w.error)}}},t?.appendChild(o),t?.appendChild(u.createTextNode("Un-Favorite  ˣ  ")),t?.appendChild(n),d?.appendChild(c);const I=u.getElementById("exportAllContainer"),v=u.createElement("input");v.type="button",v.id="exportButton",v.value="EXPORT DATA",v.title="Export Clash Collection Data",v.className="tinyType",v.onclick=async function(){await S()},I?.appendChild(v);const C=u.getElementById("clearAllContainer"),y=u.createElement("input");y.type="button",y.id="resetButton",y.value="DELETE DATA",y.title="Clear all Clash! Data",y.className="tinyType",y.onclick=async function(){if(confirm("Delete EVERYTHING? (Deletes Database and Refreshes Window)")){i.turnCounter=1,i.roundCounter=1;const T=u.getElementById("roundCount");T.innerText=`Round: ${i.roundCounter}`,await p.scene.items.deleteItems([m.LABEL]),await p.scene.items.updateItems(w=>w.metadata[`${m.EXTENSIONID}/metadata_initiative`]!=null||w.id===m.LABEL,w=>{for(let E of w)delete E.metadata[`${m.EXTENSIONID}/metadata_initiative`]}),await f.delete(),window.location.reload()}},C?.appendChild(y);const H=u.getElementById("settingsReturnContainer"),b=u.createElement("input");b.type="button",b.id="returnButton",b.className="turnColor chalkBorder turnIndicator",b.title="Save and return to Initiative List",b.value="Return",b.onclick=async function(){e.gmTurnText=a.value,await f.Settings.update(m.SETTINGSID,{gmHideHp:e.gmHideHp,gmHideAll:e.gmHideAll,gmDisableLabel:e.gmDisableLabel,gmReverseList:e.gmReverseList,gmTurnText:e.gmTurnText,gmRumbleLog:e.gmRumbleLog,disableFocus:e.gmDisableFocus}),e.gmDisableLabel&&p.scene.items.deleteItems([m.LABEL]),i.ShowSettingsMenu(!1),i.ShowMainMenu(!0)},H?.append(b);function h(T){return`<label class="switch" id="setting${T}Container">
            <span class="slider round"></span>
            </label>`}function g(T,w,E,N){const B=T.getElementById(`setting${w}Container`),R=T.createElement("input");R.type="checkbox",R.value=String(E),R.checked=E,R.onclick=async function(D){const k=D.target;switch(R.value=String(k.checked),w){case"hideHp":N.gmHideHp=k.checked;break;case"hideAll":N.gmHideAll=k.checked;break;case"noFocus":N.gmDisableFocus=k.checked;break;case"noLabel":N.gmDisableLabel=k.checked;break;case"reverseList":N.gmReverseList=k.checked;break;case"logToGM":N.gmRumbleLog=k.checked;break}},B?.insertBefore(R,B.firstChild)}async function S(){const T=await f.Creatures.toArray();var w=u.createElement("a"),E=new Blob([JSON.stringify(T)],{type:"text/plain"});w.href=URL.createObjectURL(E),w.download=`ClashCollectionExport-${Date.now()}`,u.body.appendChild(w),w.click(),u.body.removeChild(w)}async function x(T){const w=await f.Creatures.toArray();let E=[];T.forEach(N=>{let B=new M("","Default");B.SetToModel(N,!o.checked),B.tokenId="";const R=w.find(D=>D.unitName==N.unitName&&D.dataSlug==N.dataSlug);R?B.id=R.id:B.id=W(),E.push(B)}),await f.Creatures.bulkPut(E)}}function Z(u,e){var i=e;const r=u.getElementById("saveButtonContainer"),s=u.createElement("input");s.type="image",s.className="Icon clickable",s.id="saveButton",s.onclick=async function(){await i.Save()},s.src="/save.svg",s.title="Save Changes",s.height=20,s.width=20,r.appendChild(s)}function ee(u){const e=u.getElementById("rollAllContainer"),i=u.createElement("input");i.type="image",i.className="Icon RollerButton clickable",i.id="rollAllButton",i.onclick=async function(){p.notification.show("Rolled Initiative for all Monsters."),u.querySelectorAll(".isMonster").forEach(s=>{const a=s.id.substring(2),t=u.querySelector(`#iI${a}`),n=parseFloat(t.getAttribute("unit-dexbonus"));t.value=(n+Math.floor(Math.random()*(20-1)+1)).toString()})},i.src="/dice.svg",i.title="Roll Initiative for all Monsters",i.height=20,i.width=20,e.appendChild(i)}function te(u,e){var i=e;const r=u.getElementById("prevContainer"),s=u.getElementById("nextContainer"),l=u.createElement("input");l.type="button",l.id="previousButton",l.value="Previous",l.className="turnColor chalkBorder turnIndicator",l.title="Previous Turn",l.onclick=async function(){const t=u.getElementById("initiative-list");if(t.rows?.length>1){i.turnCounter--;for(var n=0,o;o=t.rows[n];n++)o.className=="turnOutline"&&o.parentElement?.firstElementChild===o&&(i.roundCounter--,i.roundCounter<1&&(i.roundCounter=1),i.turnCounter=o.parentElement.childElementCount);await i.FocusOnCurrentTurnUnit(t),await i.Save()}};const a=u.createElement("input");a.type="button",a.id="nextButton",a.value="Next",a.className="turnColor chalkBorder turnIndicator",a.title="Next Turn",a.onclick=async function(){const t=u.getElementById("initiative-list");if(t.rows?.length>1){i.turnCounter++;for(var n=0,o;o=t.rows[n];n++)o.className=="turnOutline"&&o.parentElement?.lastElementChild===o&&(i.roundCounter++,i.turnCounter=1);await i.FocusOnCurrentTurnUnit(t),await i.Save()}},r?.appendChild(l),s?.appendChild(a)}function ne(u,e){var i=e;const r=u.getElementById("resetContainer"),s=u.createElement("input");s.type="button",s.id="resetTurnButton",s.value="Reset Round",s.title="Reset Round",s.className="tinyType",s.onclick=async function(){i.turnCounter=1,i.roundCounter=1;const t=u.getElementById("roundCount");t.innerText=`Round: ${i.roundCounter}`,await f.Tracker.clear(),await f.Tracker.add({id:m.TURNTRACKER,currentRound:1,currentTurn:1}),await p.scene.items.deleteItems([m.LABEL]),await e.ShowTurnSelection(),await e.Save()},r.appendChild(s);const l=u.createElement("input");l.type="button",l.id="clearButton",l.value="CLEAR LIST",l.title="Clear List",l.className="tinyType",l.onclick=async function(){if(confirm("Clear the Initiative List (This will leave unit info)?")){i.turnCounter=1,i.roundCounter=1;const t=u.getElementById("roundCount"),n=[m.LABEL];t.innerText=`Round: ${i.roundCounter}`,await f.Tracker.clear(),await f.Tracker.add({id:m.TURNTRACKER,currentRound:1,currentTurn:1}),await p.scene.items.updateItems(o=>o.metadata[`${m.EXTENSIONID}/metadata_initiative`]!=null||o.id===m.LABEL,o=>{for(let d of o)n.push(d.id+"_hpbar"),delete d.metadata[`${m.EXTENSIONID}/metadata_initiative`],delete d.metadata[`${m.EXTENSIONID}/metadata_hpbar`]}),await f.ActiveEncounter.where({isActive:1,sceneId:i.sceneId}).modify({isActive:0}),await p.scene.items.deleteItems(n),await e.Save()}},r.appendChild(l);const a=u.createElement("input");a.type="button",a.id="settingsButton",a.value="Settings",a.title="View Settings",a.className="tinyType",a.onclick=async function(){i.ShowMainMenu(!1),i.ShowSettingsMenu(!0),Q(u,e)},r.appendChild(a)}class ie{unitsInScene=[];roundCounter=1;turnCounter=1;party=[];gmHideHp=!1;gmHideAll=!1;gmDisableLabel=!1;gmDisableFocus=!1;gmReverseList=!1;gmRumbleLog=!1;gmTurnText="";rendered=!1;sceneId="";itemOnChangeHandler;async RenderInitiativeList(e){this.setupContextMenu(this),this.ShowSettingsMenu(!1),this.ShowMainMenu(!0);const i=e.querySelector("#clash-main-body-app");if(i.innerHTML=`
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
        `,f.inMemory){const n=e.createElement("div");n.innerText="Local Storage Disabled - Features Limited",n.className="noDatabase",i.prepend(n)}Z(e,this),te(e,this),ne(e,this),ee(e);const r=await f.Settings.get(m.SETTINGSID);r?(this.gmHideHp=r.gmHideHp,this.gmHideAll=r.gmHideAll,this.gmDisableLabel=r.gmDisableLabel,this.gmDisableFocus=r.disableFocus,this.gmReverseList=r.gmReverseList,this.gmRumbleLog=r.gmRumbleLog,this.gmTurnText=r.gmTurnText):await f.Settings.add({id:m.SETTINGSID,gmHideHp:!1,gmHideAll:!1,gmDisableLabel:!1,gmTurnText:"",gmReverseList:!1,gmRumbleLog:!1,disableFocus:!1});const s=await f.Tracker.get(m.TURNTRACKER);s?(this.turnCounter=s.currentTurn,this.roundCounter=s.currentRound):await f.Tracker.add({id:m.TURNTRACKER,currentRound:1,currentTurn:1});const l=e.getElementById("playerListing");this.party=await p.party.getPlayers(),l.appendChild(X());for(const n of this.party){const o=e.createElement("li");o.id=n.id,o.textContent=n.name,o.style.color=n.color,l.appendChild(o)}p.party.onChange(async n=>{l.innerHTML="",l.appendChild(X()),this.party=n;for(const o of n){const d=e.createElement("li");d.id=o.id,d.textContent=o.name,d.style.color=o.color,l.appendChild(d);const c=o.metadata;if(c[`${m.EXTENSIONID}/metadata_playerItem`]!=null){const v=c[`${m.EXTENSIONID}/metadata_playerItem`].PlayerUpdate;J(v.stamp)||(v.initiative?await f.ActiveEncounter.update(v.id,{initiative:v.initiative}):v.cHp?await f.ActiveEncounter.update(v.id,{currentHP:v.cHp}):v.mHp?await f.ActiveEncounter.update(v.id,{maxHP:v.mHp}):v.aC&&await f.ActiveEncounter.update(v.id,{armorClass:v.aC}),await this.UpdateTrackerForPlayers())}}});const a=await p.theme.getTheme();O(a,e),p.theme.onChange(n=>{O(n,e)}),await j(async()=>await f.ActiveEncounter.toArray()).subscribe({next:async n=>{this.RefreshList(n)},error:n=>console.log("Error refreshing list: "+n)}),await this.RefreshList(),this.AttachFocusListeners(),this.rendered=!0}SetupItemOnChangeHandler(){this.itemOnChangeHandler=p.scene.items.onChange(async e=>{const i=[];for(const t of e){if(t.layer!=="CHARACTER")continue;const n=t,o=n.text?.plainText||n.name,d=this.unitsInScene.find(c=>c.id===n.id);if(d&&d.unitName!==o&&await f.ActiveEncounter.update(d.id,{unitName:o}),t.metadata[`${m.EXTENSIONID}/metadata_initiative`]!==void 0&&d?.isActive==0&&await f.ActiveEncounter.update(d.id,{isActive:1}),t.metadata[`${m.EXTENSIONID}/metadata_initiative`]!==void 0&&!d){const c=this.unitsInScene.find(v=>v.unitName===o),I=await f.ActiveEncounter.where("id").equals(n.id).first();if(m.ALPHANUMERICTEXTMATCH.test(o)){const v=o.slice(0,-2),C=await f.ActiveEncounter.where("unitName").startsWith(v).first();if(C){let y=new M(t.id,o,t.createdUserId);y.SetToModel(C),y.unitName=o,y.isActive=1,this.unitsInScene.push(y),await y.SaveToDB(this.sceneId)}}else if(c){let v=new M(t.id,o,t.createdUserId);v.SetToModel(c),v.isActive=1,this.unitsInScene.push(v),await v.SaveToDB(this.sceneId)}else I?.sceneId===this.sceneId&&i.push(t.id)}}i.length>0&&await p.scene.items.updateItems(t=>i.includes(t.id),t=>{for(let n of t)delete n.metadata[`${m.EXTENSIONID}/metadata_initiative`],delete n.metadata[`${m.EXTENSIONID}/metadata_hpbar`]});const r=e.filter(t=>t.layer==="CHARACTER"),s=Y(this.unitsInScene.map(t=>t.id),r.map(t=>t.id)),l=this.unitsInScene.filter(t=>!e.some(n=>n.id===t.id)),a=r.filter(t=>!this.unitsInScene.some(n=>n.id===t.id));if(a.length>0)for(const t of a){const n=t,o=n.text?.plainText||n.name;let d=new M(n.id,o,n.createdUserId);if(m.ALPHANUMERICTEXTMATCH.test(n.name)){const c=o.slice(0,-2),I=await f.Creatures.get({unitName:c});I&&d.SetToModel(I)}else{const c=await f.Creatures.get({unitName:o});c&&d.SetToModel(c)}await d.SaveToDB(this.sceneId)}l.length>0&&await f.ActiveEncounter.bulkDelete(s),await this.RefreshList()})}async RefreshActiveUnits(e){const i=e||await f.ActiveEncounter.toCollection().toArray();this.unitsInScene=i.filter(r=>r.sceneId===this.sceneId)}async RefreshList(e){const i=document.querySelector("#unit-list");await this.RefreshActiveUnits(e);const r=this.unitsInScene.filter(a=>a.isActive===1),s=this,l=this.gmReverseList?r.sort((a,t)=>a.initiative-t.initiative||a.unitName.localeCompare(t.unitName)):r.sort((a,t)=>t.initiative-a.initiative||a.unitName.localeCompare(t.unitName));for(;i?.rows.length>0;)i.deleteRow(0);for(const a of l){let t;if(a.ownerId){const T=this.party.find(w=>w.id===a.ownerId)?.color;T&&(t=V(T,.4))}let n=i.insertRow(-1),o=n.insertCell(0),d=n.insertCell(1),c=n.insertCell(2),I=n.insertCell(3),v=n.insertCell(4),C=n.insertCell(5);n.setAttribute("unit-id",a.id);const y=document.createElement("input");y.className="InitiativeInput",y.inputMode="numeric",y.setAttribute("unit-dexbonus",Math.floor((a.dexScore-10)/2).toString()),y.value=a.initiative.toString(),y.id=`iI${a.id}`,y.size=2,y.min="0",y.max="99",y.maxLength=2;const H=document.createElement("input");H.type="image",H.title="Roll this Unit's Iniative",H.id=`rB${a.id}`,H.className="clickable",H.onclick=async function(){const T=parseFloat(y.getAttribute("unit-dexbonus"));y.value=(T+Math.floor(Math.random()*(20-1)+1)).toString()},H.src="/dice.svg",H.height=20,H.width=20;const b=document.createElement("input");b.type="button",b.value=a.isMonster?`ʳ ${a.unitName} ʴ`:a.unitName,b.title="Change between Player and Monster groups",b.id=`nT${a.id}`,b.style.width="100%",b.style.textOverflow="ellipsis",b.style.overflow="hidden",t&&(b.style.background=`linear-gradient(200deg, transparent, ${t})`),b.className=a.isMonster?"isMonster nameToggleInput":"nameToggleInput",b.onclick=async function(){b.className=="isMonster nameToggleInput"?(b.value=a.unitName,b.className="nameToggleInput"):(b.value=`ʳ ${a.unitName} ʴ`,b.className="isMonster nameToggleInput")},b.oncontextmenu=async function(T){T.preventDefault();const w=document.getElementById("contextMenu");w.addEventListener("click",async N=>{N.stopPropagation();const B=N.target,R=w.getAttribute("currentUnit");await f.ActiveEncounter.update(R,{ownerId:B.id})}),w.setAttribute("currentUnit",a.id);const E=()=>{w.style.display="none",document.removeEventListener("click",E)};document.addEventListener("click",E),w.style.display=="block"?ae():(w.style.display="block",w.style.left=T.pageX+"px",w.style.top=T.pageY+"px")};const h=document.createElement("input");h.className="HealthInput",h.inputMode="numeric",h.id=`cHP${a.id}`,h.title=a.currentHP.toString(),h.value=a.currentHP.toString(),h.size=4,h.maxLength=4,h.onblur=function(T){const E=T.currentTarget.value;if(E.substring(0,1)=="+"){const N=E.substring(E.indexOf("+")+1);h.value=(+N+ +h.title).toString(),h.title=h.value,T.preventDefault()}else if(E.substring(0,1)=="-"){const N=E.substring(E.indexOf("-")+1);h.value=(+h.title-+N).toString(),h.title=h.value,T.preventDefault()}s.Save()},h.onkeydown=function(T){if(T.key!=="Enter")return;const E=T.currentTarget.value;if(E.substring(0,1)=="+"){const N=E.substring(E.indexOf("+")+1);h.value=(+N+ +h.title).toString(),h.title=h.value,T.preventDefault()}else if(E.substring(0,1)=="-"){const N=E.substring(E.indexOf("-")+1);h.value=(+h.title-+N).toString(),h.title=h.value,T.preventDefault()}s.Save()};const g=document.createElement("input");g.className="HealthInput",g.inputMode="numeric",g.id=`mHP${a.id}`,g.value=a.maxHP.toString(),g.size=4,g.maxLength=4;const S=document.createElement("input");S.className="ArmorInput",S.inputMode="numeric",S.id=`aC${a.id}`,S.value=a.armorClass.toString(),S.size=2,S.maxLength=2;const x=document.createElement("input");x.type="image",x.title="View/Edit this Unit's Stats",x.id=`tB${a.id}`,x.className="clickable",x.onclick=async function(T){const w=T.currentTarget;await s.OpenSubMenu(w.id.substring(2))},x.src="/triangle.svg",x.height=20,x.width=20,x.style.marginLeft="5px",o.appendChild(y),o.style.width="8%",d.appendChild(H),d.style.width="8%",c.appendChild(b),c.style.width="42%",I.appendChild(h),I.appendChild(document.createTextNode("/")),I.appendChild(g),I.style.width="24%",v.appendChild(S),v.style.width="8%",f.inMemory||(C.appendChild(x),C.style.width="10%")}this.ShowTurnSelection()}AttachFocusListeners(){const e=document.getElementById("initiative-list");e&&e.addEventListener("dblclick",i);async function i(r){r.preventDefault();const s=r.target.closest("tr");if(!s)return;const l=await L.GetCTUFromRow(s);await U.CenterViewportOnImage(l)}}ShowTurnSelection(){const e=document.getElementById("initiative-list");if(e&&e.rows?.length>1){for(var i=0,r;r=e.rows[i];i++)r.classList.remove("turnOutline");if(this.turnCounter>=e.rows.length&&(this.turnCounter=e.rows.length-1),e.rows[this.turnCounter]){const s=e.rows[this.turnCounter];s.className="turnOutline";const l=document.getElementById("roundCount");l.innerText=`Round: ${this.roundCounter}`}}}async Save(){const e=document.querySelectorAll(".InitiativeInput");for(let i=0;i<e.length;i++){const r=e[i],s=r.id.substring(2),l=r.value,a=document.querySelector(`#cHP${s}`),t=a.value?a.value:"0",n=document.querySelector(`#mHP${s}`),o=n.value?n.value:"1",d=document.querySelector(`#aC${s}`),c=d.value?d.value:"10",v=document.querySelector(`#nT${s}`).className=="isMonster nameToggleInput";if(!s||!l)return;let C=this.unitsInScene?.find(y=>y.id==s);C&&await f.ActiveEncounter.update(C.id,{initiative:parseFloat(l),currentHP:parseFloat(t),maxHP:parseFloat(o),armorClass:parseFloat(c),isMonster:v})}await f.Tracker.update(m.TURNTRACKER,{id:m.TURNTRACKER,currentTurn:this.turnCounter,currentRound:this.roundCounter}),await this.RefreshList(),await this.UpdateTrackerForPlayers()}async UpdateTrackerForPlayers(){const e=[],i=new Date().toISOString(),r=[],s=await p.scene.items.getItems(n=>n.id.endsWith("_hpbar"));for(const n of s){const o=n,d=this.unitsInScene.find(c=>c.id===o.id.replace("_hpbar",""));d&&(o.text.plainText=L.getHealthPercentageString(d.currentHP,d.maxHP),o.text.style.fillColor=L.getHealthColorString(d.currentHP,d.maxHP),r.push(o))}await p.scene.items.addItems(r);const l=this.unitsInScene.filter(n=>n.isActive===1);for(const n of l)e.push({id:n.id,name:n.unitName,initiative:n.initiative,cHp:n.currentHP,mHp:n.maxHP,aC:n.armorClass,owner:n.ownerId});const a={turn:this.turnCounter,round:this.roundCounter,units:e,gmHideHp:this.gmHideHp,gmHideAll:this.gmHideAll,gmReverseList:this.gmReverseList,lastUpdate:i},t={};t[`${m.EXTENSIONID}/metadata_trackeritem`]={Tracker:a},await p.scene.setMetadata(t)}async FocusOnCurrentTurnUnit(e){const i=e.rows[this.turnCounter],r=await L.GetCTUFromRow(i);this.gmDisableFocus||await U.CenterViewportOnImage(r),this.gmDisableLabel||await L.UpdateLabel(r,this.gmTurnText)}ShowSettingsMenu(e){const i=document.querySelector("#clash-main-body-settings");i.hidden=!e}ShowMainMenu(e){const i=document.querySelector("#clash-main-body-app");i.hidden=!e}async OpenSubMenu(e){const r=window.innerWidth<m.MOBILEWIDTH,s=window.outerHeight-150,l=s>800?700:s-100;r?await p.popover.open({id:m.EXTENSIONSUBMENUID,url:`/submenu/subindex.html?unitid=${e}&sceneid=${this.sceneId}`,height:l,width:325,hidePaper:!0}):await p.modal.open({id:m.EXTENSIONSUBMENUID,url:`/submenu/subindex.html?unitid=${e}&sceneid=${this.sceneId}`,height:l,width:350})}setupContextMenu(e){f.inMemory||p.contextMenu.create({id:`${m.EXTENSIONID}/context-menu-sheet`,icons:[{icon:"/sheet.svg",label:"[Clash!] View Info",filter:{max:1,every:[{key:"layer",value:"CHARACTER"}]}},{icon:"/multi-sheet.svg",label:"[Clash!] View Info",filter:{min:2,every:[{key:"layer",value:"CHARACTER"}]}}],async onClick(i,r){if(i.items.length==1){const s=i.items[0],l=s.text?.plainText||s.name;if(!await f.ActiveEncounter.get(s.id)){let d=new M(s.id,l);if(m.ALPHANUMERICTEXTMATCH.test(l)){const c=l.slice(0,-2),I=await f.Creatures.get({unitName:c});I&&d.SetToModel(I)}else{const c=await f.Creatures.get({unitName:l});c&&d.SetToModel(c)}await d.SaveToDB(e.sceneId)}const t=100,n=window.outerHeight-150,o=n>800?700:n-t;await p.popover.open({id:m.EXTENSIONSUBMENUID,url:`/submenu/subindex.html?unitid=${s.id}&sceneid=${e.sceneId}`,height:o,width:325,anchorElementId:r,hidePaper:!0})}else{for(const o of i.items){const d=o,c=d.text?.plainText||d.name;if(!await f.ActiveEncounter.get(o.id)){let v=new M(o.id,c);if(m.ALPHANUMERICTEXTMATCH.test(c)){const C=c.slice(0,-2),y=await f.Creatures.get({unitName:C});y&&v.SetToModel(y)}else{const C=await f.Creatures.get({unitName:c});C&&v.SetToModel(C)}await v.SaveToDB(e.sceneId)}}const s=i.items.map(o=>o.id).toString(),l=i.items.map(o=>o.metadata[`${m.EXTENSIONID}/metadata_initiative`]!==void 0).toString(),a=100,t=window.outerHeight-150,n=t>800?700:t-a;await p.popover.open({id:m.EXTENSIONSUBMENUID,url:`/submenu/subindex.html?unitid=${s}&unitactive=${l}&multi=true&sceneid=${e.sceneId}`,height:n,width:325,anchorElementId:r,hidePaper:!0})}}}),p.contextMenu.create({id:`${m.EXTENSIONID}/context-hp-menu`,icons:[{icon:"/health.svg",label:"[Clash!] Show HP Bar",filter:{every:[{key:"layer",value:"CHARACTER"},{key:["metadata",`${m.EXTENSIONID}/metadata_hpbar`],value:void 0},{key:["metadata",`${m.EXTENSIONID}/metadata_initiative`],value:void 0,operator:"!="}]}},{icon:"/health-black.svg",label:"[Clash!] Hide HP Bar",filter:{every:[{key:"layer",value:"CHARACTER"},{key:["metadata",`${m.EXTENSIONID}/metadata_hpbar`],value:void 0,operator:"!="}]}}],async onClick(i){if(i.items.every(s=>s.metadata[`${m.EXTENSIONID}/metadata_hpbar`]===void 0)){const l=[];await p.scene.items.updateItems(i.items,a=>{for(let t of a){const n=t,o=e.unitsInScene.find(d=>d.id===t.id);o&&(t.metadata[`${m.EXTENSIONID}/metadata_hpbar`]={showHpBars:!0},l.push(L.UpdateHPBar(n,o.currentHP,o.maxHP)))}}),await p.scene.items.addItems(l)}else{const s=i.items.map(l=>l.id+"_hpbar");await p.scene.items.deleteItems(s),await p.scene.items.updateItems(i.items,l=>{for(let a of l)delete a.metadata[`${m.EXTENSIONID}/metadata_hpbar`]})}}}),p.contextMenu.create({id:`${m.EXTENSIONID}/context-menu`,icons:[{icon:"/addunit.svg",label:"[Clash!] Add to Initiative",filter:{every:[{key:"layer",value:"CHARACTER"},{key:["metadata",`${m.EXTENSIONID}/metadata_initiative`],value:void 0}]}},{icon:"/removeunit.svg",label:"[Clash!] Remove from Initiative",filter:{every:[{key:"layer",value:"CHARACTER"}]}}],async onClick(i){const r=e.sceneId,s=i.items.every(a=>a.metadata[`${m.EXTENSIONID}/metadata_initiative`]===void 0),l=i.items;if(s){for(const a of l){const t=a.text?.plainText||a.name;if(await f.ActiveEncounter.get(a.id))f.ActiveEncounter.update(a.id,{isActive:1});else{let o=new M(a.id,t,a.createdUserId);if(m.ALPHANUMERICTEXTMATCH.test(a.name)){const d=t.slice(0,-2),c=await f.Creatures.get({unitName:d});c&&o.SetToModel(c)}else{const d=await f.Creatures.get({unitName:t});d&&o.SetToModel(d)}o.isActive=1,o.SaveToDB(e.sceneId)}}await p.scene.items.updateItems(l,a=>{for(let t of a)t.metadata[`${m.EXTENSIONID}/metadata_initiative`]={initiative:r}})}else{const a=i.items.map(t=>t.id+"_hpbar");await p.scene.items.deleteItems(a),await p.scene.items.updateItems(i.items,t=>{for(let n of t)delete n.metadata[`${m.EXTENSIONID}/metadata_initiative`],delete n.metadata[`${m.EXTENSIONID}/metadata_hpbar`]});for(const t of l)await f.ActiveEncounter.update(t.id,{isActive:0})}}})}}function X(){const u=document.createElement("li");return u.id="",u.textContent="No Owner",u}function ae(){document.getElementById("contextMenu").style.display="none"}class se{roundCounter=1;turnCounter=1;enableAutoFocus=!1;lastUpdate="";playerId="";playerColor="";party=[];rendered=!1;async Render(e){e.querySelector("#clash-main-body-app").innerHTML=`
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
            `;var i=this;const r=e.getElementById("settingnoFocusContainer"),s=e.createElement("input");s.type="checkbox",s.value=String(this.enableAutoFocus),s.checked=this.enableAutoFocus,s.onclick=async function(t){const n=t.target;s.value=String(n.checked),i.enableAutoFocus=n.checked},r?.insertBefore(s,r.firstChild),this.playerId=await p.player.getId(),this.playerColor=await p.player.getColor(),this.party=await p.party.getPlayers();const l=await p.theme.getTheme();O(l,e),this.SetupListeners();const a=await p.scene.getMetadata();await this.RefreshList(a),this.rendered=!0}async RefreshList(e){const i=this,s=e[`${m.EXTENSIONID}/metadata_trackeritem`]?.Tracker;if(!s||!s.units||s.lastUpdate==this.lastUpdate)return;this.lastUpdate=s.lastUpdate;const l=document.querySelector("#unit-list");if(s.gmHideAll){l.innerHTML="";return}const a=s.gmReverseList?s.units.sort((t,n)=>t.initiative-n.initiative||t.name.localeCompare(n.name)):s.units.sort((t,n)=>n.initiative-t.initiative||t.name.localeCompare(n.name));for(this.roundCounter=s.round,this.turnCounter=s.turn;l.rows.length>0;)l.deleteRow(0);for(const t of a){let n=l.insertRow(-1);if(t.owner===this.playerId){const o=V(this.playerColor,.4);n.setAttribute("unit-id",t.id);let d=n.insertCell(0);d.style.placeContent="center";const c=document.createElement("input");c.className="InitiativeInput wide",c.inputMode="numeric",c.value=t.initiative.toString(),c.id=`iI${t.id}`,c.size=2,c.min="0",c.max="99",c.maxLength=2,c.onblur=function(h){const g=h.currentTarget;g.value&&i.SendUpdate({id:g.id.substring(2),initiative:+g.value})},c.onkeydown=function(h){if(h.key!=="Enter")return;const g=h.currentTarget;g.value&&i.SendUpdate({id:g.id.substring(2),initiative:+g.value})};let I=n.insertCell(1);I.style.placeContent="center",I.style.textOverflow="ellipsis",I.style.overflow="hidden",I.style.whiteSpace="nowrap",I.className="nameToggleInput",I.style.background=`linear-gradient(200deg, transparent, ${o})`;let v=n.insertCell(2);const C=document.createElement("input");C.className="HealthInput",C.inputMode="numeric",C.id=`cHP${t.id}`,C.title=t.cHp.toString(),C.value=t.cHp.toString(),C.size=4,C.maxLength=4,C.onblur=function(h){const g=h.currentTarget,S=g.value;if(S.substring(0,1)=="+"){const x=S.substring(S.indexOf("+")+1);C.value=(+x+ +C.title).toString(),C.title=C.value,h.preventDefault()}else if(S.substring(0,1)=="-"){const x=S.substring(S.indexOf("-")+1);C.value=(+C.title-+x).toString(),C.title=C.value,h.preventDefault()}g.value&&i.SendUpdate({id:g.id.substring(3),cHp:+g.value})},C.onkeydown=function(h){if(h.key!=="Enter")return;const g=h.currentTarget,S=g.value;if(S.substring(0,1)=="+"){const x=S.substring(S.indexOf("+")+1);C.value=(+x+ +C.title).toString(),C.title=C.value,h.preventDefault()}else if(S.substring(0,1)=="-"){const x=S.substring(S.indexOf("-")+1);C.value=(+C.title-+x).toString(),C.title=C.value,h.preventDefault()}g.value&&i.SendUpdate({id:g.id.substring(3),cHp:+g.value})};const y=document.createElement("input");y.className="HealthInput",y.inputMode="numeric",y.id=`mHP${t.id}`,y.value=t.mHp.toString(),y.size=4,y.maxLength=4,y.onblur=function(h){const g=h.currentTarget;g.value&&i.SendUpdate({id:g.id.substring(3),mHp:+g.value})},y.onkeydown=function(h){if(h.key!=="Enter")return;const g=h.currentTarget;g.value&&i.SendUpdate({id:g.id.substring(3),mHp:+g.value})};let H=n.insertCell(3);const b=document.createElement("input");b.className="ArmorInput",b.inputMode="numeric",b.id=`aC${t.id}`,b.value=t.aC.toString(),b.size=2,b.maxLength=2,b.onblur=function(h){const g=h.currentTarget;g.value&&i.SendUpdate({id:g.id.substring(2),aC:+g.value})},b.onkeydown=function(h){if(h.key!=="Enter")return;const g=h.currentTarget;g.value&&i.SendUpdate({id:g.id.substring(2),aC:+g.value})},s.gmHideHp||(t.cHp<=t.mHp/4?I.className=I.className+" unitHarmed":t.cHp<=t.mHp/2?I.className=I.className+" unitHurt":I.className=I.className+" unitHappy"),d.appendChild(c),d.style.width="10%",I.appendChild(document.createTextNode(t.name)),I.style.width="58%",v.appendChild(C),v.appendChild(document.createTextNode("/")),v.appendChild(y),H.appendChild(b),H.style.width="8%"}else{let o=n.insertCell(0);o.style.placeContent="center";let d=n.insertCell(1);d.style.placeContent="center",d.style.textOverflow="ellipsis",d.style.overflow="hidden",d.style.whiteSpace="nowrap",n.setAttribute("unit-id",t.id);const c=document.createElement("input");c.className="HealthInput",c.inputMode="numeric",c.id="cHP"+t.id,c.value=t.cHp.toString(),c.size=4,c.maxLength=4,s.gmHideHp||(t.cHp<=t.mHp/4?d.className="unitHarmed":t.cHp<=t.mHp/2?d.className="unitHurt":d.className="unitHappy"),o.appendChild(document.createTextNode(t.initiative.toString())),o.style.width="10%",d.appendChild(document.createTextNode(t.name)),d.style.width="58%"}}this.AttachFocusListeners(),await this.ShowTurnSelection()}AttachFocusListeners(){const e=document.getElementById("initiative-list");e&&e.addEventListener("dblclick",i);async function i(r){r.preventDefault();const s=r.target.closest("tr"),l=await L.GetCTUFromRow(s);await U.CenterViewportOnImage(l)}}async ShowTurnSelection(){const e=document.getElementById("initiative-list");if(e.rows?.length>1){for(var i=0,r;r=e.rows[i];i++)r.classList.remove("turnOutline");if(this.turnCounter>=e.rows.length&&(this.turnCounter=e.rows.length-1),e.rows[this.turnCounter]){const s=e.rows[this.turnCounter];s.className="turnOutline";const l=document.getElementById("roundCount");l.innerText=`Round: ${this.roundCounter}`;let a=await L.GetCTUFromRow(s);a.visible&&this.enableAutoFocus&&await U.CenterViewportOnImage(a)}}}async SetupListeners(){p.scene.onMetadataChange(e=>this.RefreshList(e)),p.theme.onChange(e=>{O(e,document)}),p.player.onChange(e=>{this.playerColor=e.color}),p.party.onChange(e=>{this.party=e})}async SendUpdate(e){e.stamp=new Date().toISOString();const i={};i[`${m.EXTENSIONID}/metadata_playerItem`]={PlayerUpdate:e},await p.player.setMetadata(i)}}const A=new ie,_=new se,re="whatsnew-clash3";let G=!1,$;const P=document.querySelector("#clash-main-body-app"),F=document.querySelector("#clash-main-body-loading"),oe=f;oe.Ready();P.innerHTML=`
  <div>
    <h1>Loading...</h1>
  </div>
`;F.innerHTML=`
<div>
<h1>Waiting for Scene...</h1>
<div class="imageContainer">
<img class="resize_fit_center" src="logo.png" alt="Clash!" class="center">
</div>
</div>`;p.onReady(async()=>{G=await p.scene.isReady(),await q(G),p.scene.onReadyChange(async u=>{await q(u)})});async function q(u){const e=await p.player.getRole();u?(e==="GM"?(await le(),A.rendered||await A.RenderInitiativeList(document),A.SetupItemOnChangeHandler(),await A.RefreshList()):_.rendered||await _.Render(document),P.hidden=!1,F.hidden=!0,$="",($==="false"||!$)&&(await p.modal.open({id:m.EXTENSIONWHATSNEW,url:"/submenu/whatsnew.html?timer=10",height:500,width:350}),localStorage.setItem(re,"true"))):(typeof A.itemOnChangeHandler=="function"&&A.itemOnChangeHandler(),P.hidden=!0,F.hidden=!1)}async function le(){const u=await p.scene.getMetadata(),e=u[`${m.EXTENSIONID}/metadata_sceneid`];if(A.sceneId=e?.SceneId,!A.sceneId){const s=W(),l={};l[`${m.EXTENSIONID}/metadata_sceneid`]={SceneId:s},await p.scene.setMetadata(l),A.sceneId=s}const r=u[`${m.EXTENSIONID}/metadata_trackeritem`]?.Tracker;r?(A.roundCounter=r.round,A.turnCounter=r.turn):(A.roundCounter=1,A.turnCounter=1)}
