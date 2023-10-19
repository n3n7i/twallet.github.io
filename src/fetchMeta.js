
var metaplex = s_pk("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");


function equals(x){

  return this == x;
  }


function not_equals(x){

  return this !== x;
  }


function not_empty(x){

  return x !== "";
  }




function xMap(arr, val){

  return arr.map(equals, val);
  }

function retr(t){
 
  return t.image;

  }


function retn(t){
 
  return t.name;

  }


async function fromMint(x){

  var acc = await sol.PublicKey.findProgramAddress(['metadata', metaplex.toBuffer(), x.toBuffer()], metaplex);

  var con = connect(xloc);

  console.log(acc[0].toBase58())

  var res = await con.getAccountInfo(s_pk(acc[0].toBase58()));

  return res;

  }


function namefromMeta(x){

  if (x==null) return "";

  var x1 = x.data.slice(69, 101);

  x2 = x1.toString().slice(0, x1.indexOf('\0'));

  return x2;

  }



function fromMeta(x){

  return x.data.slice(105, 102+14);

  }


function urlfromMeta(x){

  if (x==null) return "";

  return x.data.slice(119, 116+200);

  }


 var rdata = [];

  var rdata2 = [];



async function fetchUrls(wlist){

  var n= wlist.length;

  var con = connect(xloc);

 
  for (var i=0; i<n; i++){

    rdata[i] = await sol.PublicKey.findProgramAddress(['metadata', metaplex.toBuffer(), s_pk(wlist[i].id).toBuffer()], metaplex);

//    rdata[i].then((x) => {

//      rdata[i] = x;

      rdata2[i] = await con.getAccountInfo(s_pk(rdata[i][0].toBase58()));

//      rdata2[i].then((x2) => {

//        rdata2[i] = x2;

//	});

//	});

    }

  }


function xdataslice(xlist){

  var data = [];

  for (var i=0;i<xlist.length;i++){

    var temp = urlfromMeta(xlist[i]);

    var t2 = temp.slice(temp.indexOf('h'), temp.indexOf('\0'));

    if (t2.length == 0)

        data.push("");

//      data.push(metadata_Old(wallet_Tok.id));

    if (t2.length>0)

      data.push(t2.toString());

    }

  return data;

  }


async function fetchimgUrl(xlist){

  var data=[];

  for (var i=0;i<xlist.length;i++){

    if(xlist[i].length > 0){

      var temp = await fetch(xlist[i]);

      var t2 = temp.body.getReader();

      var t3 = await t2.read();

      data.push(Buffer.from(t3.value).toString());

      }

    if(xlist[i].length == 0){

      data.push(""); //metadata_Old(wallet_Tok.id));

      }

    }

  return data;

  }


function imgStr(x, y){

  var n = x.length;

  tx = "";

  for (var i=0;i<n;i++){

    if (i%10 == 0)
      tx += "<br>";

    tx += "<img class=icon src='"+x[i]+"' title='"+y[i]+"'>";


    }

  xmain.innerHTML += tx;

  }


async function autoRun_fetch(){

  await fetchUrls(wallet_Tok);

  xcons.log("..meta accounts");

  var data3 = xdataslice(rdata2);

  var data4 = await fetchimgUrl(data3);

  xcons.log("..meta uri's");

  var emptydata = xMap(data4, "");

  var d5 = data4.filter(not_empty);

  console.log(d5)

  console.log(emptydata)

  var dataJ = d5.map(JSON.parse);

  var dataI = dataJ.map(retr);

  var dataId = dataJ.map(retn);

  var dataI2 = [];

  var dataId2 = [];

  var j=0;

  for (var i=0; i<wallet_Tok.length; i++){

    if (!emptydata[i]){

      dataI2.push(dataI[j]);

      dataId2.push(dataId[j]);

      j++;

      }

    if (emptydata[i]==true){

      var isSvg = await fetchCheck(metadata_Old(wallet_Tok[i].id));

      //xcons.log(i+"old meta accounts" + isSvg==200);

      if (isSvg!==200)
        dataI2.push(metadata_Old(wallet_Tok[i].id).slice(0,-4)+".svg");

      if (isSvg==200)
        dataI2.push(metadata_Old(wallet_Tok[i].id));


      //dataId2.push("?");

      dataId2.push(namefromMeta(rdata2[i]))

      }

    }

  imgStr(dataI2, dataId2);

  return [dataJ, dataI];

  }  


async function getMeta1(x){

     var temp = await fetch(x);

      var t2 = temp.body.getReader();

      var t3 = await t2.read();

      return Buffer.from(t3.value).toString();

      }



async function burstGet(x){

  var mp_keys= [];

  var mp_data= [];

  var mp_uri= [];

  var mp_name= [];

  var mp_uri2= [];

  var n = x.length;

  for(var i=0;i<n; i++){

    mp_keys[i] = s_pk((await sol.PublicKey.findProgramAddress(['metadata', metaplex.toBuffer(), s_pk(x[i].id).toBuffer()], metaplex))[0].toBase58());

    }

  console.log(mp_keys);

  var con = await connect(xloc);

  var cfg = {dataSlice: {offset:119 , bytes:200}, commitment: "confirmed"};

  var grabX = await con.getMultipleParsedAccounts(mp_keys, confirmed);

  return grabX;

/*
  for(var i=0;i<n; i++){

    var mp_k = mp_keys[i];

    //mp_keys[i].then((mp_k) => {

      //console.log(j +" "+i)

    mp_data[i] =  await con.getAccountInfo( s_pk( mp_k[0].toBase58() ));

//      });

    }

  console.log(mp_data);

  for(var i=0;i<n; i++){

  //  mp_data[i].then((mp_d) => {

    var mp_d = mp_data[i].data;

      var t1 = mp_d.slice(119, 319).toString();

      var t2 = t1.slice(0, t1.indexOf('\0'));

      var t3 = mp_d.slice(69, 101).toString();

      var t4 = t1.slice(0, t1.indexOf('\0'));

      if(t2==null) t2="";

      console.log(t2);

      mp_uri.push(t2);

      mp_name.push(t4);

//      });

    }

  var tx2 = "";

  for(var i=0;i<n; i++){

    var t1 = mp_uri[i];

    var x2 = false;

    var tx = "";

    if (t1==""){

       tx = metadata_OldAddr(x[i].id);

       x2 = true;

       }

    if (!x2){

      var t3 = await JSON.parse(await getMeta1(t1));

      tx = t3.image;

      }

    tx2 += "<img src='" + tx+ "' class=icon>";

    mp_uri2[i] = tx;

    }

  console.log("Done,");

  xmain.innerHTML += tx2;

  return [mp_keys, mp_data, mp_uri, mp_name, mp_uri2];
  
/*  con.getAccountInfo(s_pk(rdata[i][0].toBase58())

  if (x==null) return "";

  //return x.data.slice(119, 116+200);

  var t2 = temp.slice(temp.indexOf('h'), temp.indexOf('\0'));

  //if (t2.length == 0) */

  }



