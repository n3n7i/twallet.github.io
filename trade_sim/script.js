
var autoTrader = {};

var ls_Dataname = "aT";


function resetWallet(){

  autoTrader = {}; 
  autoTrader.coinlist = [];
  autoTrader.coin_p = [];
  autoTrader.coin_q=[];
  autoTrader.coin_contract=[];
  }


async function init_starterWallet(){

  autoTrader = {}; 
  autoTrader.coinlist = starter_wallet;
  autoTrader.coin_p = [0,0,0,0]; // ?
  autoTrader.coin_q = starter_quant; 
  autoTrader.coin_contract= starter_ca;
  
  await readPrices(starter_ca);
  
  //errs?
  if (xprices.length == 4){
  
    autoTrader.coin_p = xprices;
    }
    
  fresh_display();  
  }


var starter_wallet = ["sol", "jup", "jito", "pyth"];

var starter_ca = ["So11111111111111111111111111111111111111112",
		  "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
		  "jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL",
		  "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3"]; //3
		  
var starter_quant = [1 - (0.002 *3), 0, 0, 0]


function checkInit(){

  return localStorage.getItem("Init") == "true";
  }


function checkAutosave(){

  return localStorage.getItem("Autosave") == "true";
  }


function setStorage(x,y){
  localStorage.setItem(x, y);
  }


function fresh_display(){

  drawTable();
  setup1.innerHTML = drawCombo('ct1') + buySell_buttons() + "<br> Trade with: " + drawCombo('ct2');
  drawChart_select();
  }


function autoInit(){

  if (checkInit()){
    get_aT();
    drawTable();
    setup1.innerHTML = drawCombo('ct1') + buySell_buttons() + "<br> Trade with: " + drawCombo('ct2');
    }
  }

function load_Wallet(){

  //if (checkInit()){
    get_aT();
    drawTable();
    setup1.innerHTML = drawCombo('ct1') + buySell_buttons() + "<br> Trade with: " + drawCombo('ct2');
    //}
  }



function put_aT(){

  localStorage.setItem("aT", JSON.stringify(autoTrader));
  }


function get_aT(){

  autoTrader = JSON.parse(localStorage.getItem("aT"));
  }



function set_coinlist(x){
  autoTrader.coinlist = x;
  }
  
function set_coinquant(y){
  autoTrader.coin_q = y;
  }

function set_coinprice(z){
  autoTrader.coin_p = z;
  }

function set_coinaddress(w){
  autoTrader.coin_contract = w;
  }


async function refresh_Prices(){

  await readPrices(autoTrader.coin_contract);
  
  //errs?
  //if (xprices.length == 4){
  
    autoTrader.coin_p = xprices;
    //}
    
  fresh_display();  
  }


function drawTable(){

  var n = autoTrader.coinlist.length;

  var xstr = "<table border='1px solid #000'>";

  xstr += "<tr><td width='150px'>Coin name</td><td width='150px'> number held</td><td width='150px'> current price</td><td width='150px'> balance</td>";

  var balance = 0;

  for (var i=0;i<n;i++){

    var zstr = "<tr><td>" + autoTrader.coinlist[i] +"</td>";
    xstr = xstr + zstr;
    zstr = "<td> #" + autoTrader.coin_q[i] +"</td>";
    xstr = xstr + zstr;
    zstr = "<td> @" + autoTrader.coin_p[i] +"</td>";
    xstr = xstr + zstr;
    zstr = "<td> $" + (autoTrader.coin_q[i] * autoTrader.coin_p[i]) +"</td></tr>";
    xstr = xstr + zstr;
    balance += (autoTrader.coin_q[i] * autoTrader.coin_p[i]);
    }
  
  var zstr = "<tr><td></td><td></td><td></td><td> $" + balance + "</td></tr>"
  xstr = xstr + zstr;
  output1.innerHTML = xstr + "</table>";

  }


function drawInputs_B(zstr, zid='empty'){

  var xstr = "<input type=button value='" +zstr+"' id='"+zid+"' onclick='xHandler(this)'></input>";

  return xstr;
  }


function coinInput(zlabel='enter', zid='field'){

  return zlabel+": <input type=text id='"+zid+"'></input><br>";
  }

function draw_coinEntry(){

  var cE_str = drawInputs_B("hide", 'c_done') + "<br>";

  cE_str += coinInput("coin name", 'cn') + coinInput("coin address", 'ca') + coinInput("coin quant", 'cq') + coinInput("price", 'cx');
 
  cE_str += drawInputs_B("Add", 'c_add');

  input1.innerHTML = cE_str;
  }

function addEntry(){
  var c_cn = cn.value;
  var c_ca = ca.value;
  var c_cq = Number(cq.value) || 0; //!
  var c_cp = Number(cx.value) || 0;

  if(c_ca.length > 24){
    autoTrader.coinlist.push(c_cn);
    autoTrader.coin_contract.push(c_ca);
    autoTrader.coin_q.push(c_cq);
    autoTrader.coin_p.push(c_cp);
    
    console.log("added!");
    }

  }


function draw_coinEntry_cl(){
  var cEstr = drawInputs_B("show", 'c_show');

  input1.innerHTML = cEstr;
  }


async function xHandler(x){
  console.log("handling?", x);

  if (x.id=="c_done") draw_coinEntry_cl();
  if (x.id=="c_show") draw_coinEntry();

  if (x.id=="c_add") {addEntry(); drawTable();}

  if (x.id=="c_buy") simTrade("buy");
  if (x.id=="c_sell") simTrade("sell");
  
  if (x.id=="c_Tam") showValue();
  if (x.id=="c_Tam2") showAmount();
  
  if (x.id=="m_init") init_starterWallet();
  if (x.id=="m_load"){ load_Wallet(); refresh_Prices();}
  if (x.id=="m_save") put_aT();
  
  if (x.id=="ch_day"){ fetchchart_draw(autoTrader.coin_contract[coinchart.selectedIndex], 1); }
  if (x.id=="ch_day7"){ fetchchart_draw(autoTrader.coin_contract[coinchart.selectedIndex], 7); }
  if (x.id=="ch_day30"){ fetchchart_draw(autoTrader.coin_contract[coinchart.selectedIndex], 30); }
  if (x.id=="ch_day90"){ fetchchart_draw(autoTrader.coin_contract[coinchart.selectedIndex], 90); }
  if (x.id=="ch_day365"){ fetchchart_draw(autoTrader.coin_contract[coinchart.selectedIndex], 365); }
  
  }
 

window.addEventListener('beforeunload', (event) => {

  console.log("Fired!");
  if (checkAutosave()){
    put_aT();
    console.log("Stored!");
    }

  event.preventDefault();
  //console.log("?");
  //promptSave();

});


function drawCombo(zid){

  var n = autoTrader.coinlist.length;

  var xstr = "<select id='"+zid+"'>";

  for (var i=0;i<n;i++){

    xstr += "<option>" + autoTrader.coinlist[i] + "</option>";

    }

  xstr += "</select>";

  return xstr;

  }

function coinInput_change(zlabel='enter', zid='field'){

  return zlabel+": <input type=text id='"+zid+"' onchange='xHandler(this)'></input>";
  }	


function buySell_buttons(){

  var xstr = coinInput_change("Amount", 'c_Tam');

  xstr += coinInput_change("Value", 'c_Tam2');
  
  xstr += "<br>"+ drawInputs_B("Buy", 'c_buy') + "<span width=50></span>"+ drawInputs_B("Sell", 'c_sell');

  return xstr;

}


function simTrade(pn){

  var item1 = ct1.selectedIndex;
  var item2 = ct2.selectedIndex;

  var xquant = Number(c_Tam.value) || 0;

  var p1 = autoTrader.coin_p[item1];
  var p2 = autoTrader.coin_p[item2];

  var q1 = autoTrader.coin_q[item1];
  var q2 = autoTrader.coin_q[item2];
  
  if (item1 == item2) return;  
  if (xquant <= 0) return;
  if (p1<=0 || p2<=0) return;

  if (pn=="buy"){ 
    console.log("??");

    var v1 = p1*xquant;
    var v2 = p2 * q2;

    if (v2 > v1){
      console.log("balance ok?");
      
      q2 = (v2 - v1) / p2;
      q1 = ((p1*q1) + v1) / p1;

      console.log(q1, q2);
      autoTrader.coin_q[item1] = q1;
      autoTrader.coin_q[item2] = q2;
      }
    }
    
    
   if (pn=="sell"){ 
    console.log("??");

    var v1 = p1 * xquant;
    var v2 = p2 * q2;

    if (q1 > xquant){
      console.log("balance ok?");
      
      var nq1 = q1 - xquant;
      var nq2 = q2 + (v1 / p2);

      console.log("old balance:", q1, q2);      
      console.log("new balance:", nq1, nq2);
      autoTrader.coin_q[item1] = nq1;
      autoTrader.coin_q[item2] = nq2;
      }
    }
 
  drawTable();
  }

function showValue(){

  var item1 = ct1.selectedIndex;
  var p1 = autoTrader.coin_p[item1];
  var xquant = Number(c_Tam.value) || 0;
  
  console.log(xquant, p1, xquant * p1);
  c_Tam2.value = xquant * p1;
  }
  

function showAmount(){

  var item1 = ct1.selectedIndex;
  var p1 = autoTrader.coin_p[item1];
  var xquant = Number(c_Tam2.value) || 0;
  
  console.log(xquant, p1, xquant / p1);
  c_Tam.value = xquant / p1;
  }

  
  
function drawChart_select(){

  var dc_str = "<br> Chart select: "+ drawCombo('coinchart') + "<br>";
  
  dc_str += drawInputs_B("day", 'ch_day') + drawInputs_B("7 days", 'ch_day7') + drawInputs_B("30 days", 'ch_day30');
  
  dc_str += drawInputs_B("90 days", 'ch_day90') + drawInputs_B("365 days", 'ch_day365');
  
  chartsel.innerHTML = dc_str;

}  

