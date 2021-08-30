// To work with FileSystems
let fs = require("fs");
// To work with directory and Filepaths
let path = require("path");
// To create/ work with pdf
let pdfkit = require("pdfkit");

let cheerio = require("cheerio");
// To request/hit the website
let request = require("request");

// let repoPath,topic;

function issueUrl(url,repoPath,topic){
    request(url,function issueCb(err, response, html){
        //Callback function for github request
        if(err){
            console.log(err);
        }else if(response.statusCode == 404){
            console.log("Page Not Found");
        }else{
            issueLister(html,repoPath,topic);
        }    
    });
}

function issueLister(html,repoPath,topic){
    let $ = cheerio.load(html);
    let issueList = $('a[data-hovercard-type="issue"]');
    let issueArr = [];
    for(let i = 0; i < issueList.length; i++){
        console.log("````````````````````````````````````````");
        let issueUrl = $(issueList[i]).attr("href");
        let name = $(issueList[i]).text();
        issueArr.push(name);
        issueArr.push(issueUrl);
        console.log(issueUrl);
        console.log(name);
    }
    dirCreater(repoPath);
    let text = JSON.stringify(issueArr);
    // let filePath = path.join(repoPath,topic +'.txt');
    // fs.writeFileSync(filePath, text);
    let pdfDoc = new pdfkit();
    let filePath = path.join(repoPath,topic +'.pdf');
    pdfDoc.pipe(fs.createWriteStream(filePath));
    pdfDoc.text(text);
    pdfDoc.end();
}



function dirCreater(filepath){
    // creates directory at given path & name
    if(fs.existsSync(filepath)==false){
        fs.mkdirSync(filepath);
    }
}
module.exports = {issueUrl};
