// install request module with the help of npm
let fs = require("fs");
let request = require("request");
let cheerio = require("cheerio");
let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/royal-challengers-bangalore-vs-sunrisers-hyderabad-eliminator-1237178/full-scorecard";
request(url,cb);
function cb(error,response,html){
    // console.error('error', error)
    //console.log('body ', html)

    if(error){
        console.log(error); // Print the error if one occured
    }else if (response.statusCode==404){
        console.log("Page Not Found")
    }
    else{
        // console.log(html);
        // console.log("html",)
        dataExtractor(html);
    }
}
console.log("after");

function dataExtractor(html){
    //search tool
    let searchTool = cheerio.load(html);
    // css selector -> elem
    // glbal tool 
    // page -> tables -> row get
    let bowlers = searchTool(".table.bowler tbody tr");


    //for bowler tables
    // let bowlerTables = searchTool(".table.bowler");    
    // let htmlData = "";
    // for(let i = 0; i < bowlerTables.length; i++){
    //     // html function
    //     htmlData += searchTool(bowlerTables[i]).html();
    // }
    // fs.writeFileSync("table.html", htmlData);


    // for data of bowlers 
    // looop
    // compare -> hwt find
    for(let i = 0; i < bowlers.length; i++){
        // row - > col means cols in row 
        let cols = searchTool(bowlers[i]).find("td");
        let aElem = searchTool(cols[0]).find("a");
        let link = aElem.attr("href");
        //link 
        // new page -> link get -> complete -> request
        let fullLink = `https://www.espncricinfo.com/${link}`;
        request(fullLink, newcb);
    }
}

function newcb(error, response, html){
    if(error){
        console.log(error); // Print the error if one occured
    }else if (response.statusCode==404){
        console.log("Page Not Found")
    }
    else{
        // console.log(html);
        // console.log("html",)
        console.log("`````````````````````````````````````````")
        getBirthDay(html);
    }
}
function getBirthDay(html){
    let searchTool = cheerio.load(html);
    let elemRepresentativeArray = searchTool(".player-card-description");
    let name = searchTool(elemRepresentativeArray[0]).text();
    let age = searchTool(elemRepresentativeArray[2]).text();
    console.log(name +" "+age);
    


}
