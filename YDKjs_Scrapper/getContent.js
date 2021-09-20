// Dependencies on below modules / libraries
// fs module to work with fileSystem (files and directories)
const fs = require("fs");
// cheerio module for wecontent scrapping 
const cheerio = require("cheerio");
// puppeteer module for automation
const puppeteer = require("puppeteer");
// md-to-pdf will get the markdown data and will convert it into pdf
const {mdToPdf} = require("md-to-pdf");
// Path module to work with paths and for machine independend path
const path = require("path");


async function getAllData(cTab,cPageLink, cNameArray, selector,iter){
    // This function will get the content of all the Chapters present in a book 
    [cPageLink, bookname] = cPageLink;
    try{
        let wholeContent = "";
        bookname = "Book ".concat(iter,bookname.split(")")[1]);
        console.log("Getting data for ", bookname);
        console.log("````````````````````````````````````````````````````````````````````````````````````````````````````````");
        for(let i = 0; i < cNameArray.length; i++){
            console.log("Getting content of ",cNameArray[i])
            await cTab.goto(cPageLink,{waitUntil: 'networkidle0'});
            let cLink =  await cTab.evaluate(consoleFn, selector, cNameArray[i]);
            console.log("Link to Chapter : ", cLink);
            console.log("````````````````````````````````````````````````````````````````````````````````````````````````````````");
            await cTab.goto(cLink,{waitUntil: 'networkidle0'});
            
            let readmeArr = await cTab.$("a#raw-url");
            if(readmeArr != null){
                let mdLink = await cTab.$eval("a#raw-url", (elm) => elm.href);
                await cTab.goto(mdLink,{waitUntil: "networkidle0"})
                let htmlContent = await cTab.content();
                let content = getData(htmlContent,cTab);
                wholeContent+=content;
            }

        }
        let fileName = bookname + ".pdf";
        writeIntoPdf(fileName,wholeContent);
    }catch(err){
        console.log(err);
    }
}

function consoleFn(selector, cName){
    //It will match the Name of the chapter with the innerText of link if matched it will return the link of 
    // the Chapter
        let allC = document.querySelectorAll(selector);
        for(let j = 0; j < allC.length; j++){
            let regex1 = new RegExp(cName.split(/:|\(/)[0].trim(), "i");
            if(allC[j].innerText == cName || (regex1.test(allC[j].innerText))){
                return allC[j].href;
            }
        }
    
}

function getData(htmlContent,cTab){
    // This function will get the data associated with a particular selector and will return it
        let sTool = cheerio.load(htmlContent);
        let content = "";

        content = sTool("body").text().trim(); 

    return content;
}

async function writeIntoPdf(fileName,content){
    // This function will write all the content of a particular book into a pdf and will 
    // store it in YDKjs_1st_Edition folder
    try{
        let dirPath = path.join(process.cwd(),"YDKjs_1st_Edition");
        if(fs.existsSync(dirPath) == false){
            fs.mkdirSync(dirPath);
        }
        let fPath = path.join(dirPath,fileName);
        await mdToPdf({ content: content }, { dest:  fPath});   
    }catch(err){
        console.log(err);
    }

}


module.exports = {
    getAllData:getAllData
}




