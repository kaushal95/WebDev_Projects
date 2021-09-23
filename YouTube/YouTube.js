const fs = require("fs");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
let cTab;
let link = "https://www.youtube.com/playlist?list=PLzkuLC6Yvumv_Rd5apfPRWEcjf9b1JRnq";
//https://www.youtube.com/playlist?list=PLzkuLC6Yvumv_Rd5apfPRWEcjf9b1JRnq
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
        await cTab.waitForSelector('h1#title');
        let name = await cTab.evaluate(function(select){
            return document.querySelector(select).innerText;
        },'h1#title');

        let dataObj = await cTab.evaluate(getData,'div#stats> .style-scope.ytd-playlist-sidebar-primary-info-renderer');
        
        console.log(name,dataObj.numVideos, dataObj.numViews);

        let totalVideos = dataObj.numVideos.split(' ')[0];
        let currLength = await getCurrVideosLength();
        console.log(totalVideos,currLength);
        let numScrolls = Math.floor(totalVideos/100);
        console.log(numScrolls);
        for(let i = 0; i < numScrolls; i++){
            
            await cTab.click("div.circle.style-scope.tp-yt-paper-spinner");
            await waitTillHTMLRendered(cTab);
        }
        let htmlContent = await cTab.content();
        // console.log(htmlContent);
        let nameNLength = getHtmlContent(htmlContent);
        // cTab.waitForSelector("div#content > div#container");
        // let nameNLength = []
        // let containerArray = await cTab.evaluate(() => document.querySelectorAll("div#content > div#container"));
        // for(let i = 0; i < containerArray.length; i++){
        //     // let innerHtml = await cTab.evaluate(() => document.querySelectorAll(containerArray[i]).innerHTML);
        //     console.log(containerArray[i]);
        //     // let result = getHtmlContent(innerHtml);
        //     // nameNLength.push(result);
        // }
        // let temp = totalVideos;
//circle.style-scope.tp-yt-paper-spinner
        // 
        // let videoNames = await cTab.evaluate(getEach,"a#video-title");
        // let videoLength = await cTab.evaluate(getEach, ".style-scope.ytd-thumbnail-overlay-time-status-renderer");
        // for(let i = 0; i < videoLength.length; i++){
        //     console.log(videoNames[i],videoLength[i]);

        // }    
        // while(totalVideos - currLength >= 20){
        //     await srollToBottom();
        //     currLength = await getCurrVideosLength();
        //     // console.log(currLength);
        // }
        // while(temp > 13){
        //     temp = totalVideos;
        //     await srollToBottom();
        //     currLength = await getCurrVideosLength();
        //     temp -= currLength;
        //     console.log(currLength);
        // }
        // let finalList = await getStats();

        // using container of divs get innerthtml and then check if time and videoname tag both are present
        // get time and name else skip that video
        console.table(nameNLength);
    }catch(err){
        console.log(err);
    }
})();

function getHtmlContent(htmlContent){
    // This function will get the data associated with a particular selector and will return it
        let sTool = cheerio.load(htmlContent);
        let elementArr = sTool("div#content > div#container");
        let contentList = []
        for(let i = 0; i < elementArr.length; i++){
            let durationEle = sTool(elementArr[i]).find("span#text.style-scope.ytd-thumbnail-overlay-time-status-renderer");
            if(durationEle.length > 0){
                let videolen = sTool(elementArr[i]).find("span#text.style-scope.ytd-thumbnail-overlay-time-status-renderer").text().trim();
                let videoname = sTool(elementArr[i]).find("a#video-title.yt-simple-endpoint.style-scope.ytd-playlist-video-renderer").text().trim();
                contentList.push({
                    videoname,
                    videolen
                })
            }
        }
        return contentList;
}
const waitTillHTMLRendered = async (page, timeout = 10000) => {
    const checkDurationMsecs = 1000;
    const maxChecks = timeout / checkDurationMsecs;
    let lastHTMLSize = 0;
    let checkCounts = 1;
    let countStableSizeIterations = 0;
    const minStableSizeIterations = 3;
  
    while(checkCounts++ <= maxChecks){
      let html = await page.content();
      let currentHTMLSize = html.length; 
  
      let bodyHTMLSize = await page.evaluate(() => document.body.innerHTML.length);
  
      console.log('last: ', lastHTMLSize, ' <> curr: ', currentHTMLSize, " body html size: ", bodyHTMLSize);
  
      if(lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize) 
        countStableSizeIterations++;
      else 
        countStableSizeIterations = 0; //reset the counter
  
      if(countStableSizeIterations >= minStableSizeIterations) {
        console.log("Page rendered fully..");
        break;
      }
  
      lastHTMLSize = currentHTMLSize;
      await page.waitFor(checkDurationMsecs);
    }  
  };

function getData(selector){
    let allElem = document.querySelectorAll(selector);
    let numVideos = allElem[0].innerText;
    let numViews = allElem[1].innerText;
    return {
        numVideos: numVideos,
        numViews: numViews
    }
}

async function getCurrVideosLength(){
    // await cTab.waitForSelector('#thumbnail .yt-simple-endpoint.inline-block.style-scope.ytd-thumbnail');
    let length = await cTab.evaluate(getLength, '#thumbnail .yt-simple-endpoint.inline-block.style-scope.ytd-thumbnail');
    return length;
}

function getLength(durationSelector){
    let lengtharray = document.querySelectorAll(durationSelector);
    return lengtharray.length;
}

async function srollToBottom(){
    await cTab.evaluate(goToBottom);
    function goToBottom(){
        window.scrollBy(0, window.innerHeight);
    }
}

async function getStats(){
    // span#text.style-scope.ytd-thumbnail-overlay-time-status-renderer
    let detailArray = await cTab.evaluate(getNameNDuration,"a#video-title.yt-simple-endpoint.style-scope.ytd-playlist-video-renderer","span#text.style-scope.ytd-thumbnail-overlay-time-status-renderer");
    return detailArray;
}

function getNameNDuration(nameSelector, durationSelector){
    let nameArray = document.querySelectorAll(nameSelector);
    let durationArray = document.querySelectorAll(durationSelector);

    let detailArray = [];
    for(let i = 0; i < durationArray.length; i++){
        let name = nameArray[i].innerText.trim();
        let duration = durationArray[i].innerText.trim();
        detailArray.push({name, duration});
    }
    return detailArray;
}