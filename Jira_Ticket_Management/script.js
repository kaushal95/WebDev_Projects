var uid = new ShortUniqueId();
// console.log(uid());

// let colCode = document.querySelectorAll(".color-filter");
let mainContainer = document.querySelector(".main-container");
let textInput = document.querySelector(".task_input");
let addDel = document.querySelector(".add-delete");
let colors = ["pink", "blue", "green", "black"];
let defaultColor = "black";
let cFilter = "";
// colCode.addEventListener("click",function(event){
//     console.log("clicked");
// })
// addDel.addEventListener("click",function(event){
    // let target = event.target;
let i = 0;
// let colChange;
textInput.addEventListener("keydown",function(event){

    if(event.code == "Enter" && textInput.value){
        i++;
        let tid = uid();
        createModal(tid, textInput.value);
        textInput.value = "";
    }    
    // console.log(target.getattribute("id"));
    // console.log("et  ",event.target);
    // console.log("eCt  ",event.currentTarget);
    
})
console.log(i);
function createModal(tid, value){
    let tBox = document.createElement("div");
    tBox.className = "text-box";
    tBox.innerHTML = `<div class="text-header 
    ${defaultColor}">
    
    </div>
    <div class="text-container">
    <h3 class="text-id">${tid}</h3>    
    <div class="text-content">${value}</div>
    </div>`;
    mainContainer.appendChild(tBox)
    let colChange = tBox.querySelector(".text-header");
    colChange.addEventListener("click",function(event){
        console.log(colChange.classList);
        let cColor = colChange.classList[1];
        let idx = colors.indexOf(cColor);
        let nxtidx = (idx + 1) % 4; 
        colChange.classList.remove(cColor);
        colChange.classList.add(colors[nxtidx]);
        // console.log(currentCurrentClass);
    })
}


// filtering functinality based on particular color 
let colCode = document.querySelector(".color-filter");
colCode.addEventListener("click", function(event){
    console.log(event.currentTarget);
    console.log("ettttttttt   ", event.target)
    let filterColor = event.target.classList[1];
    console.log(filterColor);
    filterCard(filterColor);
})

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



