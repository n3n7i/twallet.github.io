

function str2bytes(s){

  var vals = []
  for(var i=0;i<s.length;i++){
     vals[i] = s.charCodeAt(i);
     }
  return vals;
  }


function byteHash(x){
  return crypto.subtle.digest("SHA-512", new Uint8Array(x));
  }


function hash2bytes(z){
  return Array.from(new Uint8Array(z));
  }

function xorBytes(b1, b2){

  n = b1.length;
  var b3=[];
  if(n==64){
    for(var i=0;i<64; i++){
      b3[i] = b1[i] ^ b2[i];
      }}
  return b3;
  }


var hshKey;


async function test_Login(){

  var p1 = document.getElementById("popup");

  var p2 = document.getElementById("idbox");
  var p3 = document.getElementById("usrbox");
  var p4 = document.getElementById("passbox");

//  console.log(p1, p2.value, p3.value, p4.value);

  var p5 = await gen_Userpass(true, p3.value, p4.value);

//  console.log(p5);

  hshKey= p5;

  p1.log = putthis;

  //p1.log("<input type=button value='Cancel' class=buttons></input><br>");

  //p1.log("<input type=button value='Decrypt key' class=buttons></input>");

  //p1.log("<input type=button value='Seed key' class=buttons onclick=seedLogin(hshKey);></input>");

  //p1.log("<input type=button value='Online key' class=buttons></input>");

  }


async function seedLogin(data){

  var key = sol.Keypair.fromSeed(new Uint8Array(data.slice(0,32)));

  console.log(key);

  xpubkey.log(key.publicKey.toBase58());

  loadpub = key.publicKey;

  }


var cryptRead = false;

function cryptLogin(){

  cryptRead = true;

  document.getElementById("fileInp").click();

  }


function cryptGen(){

  cryptRead = true;

  gen_newKey();

  }

function passToggle(x){

  console.log(x);

  var toggle=false;

  if (x.type == "password"){
	x.type = "text";
	toggle=true;}

  if(!toggle) x.type = "password";
  }

async function gen_Userpass(skip=false, ux="", px=""){

  if(!skip){
    var u = prompt("Username:");
    var p = prompt("password:");
  } 
  if(skip){ var u=ux; var p=px;}

  var s1 = "Tinywallet_Offset_[6lbji7lhj9u]"; // program salt
  var s2 = [128,1].concat(str2bytes(s1));
  var x1 = s2.concat(str2bytes(u));
  var x2 = hash2bytes(await byteHash(x1)); // 1way usrname (searchable?)
  var x3 = s2.concat(x2).concat(str2bytes(p));
  var x4 = hash2bytes(await byteHash(x3)); // 1way passwrd [usrname salt]
  var x5 = s2.concat(xorBytes(x2, x4)).concat(x4); //
  var x6 = hash2bytes(await byteHash(x5) );        // H( [H(usr) x H(H(usr)+pass)] + H(H(usr)+pass) )
//  console.log(s1.length, " ", s2);               // Throw away all intermediates
  return x6;
  }  


//-----------------------

// var sigkey_p = "2FmTasvr5hHn1XmkJSUbdxCdNTEXJur6LgVGQuPQ651B";

/*
var sigDec = [174,181,137,248,210,176,73,61,121,244,211,26,243,127,237,244,12,106,163,146,153,123,62,191,201,
		39,130,240,86,235,140,128,20,91,196,75,196,125,105,217,185,189,16,163,220,253,254,241,13,230,154,
		203,79,19,15,64,97,56,228,188,10,193,110,253];

//Onchain

*/

/*
-----------------------------------
sigDec secure enough to be on chain
    without knowing user+password?

*/

var sigkey_p;

var sigKey;

var sigKeyR;

var sigDec2;


async function initSig(){

  //await retSig().then((fromMemo));

  await retSig2().then((fromMemo2));

  var sig = gen_Userpass(true, sigkey_p, "");

  console.log("sig attempt?");

  sig.then((x)=> {
	sigKey = xorBytes(sigDec2, x);
        sig = x;
        sigKeyR = sol.Keypair.fromSecretKey(new Uint8Array(sigKey));
        console.log(sigKeyR.publicKey.toBase58() == sigkey_p?'Sigkey init':'Sigkey Err');

	xcons.log("sigkey signed in");
	xcons.log(sigkey_p);

	});	

  }

async function retSig(){

  var con = connect(xloc);

  var txZero = "4ffE5hwNMdzQRPuH7KdTPS6XNNEjFXVKcSVRvpPto63XZ4VT8UawtvB242XcKVAQeLYCDkDbPF7i4GV8DppTqR2v"

  var options = {commitment: "confirmed", limit: 20, until: txZero}

  var res = await con.getConfirmedSignaturesForAddress2(new sol.PublicKey(sigkey_p), options);
  return res;
  }


async function retSig2(){

  var txZero = "4ffE5hwNMdzQRPuH7KdTPS6XNNEjFXVKcSVRvpPto63XZ4VT8UawtvB242XcKVAQeLYCDkDbPF7i4GV8DppTqR2v"

  var con = connect(xloc);

  var res= await con.getParsedTransaction(txZero);
  
  //var res = await con.getConfirmedSignaturesForAddress2(new sol.PublicKey(sigkey_p), "confirmed");

  //res.then((x) => {})

  
//  res.then((res) => {
  var res2 = res.transaction.message.instructions[0].program == "spl-memo";

  if (res2)
     return [res.transaction.message.instructions[0].parsed];
//  });
  //return res;
  }



function fromMemo(r){

  var n = r.length;
  var t1 = r[n-1].memo; // memo order?
  var trim = t1.indexOf('{');
  var obj = JSON.parse(t1.slice(trim));
  if(obj.id && (obj.id == sigkey_p)){
    sigDec2 = obj.data;}
  }

function fromMemo2(r){
  var trim = r.indexOf('{');
  var obj = JSON.parse(r.slice(trim));
  if(obj.id){
    sigkey_p = obj.id;
    sigDec2 = obj.data;}
  }


async function Deep_Meta(mint, acc=""){

  var mint_sub1, mint_sub2, mint_sub3;

  var addrs = [];

  if(acc=="")

    var mint_sub1 = det_ATAaddr(mint, mint); //Standard ATA acc (offcurve 1)

  if(acc!=="")

  var mint_sub1 = det_ATAaddr(acc, mint); //Standard ATA acc (offcurve 1)

  mint_sub1.then((ms1) => {

    addrs.push(ms1[0].toBase58());

    console.log(ms1[0].toBase58());

    mint_sub2 = det_ATAaddr(ms1[0], mint); //Nested ATA acc (offcurve 2)

    mint_sub2.then((ms2) => {

     addrs.push(ms2[0].toBase58());

     console.log(ms2[0].toBase58());

     mint_sub3 = det_ATAaddr(ms2[0], mint); // !!Unreachable (offcurve 3)

     mint_sub3.then((ms3) => { 

       addrs.push(ms3[0].toBase58());

       console.log(ms3[0].toBase58()); }); }); }); 

  //return mint_sub3;

  return addrs;

  }


async function sigMeta(){

  var n = wallet_Tok.length;

  if ((n==0) || (!sigkey_p)) return;

  var listA = await retSig();

  var listB = [];

  var listC = [];

  console.log(listA);

  for(var i=0; i<listA.length; i++){

    if (listA[i].memo)

      if(listA[i].memo.indexOf('{')>5){

        var temp = JSON.parse(listA[i].memo.slice(5));

        if (temp.metadata)

          listB.push(temp); }

      //}

    }

  for(var i=0; i<n; i++){

    for(var j=0; j<listB.length; j++){

      if (wallet_Tok[i].id == listB[j].mint)

        listC[i] = listB[j];

      }

    }

  return listC;

  }


async function sigMeta2(x){

  var con=connect(xloc) 

  var txlist = [];

//  var txId = [];

  var resImg = [];

  var resName = [];

  for(var i=0;i<x.length; i++){

    if(x[i]) {

      txlist.push(x[i]["min-data"]);

//      txId.push(i);

//      resName.push(x[i].name);

      }

    }

  var rx = await con.getParsedTransactions(txlist, "confirmed");

  console.log(rx);

  for(var i=0;i<rx.length; i++){

    var t = rx[i].transaction.message.instructions[0].program == "spl-memo";

    if(t){

      var k = JSON.parse(rx[i].transaction.message.instructions[0].parsed);

      resImg.push(k.image);

      resName.push(k.name);

      }

    }

  xstr = "";

  for (var i=0;i<resImg.length; i++){

    xstr += "<img src='"+resImg[i]+"' class=icon title='"+resName[i]+"'>";}

  xmain.innerHTML += xstr;

  return [resImg, resName];

  }


//  listA.then((x)=> {

//    console.log(x);

//    });

//  }

//  for(var i=0; i<)


async function tinyMeta(){

  if (!sigkey_p)

    sigkey_p = "2FmTasvr5hHn1XmkJSUbdxCdNTEXJur6LgVGQuPQ651B";

  var r1 = await sigMeta();

  sigMeta2(r1);

  }


//initSig();

