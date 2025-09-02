
//var xcons = console;

var lilist = document.getElementsByTagName("li");

for (var i=0; i<lilist.length; i++){
  lilist[i].addEventListener("click", menuHandler);
  }


var privKey;

async function menuHandler(){

  //lastReq = "";

  xcons.log(this.id);

  var menuid = this.id;

  if (menuid == "new"){
    gen_newKey();
    }

  if (menuid == "open"){

    //mintRead=0;
    if (fileInp.files.length == 1){
      //xcons.log(xfinp.files[0].name + " " + xfinp.files[0].size);

      const reader = new FileReader();
      reader.onload = (evt) => {
        loadKey = evt.target.result;
        var k1 = sol.Keypair.fromSecretKey(new Uint8Array(JSON.parse(loadKey)));

        pubKey = k1.publicKey;
	privKey = k1;

  //      console.log("Loaded!" + pubKey);
        xpubkey.log("pubkey: " +pubKey.toBase58());
        }

      var res = reader.readAsText(fileInp.files[0]);

//      console.log(res);
      //file_readx(fileInp);
      }
    }

  if (menuid == "bal"){
    var con = connect(xloc);
    var bal = await con.getBalance(pubKey);

    xcons.log((bal / 10**9) + " Sol");
    }

  if (menuid == "tok"){

    var z = await tokenData_w();

    xcons.log(z.length+" tokens loaded!");

    }


  if (menuid == "tokj"){

    var z = await jupLoad();

    walletData2 = z;

    xcons.log(z.length+" tokens loaded! (Pt2)");

    walletMatches = getMatches(walletData, walletData2);

    walletData3 = valueData(walletData, walletData2, walletMatches);

    walletData4 = sortByValue(walletData3);

    }

  if (menuid == "tokj"){

    console.log("Display tokens!");

    var dstr = initTable(4);

    dstr = tab_nextrow(dstr);

    var m = walletData4.length;

    for (var i=0;i<m;i++){

      var rstr = tab_addElem("", walletData4[i].mint);

      rstr = tab_addElem(rstr, walletData4[i].ui_Am);

      rstr = tab_addElem(rstr, "$" + walletData4[i].val.toFixed(4));

      rstr = tab_addElem(rstr, "<input type=button onclick='tkSwap(" + i+ ");' value='[swap]' />");

      dstr = tab_nextrow(dstr + rstr);

      }

    dstr = tab_close(dstr);

    xmain.log(dstr);   

    }

  if (menuid == "geckoII")

    getTokenVals_Sol();

  }


//-------------------
//  submenu //
//-------------


var tk_Index;

var tk_data = {};


function tkSwap(x){

  console.log("test?" + x);

  popup4.classList.add("vis");

  var mintSel = walletData4[x].mint;

  var maxSell = walletData4[x].ui_Am;

  tk_Index = walletData4[x].index;

  console.log("test?" + tk_Index);

  var mintDec = walletData[walletMatches[tk_Index][0]].dec;

  tk_data = {mint: mintSel, dec: mintDec, max: maxSell};

  tk_inf_mint.innerHTML = mintSel;

  tk_inf_amount.innerHTML = maxSell;

  }


function setMode(x){

  var xmode = x.options[x.selectedIndex].value;

  console.log(xmode);

  tok_Swap.classList.add('hide');
  tok_Send.classList.add('hide');
  tok_Burn.classList.add('hide');
  tok_Close.classList.add('hide');

  if (xmode=="Swap"){

    tok_Swap.classList.toggle('hide');}

  if (xmode=="Send"){

    tok_Send.classList.toggle('hide');}

  if (xmode=="Burn"){

    tok_Burn.classList.toggle('hide');}

  if (xmode=="Close"){

    tok_Close.classList.toggle('hide');}

  }

function setMax(x){

  if(x=="Send")
    tk_Am1.value = tk_data.max;

  if(x=="SwapA")
    tk_Am2a.value = tk_data.max;

  if(x=="Burn")
    tk_Am3.value = tk_data.max;

  }


var t_tx;


async function getSend(){

  var ind1 = walletMatches[tk_Index][0];

  var src_Addr = walletData_ext.value[ind1].pubkey;

  var to_Addr = s_pk(tk_Addr.value);

  var dest_Addr = await det_ATAaddr(to_Addr, s_pk(tk_data.mint));

  var to_Am = Number(tk_Am1.value);

  var dec = tk_data.dec;

  var tx = await tokenTransferInst_2(src_Addr, dest_Addr[0], pubKey, to_Am, dec, 0);

  t_tx = tx;

  show_Tx("Send token transaction");

  return tx;

  }


async function getBurn(){

  var ind1 = walletMatches[tk_Index][0];

  var src_Addr = walletData_ext.value[ind1].pubkey;

  //var to_Addr = s_pk(tk_Addr.value);

  //var dest_Addr = await det_ATAaddr(to_Addr, s_pk(tk_data.mint));

  var mint_Addr = s_pk(tk_data.mint);

  var to_Am = Number(tk_Am3.value);

  var dec = tk_data.dec;

  var tx = await tokenBurnInst2(src_Addr, mint_Addr, pubKey, to_Am, dec);

  t_tx = tx;

  show_Tx("Burn token transaction");

  return tx;

  }


async function getClose(){

  var ind1 = walletMatches[tk_Index][0];

  var src_Addr = walletData_ext.value[ind1].pubkey;

  //var to_Addr = s_pk(tk_Addr.value);

  //var dest_Addr = await det_ATAaddr(to_Addr, s_pk(tk_data.mint));

  //var mint_Addr = s_pk(tk_data.mint);

  //var to_Am = Number(tk_Am1.value);

  //var dec = tk_data.dec;

  var tx = await tokenCloseInst2(src_Addr, pubKey);

  t_tx = tx;

  show_Tx("Close token transaction");

  return tx;

  }


var pair_Info = ["So11111111111111111111111111111111111111112", "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"];

var pair_Dec = [9, 6, 6];


async function getSwapA(){

  var xpair = tok_Pair.selectedIndex;

  var to_Am = Number(tk_Am2a.value);

  console.log(to_Am);

  var ind1 = walletMatches[tk_Index][0];

  var src_Addr = walletData_ext.value[ind1].pubkey;

  var mint_Addr = s_pk(tk_data.mint);

  var dec = tk_data.dec;

  var qr = await jup_getQuote(tk_data.mint, pair_Info[xpair], (to_Am * (10**dec)).toFixed(0));

  var stx = await jup_getSwap_a(qr, pubKey);

  t_tx = deserialize_Tx(stx);

  show_Tx2("Sell token transaction");

  var xstr = "Swap value: [Sell] $" + Number(qr.swapUsdValue).toFixed(4) + "<br> in: "+ to_Am + "<br>";

  tk_quoteData.innerHTML = xstr + "out: " + (qr.outAmount / 10**pair_Dec[xpair]) + "<br>";

  }



async function getSwapB(){

  var xpair = tok_Pair.selectedIndex;

  var to_Am = Number(tk_Am2b.value);

  var ind1 = walletMatches[tk_Index][0];

  var src_Addr = walletData_ext.value[ind1].pubkey;

  var mint_Addr = s_pk(tk_data.mint);

  var dec = tk_data.dec;

  var dec2 = pair_Dec[xpair];

  var qr = await jup_getQuote(pair_Info[xpair], tk_data.mint, (to_Am * (10**dec2)).toFixed(0));

  var stx = await jup_getSwap_a(qr, pubKey);

  t_tx = deserialize_Tx(stx);

  show_Tx2("Buy token transaction");


  var xstr = "Swap value: [Buy] $" + Number(qr.swapUsdValue).toFixed(4) + "<br> in: "+ to_Am + "<br>";

  tk_quoteData.innerHTML = xstr + "out: " + (qr.outAmount / 10**dec) + "<br>";


  }


function show_Tx(xstr){

  tok_tx.innerHTML = xstr + "<br><input type=button value='Send Tx' onclick='confirm_Tx();'></input>";

  }


async function confirm_Tx(){

  if (confirm("Ok to send Transaction?")){

    var sig = await send_Tx(t_tx, privKey);

    xcons.log("Transaction signature: " + sig);

    }

  }


function show_Tx2(xstr){

  tok_tx.innerHTML = xstr + "<br><input type=button value='Send Tx' onclick='confirm_Tx2();'></input>";

  }


async function confirm_Tx2(){

  if (confirm("Ok to send Transaction?")){

    var sig = await send_Tx_serial(t_tx, privKey);

    xcons.log("Transaction signature: " + sig);

    }

  }

