
let types = {
    media: ["mp4", "mkv"],
    archives: ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', "xz"],
    documents: ['docx', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex','csv'],
    app: ['exe', 'dmg', 'pkg', "deb"]
}

let fs = require("fs");
let path = require("path");
function Ofn (address) {
    dirArray = fs.readdirSync(address);
    let orgFilePath = path.join(address,"Organized Files");
    if(!fs.existsSync(orgFilePath)){
        fs.mkdirSync(orgFilePath);
    }
    //console.log(dirArray);
    for(let i = 0; i < dirArray.length; i++){
        let filePath = path.join(address,dirArray[i]);
        // console.log("filePath   ", filePath);
        let lstat = fs.lstatSync(filePath);
        if(lstat.isFile()){
            let extName = path.extname(filePath);
            // console.log(extName);
            let flag = false;
            for(let props in types){
                // console.log("props   ", props)
                for(let item=0; item < types[props].length; item++){
                    // console.log("item   ", types[props][item])
                    if(extName.slice(1)==types[props][item]){
                        flag = true;
                        let dirPath = path.join(orgFilePath,props)
                        let srcFile = filePath;
                        let fileName = path.basename(filePath);
                        let destFile = path.join(dirPath,fileName);
                        // console.log("Dir Path " , dirPath);
                        // console.log("source File Path : ", srcFile);
                        // console.log("Destination   ", destFile);
                        if(fs.existsSync(dirPath)){
                            fs.copyFileSync(srcFile,destFile);
                            Ohelperfn(path.basename(srcFile),props);
                            
                        }else{
                            fs.mkdirSync(dirPath);
                            fs.copyFileSync(srcFile,destFile);
                            // console.log("copied file ", srcFile , " TO ", destFile);
                            Ohelperfn(path.basename(srcFile),props);
                        }
                        break;
                    }
                }
            }
            if(flag == false){
                let dirPath = path.join(orgFilePath, "others")
                let srcFile = filePath;
                let fileName = path.basename(filePath);
                let destFile = path.join(dirPath,fileName);
                if(fs.existsSync(dirPath)){
                    fs.copyFileSync(srcFile,destFile);
                    // console.log("copied file ", srcFile , " TO ", destFile);
                    Ohelperfn(path.basename(srcFile),"others");
                }else{
                    fs.mkdirSync(dirPath);
                    fs.copyFileSync(srcFile,destFile);
                    // console.log("copied file ", srcFile , " TO ", destFile);
                    Ohelperfn(path.basename(srcFile),"others");
                }

            }


        }
    }
    //console.log("organize  command executed with path: " + address);
}

function Ohelperfn(srcPath,DestPath) {
    console.log(srcPath + " belongs to --->  ", DestPath);
    console.log(srcPath +" moved to  "+ DestPath)
}

module.exports = {
    organizefn : Ofn
}