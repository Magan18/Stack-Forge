let z = 1;
const PASSWORD = "1234";
let openApps = {};

/* WAIT FOR DOM (important fix) */
window.addEventListener("DOMContentLoaded", () => {

  const taskApps = document.getElementById("tapps");

  /* LOGIN */
  window.login = function(){
    if(document.getElementById("password").value === PASSWORD){
      document.getElementById("ls").style.display = "none";
    } else {
      alert("Wrong password");
    }
  };

  /* START MENU */
  window.toggleStart = function(){
    let m = document.getElementById("sm");
    m.style.display = (m.style.display === "block") ? "none" : "block";
  };

  /* OPEN APP (fixed ID mapping) */
  window.openApp = function(id){

    const map = {
      notepad: "npad",
      calc: "calc",
      browser: "b",
      settings: "s"
    };

    let realId = map[id] || id;
    let win = document.getElementById(realId);

    if(!win) return;

    win.style.display = "block";
    win.style.zIndex = ++z;

    if(!openApps[id]){
      let item = document.createElement("div");
      item.className = "task-item";
      item.innerText = id;
      item.onclick = () => focusApp(realId);
      taskApps.appendChild(item);
      openApps[id] = item;
    }
  };

  /* CLOSE */
  window.closeApp = function(id){

    const map = {
      notepad: "npad",
      calc: "calc",
      browser: "b",
      settings: "s"
    };

    let realId = map[id] || id;

    let win = document.getElementById(realId);
    if(win) win.style.display = "none";

    if(openApps[id]){
      openApps[id].remove();
      delete openApps[id];
    }
  };

  /* FOCUS */
  window.focusApp = function(id){
    let win = document.getElementById(id);
    if(win) win.style.zIndex = ++z;
  };

  /* DRAG (fixed bug: attach after DOM load) */
  document.querySelectorAll(".window").forEach(win => {
    let bar = win.querySelector(".title");

    if(!bar) return;

    bar.addEventListener("mousedown", (e) => {

      let offsetX = e.clientX - win.offsetLeft;
      let offsetY = e.clientY - win.offsetTop;

      function move(e){
        win.style.left = (e.clientX - offsetX) + "px";
        win.style.top = (e.clientY - offsetY) + "px";
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
  let exp = "";
  window.calc = function(v){
    let d = document.getElementById("cd");

    if(v === "C"){
      exp = "";
      d.value = "";
      return;
    }

    if(v === "="){
      try{
        exp = Function('"use strict";return (' + exp + ')')().toString();
      } catch {
        exp = "Error";
      }
      d.value = exp;
      return;
    }

    exp += v;
    d.value = exp;
  };

  /* BROWSER */
  window.loadSite = function(){
    let url = document.getElementById("ub").value.trim();

    if(!url) return;

    if(!url.startsWith("http")){
      url = "https://" + url;
    }

    document.getElementById("browserFrame").src = url;
  };

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
      d.style.background = value; // FIX (was backgroundImage)
    }

    d.style.backgroundSize = "cover";
    d.style.backgroundPosition = "center";
    d.style.backgroundRepeat = "no-repeat";
  }

  window.setWall = function(i){
    applyBackground(walls[i]);
    localStorage.setItem("wall", i);
    localStorage.removeItem("customWall");
  };

  window.uploadWall = function(e){
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
  };

  /* LOAD SAVED WALL */
  let custom = localStorage.getItem("customWall");
  let w = localStorage.getItem("wall");

  if(custom){
    applyBackground(custom, true);
  } else if(w !== null){
    setWall(Number(w));
  }

  /* CLOCK */
  setInterval(()=>{
    document.getElementById("clock").innerText =
      new Date().toLocaleTimeString();
  }, 1000);

  /* SHUTDOWN */
  window.shutdown = function(){
    document.getElementById("sscreen").style.display = "flex";

    setTimeout(()=>{
      location.reload();
    }, 2000);
  };

});
