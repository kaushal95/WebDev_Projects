fs = require("fs");
path = require("path");

inpArray = process.argv.slice(2);
// segregate on the basis of dash 
// if "-" present that it's a command else it's a file 
if(inpArray.length > 0){
    segregate(inpArray);
}

function segregate(inpArray){
    let optionArr = [];
    let contentArr = [];
    // segregating commmands from files 
    for(let i = 0; i < inpArray.length; i++){
        if (inpArray[i][0] == '-'){
            optionArr.push(inpArray[i]);
        }
        else{
            contentArr.push(inpArray[i]);
        }
    }
    // checking if all the files are valid files i.e they are present 
    content = "";
    for(let i = 0; i < contentArr.length; i++){
        //console.log(inpArray[i]);
        // readFile(inpArray[i]);

        if(fs.existsSync(contentArr[i])==false){
            console.log("File Doesn't Exist");
            return;
        }else{
            content += fs.readFileSync(contentArr[i]) + "\n";
        }
    }
    callingFunc(optionArr,content);
}

// this function calls optionfunc which manipulates content based on options 
function callingFunc(optionArr, content){
    if(optionArr.length > 0){
        if (optionArr.includes("-s")){
            content = optionFun("-s",content);
            if(optionArr.includes("-b") && optionArr.includes("-n")){
                if(optionArr.indexOf("-b") > optionArr.indexOf("-n")){
                    //call option function with "-n"
                    content = optionFun("-n",content);
                }else{
                    //call option function with "-b"
                    content = optionFun("-b",content);
                }
            }else if (optionArr.includes("-b")){
                //call option function with "-b"
                content = optionFun("-b",content);
            }else if (optionArr.includes("-n")){
                //call option function with "-n"
                content = optionFun("-n",content);
            }


        }else if (optionArr.includes("-b")){
            //call option function with "-b"
            content = optionFun("-b",content);
        }else if (optionArr.includes("-n")){
            //call option function with "-n"
            content = optionFun("-n",content);
        }else{
            content = console.log("Invalid wcat command");
        }
        console.log(content)
    }
}

// this will change the content based on options and returns modified content
function optionFun(option, content) {
    tempArr = [];
    if (option == "-s"){
        contentArr = content.split("\n");

        for(let i = 1; i < (contentArr.length); i++){
            if(contentArr[i] == '' && contentArr[i-1] == ''){
                contentArr[i] = null;
            }
            else if(contentArr[i] == '' && contentArr[i-1]==null){
                contentArr[i] = null;
            }
    
        }
    
        // console.log(contentArr);
        for(let i = 0; i < contentArr.length; i++){
            if(contentArr[i] != null){
                tempArr.push(contentArr[i]);
            }
        }

    }else if(option == "-n"){
        // content = ""
        contentArr = content.split("\n");
        for(let i = 0; i < contentArr.length; i++){
            tempArr.push((i+1) + ".) " + contentArr[i]);
        }
    }else if(option == "-b"){
        contentArr = content.split("\n");
        // content = ""

        let lineNum = 1;
        for(let i = 0; i < contentArr.length; i++){
            if(contentArr[i] != ''){
                tempArr.push(lineNum + ".) " + contentArr[i]);
                lineNum++;
            }else{
                tempArr.push(contentArr[i]);
            }
        }
    }
    // content = contentArr;
    // In linux / ubuntu only "\n" works, can be changed to "\r\n" or "\r" if ur using  windows / or mac
    content = tempArr.join("\n");
    return content;

}


