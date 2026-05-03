let z = 1;
const PASSWORD = "1234";
let openApps = {};
const taskApps = document.getElementById("tapps");

/* LOGIN */
function login(){
  if(document.getElementById("password").value === PASSWORD){
    document.getElementById("ls").style.display = "none";
  } else alert("Wrong password");
}

/* START MENU */
function toggleStart(){
  let m = document.getElementById("sm");
  m.style.display = m.style.display === "block" ? "none" : "block";
}

/* OPEN APP */
function openApp(id){
  let win = document.getElementById(id);
  win.style.display = "block";
  win.style.zIndex = ++z;

  if(!openApps[id]){
    let item = document.createElement("div");
    item.className = "task-item";
    item.innerText = id;
    item.onclick = ()=>focusApp(id);
    taskApps.appendChild(item);
    openApps[id] = item;
  }
}

/* CLOSE */
function closeApp(id){
  document.getElementById(id).style.display = "none";
  if(openApps[id]){
    openApps[id].remove();
    delete openApps[id];
  }
}

/* FOCUS */
function focusApp(id){
  document.getElementById(id).style.zIndex = ++z;
}

/* DRAG */
document.querySelectorAll(".window").forEach(win=>{
  let bar = win.querySelector(".title");

  bar.addEventListener("mousedown", (e)=>{
    let offsetX = e.clientX - win.offsetLeft;
    let offsetY = e.clientY - win.offsetTop;

    function move(e){
      win.style.left = (e.clientX-offsetX)+"px";
      win.style.top = (e.clientY-offsetY)+"px";
    }

    function stop(){
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", stop);
    }

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", stop);
  });
});

/* CALCULATOR */
let exp="";
function calc(v){
  let d=document.getElementById("cd");

  if(v==="C"){exp=""; d.value=""; return;}
  if(v==="="){
    try{
      exp = Function('"use strict";return ('+exp+')')().toString();
    } catch { exp="Error"; }
    d.value=exp;
    return;
  }

  exp+=v;
  d.value=exp;
}

/* BROWSER */
function loadSite(){
  let url = document.getElementById("ub").value;
  if(!url.startsWith("http")) url = "https://" + url;
  document.getElementById("browserFrame").src = url;
}

/* BACKGROUND SYSTEM */
const walls = [
  "linear-gradient(#1e3c72,#2a5298)",
  "linear-gradient(#000,#444)",
  "linear-gradient(#8e2de2,#4a00e0)"
];

function applyBackground(value, isImage=false){
  const d = document.getElementById("desktop");

  if(isImage){
    d.style.backgroundImage = `url(${value})`;
  } else {
    d.style.backgroundImage = value;
  }

  d.style.backgroundSize = "cover";
  d.style.backgroundPosition = "center";
  d.style.backgroundRepeat = "no-repeat";
}

function setWall(i){
  applyBackground(walls[i]);
  localStorage.setItem("wall", i);
  localStorage.removeItem("customWall");
}

function uploadWall(e){
  const file = e.target.files[0];
  if(!file) return;

  const reader = new FileReader();
  reader.onload = function(ev){
    let img = ev.target.result;
    applyBackground(img, true);
    localStorage.setItem("customWall", img);
    localStorage.removeItem("wall");
  };
  reader.readAsDataURL(file);
}

window.onload = ()=>{
  let custom = localStorage.getItem("customWall");
  let w = localStorage.getItem("wall");

  if(custom){
    applyBackground(custom, true);
  } else if(w !== null){
    setWall(w);
  }
};

/* CLOCK */
setInterval(()=>{
  document.getElementById("clock").innerText =
    new Date().toLocaleTimeString();
},1000);

function shutdown(){
  document.getElementById("sscreen").style.display = "flex";

  setTimeout(()=>{
    location.reload(); // simulate reboot
  }, 2000);
}
