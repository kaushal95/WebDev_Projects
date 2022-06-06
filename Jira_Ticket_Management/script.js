var uid = new ShortUniqueId();
// console.log(uid());



//variables used 
let defaultColor = "black";
let cFilter = "";
let deleteActive = false;
let colors = ["pink", "blue", "green", "black"];
let addIndicator = false;

//elements 
let mainContainer = document.querySelector(".main-container");
let textInput = document.querySelector(".task_input");
let addDel = document.querySelector(".add-delete");
let lock = document.querySelector(".lock");
let unlock = document.querySelector(".unlock");
let add = document.querySelector(".add");
let deleteButton = document.querySelector(".delete");
let colCode = document.querySelector(".color-filter");
let modal_container = document.querySelector(".main-container>.modal");
let color_panel = document.querySelector(".color-panel");


// Event Listeners
color_panel.addEventListener("click", function(e){
    let colorList = color_panel.querySelectorAll(".color-m");
    for(let i = 0; i < colorList.length; i++){
        // console.log(e.target, "---+=", colorList[i]);
        colorList[i].classList.remove("selected");
        if(e.target == colorList[i]){
            colorList[i].classList.add("selected");
            defaultColor = colorList[i].classList[1];
        }
    }
})


modal_container.addEventListener("keydown",function(event){
    let input = document.querySelector(".modal-text")
    if(event.code == "Enter" && input.value){
        let tid = uid();

        createModal(tid, input.value, true,defaultColor);
        input.value = "";
        modal_container.style.display = "none";
    }    
})

add.addEventListener("click",function(){
    // addIndicator = !addIndicator;
        modal_container.style.display="flex";

})
// filtering functinality based on particular color 
colCode.addEventListener("click", function(event){
    let filterColor = event.target.classList[1];
    console.log(filterColor);
    filterCard(filterColor);
})

//delete button functionality active/shadow function
deleteButton.addEventListener("click",function(){
    deleteActive = !deleteActive;
    if(deleteActive == true){
        deleteButton.classList.add("active");
    }else{
        deleteButton.classList.remove("active");
    }
})

//lock button functionality active/shadow function
lock.addEventListener("click",function(){
    let textContainers = document.querySelectorAll(".text-content");

    for (let i = 0; i < textContainers.length; i++){
        console.log("hi");
        textContainers[i].contentEditable = "false";
    }
    lock.classList.add("active");
    unlock.classList.remove("active");
})

// unlock button functionality active/shadow function
unlock.addEventListener("click",function(){
    let textContainers = document.querySelectorAll(".text-content");
    for (let i = 0; i < textContainers.length; i++){
        textContainers[i].contentEditable = "true";
    }
    unlock.classList.add("active");
    lock.classList.remove("active");
})

// helper functions 

//create to-do task bar 
function createModal(tid, value,flag,color){
    // to create new task bar
    let tBox = document.createElement("div");
    tBox.className = "text-box";
    tBox.innerHTML = `<div class="text-header 
    ${color ? color : defaultColor}">
    
    </div>
    <div class="text-container">
    <h3 class="text-id">#${tid}</h3>    
    <div class="text-content" contenteditable="true">${value}</div>
    </div>`;
    mainContainer.appendChild(tBox)
    let colChange = tBox.querySelector(".text-header");
    let nextcolor;

    //filter change in ui and filter update function in localstorage
    colChange.addEventListener("click",function(event){
        // console.log(colChange.classList);
        let cColor = colChange.classList[1];
        let idx = colors.indexOf(cColor);
        let nxtidx = (idx + 1) % 4; 
        nextcolor = colors[nxtidx];
        colChange.classList.remove(cColor);
        colChange.classList.add(nextcolor);

        let tasksString = localStorage.getItem("tasks");
        let tasksArr = JSON.parse(tasksString) || [];
        let taskid = colChange.parentNode.children[1].children[0].textContent.substring(1)
        for(let i = 0; i < tasksArr.length; i++){
            // console.log("tasks :  ", tasksArr[i]);
            if(tasksArr[i].tid == taskid){
                // console.log("tid     : ", tasksArr[i].tid, tasksArr[i].color, nextcolor);
                tasksArr[i].color = nextcolor;
            }
        }
        localStorage.setItem("tasks", JSON.stringify(tasksArr));
    })

    // delete functionality ui & localstorage 
    tBox.addEventListener("click",function(){
        console.log(tid);
        if(deleteActive == true){
            let tasksArr = JSON.parse(localStorage.getItem("tasks")) || [];
            console.log(tasksArr);
            
            for(let i = 0; i < tasksArr.length; i++){
                // console.log("inner tid ", tid, " tasks tid ", tasksArr[i].tid);

                if(tid == tasksArr[i].tid){
                    // console.log("inner tid ", tid, " tasks tid ", tasksArr[i].tid);
                    tasksArr.splice(i,1);
                    break;
                }
    
            }
            localStorage.setItem("tasks",JSON.stringify(tasksArr));
            tBox.remove();
        }
    })
    let inputContainer = document.querySelector(".text-content");
    inputContainer.addEventListener("blur",function(e){
        let content = inputContainer.textContent;
        let tasksArr = JSON.parse(localStorage.getItem("tasks"));
        for(let i = 0; i < tasksArr.length; i++){
            if(tid == tasksArr[i].tid){
                tasksArr[i].value = content;
                break;
            }
        }
        localStorage.setItem("tasks",JSON.stringify(tasksArr));
    })

    //appending new elements created using ui to local storage 
    if (flag == true) {
        let tasksString = localStorage.getItem("tasks");
        let tasksArr = JSON.parse(tasksString) || [];
        let taskObject = {
            tid: tid,
            value: value,
            color: defaultColor
        }
        tasksArr.push(taskObject);
        localStorage.setItem("tasks", JSON.stringify(tasksArr));
    }
}

//Filtering based on color
function filterCard(filterColor){
    let allElems = mainContainer.querySelectorAll(".text-header");
    if(cFilter != filterColor){
        for(let i = 0; i < allElems.length; i++){
            if(allElems[i].classList[1] != filterColor){
                allElems[i].parentNode.style.display = "none";
            }else{
                allElems[i].parentNode.style.display = "block";
            }
        }
        cFilter = filterColor;
    }else{
        for(let i = 0; i < allElems.length; i++){
            allElems[i].parentNode.style.display = "block";
        }
        cFilter = "";
    }

}

//localStorage function 
(function () {
    // localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    for (let i = 0; i < tasks.length; i++) {
        let { tid, value, color } = tasks[i];
        createModal(tid,value,false,color);
    }
    modal_container.style.display = "none";
    // get it to ui
})();


