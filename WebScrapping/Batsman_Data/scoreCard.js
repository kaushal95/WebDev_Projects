let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let path = require("path");
let xlsx = require("xlsx");

// urls to test the function for single match
// let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/royal-challengers-bangalore-vs-mumbai-indians-10th-match-1216547/full-scorecard";
// let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard";
// singleScorecard(url);
function singleScorecard(url){
    request(url, cb);
    function cb(error , response, html){
        if(error){
            console.log(error);
        }else if(response.statusCode == 404){
            console.log("Page Not Found");
        }else{
            getScorecardData(html);
        }
    }
}
// Gets ScoredCard Data for each match and stores in each Players excel
function getScorecardData(html){
    let searchTool = cheerio.load(html);
    let pwd = process.cwd();
    let dirPath = path.join(pwd,"ipl");
    if(fs.existsSync(dirPath) == false){
        fs.mkdirSync(dirPath);
    }
    let matcharray = searchTool(".match-header .name-detail .name-link p");

    let result = searchTool(".match-header .status-text>span").text().split("(");

    let namedetail = searchTool(".match-header .name-detail");
    let winnningTag = ".espn-icon.icon-games-solid-after.icon-sm.winner-icon";
    let winner = "";
    if((searchTool(namedetail[0]).find(winnningTag).length) > 0){
        winner = searchTool(matcharray[0]).text().trim() + " won the match";
    }else if ((searchTool(namedetail[1]).find(winnningTag).length) > 0){
        winner = searchTool(matcharray[1]).text().trim() + " won the match";
    }

    let headData = ["Team Name", "Player Name", "Venue", "Date","Opponent Team","Result","Runs","Balls","Fours","Sixes","Strike Rate"];
    let scoreTable = searchTool(".table.batsman");

    let location = searchTool(".match-info.match-info-MATCH.match-info-MATCH-half-width .description").text().split(", ");
    for(let i = 0; i < matcharray.length; i++){

        let tableArray = searchTool(scoreTable[i]).find("td");
        let teamName = searchTool(matcharray[i]).text().trim();


        let teamPath = path.join(dirPath,teamName); 
        if(fs.existsSync(teamPath) == false){
            fs.mkdirSync(teamPath);
        }
        for(let j = 0; j < tableArray.length; j++){
            let lis = [teamName,location[1],location[2]];
            if(i % 2 == 0){
                lis.push(searchTool(matcharray[1]).text().trim());
            }
            else{
                lis.push(searchTool(matcharray[0]).text().trim());
            }
            if(result.length>1){
                winner += ("("+result.pop())
            }
            lis.push(winner);
            if(searchTool(tableArray[j]).attr("class") == "batsman-cell text-truncate out" 
            || searchTool(tableArray[j]).attr("class") =="batsman-cell text-truncate not-out"){
                let captAndWckeeper = searchTool(tableArray[j]).text().trim();
                captAndWckeeper = captAndWckeeper.split("(c)")[0].trim();
                captAndWckeeper = captAndWckeeper.split("†")[0].trim();
                lis.splice(1,0,captAndWckeeper);
                let playerPath = path.join(teamPath,(captAndWckeeper+".xlsx"));
                for(let k = j+2; k < j+9; k++){
                    if(!isNaN(searchTool(tableArray[k]).text().trim())){
                        lis.push(searchTool(tableArray[k]).text().trim())
                    }
                    
                }
                lis.pop();
                // used Json initiallly than switched to excel
                // let content = fs.readFileSync(playerPath);
                // let jsoncontent = JSON.parse(content);
                // jsoncontent.push(lis);
                // let jsonWritable = JSON.stringify(jsoncontent);
                // fs.writeFileSync(playerPath,jsonWritable);
                let content = xlReader(playerPath,"player stats");

                xlsWriter(headData, lis,content, playerPath, "player stats");
            }
        }
    }

}

// writes appends data to existing data and writes in the excel 
function xlsWriter(header,lis,existingData,filepath, sheetName){
    playerObj = {};
    for(let i = 0; i < header.length; i++) {
        playerObj[header[i]] = lis[i];
    }
    existingData.push(playerObj);
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(existingData);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    xlsx.writeFile(newWB, filepath);
}
// Reads data from excel and returns Json data 
function xlReader(filepath, sheetName){
    if(fs.existsSync(filepath)==false){
        return [];
    }
    let wb = xlsx.readFile(filepath);
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}

module.exports ={
    sc:singleScorecard
}