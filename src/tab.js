
function initTable(cols){

  var n = cols.length;

  var xstr= "<table><tr>"

  for (var i=0;i<n;i++){

    xstr += "<td>" +cols[i]+ "</td>";

    }

  xstr += "</tr><tr>";

  return xstr;

  }
  
function tab_addElem(tabstr, item){

  return tabstr + "<td>" + item + "</td>";}


function tab_nextrow(tabstr){

  return tabstr + "</tr><tr>";}


function tab_close(tabstr){

  return tabstr + "</tr></table>";}