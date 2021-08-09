// install request module with the help of npm
let request = require("request");
let cheerio = require("cheerio");
let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/rajasthan-royals-vs-sunrisers-hyderabad-40th-match-1216518/ball-by-ball-commentary";
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

    let elemRepresentativeArray = searchTool(".match-comment-wrapper .match-comment-long-text p");
    // let elemRepresentativeArray = searchTool(".match-comment-wrapper");
    console.log(elemRepresentativeArray);// behid the scenes it's an object 
    //text
    // cram this 
    let lbc = searchTool(elemRepresentativeArray[0]).text();
    console.log( "lbc "+lbc);
}
console.log("after")
