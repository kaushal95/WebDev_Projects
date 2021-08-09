let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let path = require("path");

// let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/royal-challengers-bangalore-vs-mumbai-indians-10th-match-1216547/full-scorecard";
// //"https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard";
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
function getScorecardData(html){
    let searchTool = cheerio.load(html);
    let pwd = process.cwd();
    let dirPath = path.join(pwd,"ipl");
    if(fs.existsSync(dirPath) == false){
        fs.mkdirSync(dirPath);
    }
    // console.log(pwd);

    let matcharray = searchTool(".match-header .name-detail .name-link p");
    //.status-text
    let result = searchTool(".status-text>span").text().split("(");

    let namedetail = searchTool(".match-header .name-detail");
    let winnningTag = ".espn-icon.icon-games-solid-after.icon-sm.winner-icon";
    let winner = "";
    if((searchTool(namedetail[0]).find(winnningTag).length) > 0){
        winner = searchTool(matcharray[0]).text().trim() + " won the match";
    }else if ((searchTool(namedetail[1]).find(winnningTag).length) > 0){
        winner = searchTool(matcharray[1]).text().trim() + " won the match";
    }

    let headData = ["team_name", "playername", "vanue", "date","opponentTeamName","result","runs","balls","fours","sixes","sr"];
    let scoreTable = searchTool(".table.batsman");
    // teamNames = matcharray.attr("alt");
    // console.log(matcharray.length);
    let location = searchTool(".match-info.match-info-MATCH.match-info-MATCH-half-width .description").text().split(", ");
    // console.log(location);
    // console.log('```````````````````````````````````````````````');
    for(let i = 0; i < matcharray.length; i++){
        // console.log('```````````````````````````````````````````````');
        // console.log(searchTool(matcharray[i]).text().trim());
        let tableArray = searchTool(scoreTable[i]).find("td");
        let teamName = searchTool(matcharray[i]).text().trim()
        let teamPath = path.join(dirPath,teamName); 
        if(fs.existsSync(teamPath) == false){
            fs.mkdirSync(teamPath);
        }
        for(let j = 0; j < tableArray.length; j++){
            // console.log(searchTool(tableArray[j]).text());
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
            //     playerName = searchTool(tableArray[j]).text()[0];
                // console.log(searchTool(tableArray[j]).text());
                let captAndWckeeper = searchTool(tableArray[j]).text().trim();
                captAndWckeeper = captAndWckeeper.split("(c)")[0].trim();
                captAndWckeeper = captAndWckeeper.split("†")[0].trim();
                lis.splice(1,0,captAndWckeeper);
                let playerPath = path.join(teamPath,(captAndWckeeper+".json"));
                // console.log(playerPath);
                if(fs.existsSync(playerPath) == false){
                        let data = JSON.stringify(headData);
                    fs.writeFileSync(playerPath,data);
                }
                
                // lis.push(.split("/[(c),†]+/")
                for(let k = j+2; k < j+9; k++){
                    // console.log(searchTool(tableArray[k]).text());
                    if(!isNaN(searchTool(tableArray[k]).text().trim())){
                        lis.push(searchTool(tableArray[k]).text().trim())
                    }
                    
                }
                lis.pop();
                let content = fs.readFileSync(playerPath);
                let jsoncontent = JSON.parse(content);
                jsoncontent.push(lis);
                let jsonWritable = JSON.stringify(jsoncontent);
                fs.writeFileSync(playerPath,jsonWritable);

                // console.log(lis);
                // j = j + 9;
            }
        }
        // console.log(tableArray.length);
        
    }

    
    // let stats = searchTool(scoreTable[0]).find("td");
    // console.log(stats.text());
    // fs.writeFileSync("InningsTable2.html",searchTool(scoreTable[1]).html());
    // console.log(scoreTable.length);

    // console.log(searchTool(matcharray[1]).text().trim());
}

module.exports ={
    sc:singleScorecard
}