
var walletData = [];

var walletData_ext = [];

var walletData2 = [];

var walletMatches = [];

var walletData3 = [];

var walletData4 = [];


function tokenObj(m, d, am){

  return {mint: m, dec: d, amount: am};

  }


function tokenObj_ext(x){

  var t = x.account.data.parsed.info;

  var m = t.mint;

  var t2 = t.tokenAmount;

  var d = t2.decimals;

  var am = t2.amount;

  return tokenObj(m, d, am);
  }



async function tokenData_w(){

  var con = connect(xloc);

  var xwallet = await dataReq_ptok(con, pubKey);

  var zWallet = [];

  var n = xwallet.value.length;
 
  for (var i=0;i<n; i++){

    zWallet.push(tokenObj_ext(xwallet.value[i]));

    }

  console.log(xwallet);

  walletData = zWallet;

  walletData_ext = xwallet;

  return zWallet;

  }



async function jup_Batch(n=0){

  var j = Math.min(50*(n+1), walletData.length);

  xstr = "";

  for (var i=50*n; i<j; i++){

    xstr = xstr + walletData[i].mint+',';

    }

  var res = await getTokenVals_Sel(xstr);

  return res;

  }


async function jupLoad(){

  var m = walletData.length;

  var res2 = [];

  if(m<50) return jup_Batch();

  if (m>50){

    var k=0;

    //var res2 = [];

    for (var j=0; j<m; j+=50){

      var res = await jup_Batch(k);

      res2.push(objExt(res));

      k++;

      }
    }
  return res2.flat();

  }



function objExt(z){

  var res = [];

  for (x in z){

    res.push([x, z[x]]);

    }

  return res;

  }


function getMatches(w1, w2){

  var m1 = w1.length;

  var m2 = w2.length;

  var res = [];

  for (var i=0;i<m1; i++){

    var t1 = w1[i].mint;

    for (var j=0;j<m2; j++){

      var t2 = w2[j][0];

      if (t1 == t2){

        res.push([i, j]);}

      }

    }

  return res;

  }


function valueData(w1,w2, w3){

  var m = w3.length;

  var gtot = 0;

  var xres = [];

  for (var i=0; i<m; i++){

    var t1 = w3[i][0];
    var t2 = w3[i][1];

    var ui_Am = w1[t1].amount / 10**w1[t1].dec;

    var tk_Price = w2[t2][1].usdPrice;

    var tot = ui_Am * tk_Price;

    xres.push({mint: w2[t2][0], price: tk_Price, ui_Am: ui_Am, val: tot, index: i});

    gtot += tot;

    }

  console.log("token Val: $"+gtot);

  return xres;

  }


function sortByValue(priceData){

  var priceData2 = priceData.sort((a,b)=>b.val-a.val);

  return priceData2;

  }
