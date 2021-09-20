// const HTMLToPDF = require('convert-html-to-pdf').default;
// var markdownpdf = require("markdown-pdf")
const cheerio = require("cheerio");
const fs = require("fs");
const pdfkit = require("pdfkit");
const puppeteer = require("puppeteer");
const {mdToPdf} = require("md-to-pdf");
const path = require("path");


async function getAllData(cTab,cPageLink, cNameArray, selector,iter){
    [cPageLink, bookname] = cPageLink;
    try{
        let wholeContent = "";
        // console.log("out",selector,cPageLink, cNameArray);
        bookname = "Book ".concat(iter,bookname.split(")")[1]);
        console.log("Getting data for ", bookname);
        console.log("````````````````````````````````````````````````````````````````````````````````````````````````````````");
        for(let i = 0; i < cNameArray.length; i++){
            console.log("Getting content of ",cNameArray[i])
            await cTab.goto(cPageLink,{waitUntil: 'networkidle0'});
            // cTab.waitForSelector(selector);
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
        let allC = document.querySelectorAll(selector);
        for(let j = 0; j < allC.length; j++){
            let regex1 = new RegExp(cName.split(/:|\(/)[0].trim(), "i");
            if(allC[j].innerText == cName || (regex1.test(allC[j].innerText))){
                return allC[j].href;
            }
        }
    
}

function getData(htmlContent,cTab){
        let sTool = cheerio.load(htmlContent);
        let content = "";

        content = sTool("body").text().trim(); 

    return content;
}

async function writeIntoPdf(fileName,content){
    let dirPath = path.join(process.cwd(),"YDKjs_1st_Edition");
    if(fs.existsSync(dirPath) == false){
        fs.mkdirSync(dirPath);
    }
    let fPath = path.join(dirPath,fileName);
    
    // await fs.promises.writeFile(fpath,wholeContent);
    await mdToPdf({ content: content }, { dest:  fPath});

}


module.exports = {
    getAllData:getAllData
}




