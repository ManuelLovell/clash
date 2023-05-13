---
title: Clash!
description: Full-featured initiative tracking and creature management
author: Battle-System
image: https://battle-system.com/owlbear/clash-docs/preview.png
icon: https://battle-system.com/owlbear/clash-docs/logo.png
tags:
  - tool
  - combat
manifest: https://clash.battle-system.com/manifest.json
learn-more: manuel@battle-system.com
---

# Clash! Initiative Tracker

Track the turn-order and abilities of unit's in combat.  In addition to the base initiative list, you can also customize creature stat blocks (Designed for 5e) and save/share the data.
(Note: If you have LocalStorage disabled, you will not be able to use/save the UnitInformation features. You can still use the Initiative tracker though!)

**Getting Familiar**


![context menu](https://battle-system.com/owlbear/clash-docs/menuview.png)


You can add a unit to the Initiative List by clicking on a character token and selecting the Add icon.

1. **Add to Initiative**. This will add a creature to the Initiative List. Click again to remove.

2. **View UnitInfo**. This will show you the Info Card for this particular token. Useful if you want to store some data while not having them in the initiative yet.


![main view](https://battle-system.com/owlbear/clash-docs/mainview.png)


The main window is where you'll have most of your information at a glance, as well as some quick-access controls for getting things in order.

1. **Initiative inputs**. You can manually enter the numbers into these fields if you want. Alternatively, you can click the dice and it will roll a D20 and add the unit's dexterity modifier, if applicable.

2. **Unit Name toggle**.  While also showing a unit's name, if you click on this - it'll turn the name red.  Which is a quick indication that this is a 'monster'. When used in combination with the Red Dice button at the top, you can roll initiative for all of your monsters at once!

3. **Unit Health inputs**. At it's base, the left is where you would record Current HP and the right is Maximum HP.  The left also doubles as a basic calculator. If the current HP is set to 200, and you type in '+50' or '-50', it will calculate the result for you. (This only works with basic addition and subtraction.)

4. **Save button**.  Clash stores data in your browser's local storage. So as long as you have that enabled, you can save your initiative data and unit data for later use.

5. **Previous/Next buttons**. These will increment or decrement the current turn, highlighting the next unit whose turn it is in the list.

*Note: The Save/Next/Previous buttons will ALSO send turn information to the player's in your room, where they can see the turn-order as well as rough HP indications. (A unit's name will display in red for them if the unit is under 25% HP and yellow if the unit is under 50% hp. This can be turned off in Settings.*

6.  **Reset Round**. This will reset the list back to Turn 1, Round 1.

    **Clear List**. This will clear unit's from the Initiative List, leaving it blank.

	**Settings**. This will take you to the Settings page.


![sub view](https://battle-system.com/owlbear/clash-docs/subview.png)


**Unit Information**

The sub window is where you can assign specific information for a unit. It's designed for 5e and holds a lot of information for a small space. The controls are somewhat contextual, but easy to grasp.

1.  **Unit Info button**. Clicking this on the Initiative List will open up the Information block for that unit.

2.  **Menu buttons**. These help move around the information presented on this submenu.

*  Heart Icon - Toggling this on will 'Favorite' an info card when you export it to collection. Your favorites will appear automatically when you Search Monster Data, before searching (indicated with a Heart). To unfavorite, save to collection again with the heart toggle turned off.

* Folder Icon - Clicking this will save the info card to your personal Collection, where you can Search for it later and apply to different units.

* Export Icon - This will copy the particular info card into your clipboard in JSON format, where you can share it with others - or just put it in a text file for yourself.

* Save Icon - This saves any changes made on this form. Any updates made to this sheet are not saved/finalized until the card is saved. Clicking away before saving will lose changes. 

3. **Rollables**. All information on the info card is edit-able, but information in a red-rounded box is also rollable. Click on the box to have it roll for you, displaying the 
information in an OBR Notification.

4. **Action Rollables**. These work the same way the attribute rollables work, but with an extra bonus. Any information formatted as (#d#+#) in an action's description will be 
automatically formatted into a rollable. So when creating your own skills, try adding something like (2d6+6) and let it create the button for you.

5. **Add Actions**. This will  put another Action into list for you to customize.

6. **Data buttons**. These will let you quickly get data populated into the card.

* Search Monster Data - In addition to being able to search your own collection of saved units, this will also search Open5E's database for applicable monsters from the SRD.

* Import Custom JSON - This will let you dump a JSON blob and instantly have it set up on a unit. An easy way to get in a unit someone has shared with you. 


![settings view](https://battle-system.com/owlbear/clash-docs/settingsview.png)


**Settings**

Settings will let you customize some features, export/import data and tinker with the view that you and your players can see.

* Export Data. Save your entire collection to a text file that can be shared with others, or backed up if you need to clear your browser cache.

* Import Data. Reads the file-types from Export. This will overwrite any existing units if they share an exact NAME and DATASLUG (Dataslug is generally the Author's name.) So a 
Werewolf created by "Jim" is in your collection, and a mass import includes a Werewolf created by "Benson" - they will be two separate units.

* Delete Data. This will nuke your database, starting you from scratch.

* Hide HP. This will remove the color-warnings on the player-end of Clash that shows how low a unit's HP is.

* Hide-All. This will hide the entire list from on the player-end. Use this if you want to set things up without them knowing, and then turn it off for a big reveal.

* Reverse Initiative. Some people wanted it in reverse. 🤷

* Disable Camera. This will stop the camera from centering on a unit when the Next/Previous buttons are pushed.

* Disable Label. This will remove the label that appears on the unit whose turn it is.  The text box next to it allows you to customize that label to say whatever you would prefer.

![player view](https://battle-system.com/owlbear/clash-docs/playerview.png)

Happy gaming.

**Support**

If you have questions, please join the [Owlbear Rodeo Discord](https://discord.gg/UY8AXjhzhe).


**Changes**

- v1.0.5 - Light/Dark mode can be toggled via the Owlbear settings.
         - Group-Edit has been added, select a group of units and assign information all at once - once saved, the resulting units will have iterating letters at the end to differentiate. (Wolf A, Wolf B, Wolf C, etc..)

![group view](https://battle-system.com/owlbear/clash-docs/groupview.png)
