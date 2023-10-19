
var s_hist = [];
var t_hist;

var t_page=0;


async function get_txhist(key, xnum=50, xbef=""){

  if (s_hist.length>0)
    return s_hist;

  var cfg = {limit: xnum, };

  if (xbef!=="")
    cfg = {limit: xnum, before: xbef};

  var con=connect(xloc);

  var tx = await con.getSignaturesForAddress(loadpub, cfg, "finalized");

  s_hist=tx;

  return tx;

  }


async function get_txdata(keydata, page=0){


  console.log('called@ '+page);
//  if xbef

  var sigs = []

 if(page==10){

    keydata = await get_txhist(loadpub, xnum=200, xbef=s_hist[s_hist.length-1].signature);

    page=0;}
  

  for (var i=0;i<keydata.length;i++)

    sigs.push(keydata[i].signature);

  var con=connect(xloc);


  if(sigs.length>0){

    var steps = [page*5, (page+1)*5];

    var tx = await con.getParsedTransactions(sigs.slice(steps[0],steps[1]), { maxSupportedTransactionVersion: 0, commitment: "finalized"});

    t_hist=tx;

    collectKeys(t_hist);

    t_page = page+1;

    return tx;}

  }



function gen_tr(x, y){

  var zstr = (y==null)? [""] : y.split(';');

  var xstr = "<tr><td>";
  xstr += x.slice(0,10) +"..</td><td>";

  for (var j=0;j<zstr.length; j++)
    xstr += zstr[j] +"<br>";

  xstr += "</td></tr>";
  return xstr;
  }


function gentr_Var(x){

  var xstr = "<tr><td>";

  for (var j=0;j<x.length; j++){

//    var t = (x[j].length == 2);
    xstr += x[j] + "</td><td>";
    }

  xstr += "</td></tr>";
  return xstr;
  }



function print_txhist(l){

  var zstr = "<table>"

  for (var i=0;i<l.length; i++)

    zstr += gen_tr(l[i].signature, l[i].memo);

  zstr += "</table>";

  xsend.innerHTML += zstr;

  }


function print_txdata(l){

  var zstr = "<table border=1 class=inline>";

  var coldata = ["id",  "signs", "keys", "fee", "sig1", "lampchange", "lampfinal", "key0", "instructions"];

  zstr+= gentr_Var(coldata);

  for (var i=0;i<l.length; i++){

    var t1_page = ((t_page-1)*5) +i;

    var t1_fee = l[i].meta.fee;

    var t1_sig = l[i].transaction.signatures.length;

    var t1_sig0 = l[i].transaction.signatures[0].slice(0,10);

    var t1_inst = l[i].transaction.message.instructions;

    var t1_keys = l[i].transaction.message.accountKeys.length;

    var t1_lamp = l[i].meta.preBalances[0] - l[i].meta.postBalances[0];

    var t1_lamp2 = l[i].meta.postBalances[0];

    var t1_lamp3 = l[i].transaction.message.accountKeys[0].pubkey.toBase58().slice(0,4);

    var xmeta = l[i].meta;

    var insdata = [];

    for (var j=0;j<t1_inst.length; j++){

      var t2 = t1_inst[j].program;

      var t4 = t1_inst[j].programId.toBase58();


      if (t4 == jm_progKey)

        t2 = "Jupiter market";


      if (t4 == jm_compKey)

        t2 = "priority key";



      var t3 = (t1_inst[j].parsed)? t1_inst[j].parsed.type: "?";
//      var t4 = t1_inst[j].

      insdata.push([t2,' ',t3]);
      }

      for (k in xmeta.preTokenBalances){

        //console.log("test", k);

        var m = xmeta.preTokenBalances[k];

        var m2 = xmeta.postTokenBalances[k];

        if (m && m.owner == loadpub.toBase58())

          insdata.push([m.mint.slice(0,8), m2.uiTokenAmount.uiAmount - m.uiTokenAmount.uiAmount]);

        }

//      for (k in xmeta.postTokenBalances){

  //      console.log("test2", k);

    //    var m = xmeta.postTokenBalances[k];

      //  if (m && m.owner == loadpub.toBase58())

        //  insdata.push([m.mint, m.uiTokenAmount.uiAmount]);

        //}



//    console.log(t1_fee + " "+t1_sig);

//    console.log(insdata);

    zstr+= gentr_Var([t1_page, t1_sig, t1_keys, t1_fee,  t1_sig0,  t1_lamp, t1_lamp2, t1_lamp3]);

    zstr+= gentr_Var(["","",""].concat(insdata));

    }

  xsend.innerHTML += zstr + "</table> <input type=button value='Next' onclick='nextPage()'></input>" ;

  }

async function nextPage(){

  var tx = await get_txdata(s_hist, t_page);

  print_txdata(tx);}


var txKeys = new Map();

function dupCheck(arr){

  var txKeys2 = new Map();

  for (var i=0; i<arr.length; i++){

      if (!txKeys2.has(arr[i]))

        txKeys2.set(arr[i], '');

    }

  var klist = [];

  for(var key of txKeys2.keys()) klist.push(key);

  return klist;

  }


function collectKeys(hist){

  var n = hist.length;

  var Kcount =0;

  for (var i=0;i<n;i++){

    var histrec = hist[i].transaction.message.accountKeys;

    for (var j=0;j<histrec.length;j++){

      var keyx = histrec[j].pubkey.toBase58();

      if (!txKeys.has(keyx)){

        txKeys.set(keyx, '');

        Kcount+=1;

        }

      }

    }

  console.log(Kcount +" keys found");

  }

function retKeys(){

  var klist = [];

  for(var key of txKeys.keys()) klist.push(key);

  return klist;

  }


async function getkeyData_multi(keylist){

  var con=connect(xloc);

  var kx2 = keylist.map(s_pk);

  var n=kx2.length;

  if(n>100) n=100; // limit

  var d1 = await con.getMultipleAccountsInfo(kx2.slice(0,n), {commitment:"confirmed", dataSlice:{offset:0, length:200}}); 

  return d1;

  }


function keyData_estType(xlist){

  var n = xlist.length;

  var res=[];

  for (var i=0;i<n;i++){

    var xtype = "";

    if (xlist[i] == null) xtype="closed";

    if (xtype==""){

      if (xlist[i].executable) xtype="program";

      if (xlist[i].data.length==165) xtype="token_acc";

      if (xlist[i].data.length==170) xtype="token22_acc"; //maybe

      if (xlist[i].data.length==82) xtype="token_mint";

      if ((xlist[i].data.length==0) && (xlist[i].lamports > 1000000)) xtype="user";

      if (xlist[i].owner.toBase58().slice(0,6) == "Sysvar") xtype="sysvar";

      if (xlist[i].owner.toBase58().slice(0,6) == "111111") xtype="user";

      }

    res[i] = xtype;

    }

  return res;

  }


function typeCounter(rex, typ=""){ /// mapsum function

  return rex.map(x=> x==typ).reduce((x,y)=>x+y);

  }

function typeCheck(rex, typ=""){ //

  return rex.map(x=> x==typ);
  
  }


async function get_userMints(l1, m1, mint){

  var n = m1.length;

  var mu = [];

  var mt = [];

  for (var i=0;i<n;i++){

    if(m1[i] == "user"){

      mt.push([l1[i], await det_ATAaddr(l1[i], s_pk(mint))]);
      }

    }

  return mt;

  }


async function get_tokenMints(l1, m1, m2){

  var n = m1.length;

  var mu = [];

  var mt = [];

  for (var i=0;i<n;i++){

    if(m1[i] == "token_acc"){

      //mt.push([l1[i], await det_ATAaddr(s_pk(l1[i]), s_pk(mint))]);

      //m1[i].owner.toBase58()

      var owner = (new sol.PublicKey(m2[i].data.slice(32,64))).toBase58();

      var xmint = (new sol.PublicKey(m2[i].data.slice(0,32))).toBase58();

      mt.push([owner, [l1[i], 0], xmint]);
      }

    }

  return mt;

  }




async function scan_userMints(um){

  var tk_ac = um.map(x => x[1][0].toBase58());

  var zz = await getkeyData_multi(tk_ac)

  var zz2 = keyData_estType(zz);

  var res=[];

  for (var i=0;i<zz2.length; i++){

    if (zz2[i] == "token_acc") res.push(tk_ac);

    }

  return res;

  }


async function collect_txaccounts(page=0){

  var keylist = retKeys().slice(page*100, (page+1)*100);

  var keybals = await getkeyData_multi(keylist);

  var rex = keyData_estType(keybals);

  var tm = await get_tokenMints(keylist, rex, keybals);  

  return [keylist, rex, keybals, tm];

  }


function burstSize(accs, sigs, mints=1, progs=1, owner=2){

  var msgHead = 3;

  var z = 64*(sigs+1);

  var z2 = 32*(mints + progs + owner);

  var z4 = accs * (32 + 9 + 1 + 4); //[key + amount + inst_header + [short_u16s]]

  var lim = 1280; //?

  console.log((msgHead +z+z2+z4) +" "+lim );

  }


function burstEst(sigs, mints=1, progs=1, owner=2){

  var msgHead = 3;

  var z = 64*(sigs+1); //(+1 blockhash)

  var z2 = 32*(mints + progs + owner);

  var z4 = (32 + 9 + 1 + 4); //[key + amount + inst_header + [short_u16s]]

  var lim = 1200; //?

  var t1 = lim - (msgHead +z+z2);

  var t2 = (t1-(t1%z4)) / z4;

  console.log(t2 + "max Accounts, "+(t1%z4)+"Byte rem");

  }

//lookup table per/Transfer ests
function lookupEst(accs, sigs, mints=1, progs=1, owner=2){

  var msgHead = 3;

  var z = 64*(sigs+1);

  var z2 = 32*(mints + progs + owner);

  var z4 = accs * (0*32 + 9 + 1 + 4); //[key + amount + inst_header + [short_u16s]]

  var lim = 1280; //?

  console.log((msgHead +z+z2+z4) +" "+lim );
  

  }


async function burstDrop(acclist, pubtoken,amount=0, dec=0){

  var tx = await tokenTransferInst_2(s_pk(pubtoken), s_pk(acclist[0]), loadpub, amount, dec);

  var n = Math.min(acclist.length, 20);

  for(var i=1;i<n;i++){

    tx = await tokenTransferInst_2(s_pk(pubtoken), s_pk(acclist[i]), loadpub, amount, dec, true, tx);

    }

  return tx;

  }

function xlists(burst){

  var mintadx = burst[3].map(x => x[2]);
  var tokadx = burst[3].map(x => x[1][0]);

  return [mintadx, tokadx];
  }


function listMatch(mint, mintaddrs, tokaddrs){

  var targ = typeCheck(mintaddrs, mint);

  var dest = [];

  for (var i=0; i<mintaddrs.length; i++){

    if(targ[i]) dest.push(tokaddrs[i]);

    }

  return dest;

  }


async function airdropX(mint){

  var n = retKeys().length;
 
  var p=0;

  var airlists = [];

  var listfilter = [];

  while(p*100<n){

    airlists[p] = await collect_txaccounts(p);

    p++;

    }

  for (var q=0; q<airlists.length; q++){

//    if(airlists.length>q){

      var xl = xlists(airlists[q]);

//      console.log(xl[0].length);

      var rz = listMatch(mint, xl[0], xl[1]);

//      console.log(rz.length);

      listfilter = listfilter.concat(rz);

//      console.log(listfilter.length);

//      }

    }

  return listfilter; //[listfilter, airlists];

  }


async function multi_Tx(pubtoken, amount, dec, airlist){

  var n = airlist.length;

  var r = ((n/20)+1) |0;

  var s = ((n / r)+1) |0;

  var txs = [];

  var offset =0;

  for (var i=0; i<n; i+=s){

    var dst = airlist.slice(i, i+s);

    txs[offset] = await burstDrop(dst, pubtoken, amount, dec);

    offset++;

    }

  return txs;

  }


function nsplit(tot, nacc, plac=3){

  return Number((tot/nacc).toFixed(plac));

  }


async function airdrop_fromList(listStr, xmint){

  var xstr = listStr;

  var inval_Chars = "?!@#$%^&*()[]{}<>_- \r\n\'\"";

  for (var i=0;i<inval_Chars.length; i++){

    if(listStr.indexOf(inval_Chars[i])>-1){

      xstr = xstr.replaceAll(inval_Chars[i], '');

      }

    }

  var droplist = xstr.split(',');

  droplist = dupCheck(droplist);

  var dlist2 = droplist.map(s_pk);

  var xuser = dlist2.map((x)=>sol.PublicKey.isOnCurve(x)?"user":""); //false positive for mint addresses!

  var xtoken = await get_userMints(dlist2, xuser, xmint); // filter

  xuser = xtoken.map((x)=>x[0]);

  xtoken = xtoken.map((x)=>x[1][0]);

  return [xuser, xtoken];

  }


async function keytypes2(keylist){

  var keybals = [];

  for(var i=0;i<keylist.length;i+=100){

    var keybals2 = await getkeyData_multi(keylist.slice(i,i+100));

    keybals= keybals.concat(keybals2);

    }

  var rex = keyData_estType(keybals);

  return [keybals, rex];

  }


function xfilter(data, bvec){

  var data2=[];

  for (var i=0;i<data.length;i++){

    if(bvec[i]) data2.push(data[i]);
 
    }

  return data2;

  }
