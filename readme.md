<!--
  Title: terraria player parser
  Description: Terraria player character file parser
  Author: cokolele
  Tags: terraria, player file, file structure, file dumper, file format, documentation, data, parsing, parser, inventory viewer, tool
  -->

# Terraria player parser

Terraria player file parser written in javascript

\- supports only characters created in 1.3.5.3

Feel free to contribute 🧙

## Usage 

```javascript
const terrariaPlayerParser = require("terraria-player-parser.js");

// node
let player = new terrariaPlayerParser(path);
player = player.parse();

// browser
let player = await new terrariaPlayerParser(file);
player = await window.player.parse();

const name = player.name;
const hp = player.statLife;
console.log( `${name} has ${hp} health right now!`);
```

## Functions:

class constructor: new terrariaPlayerParser( path|file )
 \- Opens the file, does not parse it yet

instance method: parse()
 \- Parses the file
 \- Returns an object

## Return object:

Type | Variable | Description
--- | --- | ---
*int32* | version | map file version (not game version)
*7 bytes string* | magicNumber | magic number for file format
*uint8* | fileType | file format type (relogic uses more formats than .wld)
*uint32* | revision | how many times player file was saved (always 0 - works only for maps)
*bool* | favorite | is map favorite (always 0)
*string* | name | is map favorite (always 0)
*uint8* | difficulty | softcore, mediumcore, hardcore
*int64* | playTime | players ingame time (returns 8 bytes array, njs doesn't support int64 natively)
*int32* | hair | hair type
*uint8* | hairDye | hair dye type
*bools array* | hideVisual | is main equip slot hidden (armor + accessories)
*bools array* | hideMisc | is misc equip slot hidden (pet, light, mount ...)
*uint8* | skinVariant | character style
*int32* | statLife | current life amount
*int32* | statLifeMax | max life amount
*int32* | statMana | current mana amount
*int32* | statManaMax | max mana amount
*bool* | extraAccessory | is extra accessory slot activated
*bool* | downedDD2EventAnyDifficulty | has the player downed any old one's army event
*int32* | taxMoney | how many tax money can the player collect already (probably)
*rgb array* | hairColor | color of the hair
*rgb array* | skinColor | color of the skin
*rgb array* | eyeColor | color of the eyes
*rgb array* | shirtColor | color of the shirt
*rgb array* | underShirtColor | color of the under shit
*rgb array* | pantsColor | color of the pants
*rgb array* | shoeColor | color of the shoes
*object array* : | armor | equipped items
\|&nbsp;&nbsp;&nbsp;&nbsp;*int32* | id | item id
\|&nbsp;&nbsp;&nbsp;&nbsp;*uint8* | prefix | prefix id
*object array* : | dye | dyes of armor
\|&nbsp;&nbsp;&nbsp;&nbsp;*int32* | id | item id
\|&nbsp;&nbsp;&nbsp;&nbsp;*uint8* | prefix | prefix id
*object array* : | inventory | items in player inventory
\|&nbsp;&nbsp;&nbsp;&nbsp;*int32* | id | item id
\|&nbsp;&nbsp;&nbsp;&nbsp;*int32* | stack | stack size
\|&nbsp;&nbsp;&nbsp;&nbsp;*uint8* | prefix | prefix id
\|&nbsp;&nbsp;&nbsp;&nbsp;*boolean* | favorited | is favorite checked
*object array* : | miscEquips | equipped misc (pet, light, mount ...)
\|&nbsp;&nbsp;&nbsp;&nbsp;*int32* | id | item id
\|&nbsp;&nbsp;&nbsp;&nbsp;*uint8* | prefix | prexif id
*object array* : | miscDyes | dyes of misc
\|&nbsp;&nbsp;&nbsp;&nbsp;*int32* | id | item id
\|&nbsp;&nbsp;&nbsp;&nbsp;*uint8* | prefix | prexif id
*object array* : | bank | safe inventory
\|&nbsp;&nbsp;&nbsp;&nbsp;*int32* | id | item id
\|&nbsp;&nbsp;&nbsp;&nbsp;*int32* | stack | stack size
\|&nbsp;&nbsp;&nbsp;&nbsp;*uint8* | prefix | prefix id
*object array* : | bank2 | piggy bank inventory
\|&nbsp;&nbsp;&nbsp;&nbsp;*int32* | id | item id
\|&nbsp;&nbsp;&nbsp;&nbsp;*int32* | stack | stack size
\|&nbsp;&nbsp;&nbsp;&nbsp;*uint8* | prefix | prexif id
*object array* : &nbsp; &nbsp;| bank3 | defender's forge inventory
\|&nbsp;&nbsp;&nbsp;&nbsp;*int32* | id | item id
\|&nbsp;&nbsp;&nbsp;&nbsp;*int32* | stack | stack size
\|&nbsp;&nbsp;&nbsp;&nbsp;*uint8* | prefix | prexif id
*int32 array* | buffType | ids of buffs
*int32 array* | buffTime | time lefts of buffs
*int32 array* | spX | X position of the spawn point (each array index is one exact map)
*int32 array* | spY | Y position of the spawn point (^)
*int32 array* | spI | ID of the spawn point map (^)
*int32 array* | spN | name of the spawn point map (^)
*bool* | hbLocked | is hot bar locked
*bool array* | hideInfo | is informationals item info hidden (depth, dps, weather...)
*bool* | hbLocked | is hot bar locked
*int32* | anglerQuestsFinished | number of finished anglers quests
*int32 array* | DpadRadualBindings | ?
*int32 array* | builderAccStatus | ?
*int32* | bartenderQuestLog | when the player clicks "eternia crystal" for the first time, he gets reward -- has the player got it, 0 or 1