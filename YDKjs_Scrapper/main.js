
//Dependencies on below modules/libraries

// fs module to work with fileSystem (files and directories)
const fs = require("fs");
// cheerio module for wecontent scrapping 
const cheerio = require("cheerio");
// puppeteer module for automation
const puppeteer = require("puppeteer");
// getAllData will get Data of all the books and store them in pdf
const {getAllData} = require("./getContent")

let cTab;
// link to mainPage/Starting page of repo
let link = "https://github.com/getify/You-Dont-Know-JS/tree/1st-ed";

(async function(){
    // This function gets name and link of all the books from main page and then gets all the Chapter names 
    // and chapter links of corresponding books 
    // It then calls getcontent module to get data of each chapter
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
        let [numBooks,nameBooks, bookLinkArr] = await getBooksNChapters(".markdown-body.entry-content.container-lg > ul > li");
        // console.log(numBooks, nameBooks, bookLinkArr);
        for(let i = 0; i < bookLinkArr.length; i++){
            // await cTab.click(".markdown-body.entry-content.container-lg > ul > li > a");
            cTab.goto(bookLinkArr[i],{waitUntil: 'networkidle0'});
            await cTab.waitForSelector(".markdown-body.entry-content.container-lg > ul > li > a");
            let [numLessons,nameLessons, lessonLinkArr] = await getBooksNChapters(".markdown-body.entry-content.container-lg > ul > li");
            // console.log(numLessons, nameLessons, lessonLinkArr);
            await getAllData(cTab,[bookLinkArr[i],nameBooks[i]],nameLessons,".markdown-body.entry-content.container-lg > ul > li > a",i+1);
        }
        await browserInstance.close()
   
    }catch(err){
        console.log(err);
    }
})();


async function getBooksNChapters(selector){
    //This function gets Details of individual books and there chapters by calling getLength function
    let [length, titleArray,linkArray] = await cTab.evaluate(getDetails, selector);
    return [length, titleArray, linkArray];
}

function getDetails(selector){
    // This function finds the names and links of chapter and books and return an array consisting all the info
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
