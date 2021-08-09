let treeObj = require("./commands/tree.js");
let organizeObj = require("./commands/organize.js");
let helpObj = require("./commands/help.js");

inputArr = process.argv.slice(2)
command = inputArr[0];
path = inputArr[1];
switch (command){
    case "tree" :
        treeObj.treefn(path);
        break;
    case "organize":
        organizeObj.organizefn(path);
        break;
    case "help":
        helpObj.helpfn();
        break;
    default:
        console.log("Please choose correct option");
}
