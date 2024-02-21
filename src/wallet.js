
var lastReq = "";


var t_recip;

var t_amount;

var t_memo;


var t_tx;


var xdata;

var val_Curr = "usd";

var cryptRead = false;

var mintpub;
var mintPriv;


var mintA_pub;
var mintAuth;

var mintRead=0;


var dispToken = false;

function Esc(x){
  //console.log(x);
  if (x.key == "Escape"){
    xcons.log("/clear");
    xmain.log("");
    xpubkey.log("");
    xsend.log("");
    loadkey = [];
    loadpub = [];
    res3    = [];
    hshKey  = [];
    }
  }

document.body.onkeydown = Esc;


async function menuHandler(){

  //lastReq = "";

  xcons.log(this.id);

  var menuid = this.id;

  if (menuid == "new"){
    gen_newKey();
    }

  if (menuid == "open"){

    mintRead=0;
    if (xfinp.files.length == 1){
      xcons.log(xfinp.files[0].name + " " + xfinp.files[0].size);
      readx(xfinp);
      }
    }

  if (menuid == "save2"){

    printFile2();

    }

  if (menuid == "send"){

    var v1 = prompt("Public key to recipient");

    var v2 = prompt("Amount to send in Sol");

    var v3 = prompt("Memo Data");

    var v1A = new sol.PublicKey(v1);

    var v1B = sol.PublicKey.isOnCurve(v1A);

    var v2A = Number((Number(v2) * 1000000000).toFixed(0)) + 5000;

    var minAcc_val = 890880 + (5000 * 10); //? fixed

    var v2B = RecentBal > (v2A+minAcc_val);

    //var v2C = RecentBal - v2A;

    var v3A = v3.length < 512;

    console.log(RecentBal +" "+ v2A + " "+v2B);

    xsend.innerHTML = "Send "+Number(v2).toFixed(6) + " Sol <br>";

    xsend.innerHTML = " --{ "+(v2 * 1000000000).toFixed(0) + " L ";  //<br>";

    xsend.innerHTML += "[balCheck: " + (v2B?'✅':'❌') + "] }-- <br>"; 

    xsend.innerHTML += "to "+v1+" [onCurve: " + (v1B?'✅':'❌') +"]<br>";

    xsend.innerHTML += "from "+ loadkey.publicKey.toBase58() +" <br>";

    xsend.innerHTML += "with Memo: [max 512 chars: "+(v3A?'✅':'❌')+"]<br>" + v3;

    xsend.innerHTML += "<br><input value='Send' type=button onclick=sendTransfer();>";

    t_recip = v1A;

    t_amount = Number((Number(v2) * 1000000000).toFixed(0));

    t_memo = v3.slice(0,512);

    }

  if (menuid == "s2u"){
 
    var x1 = prompt("sol Amount:");

    alert("$" + (x1 * RecentSVal).toFixed(3));

    }

  if (menuid == "u2s"){
 
    var x1 = prompt("usd Amount:");

    alert("$"+ x1 +" = "+ (x1 / RecentSVal).toFixed(4) +" Sol");

    }

  if ((menuid == "rMa") || (menuid == "rMb")){

    var lv = RecentSVal / 1000000000;

    var rPe = rentVals[0] / 365;

    if (menuid == "rMb")

       rPe = rentVals[1] / 365;

    var m1 = prompt("N epoch? [days till expiry / 2]");

    var t1 = prompt("N transfers? [/days till expiry]");

    var xres = Number(m1)*rPe + Number(t1)*5000;

    console.log("Lamp req: " + xres);

    console.log("Max expiry: " + (xres / rPe) * 2);

    console.log("Max transactions: " + (xres / 5000));

    console.log("Value: " + xres * lv +" usd");

    }

  if (menuid == "rMc"){

    var t = connect(xloc);

    var p = prompt("account Datasize (Bytes)");

    var r = t.getMinimumBalanceForRentExemption(Number(p), "confirmed");

    r.then((x)=>{xcons.log(x +"L for "+p+"Bytes"); console.log(x)});

    }


  if (menuid == "exit"){
    xcons.log("/clear");
    xmain.log("");
    xpubkey.log("");
    xsend.log("");
    loadkey = [];
    loadpub = [];
    res3    = [];
    hshKey  = [];
    rdata   =[];
    rdata2  =[];
    txKeys.clear();
    }

  if (menuid == "bal"){
    xcons.log("getBal");
    //xmain.log("");
    //xpubkey.log("");

    if (lastReq !== this.id){

      xcons.log("fetch getBal");

      var con = connect(xloc, "finalized");
      var bal = dataReq_sBal(con, loadpub);
      bal.then((res) => {
          console.log("async bal" + res)
          RecentBal = res;}
        );
      }

    if (lastReq == this.id){
      xcons.log("Balance " + res3/1000000000 + " Sol");

      RecentBal = res3;}

    lastReq = this.id;

    }

  if (menuid == "tok"){
    //var bal = dataReq_ptok(con, loadpub);

    var xcl = lastReq == this.id;

      xcons.log("fetch getTokens");

      var con = connect(xloc, "finalized");
      var bal = dataReq_ptok(con, loadpub);
      bal.then((x) => getRes(x, xcl));

      //}

   /* if (lastReq == this.id){
      xcons.log("tokenBalance");
      getRes(res3);} */

    lastReq = this.id;

    }

  if (menuid == "jpread"){

    dataInit_jup();

    }

  if (menuid == "jpread3"){

    dataInit_jup(true);

    }


  if (menuid == "jpread2"){

    matchToken();

    dataReq_jup_prices();

    }

  if (menuid == "jpread4"){

    popup3.classList.add("hide");

    }

  if (menuid == "jpicons"){

    dispToken = !dispToken;

    xcons.log("jupiter icons "+ (dispToken==true?"Displayed":"Not displayed"));

    }



  if (menuid == "tok2"){
 
    if (lastReq == "tok"){

      var con = connect(xloc, "finalized");

      var n = res3.value.length;

      console.log("searching n");

      xdata = [];

      var tempdata = [];

      for(i=0;i<n;i++){

        var checkpub = res3.value[i].pubkey;

        tempdata[i] = con.getParsedTokenAccountsByOwner(checkpub, {programId: tokenkey,});;

        tempdata[i].then( (x)=> {xdata.push( [checkpub, x]);} );

        }

      }

    if (lastReq == "tok2"){

      if(xdata){

        console.log(xdata.length, " accounts checked as owner.. ");

        var xstr="<br><table border='1px solid #FFF'><tr><td><br></td></tr>";

        xstr+= "<tr><td>nested keys</td><td>mint</td><td>amount</td></tr>"

        for(var i=0; i<xdata.length; i++){

          if(xdata[i][1].value.length>0){

            console.log("found in "+xdata[i][0].toBase58());

            console.log(xdata[i][1].value.length + "Accounts?")

            for (var j=0; j<xdata[i][1].value.length; j++){

              var shcut = xdata[i][1].value[0].account.data.parsed.info;

              console.log(xdata[i][1].value[j].pubkey.toBase58()); 

 	      xstr += "<tr><td>"+xdata[i][1].value[j].pubkey.toBase58() + "</td>";

              xstr += "<td>"+shcut.mint + "</td>";

              xstr += "<td>"+shcut.tokenAmount.uiAmount + "</td></tr>"

	      }  // loop?

            }

          }

        xstr+="</table>";

        xmain.innerHTML += xstr;

        }};

    lastReq = this.id;
    }

  if (menuid == "tok3"){
    if(lastReq != this.id)
      autoRun_fetch();

    lastReq = this.id;  
    }

  if (menuid == "tok4"){
    if(lastReq != this.id)
      autoRun_fetch2();

    lastReq = this.id;  
    }

  if (menuid == "tok5"){
    if(lastReq != this.id)
      tinyMeta();

    lastReq = this.id;  
    }



  if (menuid == "gecko"){

    var n = wallet_Tok.length;

    if (lastReq !== this.id){

      geckodata = [];

      for(var i=0;i<n;i++){

        dataReq_cVal(solAddr2(wallet_Tok[i].id, val_Curr), i);}

      }

    if (lastReq == this.id){

      var tokenBal = 0.0;

      for(var i=0;i<n;i++){

        if(geckodata[i])

        if(!geckodata[i].data.error){

          var j = geckodata[i].id;

          console.log(geckodata[i].data.prices[0][1] + " * "+wallet_Tok[j].amount);

          xcons.log("$¤ " + (geckodata[i].data.prices[0][1] * wallet_Tok[j].amount).toFixed(3));

          tokenBal += (geckodata[i].data.prices[0][1] * wallet_Tok[j].amount);

	  xcons.log("$" + tokenBal);
	  }

        }

      console.log("$" + (tokenBal).toFixed(3) + " total");

      xcons.log("$" + (tokenBal).toFixed(3) + " total");

      }
    lastReq = this.id;

    }

  if (menuid == "geckoII"){

    dataReq_cValII();

    }

  if (menuid == "rent"){

    var con = connect(xloc);

    var r1 = minRent(con, 0);

    var r2 = minRent(con, 165);

    r1.then((r) => {r1 =r; xcons.log(r+"L main account");  rentVals[0] = r;}  );

    r2.then((r) => {r2 =r; xcons.log(r2+"L token account"); rentVals[1] = r;} );

    console.log(r1 +":main,  "+r2 +":sub ");

    }

  if (menuid == "memo"){

    res3 = logMemo("memo from tinywallet");

    res3.then((resp) => xcons.log(resp));

    }

  if (menuid == "xSnap"){

    var r1 = gen_Snap();

    if (r1.length > 0){

      res3 = put_Snap(JSON.stringify(r1));

      res3.then((resp) => xcons.log(resp));

      }

    }


  if (menuid == "xSnap2"){

    var r1 = await snap_sig();

    if (r1>-1) fetch_Snap(r1);

    }



  if (menuid == "viewX"){

    loadpub = new sol.PublicKey(prompt("Enter pubkey"));}


  if (menuid == "newX"){

    var p1 = prompt("Dest Wallet");

    var p2 = prompt("Mint address");

    p1 = new sol.PublicKey(p1);
    p2 = new sol.PublicKey(p2);

    //console.log(p1.toBase)

    var txres = createTokenAccount_testB(p1, p2);

    txres.then((x,y) => {

	console.log(x);
	if(!x[0].value.err){

         var p3 = sol.PublicKey.isOnCurve(p1);

         xcons.log("Standard address "+(p3?'✅':'❌'));
	 t_tx = x[1]; 
         xsend.log(JSON.stringify(t_tx) + "<br><input type=button value='Create' onclick='sendXTransaction()'></input>");
	}});

    }

  if (menuid == "nestX"){

    console.log("?");

    var tx = genTransfer_nested();

    tx.then((x) => {
	
	t_tx = x; 

	xsend.log(JSON.stringify(t_tx) + "<br><input type=button value='Create' onclick='sendXTransaction()'></input>");

	});

    //t_tx = 

    }

  if (menuid == "nestZ"){

    console.log("?");

    var tx = gen_nested();

    tx.then((x) => {
	
	t_tx = x[1]; 

        var xstr = ""+JSON.stringify(x[0])+"<p>"+JSON.stringify(t_tx)+"<p>";

        //if(x[0])

        xstr += "<input type=button value='Create' onclick='sendXTransaction()'></input>";

	xsend.log(xstr);

	});

    //t_tx = 

    }


  if (menuid == "burnX"){

    console.log("burn tokens?");

    }

  if (menuid == "closeX"){

    //console.log("burn tokens?");

    var p1 = s_pk(prompt("Account?"));

    //var p2 = prompt("Mint?");

    var p3 = loadpub;

    var tx = tokenCloseInst2(p1, loadpub);

    tx.then((x) => {
	
	t_tx = x; 

	xsend.log(JSON.stringify(t_tx) + "<br><input type=button value='Create' onclick='sendXTransaction()'></input>");

	});

    }

  if (menuid == "closeZ"){

    var tx = collectNst();

    tx.then((x) => {
	
	t_tx = x; 

	xsend.log(JSON.stringify(t_tx) + "<br><input type=button value='Close Nest' onclick='sendXTransaction()'></input>");

	});

    }

  if (menuid == "appX"){

    var tx = collectAppr();

    tx.then((x) => {
	
	t_tx = x; 

	xsend.log(JSON.stringify(t_tx) + "<br><input type=button value='Approve' onclick='sendXTransaction()'></input>");

        xsend.innerHTML += "<br><input type=button value='Approve2' onclick='simXTransaction()'></input>"

	});

    }


  if (menuid == "revX"){

    var tx = collectRevoke();

    tx.then((x) => {
	
	t_tx = x; 

	xsend.log(JSON.stringify(t_tx) + "<br><input type=button value='Revoke' onclick='sendXTransaction()'></input>");

	});

    }
	
  if (menuid == "authX" || menuid == "authY"){

    lastReq = menuid;
	  
    var targ = s_pk(prompt("Target Account"));
    var auth1 = s_pk(prompt("Current Authority"));
	  
    var auth2 = s_pk(prompt("New Authority"));
	  
    var auth3 = confirm("Enable new authority?");
			
    var authmodex = (menuid=="authY")? 2:0; 

//async function Authto_Inst(account, currentAuth, mode, newEnable, newAuth){

    var tx = Authto_Inst(targ, auth1, authmodex, auth3, auth2);

    tx.then((x) => {
	
	t_tx = x; 
	    
	menuid = "mint4";

        var dataX = "<br><input type=button value='setAuth2' onclick='sendXTransaction()'></input>";

	xsend.log(JSON.stringify(t_tx) + "<br><input type=button value='sim setAuth' onclick='simXTransaction()'></input>" + dataX); //Fix sendtype?

	});

    }

  if (menuid == "login" || menuid == "Newlogin"){

    document.getElementById("popup").classList.toggle("vis");}

  if (menuid == "xMeta"){

    document.getElementById("popup2").classList.toggle("vis");}


  if (menuid == "mint1" || menuid == "mint2"){

     
    if (xfinp.files.length == 1){

      mintRead= (menuid=="mint1")? 1:2;
      
      xcons.log(xfinp.files[0].name + " " + xfinp.files[0].size);
      readx(xfinp);
      
      //mintRead=0;
      if (menuid == "mint1"){
        mintpub = s_pk(loadpub.toBase58());
        //mintPriv = sol.Keypair.fromSecretKey(loadkey); 
	}

      if (menuid == "mint2"){
        mintA_pub = s_pk(loadpub.toBase58());
        //mintAuth = sol.Keypair.fromSecretKey(loadkey); 
	}
      
      }

    }

  if (menuid == "mint3"){

    lastReq = "mint3";

    var dec = Number(prompt("Decimal places for new Mint:"));

    var tx = CreateAccount_mint(loadpub, mintpub, mintA_pub, dec, 0);

    console.log(tx);

    tx.all((tx2) => {

      console.log(tx2);

      t_tx = tx2;

      xsend.log(JSON.stringify(tx2) + "<br><input type=button value='Mint3' onclick='simXTransaction()'>"); 

      });

    }


  if (menuid == "mint4"){

    lastReq = "mint4";

    var mintAm = prompt("Number to mint");

    var dec = Number(prompt("Decimal places for new Mint:"));

    var tx = Mintto_Inst(mintpub, mintA_pub, mintA_pub, Number(mintAm), dec);

    tx.then((tx2) => {

      console.log(tx2);

      t_tx = tx2;

      xsend.log(JSON.stringify(tx2) + "<br><input type=button value='Mint3' onclick='simXTransaction()'>"); 

      });

    }

  if (menuid == "prog1") tokenkey =  s_pk("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

  if (menuid == "prog22") tokenkey = s_pk("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb");


  if (menuid == "xMarket"){

    initSig();

    market_estVal();

    }

  if (menuid=="txread"){

    var lasttx = get_txhist(loadpub);

    lasttx.then((x) => { //print_txhist(x);   

      var tz = get_txdata(x); 

      tz.then((x) => { 

        //console.log(x);

        print_txdata(x);

        });

      });

    }

  if(menuid=="txclear") { clearTx(); s_hist=[];}

  if(menuid=="txkeys") {

    var keylist1 = retKeys();

    var ktypes = await keytypes2(keylist1);

    var k_lamps = ktypes[0].map((x)=> (x==null)?0:(x.lamports / 1000000000).toFixed(4));

    var k_data = ktypes[0].map((x)=> (x==null)?0:(x.data.length).toFixed(0));

    console.log(ktypes);

    var xstr = "<table><tr><td>" + JSON.stringify(retKeys()).replaceAll(',','<br>');

    xstr += "</td><td>" + JSON.stringify(ktypes[1]).replaceAll(',', '<br>');

    xstr += "</td><td>" + JSON.stringify(k_lamps).replaceAll(',', '<br>');

    xstr += "</td><td>" + JSON.stringify(k_data).replaceAll(',', '<br>');

    xsend.innerHTML = xstr+"</td></tr></table>";

    }

  if(menuid=="txdrop") {

    var tm = prompt("token mint address?");//s_pk(

    var t_am = prompt("token amount (total)");

    var tx = JSON.parse(rData_pf);

    if(tx){
  
      var tz = await keytypes2(tx.map(s_pk));

      var xz = tz[1]; //search user accounts

      var tz2 = await get_userMints(tx.map(s_pk), xz, tm); // filter1

      var targs = tz2.map((x)=> x[1][0]);

      var tz3 = await keytypes2(targs);

      var xz3 = tz3[1]; //search token accounts

      var targs2 = xfilter(targs, typeCheck(xz3, "token_acc"));

      console.log([tz, xz, tz2, targs]);

      var x_ok = confirm((t_am / targs2.length).toFixed(1) + " per user?");

      if (x_ok){

        var tk_ac = s_pk(prompt("token acc"));

        var tk_am = Number(prompt("token amount"));

        var tk_dec = Number(prompt("token dec!"));

        var tx = await multi_Tx(tk_ac, tk_am, tk_dec, targs2);

//        console.log(tx);

        xsend.log(JSON.stringify(tx) +"<br><input type=button onclick='sendXTransaction_drop()' value='Airdrop!'></input>");

        t_tx = tx;

        }

      console.log(targs2);

      }
    }


  } // end of menu



///------------------------------------------------------------------------------



var rentVals = [];

var geckodata = [];

function logthis(t){
  this.innerHTML = t+"<br>"+ this.innerHTML;
  if (t=="/clear") this.innerHTML= "";
  }

function printthis(t){
  this.innerHTML = t;
  }

function putthis(t){
  this.innerHTML += t;
  }


function setVal(){

  var x2 = document.getElementById("Currency_sel");
  xcons.log("Base currency "+x2.value);
  val_Curr=x2.value;
  }


var xmain = document.getElementById("main");
xmain.log = printthis;

var xpubkey = document.getElementById("pubkey");
xpubkey.log = printthis;

var xcons = document.getElementById("xcons");
xcons.log = logthis;

//var xmain = document.getElementById("main");
xsend.log = printthis;


xcons.log("wallet.js loading menu...");

var xfinp = document.getElementById("fileInp");


var lilist = document.getElementsByTagName("li");

for (var i=0; i<lilist.length; i++){
  lilist[i].addEventListener("click", menuHandler);
  }


xcons.log("wallet.js loading...");

var sol = solanaWeb3;

var Buffer = buffer.Buffer;

var tokenkey =  new sol.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

var xloc2 = sol.clusterApiUrl('mainnet-beta', true);

// Solana web func //


var res3, xRent;

function connect(xlo){
  var connection = new sol.Connection(xlo, "confirmed");
  return connection;
  }

async function minRent(con, bytes){

  var xRent = await con.getMinimumBalanceForRentExemption(bytes);
  return xRent;
  }

async function dataReq_ptok(con, owned){

  res3 = await con.getParsedTokenAccountsByOwner(owned, {programId: tokenkey,});
  return res3;
  }


var RecentBal;

async function dataReq_sBal(con, owned){

  res3 = await con.getBalance(owned, "confirmed");

  //res3.then((res) => RecentBal = res);

  return res3;
  }



function solAddr(id){
 
  if (id=="")
    return "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd";

  return "https://api.coingecko.com/api/v3/coins/sol/contract/" +id + "/market_chart/?vs_currency=usd&days=0";
  }


function solAddr2(id, csel="usd"){
 
  if (id=="")
    return "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies="+csel;

  return "https://api.coingecko.com/api/v3/coins/sol/contract/" +id + "/market_chart/?vs_currency="+csel+"&days=0";
  }



async function dataReq_cVal(url, id){

  fetch(url, {headers:{accept: 'application/json'}}).then((resp) => resp.json()).then((data) => {

	//res3 = data; 
	geckodata.push({id: id, data: data}); });

  //return res3;

  }


var RecentSVal;

function dataReq_cValII(){

  fetch(solAddr2("", val_Curr), {headers:{accept: 'application/json'}}).then((resp) => resp.json()).then((data) => {

    res3 = data; 

    console.log(data.solana);

    var xstr = " Sol: $"+data.solana[val_Curr] +" <br>"; 

    xstr += " "+ (1.0/(data.solana[val_Curr])).toFixed(4)  +" Sol per $1 <br>"

    xstr += " "+ (100*5*(data.solana[val_Curr] / 1000000)).toFixed(4) +"c per signature"

    RecentSVal = data.solana[val_Curr];

    //xcons.log("$"+data.solana.usd +" per Sol");

    //xcons.log("$"+(data.solana.usd / 1000000000)  +" per Lamp");

    //xcons.log(" "+ (0.01/(data.solana.usd / 1000000000)).toFixed(0)  +" Lamp per cent");

    xcons.log(xstr);

    });

  }

async function urlReader(prom){

  var pr = prom.body.getReader();

  var pr2;

  pr.read().then((x) => pr2 = x);

  return pr2;

  }


// solana readFile //

function readx(z){
  var f = z.files[0];
  oldval = f;
  //alert(f.size);
  if (f.type == "text/html") printFile(f);
  if (f.type == "application/json") printFile(f);
  if (f.type == "") printFile(f);
  console.log(f.type);
  }


function printFile(file) {
  const reader = new FileReader();
  reader.onload = (evt) => {
    console.log(evt.target.result);
    loadkey = evt.target.result;
    var r1 = JSON.parse(loadkey);
    var r2 = new Uint8Array(r1);
    console.log(r2.length);
    if(r2.length==64)

        if (cryptRead) r2 = new Uint8Array(xorBytes(r2, hshKey));
	cryptRead=false;

        if (mintRead==0){

  	  loadkey = sol.Keypair.fromSecretKey(r2);
	  loadpub = loadkey.publicKey;}

        if (mintRead==1){

  	  mintPriv = sol.Keypair.fromSecretKey(r2);
	  mintpub = loadkey.publicKey;}

        if (mintRead==2){

  	  mintAuth = sol.Keypair.fromSecretKey(r2);
	  mintA_pub = loadkey.publicKey;}



	console.log("Key with pubid:" + loadpub.toBase58() + " loaded");

        xpubkey.log("pubkey: "+loadpub.toBase58())
  };
  reader.readAsText(file);
}


var rData_pf = [];

function printFile2() {

//  var file
  var file = xfinp.files[0];
  console.log("read "+file.name);
  const reader = new FileReader();
  reader.onload = (evt) => {
    //console.log(evt.target.result);
    var loaddata = evt.target.result;
//    var r1 = JSON.parse(loaddata);

    rData_pf = loaddata;

    console.log("read");
    //var r2 = new Uint8Array(r1);
    };

  reader.readAsText(file);
}

function saveData2(xdata, label){

  var a = new Blob([xdata], {type: "text/html"});
  var u = URL.createObjectURL(a);

  xcons.log("<a href='"+u+"'>file save</a>"+label+"<br>");
  }

// displayTokens //

var wallet_Tok;

function token(id, amount, dec){
  this.id = id;
  this.amount = amount;
  this.decimals = dec;
  }

function getRes(r, xClear=true){

  if (xClear) wallet_Tok = [];

  var lamptot = 0;

  var mode2 = false;

  if (jupstrict.length>0)
    mode2=true;

  if (mode2 == false){

  var n = r.value.length;
  var Xstr = "<table border='1px #0009'>";
  var zstr = "<tr><td>Account key</td><td>Mint address</td><td>Lamports</td><td>dec</td><td>Amount</td><td></td></tr>";
  for (var i=0; i<n; i++){

    zstr += "<tr><td>";
    zstr = zstr + r.value[i].pubkey.toBase58().slice(0,8) + "</td><td>";
    zstr = zstr + r.value[i].account.data.parsed.info.mint.slice(0,8) + "</td><td>";
    zstr = zstr + r.value[i].account.lamports + "</td><td>";
    zstr = zstr + r.value[i].account.data.parsed.info.tokenAmount.decimals + "</td><td>";
    zstr = zstr + r.value[i].account.data.parsed.info.tokenAmount.uiAmount + "</td><td>"; //"</td></tr>";

    zstr += "<input id='" +"button_"+i+"' type=button value='>'";
    zstr += "data-mintid='"+ r.value[i].account.data.parsed.info.mint+"' ";

    zstr += "data-dec='"+ r.value[i].account.data.parsed.info.tokenAmount.decimals+"' ";

    zstr += "data-acc='"+ r.value[i].pubkey +"' "; 

    zstr += "data-amount='"+ r.value[i].account.data.parsed.info.tokenAmount.amount +"' "; 

    zstr += "onclick='token_Transfer(this);'></input></td></tr>";

    var val = r.value[i].account.data.parsed.info.tokenAmount.amount / (10**r.value[i].account.data.parsed.info.tokenAmount.decimals);

    lamptot += r.value[i].account.lamports;

    if (r.value[i].account.data.parsed.info.tokenAmount.decimals > 0)
      wallet_Tok.push(new token(r.value[i].account.data.parsed.info.mint, val, r.value[i].account.data.parsed.info.tokenAmount.decimals));
    }
  Xstr = Xstr + zstr;
  Xstr = Xstr + "</table>";

  }


  if (mode2==true){

  //matchToken();

  var n = r.value.length;
  var Xstr = "<table border='1px #0009'>";
  var zstr = "<tr><td>icon</td><td>Account key</td><td>Mint address</td><td>Lamports</td><td>dec</td><td>Amount</td><td></td></tr>";
  for (var i=0; i<n; i++){

    var icon_src = "";
    if (dispToken){

      var mintkey = r.value[i].account.data.parsed.info.mint;

//    var icon_id = jups_mat.filter((x=>x.wallet == i))[0]; // .strict;

      var icon_id = jupstrict.filter((x=>x.address == mintkey))[0]; // .strict;    

      //if (icon_id) icon_src = jupstrict[icon_id.strict].logoURI;

      if (icon_id) icon_src = icon_id.logoURI;}

    zstr += "<tr><td>";

    if (dispToken) zstr += "<img src='"+icon_src+"' class=icon2></img>";

    zstr = zstr + "</td><td>"
    zstr = zstr + r.value[i].pubkey.toBase58() + "</td><td>";
    zstr = zstr + r.value[i].account.data.parsed.info.mint + "</td><td>";
    zstr = zstr + r.value[i].account.lamports + "</td><td>";
    zstr = zstr + r.value[i].account.data.parsed.info.tokenAmount.decimals + "</td><td>";
    zstr = zstr + r.value[i].account.data.parsed.info.tokenAmount.uiAmount + "</td><td>"; //"</td></tr>";

    zstr += "<input id='" +"button_"+i+"' type=button value='>'";
    zstr += "data-mintid='"+ r.value[i].account.data.parsed.info.mint+"' ";

    zstr += "data-dec='"+ r.value[i].account.data.parsed.info.tokenAmount.decimals+"' ";

    zstr += "data-acc='"+ r.value[i].pubkey +"' "; 

    zstr += "data-amount='"+ r.value[i].account.data.parsed.info.tokenAmount.amount +"' "; 

    zstr += "onclick='token_Transfer(this);'></input></td></tr>";

    var val = r.value[i].account.data.parsed.info.tokenAmount.amount / (10**r.value[i].account.data.parsed.info.tokenAmount.decimals);

    lamptot += r.value[i].account.lamports;

    if (r.value[i].account.data.parsed.info.tokenAmount.decimals > 0)
      wallet_Tok.push(new token(r.value[i].account.data.parsed.info.mint, val, r.value[i].account.data.parsed.info.tokenAmount.decimals));
    }
  Xstr = Xstr + zstr;
  Xstr = Xstr + "</table>";

  }

  if(xClear) xmain.log(Xstr);
  if(!xClear) xmain.innerHTML += "<p>"+Xstr;

  xcons.log(lamptot / 1000000000 + " token rent");

  }

// keyGenerator ------------ //

function gen_newKey(){

  var newkey = sol.Keypair.generate();

  var pub_nk = newkey.publicKey;
  var pub_nkStr = newkey.publicKey.toBase58();

  //var key2 = sol.Keypair.fromSecretKey(newkey.secretKey);
  //console.log(pub_nk, "\n", key2.publicKey.toBase58());
  // wallet export

  var keydata = "["+newkey.secretKey.toString()+"]";

  if (cryptRead){
    keydata = "[" + xorBytes(newkey.secretKey, hshKey).toString() + "]";
    cryptRead = false;
    }
  
  var a = new Blob([keydata], {type: "text/html"});
  var u = URL.createObjectURL(a);

  xpubkey.log("<a href='"+u+"'>Secret key</a> for address "+pub_nkStr.slice(0,8)+"...");

  }

// memo transaction 1

async function logMemo(message) {  

    var con = connect(xloc);

    var fromKeypair = loadkey;

    // 1. Create Solana Transaction
    let tx = new sol.Transaction();

    // 2. Add Memo Instruction
    await tx.add(
        new sol.TransactionInstruction({
          keys: [{ pubkey: fromKeypair.publicKey, isSigner: true, isWritable: true }],
          data: Buffer.from(message, "utf-8"),
          programId: new sol.PublicKey("Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo"),
        })
      )
    // 3. Send Transaction
    let result = await sol.sendAndConfirmTransaction(con, tx, [fromKeypair]);
    // 4. Log Tx URL
    console.log("complete: ", `https://explorer.solana.com/tx/${result}`);
    return result;
}


async function logMemoB(message) {  

    var con = connect(xloc);

    var fromKeypair = loadkey;

    var secKey = sol.Keypair.generate();

    // 1. Create Solana Transaction
    let tx = new sol.Transaction();

    // 2. Add Memo Instruction
    await tx.add(
        new sol.TransactionInstruction({
          keys: [{ pubkey: fromKeypair.publicKey, isSigner: true, isWritable: true }, 
                 { pubkey: secKey.publicKey, isSigner: true, isWritable: true }],
          data: Buffer.from(message + xstr, "utf-8"),
          programId: new sol.PublicKey("Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo"),
        })
      )
    // 3. Send Transaction       ---xstr demo only---
    let result = await sol.sendAndConfirmTransaction(con, tx, [fromKeypair, secKey]);
    // 4. Log Tx URL
    console.log("complete: ", `https://explorer.solana.com/tx/${result}?cluster=devnet`);
    return result;
}


// memo transaction 3
 /*
function transferLamps(from, to, amount){

  var nt = new sol.Transaction();

  nt.add(sol.SystemProgram.transfer({

    fromPubkey: from,
    toPubkey: to,
    lamports: amount, }) );

  return nt;}
*/


async function logMemoC(message, amount, to) {  

    var con = connect(xloc);

    var fromKeypair = loadkey;

    //var to = new sol.PublicKey("2bHQiUSQzzbiJ28ZnuTVxAsajsscMc5QwagurqsjVCb8");
    //var amount = 7 * 1000;

    // 1. Create Solana Transaction
    let tx = new sol.Transaction();

    // 2. Add Memo Instruction
    await tx.add(
        new sol.TransactionInstruction({
          keys: [{ pubkey: fromKeypair.publicKey, isSigner: true, isWritable: true }],
          data: Buffer.from(message, "utf-8"),
          programId: new sol.PublicKey("Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo"),
        })
      )
    // 2. Add Send Instruction
    await tx.add(
        sol.SystemProgram.transfer({

          fromPubkey: fromKeypair.publicKey,
          toPubkey: to,
          lamports: amount, }) 
        );

    // 3. Send Transaction
    let result = await sol.sendAndConfirmTransaction(con, tx, [fromKeypair]);
    // 4. Log Tx URL
    console.log("complete: ", `https://explorer.solana.com/tx/${result}`);
    return result;
}


function sendTransfer(){

  var cc = confirm("Ok to send?");

  if (cc)
    logMemoC(t_memo, t_amount, t_recip);

  }

/*
#tokeninstruct.Transfer = 3,
 transferInstructionData = struct<TransferInstructionData>([u8('instruction'), u64('amount')]);

export function createTransferInstruction(
    source: PublicKey,
    destination: PublicKey,
    owner: PublicKey,
    amount: number | bigint,
    multiSigners: Signer[] = [],
    programId = TOKEN_PROGRAM_ID
): TransactionInstruction {
    const keys = addSigners(
        [
            { pubkey: source, isSigner: false, isWritable: true },
            { pubkey: destination, isSigner: false, isWritable: true },
        ],
        owner,
        multiSigners
    );

    const data = Buffer.alloc(transferInstructionData.span);
    transferInstructionData.encode(
        {
            instruction: TokenInstruction.Transfer,
            amount: BigInt(amount),
        },
        data
    );

    return new TransactionInstruction({ keys, programId, data });
}


function tokenTransfer(s,d,o,a){

new sol.TransactionInstruction({
          keys: [{ pubkey: fromKeypair.publicKey, isSigner: true, isWritable: true }],
          data: Buffer.from(message, "utf-8"),
          programId: tokenkey,
        })

  sol.TransactionInstruction({ 
      [
            { pubkey: source, isSigner: false, isWritable: true },
            { pubkey: destination, isSigner: false, isWritable: true },
      ],
      tokenkey, 

    })

const transaction = new Transaction().add(
                    createTransferInstruction(
                        fromTokenAccount.address, // source
                        toTokenAccount.address, // dest
                        publicKey,
                        amount * LAMPORTS_PER_SOL,
                        [],
                        TOKEN_PROGRAM_ID
                    )
                )


*/


async function tokenTransferInst(){

    // 1. Create Solana Transaction
    let tx = new sol.Transaction();

    var s = new sol.PublicKey("5zQWQCutY3jAapHsKspntdWPZuNHecHPeHJifgsTF3uh");

    var d = new sol.PublicKey("3xbQpBvgvRUQBXi2QQeTXNzdNZ5A1CGZwrVp9UK9kfJ9");

    var o = new sol.PublicKey("75EL7ju4FZjRjbhSdeNdzZesSZZAN8wNBphCexUf9MfE");


    // 2. Add Memo Instruction
    await tx.add(
        new sol.TransactionInstruction({
          keys: [{ pubkey: s, isSigner: false, isWritable: true }, 
                 { pubkey: d, isSigner: false, isWritable: true }, 
                 { pubkey: o, isSigner: true, isWritable: false }, ],
          data: Buffer.from(bignumber_Encode(10, 5, 3)),
          programId: tokenkey,
        })
	);

    return tx;
}



async function tokenBurnInst(){

    // 1. Create Solana Transaction
    let tx = new sol.Transaction();

    var s = new sol.PublicKey("5zQWQCutY3jAapHsKspntdWPZuNHecHPeHJifgsTF3uh");

    var d = new sol.PublicKey("3xbQpBvgvRUQBXi2QQeTXNzdNZ5A1CGZwrVp9UK9kfJ9");

    var m = new sol.PublicKey("kinXdEcpDQeHPEuQnqmUgtYykqKGVFq6CeVX5iAHJq6");

    var o = new sol.PublicKey("75EL7ju4FZjRjbhSdeNdzZesSZZAN8wNBphCexUf9MfE");


    // 2. Add Memo Instruction
    await tx.add(
        new sol.TransactionInstruction({
          keys: [{ pubkey: s, isSigner: false, isWritable: true },  
                 { pubkey: m, isSigner: false, isWritable: true },              
                 { pubkey: o, isSigner: true, isWritable: false }, ],
          data: Buffer.from(bignumber_Encode(5, 5, 8)),
          programId: tokenkey,
        })
	);

    return tx;
}
 


async function tokenCloseInst(){

    // 1. Create Solana Transaction
    let tx = new sol.Transaction();

    var s = new sol.PublicKey("5zQWQCutY3jAapHsKspntdWPZuNHecHPeHJifgsTF3uh");

    var d = new sol.PublicKey("3xbQpBvgvRUQBXi2QQeTXNzdNZ5A1CGZwrVp9UK9kfJ9");

    var m = new sol.PublicKey("kinXdEcpDQeHPEuQnqmUgtYykqKGVFq6CeVX5iAHJq6");

    var o = new sol.PublicKey("75EL7ju4FZjRjbhSdeNdzZesSZZAN8wNBphCexUf9MfE");


    // 2. Add Memo Instruction
    await tx.add(
        new sol.TransactionInstruction({
          keys: [{ pubkey: s, isSigner: false, isWritable: true },  
                 { pubkey: o, isSigner: false, isWritable: true },              
                 { pubkey: o, isSigner: true, isWritable: false }, ],
          data: Buffer.from(shortInst_Encode("closeAccount")),
          programId: tokenkey,
        })
	);

    return tx;
}


/*

async function tokenCreateAccount(id){


    let tx = new sol.Transaction();

//    var s = new sol.PublicKey("5zQWQCutY3jAapHsKspntdWPZuNHecHPeHJifgsTF3uh");

    var seed = "Kin_01";//?


    var d = new sol.PublicKey("3xbQpBvgvRUQBXi2QQeTXNzdNZ5A1CGZwrVp9UK9kfJ9");

    var m = new sol.PublicKey("kinXdEcpDQeHPEuQnqmUgtYykqKGVFq6CeVX5iAHJq6");

    var o = new sol.PublicKey("75EL7ju4FZjRjbhSdeNdzZesSZZAN8wNBphCexUf9MfE");

    var s = await sol.PublicKey.createWithSeed(loadpub, seed, m);

    console.log(sol.PublicKey.isOnCurve(s) + " == false?");


  if(id==1){

    await tx.add( sol.SystemProgram.createAccount({

		space:165,
		lamp: 2040000,
		programId: tokenkey,
		fromPubkey: o,
		newAccountPubkey: s,
		basePubkey: o,
 		}) );
  };if(id==2){

   await tx.add( new sol.TransactionInstruction({
          keys: [{ pubkey: s, isSigner: false, isWritable: true },  
                 { pubkey: m, isSigner: false, isWritable: false },              
                 { pubkey: o, isSigner: true, isWritable: true },              
                 { pubkey: sol.SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false }, ],
          data: Buffer.from(shortInst_Encode("openAccount")),
          programId: tokenkey,}) );
  }

  return tx;

  }



*/

xcons.log("Wallet ready");



function timedInt(){

  console.log("Tick");

  dataReq_jup_price_X(targ);

  clearCanv();

  draw(tickRes_pc);

  }


var minuteTimer;// = setInterval(timedInt, 3600);

var targ = "SOL";



function init_Ticker(){

  minuteTimer = setInterval(timedInt, 3600);

  //targ = "SOL";

  initCanvas();

  }

