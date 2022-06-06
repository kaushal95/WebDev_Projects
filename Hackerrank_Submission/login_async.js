//npm i puppeteer
let puppeteer = require("puppeteer");
const {login} = require("./secrets");
const {answers} = require("./codes.js");
const { Console } = require("console");
let loginUrl = "https://www.hackerrank.com/auth/login";
// console.log(login);
// creates headless browser i.e it won't be visible but will be opened in bg
let page, browserPageObj,lastPage,indc;
(async function(){
    let browserStartObj = await puppeteer.launch({
    // visible
    headless: false, 
    // 1 sec
    // slowMo : 1000,
    defaultViewport: null,
    args: ["--start-maximized", "--disable-notifications"]
    });
    let solArray = [];
    pageArray = await browserStartObj.pages();
    page = await pageArray[0];
    console.log("Browser Opened");
    await page.goto(loginUrl);
    console.log("Hackerrank login page Opened");
    // keyboard -> Data entry/ typing
    await page.type('input[id="input-1"]',login.email, {delay: 50});

    await page.type('.input[type="password"]',login.pwd, {delay: 50});
    // keyboard specific keys -> tap/pressed
    await page.keyboard.press('Enter');
    console.log("Login Successful");
    await waitAndClick('div[data-automation="algorithms"]', page);
    await waitAndClick('input[value="warmup"]',page);

    let arrayChallenges = await page.$$(".ctas > .challenge-submit-btn", {delay: 100});
    let questionArray = [];
    for(let i = 0; i < arrayChallenges.length; i++){

        let questionName = await page.evaluate(function(selector){
            return document.querySelector(selector).innerText;
        },arrayChallenges[i])
        questionArray.push(questionName);
    }
    console.log(questionArray);
    // console.log("number of questions ",arrayChallenges.length);
    // let qSolvePromise = questionSolver(page,arrayChallenges[0], answers);
    // // for(let i = 0; i < array.length; i++){
    // //     solArray.push(findSol(array[i],page));
    // // }
    // // return;
    // console.log("question is solved");
})();

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