
var ferret_includes = new Map();


function ferret_script(src){

  if (ferret_includes.has(src)) return;
  
  var s = document.createElement("script");
  s.src = src;
  document.body.appendChild(s);
  
  ferret_includes.set(src, s);
  }