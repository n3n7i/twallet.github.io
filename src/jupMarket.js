

var jupdata = [];

var jupstrict = [];

var jups_mat = [];

var JM_addr1 = "https://token.jup.ag/strict"

var JM_addr2 = "https://token.jup.ag/all"

var JM_api4 = "https://quote-api.jup.ag/v4/quote"; 

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

  var str1 = 'https://price.jup.ag/v4/price?ids=' + sym;

  fetch(str1, {headers:{accept: 'application/json'}}).then((resp) => resp.json()).then((data) => {
  
  //if (tickRes.length==0)

  tickRes.push(data.data[sym].price);

  if (tickRes.length>1)

    tickRes_pc.push(tickRes[tickRes.length-1] / tickRes[0] * 10000 - 10000 + 50);

  } );

  }  


async function dataReq_jup_prices(){

  var str1 = 'https://price.jup.ag/v4/price?ids=';

  var xstr2 = "";

  var xlist = [];

  var rxmax = Math.min(jups_mat.length, 100);
  
  for (var k=0;k<rxmax; k++){

    var sym = jupstrict[jups_mat[k].strict].symbol;

    xstr2 += sym + ",";

    xlist.push(sym);

    }

  fetch(str1 + xstr2, {headers:{accept: 'application/json'}}).then((resp) => resp.json()).then((data) => {

    jm_prices = data.data;

    var xtot = 0;

    var xpass = [];

    for (var k=0;k<xlist.length; k++){

      if (jm_prices[xlist[k]]){

        var p = jm_prices[xlist[k]].price;

        var n = xlist[k];

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

  var xcheck = "<br><small>Use ExactOut for buy: <input type=checkbox name='buyExact' value='allow ExactOut' checked /><br>";

  xcheck += "<small>(use currency-pair amount for buy value if unchecked)</small><br>";

  xcheck += "Use ExactOut for sell: <input type=checkbox name='sellExact' value='allow ExactOut' /><br>";

  xcheck += "<small>(use currency-pair amount for sell value if checked)</small><br></small>";

  popup3.log(tstr + xcheck);

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

	await dataReq_jup(t2b, t1, am * 10**xdec, true);

        }

     }



  console.log(jupdata);

  //var tx = await

  }


var last_qt = [];



function showQuote(x){

  var z = x.data.data;

  if (!z)

    return 0;

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

  if (n>0){

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


  if (n>0){

    xstr = xstr + "r Select 1: " + sid +  ", r Select 2: " + sid2 + "<br>";

    xstr = xstr + "best by price:" + z[0].inAmount + "u -> " + z[0].outAmount + "u <br>";

    xstr = xstr + "token route: " + rmints[0].toString() + "<br>";

    xstr = xstr + "best by route:" + z[selectMint].inAmount + "u -> " + z[selectMint].outAmount + "u <br>";

    xstr = xstr + "token route: " + rmints[selectMint].toString() + "<br>";

    xstr = xstr + "swap mode: " + z[0].swapMode + ", max slip: " + z[0].slippageBps + " base points<br>";

    //xstr = xstr + "token route: " + rmints[0].toString() + "<br>";

    //xstr = xstr + z[0].marketInfos.length + " hops<br>";

    //xstr = xstr + "Max Lamp est: " + ((z[0].marketInfos.length)*2040000 + 900000 + 5000) + "L <br>";

    xstr = xstr + "Est lamp required: " + ((z[selectMint].marketInfos.length - chmints[selectMint])*2040000 + 5000) + "L <br>";

    //xstr = xstr + "~Min lamp required: " + (900000 + 5000) / 5000 + " Sig <br>";

    xstr = xstr + "<input type=button value='Gen tx' onclick='jp_gentx()' />";

    last_qt = z[selectMint];

    }

  xsend.log("Quote data: <br>" + xstr);

  }

async function jp_gentx(){

  var t1 = await dataPost_jup(last_qt, loadpub.toBase58());

  console.log(t1);

  if (confirm("Ok to send?")){

    await dataProc_jup(t1.swapTransaction);

    }

  }


async function dataReq_jup(t1, t2, am, exactOut=false){

  var rx = JM_api4 + "?inputMint=" + t1 + "&outputMint=" + t2 + "&amount="+am

  var ex2 = document.getElementsByName("buyExact")[0].checked;

  //if (exactOut && ex2)

  if (exactOut)
    rx = rx + "&swapMode=ExactOut";

  fetch(rx, {headers:{accept: 'application/json'}}).then((resp) => resp.json()).then((data) => {

	//res3 = data; 
	jupdata.push({data: data}); 
	showQuote({data:data});
	});

  }



async function dataPost_jup(r1, k1){

const jup_tx = await (
  await fetch('https://quote-api.jup.ag/v4/swap', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      route: r1,
      userPublicKey: k1,

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

return jup_tx;

}


async function dataProc_jup(jtx){

  const swapTransactionBuf = Buffer.from(jtx, 'base64');

  var t = sol.VersionedTransaction.deserialize(swapTransactionBuf);

//var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
  console.log(t);

// sign the transaction
  t.sign([loadkey]);


  var c = connect(xloc);


// Execute the transaction
  const rawTransaction = t.serialize()
  const txid = await c.sendRawTransaction(rawTransaction, {
    skipPreflight: true,
    maxRetries: 2
    });

  console.log(txid);


  await c.confirmTransaction(txid);
  console.log(`https://solscan.io/tx/${txid}`);

}


