
let request = require("request");
let cheerio = require("cheerio");
let scObj = require("./scoreCard");

let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
request(url, cb);
function cb(error , response, html){
    if(error){
        console.log(error);
    }else if(response.statusCode == 404){
        console.log("Page Not Found");
    }else{
        dataExtractor(html);
    }
}
function dataExtractor(html){
    let searchTool = cheerio.load(html);
    let anchorrep = searchTool('a[data-hover="View All Results"]');
    let link = anchorrep.attr("href");
    // console.log(link);
        // let homepage = acho
    let fullLink = `https://www.espncricinfo.com${link}`
    request(fullLink, mainPageCb);
}
function mainPageCb(error, response, html){
    if(error){
        console.log(error);
    }else if(response.statusCode == 404){
        console.log("Page Not Found");
    }else{
        // console.log(html);
        getAllScoreCard(html);
    }    
}
function getAllScoreCard(html){
    searchTool = cheerio.load(html);
    screpr = searchTool('a[data-hover="Scorecard"]');

    // console.log(screpr.text());
    for(let i = 0; i < screpr.length; i++){
        let link = searchTool(screpr[i]).attr("href");
        let fullLink = `https://www.espncricinfo.com${link}`
        // console.log(link);
        // request(fullLink, indivScorecb);
        scObj.sc(fullLink);
    }
}
// function indivScorecb(error, response, html){
//     if(error){
//         console.log(error);
//     }else if(response.statusCode == 404){
//         console.log("Page Not Found");
//     }else{
//         // console.log(html);
//         scObj.sc(html);
//     }        
// }
// function getScorecardData(html){
//     searchTool = cheerio.load(html);
//     matcharray = searchTool(".match-header .name-detail .name-link p");
//     scoreTable = searchTool("table batsman");
//     // teamNames = matcharray.attr("alt");
//     console.log(searchTool(matcharray[0]).text());
//     console.log(searchTool(matcharray[1]).text());
// }

