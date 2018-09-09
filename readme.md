<!--
  Title: terraria player parser
  Description: Terraria player character file parser
  Author: cokolele
  Tags: terraria, player file, file structure, file dumper, file format, documentation, data, parsing, parser, inventory viewer, tool
  -->

# Terraria player parser

JavaScript based Terraria player character file parser for Node.js

\- supports only characters generated in 1.3.5.3

Feel free to contribute 🧙

## Usage 

```javascript
const terrariaPlayerParser = require("./terraria-player-parser.js");

try {

    let player = new terrariaPlayerParser("./Wizard.plr");
    player = player.Load();

    const name = player.name; //todo
    const size = player.header.maxTilesX + "x" + player.header.maxTilesY;
    console.log( `Size of ${name} is ${size}`);

} catch (e) {
    console.log(e.message)
}
```

Other examples in /examples directory:

\- todo

\- todo

## Functions:

  class constructor: new terrariaPlayerParser( "./path/to/file.plr" )
 - Opens the file, does not parse it yet


  instance method: Load()
 - Parses the file
 - Returns an object

## Return object:

//todo

***object* fileFormatHeader**

Type | Variable | Description
--- | --- | ---
*int32* | version | map file version (not game version)
*7 bytes string* | magicNumber | magic number for file format
*int8* | fileType | file format type (relogic uses more formats than .wld)
*uint32* | revision | how many times this map was opened ingame
*uint64* | favorite | is map favorite (always 0)
*int32 array* | pointers | memory pointers for sections
*bool array* | importants | tile frame important for blocks (animated, big sprite, more variants...)<br>\- contains *null*s instead of *false*s<br>\- array entry number == block id