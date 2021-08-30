// To work with FileSystems
let fs = require("fs");
// To work with directory and Filepaths
let path = require("path");
let cheerio = require("cheerio");
// To request/hit the website
let request = require("request");

let issuePageObj = require("./Issues");
// let dirPath;
function topicLinks(topicUrl,dirPath){
    // dirPath = dirpath;
    request(topicUrl, function topicCb(err, response, html){
        //Callback function for github request
        if(err){
            console.log(err);
        }else if(response.statusCode == 404){
            console.log("Page Not Found");
        }else{
            topicIssues(html,dirPath);
        }    
    }
    );


}

function topicIssues(html,dirPath){
    let st = cheerio.load(html);
    // let repoList = st(".border.rounded.color-shadow-small.color-bg-secondary.my-4");
    let repoList = st(".f3.color-text-secondary.text-normal.lh-condensed");
    //-> can be used to find name 
    let issueUrlArr = st(".tabnav-tabs");
    console.log(repoList.length);
    //issues-tab (can use to find this issue tab)
    for(let i = 0; i < repoList.length && i < 8; i++){
        let name = st(repoList[i]);

        name = st(name[0]).text().split("/").pop().trim();
        console.log(name);
        // let repoPath = path.join(dirPath,name);
        let issueUrl = st(issueUrlArr[i]).find("a");
        issueUrl = st(issueUrl[1]).attr("href");
        fullIssueUrl = `https://github.com${issueUrl}`;
        // request(fullIssueUrl,cb2);

        console.log(fullIssueUrl);
        issuePageObj.issueUrl(fullIssueUrl,dirPath,name);
    }
    // console.log(repoList.length);
}



module.exports = 
{topicLinks}
//