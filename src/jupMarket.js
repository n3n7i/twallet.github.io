

var jupdata = [];

var jupstrict = [];

var jups_mat = [];

//var JM_addr1 = "https://token.jup.ag/strict"

//var JM_addr2 = "https://token.jup.ag/all"

var JM_api4 = "https://quote-api.jup.ag/v4/quote"; 

var JM_api4B = 'https://quote-api.jup.ag/v4/swap';

// update api?

var JM_price = "https://api.jup.ag/price/v2?ids=";

var JM_addr1 = "https://tokens.jup.ag/tokens?tags=verified";

var JM_addr2 = "https://tokens.jup.ag/tokens?tags=community";

var JM_api6 = "https://quote-api.jup.ag/v6/quote"; 

var JM_api6B = 'https://quote-api.jup.ag/v6/swap';

var J_api6 = true;


var JM_order1 = "https://jup.ag/api/limit/v1/openOrders";

var JM_order2 = "https://jup.ag/api/limit/v1/orderHistory";

var jm_prices = [];

var jm_progKey = "JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB";

var jm_compKey = "ComputeBudget111111111111111111111111111111";


//?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=10000&slippageBps=1' 

var mintlist = ["So11111111111111111111111111111111111111112", "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"]


//mintlist.push("kinXdEcpDQeHPEuQnqmUgtYykqKGVFq6CeVX5iAHJq6");

mintlist.push("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB");


var mlist_Dec = [9, 6, 6];




async function dataInit_jup(extra = false){ //t1, t2, am){

  var rx = JM_addr1;

  if (extra)

    rx = JM_addr2;

  fetch(rx, {headers:{accept: 'application/json'}}).then((resp) => resp.json()).then((data) => {

	//res3 = data; 
	jupstrict = data;

        xcons.log("jupdata loaded");
	} );

  }



function matchToken(){

  jups_mat = [];

  var n1 = wallet_Tok.length;

  var n2 = jupstrict.length;

  for (var i=0; i<n2; i++){

    for (var j=0; j<n1; j++){

      var m1 = jupstrict[i].address == wallet_Tok[j].id;

      if (m1){

        jups_mat.push({strict: i, wallet:j});

        }

      }

    }

  }



function searchToken(){

  var str1 = prompt("token symbol?").toUpperCase();

  if(str1 !== ""){

    for (var i=0; i<jupstrict.length; i++){

      if (jupstrict[i].symbol.toUpperCase() == str1){

        console.log(jupstrict[i]);

        }

      if (jupstrict[i].name.toUpperCase().search(str1)>-1){

        console.log(jupstrict[i]);

        }

      }

    }

  }


function searchMint(){

  var str1 = prompt("token mint?");

  if(str1 !== ""){

    for (var i=0; i<jupstrict.length; i++){

//      if (jupstrict[i].symbol.toUpperCase() == str1){

//        console.log(jupstrict[i]);

//        }

      if (jupstrict[i].address.search(str1)>-1){

        console.log(jupstrict[i]);

        }

      }

    }

  }


function searchMintB(str1){

  for (var i=0; i<jupstrict.length; i++){

    if (jupstrict[i].address.search(str1)>-1)

        return jupstrict[i].name;
    }

  return "[unstrict]"

  }




function checkMint(x){

  var n = wallet_Tok.length;

  var xfound = false;

  for (var k=0;k<n;k++){

    if (x==wallet_Tok[k].id)

       xfound = true;

    }

  return xfound;

  }


var tickRes = [];

var tickRes_pc = [];



function reset_ticker(syb){

  tickRes = [];

  tickRes_pc = [];

  targ = syb;

  }



async function dataReq_jup_price_X(sym){

  //var str1 = 'https://price.jup.ag/v4/price?ids=' + sym;// JM_price

  var str1 = JM_price + sym;

  fetch(str1, {headers:{accept: 'application/json'}}).then((resp) => resp.json()).then((data) => {
  
  //if (tickRes.length==0)

  tickRes.push(data.data[sym].price);

  if (tickRes.length>1)

    tickRes_pc.push(tickRes[tickRes.length-1] / tickRes[0] * 10000 - 10000 + 50);

  } );

  }  


async function dataReq_jup_prices(){

  //var str1 = 'https://price.jup.ag/v4/price?ids=';

  var str1 = JM_price;

  var xstr2 = "";

  var xlist = [];

  var xlist2 = [];

  var rxmax = Math.min(jups_mat.length, 100);
  
  for (var k=0;k<rxmax; k++){

    var sym = jupstrict[jups_mat[k].strict].address;

    xstr2 += sym + ",";

    xlist.push(sym);

    xlist2.push(jupstrict[jups_mat[k].strict].symbol);

    }

  fetch(str1 + xstr2, {headers:{accept: 'application/json'}}).then((resp) => resp.json()).then((data) => {

    xcons.log("prices fetched");

    console.log(data);

    jm_prices = data.data;

    var xtot = 0;

    var xpass = [];

    for (var k=0;k<xlist.length; k++){

      if (jm_prices[xlist[k]]){

        var p = jm_prices[xlist[k]].price;

        var n = xlist2[k];

        var am = wallet_Tok[jups_mat[k].wallet].amount;

	xpass.push({mint: wallet_Tok[jups_mat[k].wallet].id, symbol: n, amount: am, val: am*p, dec: wallet_Tok[jups_mat[k].wallet].decimals});

        xcons.log(n + "<br>" + am + " @$" + p + "<br>" + am*p);
        //xcons.log();

        xtot += am*p;

        }

      }

    marketData(xpass);

    xcons.log("$" + xtot);

    } );

}


var md_Store = [];


function marketData(x){

  popup3.log = printthis;

  var xcombo = "<select id='baseCur'>"
  xcombo = xcombo + "<option value='USDC'>USDC</option>"
  xcombo = xcombo + "<option value='USDT'>USDT</option>"
  xcombo = xcombo + "<option value='SOL'>SOL</option></select>"

  tstr = initTable(["Market", "", xcombo, ""]);

  md_Store = [];

  for (k=0; k<x.length; k++){

    md_Store.push(x[k]);

    //var zdata = "" + x[k].symbol + " "+ x[k].amount;
    //tstr = tab_addElem(tstr, zdata);

    tstr = tab_addElem(tstr, x[k].symbol);
    tstr = tab_addElem(tstr, x[k].amount);

    zdata = " <input type=text name='jam'> </input> <input type=button value=' + ' name='jbuy' data-id="+k+"></input><input type=button value=' - ' name='jsell' data-id="+k+"></input>";

    tstr = tab_addElem(tstr, zdata);

    tstr = tab_nextrow(tstr);

    }

  tstr = tab_close(tstr);

  var xcheck = "<br><small>Use ExactOut for buy: <input type=checkbox name='buyExact' value='allow ExactOut' disabled /><br>";

  xcheck += "<small>(use currency-pair amount for buy value if unchecked)</small><br>";

  xcheck += "Use ExactOut for sell: <input type=checkbox name='sellExact' value='allow ExactOut' disabled /><br>";

  xcheck += "<small>(use currency-pair amount for sell value if checked)</small><br></small>";

  xcheck += "<hr><small>Use directRoutes </small><input type=checkbox name='r_direct' value='require direct' disabled /><br><small><br></small>";

  //xcheck += "+1% priority <input type=checkbox name='prior1' value='allow ExactOut' /><br><small>.<br></small>";

  xcombo = "Slip basis: <select id='baseSlip'>"
  xcombo = xcombo + "<option value='def'>0.05%</option>"
  xcombo = xcombo + "<option value='def2' selected>0.25%</option>"
  xcombo = xcombo + "<option value='def3'>0.75%</option></select>"

  xcheck = xcheck + xcombo;

  xcombo = " || priority: <select id='basePrior'>"
  xcombo = xcombo + "<option value='def'>+0.0% [x1.0]</option>"
  xcombo = xcombo + "<option value='def1' selected>+1.0% [x1.01]</option>"
  xcombo = xcombo + "<option value='def2'>+5.0% [x1.05]</option>"
  xcombo = xcombo + "<option value='def3'>+10.0% [x1.10]</option>"
  xcombo = xcombo + "<option value='def4'>+50% [x1.50]</option>"
  xcombo = xcombo + "<option value='def5'>+150% [x2.50]</option>"
  xcombo = xcombo + "<option value='def6'>+400% [x5.00]</option></select>"
//  xcombo = xcombo + "<option value='def9'>+900% [x10.00]</option>"
//  xcombo = xcombo + "<option value='def9'>+2400% [x25.0]</option>"


  popup3.log(tstr + xcheck + xcombo);

  market_setHandler();

  popup3.classList.remove("hide");

  }


function market_setHandler(){

  var v1 = document.getElementsByName('jbuy');

  for (var j=0;j<v1.length;j++){

    v1[j].onclick = function (t){ getQuote(t, "buy"); };

    }

  var v2 = document.getElementsByName('jsell');

  for (var j=0;j<v2.length;j++){

    v2[j].onclick = function (t){ getQuote(t, "sell"); };

    }


  }


async function getQuote(id, xmode){

  var id2 = Number(id.target.getAttribute("data-id"));

  console.log(id2);

  var t1 = md_Store[id2].mint;

  var t2 = baseCur.value;

  var am = document.getElementsByName('jam')[id2].value;

  console.log("Quote for", t1, t2, am, xmode, "?");

  var t2b = "";

  var dec = md_Store[id2].dec;

  if (t2=="USDT") t2b = mintlist[2];

  if (t2=="USDC") t2b = mintlist[1];

  if (t2=="SOL") t2b = mintlist[0];

  if (xmode=="sell"){

      if (!document.getElementsByName("sellExact")[0].checked)

        await dataReq_jup(t1, t2b, am * 10**dec);

      if (document.getElementsByName("sellExact")[0].checked){

        var ind_dec = 0;

        if (t2=="USDT") ind_dec=2;

	if (t2=="USDC") ind_dec=1;

	if (t2=="SOL") ind_dec =0;

        var xdec = mlist_Dec[ind_dec];

        await dataReq_jup(t1, t2b, am * 10**xdec, true);

        }  };


  if (xmode=="buy"){

      if (document.getElementsByName("buyExact")[0].checked)

        await dataReq_jup(t2b, t1, am * 10**dec, true);


      if (!document.getElementsByName("buyExact")[0].checked){

        var ind_dec = 0;

        if (t2=="USDT") ind_dec=2;

	if (t2=="USDC") ind_dec=1;

	if (t2=="SOL") ind_dec =0;

        var xdec = mlist_Dec[ind_dec];

	await dataReq_jup(t2b, t1, am * 10**xdec);

        }

     }



  console.log(jupdata);

  //var tx = await

  }


var last_qt = [];



function showQuote(x){


  if (J_api6){


      console.log("Using api v6!");

      console.log(x);

      }


  var z = x.data.data;

  if (!z){

    console.log("Data.data empty?\n", x.data);

    if (J_api6)

//      console.log(x);

      z = [x.data];

    //return 0;
    }

  var n = z.length;

  var xstr = "Routes: "+n+"<br>"

  if (n==0){

    xsend.log("Quote data: <br>" + xstr);

    return 0;}

  var rhops=[];

  var rmints=[];

  var chmints = [];

  var hmints = [];

  var sval = 10;

  var sid = -1;

  var sid2 = -1;

  var am1_in = Number(z[0].inAmount);

  var amn_in = Number(z[n-1].inAmount);

  var am1_out = Number(z[0].outAmount);

  var amn_out = Number(z[n-1].outAmount);

  xstr = xstr + "route price differences, inp: " + (((amn_in/am1_in)-1)*100).toFixed(3) + "%, out:" + (((am1_out / amn_out)-1)*100).toFixed(3) + "% <br>";

//  ((am1_in/amn_in) > 1.001)

  if ((n>0) & (!J_api6)){

    for (var i=0;i<n; i++){

      rhops[i] = z[i].marketInfos.length;

      var xmints = [];

      if (rhops[i]<sval){
        sval = rhops[i];
        sid = i;}

      var okMints=0;

      if (rhops[i]>0)
      for (var j=0; j<rhops[i]; j++){
 
        var xhop = z[i].marketInfos[j];
  
        xmints.push([xhop.inputMint.slice(0,8), xhop.outputMint.slice(0,8)]);

        okMints += checkMint(xhop.outputMint);

        }

      rmints.push(xmints);

      chmints.push(okMints);

      hmints.push(okMints == rhops[i]);

      }

    xstr = xstr + "route hops:" + rhops.toString() + ", held mints: "+ chmints.toString() + "<br>";

    xstr = xstr + "Shortest route: " + sid + ", hops: "+sval+ "<br>";

    xstr = xstr + rmints[sid].toString() + "<br>";

    }

  for (var i=0; i<hmints.length; i++){

    if ((sid2==-1) && (hmints[i] == true))

      sid2= i;

    }


  var selectMint =0;

  if (sid2 > -1)
    selectMint = sid2;

  if (sid2 == -1)
    selectMint = sid;

  if (selectMint == -1)
    selectMint = 0;

  console.log("route ", selectMint);

  if ((n>0)){

    xstr = xstr + "r Select 1: " + sid +  ", r Select 2: " + sid2 + "<br>";

    xstr = xstr + "best by price:" + z[0].inAmount + "u -> " + z[0].outAmount + "u <br>";

    if (!J_api6) xstr = xstr + "token route: " + rmints[0].toString() + "<br>";

    if (J_api6) xstr = xstr + "token hops: " + z[0].routePlan.length.toString() + "<br>";

    xstr = xstr + "best by route:" + z[selectMint].inAmount + "u -> " + z[selectMint].outAmount + "u <br>";

    if (!J_api6) xstr = xstr + "token route: " + rmints[selectMint].toString() + "<br>";

    xstr = xstr + "swap mode: " + z[0].swapMode + ", max slip: " + z[0].slippageBps + " base points<br>";

    //xstr = xstr + "token route: " + rmints[0].toString() + "<br>";

    //xstr = xstr + z[0].marketInfos.length + " hops<br>";

    //xstr = xstr + "Max Lamp est: " + ((z[0].marketInfos.length)*2040000 + 900000 + 5000) + "L <br>";

    if (!J_api6) xstr = xstr + "Est lamp required: " + ((z[selectMint].marketInfos.length - chmints[selectMint])*2040000 + 5000) + "L <br>";

    //xstr = xstr + "~Min lamp required: " + (900000 + 5000) / 5000 + " Sig <br>";

    xstr = xstr + "<input type=button value='Gen tx' onclick='jp_gentx()' />";

    last_qt = z[selectMint];

    }

  xsend.log("Quote data: <br>" + xstr);

  }

var enc_tx;


async function jp_gentx(){

  console.log(last_qt);

  var t1 = await (await dataPost_jup(last_qt, loadpub.toBase58())).json();

  console.log(t1);

  enc_tx = t1;



  //console.log("swap data length:", t1.swapTransaction.length);

  checktx = sol.VersionedTransaction.deserialize(Buffer.from(t1.swapTransaction, 'base64'));

  if (confirm("Ok to send?")){

    await dataProc_jup(t1.swapTransaction);

    }

  }


var direct_Rt = true;

var direct_Slip = 25;

var slipvals = [5,25,75];


async function dataReq_jup(t1, t2, am, exactOut=false){

  var rx = JM_api4 + "?inputMint=" + t1 + "&outputMint=" + t2 + "&amount="+am

  if (J_api6)

    rx = JM_api6 + "?inputMint=" + t1 + "&outputMint=" + t2 + "&amount="+am + "&restrictIntermediateTokens=true"

  var ex2 = document.getElementsByName("buyExact")[0].checked;

  //if (exactOut && ex2)

  if (exactOut)
    rx = rx + "&swapMode=ExactOut";

  if (direct_Rt && document.getElementsByName("r_direct")[0].checked)

    rx = rx + "&onlyDirectRoutes=true";

  if (direct_Slip !== 0){

    direct_Slip = slipvals[document.getElementById("baseSlip").selectedIndex];

    rx = rx + "&slippageBps="+String(direct_Slip);}

//method: "GET", mode: "no-cors", credentials: "omit",

  fetch(rx, { headers:{accept: 'application/json'}}).then((resp) => resp.json()).then((data) => {

	//res3 = data; 
	jupdata.push({data: data}); 
	showQuote({data:data});
	});

  }


var priorityVals = [0,50,250,500, 2500, 7500, 15000].map((x)=>Math.floor(x/1.4));

var xpriorVals = [0,50,250,500, 2500, 7500, 15000];

async function dataPost_jup(r1, k1, def_comp=35){

  var dcomp2 = priorityVals[document.getElementById("basePrior").selectedIndex];


  var api4 = JM_api4B;

  if (J_api6 == true)

    api4 = JM_api6B;


  if (J_api6 == false){

    console.log("using api v4");

const jup_tx = await (
  await fetch(api4, {
    method: 'POST',
    mode: "no-cors",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      route: r1,
      userPublicKey: k1,
      computeUnitPriceMicroLamports: dcomp2,

      // route from /quote api
      // user public key to be used for the swap
      // auto wrap and unwrap SOL. default is true
      // wrapUnwrapSOL: true,
      // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
      // This is the ATA account for the output token where the fee will be sent to. If you are swapping from SOL->USDC then this would be the USDC ATA you want to collect the fee.
      // feeAccount: "fee_account_public_key"
    })
  })
).json();

}

 if (J_api6 == true){

    console.log("using api v6?");

    var zdata = r1.routePlan[0].swapInfo;

    console.log(zdata);

    console.log(r1);

const jup_tx =   await fetch(api4, {
    method: 'POST',
    headers: {      'Content-Type': 'application/json'    },
    body: JSON.stringify({
      quoteResponse: r1,
      userPublicKey: k1,
      computeUnitPriceMicroLamports: dcomp2,

/**

      quoteResponse,
      // user public key to be used for the swap
      userPublicKey: wallet.publicKey.toString(),
      // auto wrap and unwrap SOL. default is true
      wrapAndUnwrapSol: true,
      // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
      // feeAccount: "fee_account_public_key"
**/
    }),
    });

  return await jup_tx;

  }

//return jup_tx;
}

var checktx;

var altSign = false;

var memoInj = false;


async function dataProc_jup(jtx){

  const swapTransactionBuf = Buffer.from(jtx, 'base64');

  var t = sol.VersionedTransaction.deserialize(swapTransactionBuf);

//var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
  console.log(t);

  checktx = t;

  if (altSign){

    checktx.message.staticAccountKeys[0] = loadkey.publicKey;}

  if (memoInj){

    var bh = checktx.message.recentBlockhash;

    //var sak = checktx.message.staticAccountKeys.map((x)=>x.toBase58());

    //var id = sak.indexOf("ComputeBudget111111111111111111111111111111");

    //var id2 = new sol.PublicKey("Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo");

    //checktx.message.staticAccountKeys[id] = id2;

    var m1 = memoX("swap memo")

    var m2 = msgCompile(m1, bh)

    msgCombine(checktx, m2);

    //new sol.PublicKey("Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo")

    }


// sign the transaction
  t.sign([loadkey]);

  var c = connect(xloc);


// Execute the transaction
/*  const rawTransaction = t.serialize()
  const txid = await c.sendRawTransaction(rawTransaction, {
    skipPreflight: false,
    maxRetries: 2
    });
*/

  var txid = await c.sendTransaction(t, loadkey);
  console.log(txid);


  await c.confirmTransaction(txid);
  console.log(`https://solana.fm/tx/${txid}`);

}


async function dataReq_jup_price_X2(sym){

  var str1 = 'https://price.jup.ag/v4/price?ids=' + sym;

  var z = await fetch(str1, {headers:{accept: 'application/json'}}); //.then((resp) => resp.json()).then((data) => {
  
  var z2 = await z.json();

  var z3 = z2.data[sym].price;

  return z3;

  }  


async function dataReq_jup_orders(sym){

  var str1 = JM_order1 + "?wallet=" + sym;

  var z = await fetch(str1, {headers:{accept: 'application/json'}});

  return z;

  }


async function dataReq_jup_orderHist(sym){

  var str1 = JM_order2 + "?wallet=" + sym;

  var z = await fetch(str1, {headers:{accept: 'application/json'}});

  return z;

  }
  

