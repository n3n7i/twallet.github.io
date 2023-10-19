

function gen_Snap(){

  g2 = [];

  if (geckodata){

    n = geckodata.length;

    for (var i=0;i<n;i++){

      if(!geckodata[i].data.error){

	var xprice = geckodata[i].data["prices"][0][1];

        var xquant = wallet_Tok[geckodata[i].id].amount;

	var xtot = xprice * xquant;

        var xpc = 100;

	var xid = wallet_Tok[geckodata[i].id].id;

        console.log("ok", i, xid.slice(0,6), xtot);

 	if (xtot > 0.005)

  	  g2 = g2.concat([xid.slice(0,6), xquant.toFixed(3), xprice.toFixed(3), xtot.toFixed(3)]);

        }

      }

    }

  return g2;

  }


function put_Snap(data){

  var xobj = JSON.stringify({type: "Snapshot", data: data});

  if (xobj.length < 1100){

    if (confirm("Write to blockchain? [fee: 0.000005 Sol]")==true)

    return logMemo(xobj);

    }

  }


async function snap_sig(){

  var r = await get_txhist([], 25);

  for (var i=0; i<r.length; i++){

    if (r[i].memo){

      if (r[i].memo.indexOf("Snapshot") > -1)

        return i;

      }
    }

  return -1;
  }


function fetch_Snap(xid){

  var xdata = gen_Snap();

  var item0 = JSON.parse(s_hist[xid].memo.slice(6));

  var data0 = JSON.parse(item0.data);

  var n1 = xdata.length;

  var n2 = data0.length;

  var sums = [0,0];

  var xmatch = 0;

  for (var i=0; i<n2; i+=4){

    var ids2 = xdata.indexOf(data0[i]); //data0.indexOf(xdata[i]);

    if (ids2 == -1)

      console.log("missing?", data0[i]);

    }


  for (var i=0; i<n1; i+=4){

    var ids = data0.indexOf(xdata[i]);

    if (ids > -1){

      var t1 = Number(data0[ids+3]);

      var t2 = Number(xdata[i+3]);

      var a1 = Number(data0[ids+1]);

      var a2 = Number(xdata[i+1]);

      var p1 = Number(data0[ids+2]);

      var p2 = Number(xdata[i+2]);


      var change_t = t2 / t1;

      var change_a = a2 / a1;

      var change_p =  change_t / change_a; //Math.min(p2,0.0001) / Math.min(p1,0.0001);

      var est1 = 1 / (change_a * change_t); 

      var est2 = 1 / change_t; 

      sums[0] += t1;

      sums[1] += t2;

      console.log("$", t2, xdata[i], a2,  change_t, change_a, change_p, "buy?:", (est1-1) * a2, est2, " (+-)", t2-t1);

      xmatch += 1;

      }

    if (ids==-1) console.log("missing II?", xdata[i]);

    }

  console.log("old: " + sums[0] + ", new: " + sums[1], ", change: ", sums[1]/sums[0]);

  console.log("current", n1, "previous", n2, "matched", xmatch);

  console.log("chain snap:", data0);

  console.log("gen snap:", xdata);
  }


