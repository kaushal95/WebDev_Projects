//npm i puppeteer
let puppeteer = require("puppeteer");
const {login} = require("./secrets");
const {answers} = require("./codes.js");
let loginUrl = "https://www.hackerrank.com/auth/login";
// console.log(login);
// creates headless browser i.e it won't be visible but will be opened in bg
let browserStartPromise = puppeteer.launch({
    // visible
    headless: false, 
    // 1 sec
    // slowMo : 1000,
    defaultViewport: null,
    args: ["--start-maximized", "--disable-notifications"]

});
let page, browserPageObj,lastPage,indc;
let solArray = [];
browserStartPromise
    .then(function(browserObj){
        browserPageObj = browserObj;
        console.log("Browser Opened");
        //new tab
        let BrowserTabOpenPromise = browserObj.newPage();
            return BrowserTabOpenPromise
    }).then(function(newTab){
        page = newTab;
        console.log("new page opened");
        // to go to specific url on that tab
        let gpageOpenPromise = page.goto(loginUrl);
        return gpageOpenPromise;
    }).then(function(){
        console.log("Hackerrank login page Opened");
        // keyboard -> Data entry/ typing
        let typingPromise = page.type('input[id="input-1"]',login.email, {delay: 50});
        return typingPromise;
    })
    .then(function(){
        // keyboard -> Data entry/ typing
        let typingPromise = page.type('.input[type="password"]',login.pwd, {delay: 50});
        return typingPromise;
    })
    .then(function(){
        // keyboard specific keys -> tap/pressed
        let enterPressedPromise = page.keyboard.press('Enter');
        return enterPressedPromise;
    }).then(function(){
        let waitnClickPromise = waitAndClick('div[data-automation="algorithms"]', page);
        return waitnClickPromise;
    }).then(function(){
        let warmUpTickPromise = waitAndClick('input[value="warmup"]',page);
        return warmUpTickPromise;
    }).then(function(){
        let arrayChallenges = page.$$(".ctas > .challenge-submit-btn", {delay: 100});
        return arrayChallenges;
    }).then(function(array){
        console.log("number of questions ",array.length);
        let qSolvePromise = questionSolver(page,array[0], answers);
        return qSolvePromise;
        // for(let i = 0; i < array.length; i++){
        //     solArray.push(findSol(array[i],page));
        // }
        // return;
    }).then(function(){
        console.log("question is solved");
    })

    function questionSolver(page, question, answer){
        return new Promise(function(resolve,reject){
            let qClickPromise = question.click();
            //code read
            // hk editor -> ctrl + a + x
            // code type
            
            qClickPromise.then(function(){
                    //this portion of page will take some time to come
                    let waitForEditorToBInFocus = waitAndClick(".monaco-editor.no-user-select.vs",page);
                    return waitForEditorToBInFocus;
            }).then(function(){
                return waitAndClick(".checkbox-input",page);
            }).then(function(){
                page.waitForSelector(".text-area.custominput",{visible : true});
            }).then(function(){
                return page.type(".text-area.custominput ",answer,{delay : 50});
            }).then(function(){
                let ctrlsPressedP = page.keyboard.down("Control", {delay: 100});
                return ctrlsPressedP;
            }).then(function(){
                let AisPressedP = page.keyboard.press("A",{delay: 100});
                return AisPressedP;
            }).then(function(){
                return page.keyboard.press("X",{delay: 100});
            }).then(function(){
                let ctrlIsPressed = page.keyboard.up("Control");
                return ctrlIsPressed;
            })
            .then(function(){
                //focus
                let waitForEditorToBInFocus = waitAndClick(".monaco-editor.no-user-select.vs",page);
                return waitForEditorToBInFocus;
            }).then(function(){
                let ctrlsPressedP = page.keyboard.down("Control", {delay: 100});
                return ctrlsPressedP;
            }).then(function(){
                let AisPressedP = page.keyboard.press("A",{delay: 100});
                return AisPressedP;
            }).then(function(){
                let ctrlIsPressed = page.keyboard.up("Control");
                return ctrlIsPressed;
            }).then(function(){
                let ctrlsPressedP = page.keyboard.down("Control", {delay: 100});
                return ctrlsPressedP;
            })
            .then(function(){
                return page.keyboard.press("V",{delay: 100});
            }).then(function(){
                let ctrlIsPressed = page.keyboard.up("Control");
                return ctrlIsPressed;
            // }).then(function(){
            //     page.keyboard.type(answer,{delay: 50});
            }).then(function(){
                return waitAndClick(".hr-monaco__run-code",page);
            })

            .then(function(){
                resolve();
            }).catch(function(err){
                console.log(err);
                reject(err);
            })
        })
    }

    function findSol(element,page){
        return new Promise(function(resolve,reject){
            
                // let challnum = elementParser(array,0);
                // // let element = array[0];
                // let element = challnum;
                page.waitFor(3000);
                let challenge1 = element.click()
                challenge1
            
            .then(function(){
                let editorialPromise = waitAndClick('div[data-attr2="Editorial"]', page);
                return editorialPromise;
            }).then(function(){
                let editorialClickPromise = ifnotPresent(".editorial-content-locked .ui-text",page);
                return editorialClickPromise;
            }).then(function(){
                let texth3PromiseArray = page.$$eval("div h3", el => el.map(item => item.innerText));
                return texth3PromiseArray;
            }).then(function(textArray){
                console.log(textArray);
                let idx = 0;
                for(let i = 0; i <textArray.length; i++){
                    if(textArray[i] == "C++"){
                        idx = i;
                    }
                }
                // console.log(idx);
                indc = idx;
                return;
            }).then(function(){
                let solTextArray = page.$$eval("div .highlight", el => el.map(item => item.innerText));
                // let array = [];
                // array.push(textSolPromiseArray);
                // array.push(idx);
                // return array;
                return solTextArray
            }).then(function(solTextArray){
                // console.log(idx);
                console.log(solTextArray[indc]);
                // let pos = solTextArray[1];
                // let textArray = solTextArray[0];
                // console.log(textArray[pos]);
                return solTextArray;
            }).then(function(solTextArray){
                resolve(solTextArray);
            }).catch(function(){
                resolve(solTextArray);
            })
        })
    }
 console.log(solArray);   
    // .then(function(solutionArray){
    //     console.log(solutionArray[indc]);
    // });
    // .then(function(array){
    //     console.log(array);
    //     return;
    // });


    // await page.$$eval(".plan-features a",
    // elements=> elements.map(item=>item.textContent))    
// div h3
// const innerTextOfButton = await page.$eval('button#submit', el => el.innerText)

    // function innerText(selector){
    //     return selector.text();
    // }


function elementParser(array,idx){
    if(idx == array.length){
        return;
    }
    elementParser(idx+1);
    return array[idx];
    
}
    
function waitAndClick(selector, cpage){
    return new Promise(function(resolve, reject){
        let waitForElementPromise = cpage.waitForSelector(selector,{visible:true});
        waitForElementPromise
        .then(function(){
        let elementClickPromise = cpage.click(selector,{delay:100});
        return elementClickPromise;
    }).then(function(){
        resolve();
    })
    .catch(function(err){
        reject(err);
    })
    });

}
    
function ifnotPresent(selector,cpage){
    return new Promise(function(resolve, reject){
        let wcPromise = waitAndClick(selector,cpage);
        wcPromise.then(function(){
            resolve();
        })
        wcPromise.catch(function(){
            resolve();
        })

    });
    
}