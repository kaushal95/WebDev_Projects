const fs = require("fs");
const cheerio = require("cheerio");
const { pdfkit } = require("pdfkit");
const puppeteer = require("puppeteer");
const {getAllData} = require("./getContent")

let cTab;
let link = "https://github.com/getify/You-Dont-Know-JS/tree/1st-ed";

(async function(){
    try{
        let browserOpen = puppeteer.launch({
            headless: false, 
            // 1 sec
            // slowMo : 1000,
            defaultViewport: null,
            args: ["--start-maximized", "--disable-notifications"]

        })

        let browserInstance = await browserOpen;
        let allTabsArray = await browserInstance.pages();
        cTab = allTabsArray[0];
        await cTab.goto(link);

        await cTab.waitForSelector('.markdown-body.entry-content.container-lg > ul > li > a');
        let [numBooks,nameBooks, bookLinkArr] = await getNumBooks(".markdown-body.entry-content.container-lg > ul > li");
        // console.log(numBooks, nameBooks, bookLinkArr);
        for(let i = 0; i < bookLinkArr.length; i++){
            // await cTab.click(".markdown-body.entry-content.container-lg > ul > li > a");
            cTab.goto(bookLinkArr[i],{waitUntil: 'networkidle0'});
            await cTab.waitForSelector(".markdown-body.entry-content.container-lg > ul > li > a");
            let [numLessons,nameLessons, lessonLinkArr] = await getNumBooks(".markdown-body.entry-content.container-lg > ul > li");
            // console.log(numLessons, nameLessons, lessonLinkArr);
            await getAllData(cTab,[bookLinkArr[i],nameBooks[i]],nameLessons,".markdown-body.entry-content.container-lg > ul > li > a",i+1);
        }
        await browserInstance.close()
   
    }catch(err){
        console.log(err);
    }
})();

async function getNumBooks(selector){
    // await cTab.waitForSelector('#thumbnail .yt-simple-endpoint.inline-block.style-scope.ytd-thumbnail');
    let [length, titleArray,linkArray] = await cTab.evaluate(getLength, selector);
    return [length, titleArray, linkArray];
}

function getLength(selector){
    let lengtharray = document.querySelectorAll(selector);
    let anchArray = document.querySelectorAll((selector + " > a"));
    titleArray = [];
    linkArray = [];
    for(let i = 0; i < lengtharray.length; i++){
        titleArray.push(lengtharray[i].innerText);
    }
    for(let i = 0; i < anchArray.length; i++){
        if(anchArray[i].href.search(/github.com/i) != -1){
            linkArray.push(anchArray[i].href);
        }
    }
    return [lengtharray.length, titleArray,linkArray];
}
