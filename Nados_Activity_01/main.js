(function(){
    let btnAddFolder = document.querySelector("#addFolder");
    let btnAddTextFile = document.querySelector("#addTextFile");
    let divbreadcrumb = document.querySelector("#breadcrumb");
    let aRootPath = divbreadcrumb.querySelector("a[purpose='path']");
    let divContainer = document.querySelector("#container");
    let templates = document.querySelector("#templates");
    let resources = [];
    let cfid = -1;
    let rid = 0;

    btnAddFolder.addEventListener("click", addFolder);
    btnAddTextFile.addEventListener("click", addTextFile);
    aRootPath.addEventListener("click", viewFolderFromPath);

    function addFolder(){
        let rname = prompt("Enter Folder name");
        //Empty name validation
        if(rname != null){
            rname = rname.trim();
        }
        if(!rname){
            alert("Please enter valid name");
            return;
        }
        
        //uniqueness valiation
        let alreadyExists = resources.some(r => r.rname == rname && r.pid == cfid);
        if(alreadyExists == true){
            alert(rname + " already exists!!");
            return;
        }
        rid++;
        let pid = cfid;
        addFolderHTML(rname, rid, pid);
        resources.push({
            rid,
            rname,
            rtype: "folder",
            pid
        });
        saveToStorage();
        
    }
    function addTextFile(){
        let rname = prompt("Enter Text File name");

        //Empty name validation
        if(rname != null){
            rname = rname.trim();
        }
        if(!rname){
            alert("Please enter valid name");
            return;
        }
        
        //uniqueness valiation
        let alreadyExists = resources.some(r => r.rname == rname && r.pid == cfid);
        if(alreadyExists == true){
            alert(rname + " already exists!!");
            return;
        }
        rid++;
        let pid = cfid;
        addTextFileHTML(rname, rid, pid);
        resources.push({
            rid,
            rname,
            rtype: "text-file",
            pid
        });
        saveToStorage();
    }
    function deleteFolder(){
        let spanDelete = this;
        let divFolder = spanDelete.parentNode;
        let divname = divFolder.querySelector("[purpose='name']");

        let fidTBD = parseInt(divFolder.getAttribute("rid"));
        let fname = divname.innerHTML;

        let sure = confirm(`Are you sure you want to delete ${fname}`);
        if(!sure){
            return;
        }

        //html 
        divContainer.removeChild(divFolder);

        //ram
        deleteHelper(fidTBD);

        //storage
        saveToStorage();

        
    }
    function deleteHelper(fidTBD){
        let children = resources.filter(r => r.pid == fidTBD);

        for(let i = 0; i < children.length; i++){
            deleteHelper(children[i].rid); // small problem , will work
        }

        let ridx = resources.findIndex(r => r.rid == fidTBD);
        console.log(resources[ridx].rname);
        resources.splice(ridx, 1);

    }
    function deleteTextFile(){
        let spanDelete = this;
        let divTextFile = spanDelete.parentNode;
        let divname = divTextFile.querySelector("[purpose='name']");

        let fidTBD = parseInt(divTextFile.getAttribute("rid"));
        let fname = divname.innerHTML;

        let sure = confirm(`Are you sure you want to delete ${fname}`);
        if(!sure){
            return;
        }

        //html 
        divContainer.removeChild(divTextFile);

        //ram
        // deleteHelper(fidTBD);
        let ridx = resources.findIndex(r => r.rid == fidTBD);
        resources.splice(ridx, 1);

        //storage
        saveToStorage();

    }
    function renameFolder(){
        let nname = prompt("Enter name");
        if(nname != null){
            nname = nname.trim();
        }
        if(!nname){
            alert("Please enter valid name");
            return;
        }
        
        let spanRename = this;
        let divFolder = spanRename.parentNode;
        let ridTBU = parseInt(divFolder.getAttribute("rid"));
        let divName = divFolder.querySelector("[purpose=name]");
        let orname = divName.innerHTML;
        //uniqueness valiation
        if(orname == nname){
            alert("Please enter a new name");
        }
        let alreadyExists = resources.some(r => r.rname == nname && r.pid == cfid);
        if(alreadyExists == true){
            alert(nname + " already exists!!");
            return;
        }
        //change HTML
        divName.innerHTML = nname;
        //Change ram
        let resource = resources.find(r => r.rid == ridTBU);
        resource.rname = nname;
        //Change Storage
        saveToStorage();

    }
    function renameTextFile(){
        let nname = prompt("Enter name");
        if(nname != null){
            nname = nname.trim();
        }
        if(!nname){
            alert("Please enter valid name");
            return;
        }
        
        let spanRename = this;
        let divFolder = spanRename.parentNode;
        let ridTBU = parseInt(divFolder.getAttribute("rid"));
        let divName = divFolder.querySelector("[purpose=name]");
        let orname = divName.innerHTML;
        //uniqueness valiation
        if(orname == nname){
            alert("Please enter a new name");
        }
        let alreadyExists = resources.some(r => r.rname == nname && r.pid == cfid);
        if(alreadyExists == true){
            alert(nname + " already exists!!");
            return;
        }
        //change HTML
        divName.innerHTML = nname;
        //Change ram
        let resource = resources.find(r => r.rid == ridTBU);
        resource.rname = nname;
        //Change Storage
        saveToStorage();

    }
    function viewFolder(){
        // console.log("In View");
        let spanView = this;
        let divFolder = spanView.parentNode;
        let divname = divFolder.querySelector("[purpose='name']");

        let fname = divname.innerHTML;
        let fid = parseInt(divFolder.getAttribute("rid"));

        let aPathTemplate = templates.content.querySelector("a[purpose='path']");
        let aPath = document.importNode(aPathTemplate,true);

        aPath.innerHTML = fname;
        aPath.setAttribute("rid", fid);
        aPath.addEventListener("click", viewFolderFromPath);
        divbreadcrumb.appendChild(aPath);

        cfid = fid;
        divContainer.innerHTML = "";

        for(let i = 0; i < resources.length; i++){
            if(resources[i].pid == cfid){
                if(resources[i].rtype == "folder"){
                    addFolderHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                }else if(resources[i].rtype=="text-file"){
                    addTextFileHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                }
            }
        }
    }

    function viewFolderFromPath(){
        let aPath = this;
        let fid = parseInt(aPath.getAttribute("rid"));

        // set the breadcrumb
        while(aPath.nextSibling){
            aPath.parentNode.removeChild(aPath.nextSibling);
        }
        // set the container
        cfid = fid;
        divContainer.innerHTML = "";
        for(let i = 0; i < resources.length; i++){
            if(resources[i].pid == cfid){
                if(resources[i].rtype == "folder"){
                    addFolderHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                }else if(resources[i].rtype=="text-file"){
                    addTextFileHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                }
                
            }
        }

    }
    function viewTextFile(){

    }
    function addTextFileHTML(rname, rid, pid){
        let divTextFileTemplate = templates.content.querySelector(".text-file");
        let divTextFile = document.importNode(divTextFileTemplate, true);

        let spanRename = divTextFile.querySelector("[action=rename]");
        let spanDelete = divTextFile.querySelector("[action=delete]");
        let spanView = divTextFile.querySelector("[action=view]");
        let divName = divTextFile.querySelector("[purpose=name]");
    
        spanRename.addEventListener("click",renameTextFile);
        spanDelete.addEventListener("click", deleteTextFile);
        spanView.addEventListener("click",viewTextFile);
        divName.innerHTML = rname;

        divTextFile.setAttribute("rid", rid);
        divTextFile.setAttribute("pid", pid);
        divContainer.appendChild(divTextFile);
    }
    function addFolderHTML(rname, rid, pid){
        let divFolderTemplate = templates.content.querySelector(".folder");
        let divFolder = document.importNode(divFolderTemplate, true);

        let spanRename = divFolder.querySelector("[action=rename]");
        let spanDelete = divFolder.querySelector("[action=delete]");
        let spanView = divFolder.querySelector("[action=view]");
        let divName = divFolder.querySelector("[purpose=name]");
    
        spanRename.addEventListener("click",renameFolder);
        spanDelete.addEventListener("click", deleteFolder);
        spanView.addEventListener("click",viewFolder);
        divName.innerHTML = rname;

        divFolder.setAttribute("rid", rid);
        divFolder.setAttribute("pid", pid);
        divContainer.appendChild(divFolder);
    }
    function saveToStorage(){
        let rjson = JSON.stringify(resources);
        localStorage.setItem("data", rjson);
    }
    function loadFromStorage(){
        let rjson = localStorage.getItem("data");
        if(!!rjson){

            resources = JSON.parse(rjson);
            for(let i = 0; i < resources.length; i++){
                if(resources[i].pid == cfid){
                    if(resources[i].rtype == "folder"){
                        addFolderHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                    }else if(resources[i].rtype == "text-file"){
                        addTextFileHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                    }
    
                }
                if(resources[i].rid > rid){
                    rid = resources[i].rid;
                }
            }
        }
    }
    loadFromStorage();
})();