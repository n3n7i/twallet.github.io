

function show_Addr(key){
  document.getElementById("Addr").innerHTML = key.publicKey.toBase58();
  }

function show_Balance(Lamp){
  document.getElementById("Bal").innerHTML = (Lamp / 10**9).toString();
  }


async function show_SolVal(){

  var sym = "SOL";

  var str1 = 'https://price.jup.ag/v4/price?ids=' + sym;

  var res = await (await fetch(str1, {headers:{accept: 'application/json'}})).json();

  console.log(res);

  var p = res.data.SOL.price;

  mobWallet.solPrice = p;

  document.getElementById("Sol").innerHTML = "$"+p.toFixed(2);

  }


async function jupToken_info(){

  var JM_addr2 = "https://token.jup.ag/all"

  var resp = await (await fetch(JM_addr2, {headers:{accept: 'application/json'}})).json();

  return resp;

  }


function walletFilter(wmint, jdata){

  var n = wmint.length;

  var m = [];

  for (var i=0; i<n; i++){

    var temp = jdata.filter((x)=> x.address == wmint[i]);

    m.push({id: i, data: temp[0]});

    }

  return m;

  }


async function dataReq_jup_prices(symb){

  var str1 = 'https://price.jup.ag/v4/price?ids=';

  var xstr2 = "";

  var xlist = [];

  var rxmax = Math.min(symb.length, 100); // limit to 100
  
  for (var k=0;k<rxmax; k++){

    var sym = symb[k];

    xstr2 += sym + ",";

    xlist.push(sym);

    }

  var res = await( await fetch(str1 + xstr2, {headers:{accept: 'application/json'}})).json();

  return res;

  }

function x_interpret(pdata){

  var xlist = [];
  for (x in pdata.data){
    xlist.push({id: x, data: pdata.data[x]});
    }
  return xlist;
  }


function show_Tokens(t_data){

  var t_list = document.getElementById("Tok");

  var n = t_data[0].length;

  for (var i=0;i<n;i++){

    t_list.innerHTML += "<span>"+t_data[0][i].slice(0,10)+" "+ t_data[1][i].toString() + "</span><br>";

    }

  }


function show_Tokens2(t_data){

  var t_list = document.getElementById("Tok2");

  var n = t_data[0].length;

  for (var i=0;i<n;i++){

    t_list.innerHTML += "<span>"+t_data[0][i]+" "+ t_data[1][i] + "</span><br>";

    }

  }

function show_Tokens3(t_data, targ="Tok3"){

  var t_list = document.getElementById(targ);

  var n = t_data[0].length;

  for (var i=0;i<n;i++){

    t_list.innerHTML += "<span>"+t_data[0][i]+" "+ t_data[1][i] + "</span><br>";

    }

  }


function show_Tokens3x(t_data, targ="Tok3"){

  var t_list = document.getElementById(targ);

  var n = t_data[0].length;

  var m = t_data.length;

  for (var i=0;i<n;i++){

    var xstr = "<span>";

    for (var j=0; j<m; j++){

      xstr += t_data[j][i] + " ";

      }

    t_list.innerHTML += xstr + "</span><br>";

    }
  }


//<div class="green grad2B">Test</div> <span class=right>quant</span><br>


function show_Tokens4(t_data, targ="Tok"){

  var t_list = document.getElementById(targ);

  var n = t_data[0].length;

  var m = t_data.length;

  var xstr = "";

  for (var i=0;i<n;i++){

    //for (var j=0; j<m; j++){

      //xstr += t_data[j][i] + " ";

      //}

    var zstr = "<div class='green grad2B' onclick='callToken("+i+")'>" + t_data[0][i] + "</div><span class='pad right'>" + t_data[3][i] + "</span><br>";

    zstr += "<div class='plain fillwidth'>" + t_data[2][i] + "<span class='plain right'>" + t_data[1][i] + "</span></div><br><hr>";

    xstr += zstr;

    }

  t_list.innerHTML = xstr;

  }



function show_Elementx(t_data, targ){

  var t_list = document.getElementById(targ);

  t_list.innerHTML = t_data;

  }



function searchTokens(){
  
  var tx = document.getElementById("search").value;

  var rx = jupData.filter((x) => x.symbol.slice(0,tx.length).toUpperCase() == tx.toUpperCase());

  document.getElementById("search_res").value = JSON.stringify(rx);

  }


function searchTokens_name(){
  
  var tx = document.getElementById("search").value;

  var rx = jupData.filter((x) => x.name.toUpperCase().indexOf(tx.toUpperCase()) > -1);

  var rx2 = rx.filter((x) => x.tags[0] !== "Unknown").map((x)=>x.name);

  document.getElementById("search_res").value = JSON.stringify(rx2);

  }


function sortx(a,b){ 

  if (a.value>b.value) return 1;
  if (b.value>a.value) return -1;
  return 0;

  }


function callToken(x2){

  console.log(x2, mobWallet.tokens[x2].id);

  mobWallet.tokenSelect = x2;

  zAmount();

  xAmount();

  iSel.src = jupData.filter((x)=>x.address == mobWallet.tokens[x2].mint)[0].logoURI;

  }



function saveData2(key, label){

  var xdata = "["+key.secretKey.toString()+"]";

  var a = new Blob([xdata], {type: "text/html"});
  var u = URL.createObjectURL(a);

  //xcons.log("<a href='"+u+"'>file save</a>"+label+"<br>");

  return "<a href='"+u+"' download='keyfile.txt'>file save</a>"+label+"<br>"
  }



var w_exp = false;

async function wal_export(){

  console.log("export?");

  if(!w_exp){

    var savelink = saveData2(mobWallet.keypair);


    console.log(savelink);

    show_Elementx(savelink, "Addr");}

  if (w_exp) show_Elementx(mobWallet.address, "Addr");

  w_exp = !w_exp;

/*
  var opfsRoot = await navigator.storage.getDirectory();

// On the main thread, not in the Worker. This assumes
// `fileHandle` is the `FileSystemFileHandle` you obtained
// the `FileSystemSyncAccessHandle` from in the Worker
// thread. Be sure to close the file in the Worker thread first.
  var fileHandle = await opfsRoot.getFileHandle('keyfile1.txt');
  try {
  // Obtain a file handle to a new file in the user-visible file system
  // with the same name as the file in the origin private file system.
    var saveHandle = await showSaveFilePicker({
      suggestedName: fileHandle.name || ''
      });
    var writable = await saveHandle.createWritable();
    await writable.write(await fileHandle.getFile());
    await writable.close();
    } 
  catch (err) {
    console.error(err.name, err.message); 
    }

*/

  //<a href="/resources/report.pdf" download="latest-reports.pdf">

  }


function xAmount(){

  var in_Am = document.getElementById("AmIn").value;

  console.log(mobWallet.tokenSelect);

  console.log(in_Am);

  if (mobWallet.tokenSelect > -1){

    var p1 = mobWallet.tokens[mobWallet.tokenSelect].price;

    console.log(p1);

    console.log(p1 * in_Am);

    show_Elementx("$"+(p1 * in_Am).toFixed(3), "AmVal");

    }

  }


function zAmount(){

  if (mobWallet.tokenSelect > -1){

    var p1 = mobWallet.tokens[mobWallet.tokenSelect].price;

    console.log(p1);

    console.log(1.0 / p1);

    show_Elementx("# "+(1.0 / p1).toExponential(2), "UnitVal");

    }

  }

