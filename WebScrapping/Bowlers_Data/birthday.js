// install request module with the help of npm
let fs = require("fs");
let request = require("request");
let cheerio = require("cheerio");
let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/royal-challengers-bangalore-vs-sunrisers-hyderabad-eliminator-1237178/full-scorecard";
let bowlersArr = [];
let bowlersCount = 0;
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
    for(let i = 0; i < bowlers.length; i++){
        let cols = searchTool(bowlers[i]).find("td");
        if(cols.length > 1){
            bowlersCount++;

        }
    }

    // for data of bowlers 
    // looop
    // compare -> hwt find
    for(let i = 0; i < bowlers.length; i++){
        // row - > col means cols in row 
        let cols = searchTool(bowlers[i]).find("td");
        if(cols.length > 1){
            let aElem = searchTool(cols[0]).find("a");
            let link = aElem.attr("href");
            //link 
            // new page -> link get -> complete -> request
            let fullLink = `https://www.espncricinfo.com/${link}`;
            request(fullLink, newcb);
        }

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
        // console.log("`````````````````````````````````````````")
        getBirthDay(html);
        if(bowlersArr.length == bowlersCount){
            console.table(bowlersArr);
            let sortedArray = sortArray(bowlersArr);
            console.table(sortedArray);
        }
        
    }
}
function getBirthDay(html){
    let searchTool = cheerio.load(html);
    let elemRepresentativeArray = searchTool(".player-card-description");
    let name = searchTool(elemRepresentativeArray[0]).text();
    let age = searchTool(elemRepresentativeArray[2]).text();
    bowlersArr.push({name, age});
    // console.log(name +" "+age);
}
function sortArray(bowlersArr){
    bowlersArray = bowlersArr.sort(comparator);
    return bowlersArr;
}
function comparator(objA,objB){
       let ageArrayA = objA.age.split(" "); 
       let ageArrayB = objB.age.split(" ");
       let yearsofAgeA = Number(ageArrayA[0].substring(0, ageArrayA[0].length - 1));
       let yearsofAgeB = Number(ageArrayB[0].substring(0, ageArrayB[0].length - 1));
       let numDaysA = Number(ageArrayA[1].substring(0, ageArrayA[1].length - 1));
       let numDaysB = Number(ageArrayB[1].substring(0, ageArrayB[1].length - 1));
       return yearsofAgeA - yearsofAgeB || numDaysA - numDaysB;


}
