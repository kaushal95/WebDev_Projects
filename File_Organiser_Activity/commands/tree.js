let fs = require("fs");
let path = require("path");
function tfn (address) {
    dirArray = fs.readdirSync(address);
    console.log("|--" + address);
    for(let i = 0; i < dirArray.length; i++){

        console.log("       |---" +dirArray[i]);
    }
    console.log("tree  command executed with path: " + address);
}

module.exports = {
    treefn : tfn
}