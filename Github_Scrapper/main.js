// To work with FileSystems
let fs = require("fs");
// To work with directory and Filepaths
let path = require("path");
// To format and work  with Website data
let cheerio = require("cheerio");
// To request/hit the website
let request = require("request");

// let dirCreaterObj = require("./Issues");

let topicsObj = require("./topics");

let url = "https://github.com/topics";
request(url,cb);

function cb(err, response, html){
    //Callback function for github request
    if(err){
        console.log(err);
    }else if(response.statusCode == 404){
        console.log("Page Not Found");
    }else{
        dataExtracter(html);
    }
    
}

function dataExtracter(html){
    //extracts data from html
    let st = cheerio.load(html);
    //Selects the whole topic area i.e unordered list
    let topicRepr = st(".d-flex.flex-wrap.flex-justify-start.flex-items-stretch.list-style-none.gutter.my-4");
    // getting array of topic , 3 topics
    let topicArr = topicRepr.find(".no-underline.d-flex.flex-column.flex-justify-center");
    for(let i = 0; i < topicArr.length; i++){
        let anchorRep = st(topicArr[i]).attr("href");
        let name = st(topicArr[i]).find("img").attr("alt");
        let fullLink = `https://github.com${anchorRep}`;
        console.log(name);
        let dirPath = path.join(process.cwd(), name);
        // dirCreater(dirPath);
        console.log(fullLink);
        topicsObj.topicLinks(fullLink, dirPath);
    }

    // fs.writeFileSync('sample.html',topicRepr.html());
}

function dirCreater(filepath){
    // creates directory at given path & name
    if(fs.existsSync(dirCreater)==false){
        fs.mkdirSync(filepath);
    }
}
