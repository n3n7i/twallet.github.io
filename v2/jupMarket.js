
var jp_Price = "https://lite-api.jup.ag/price/v3";

var jp_Quote = "https://lite-api.jup.ag/swap/v1/quote";

var jp_Swap = "https://lite-api.jup.ag/swap/v1/swap";



async function getTokenVals_Sol(){

  const price = await fetch("https://lite-api.jup.ag/price/v3?ids=So11111111111111111111111111111111111111112");

  var p2 = await price.json();

  var sp = p2["So11111111111111111111111111111111111111112"].usdPrice;

  //console.log(price);
  console.log(p2);
  xcons.log("Solana price: $"+sp.toFixed(3));

//  console.log(JSON.stringify(price, null, 2));

}

async function getTokenVals_Sel(x){

  const price = await fetch(jp_Price+'?ids='+x);

  var p2 = await price.json();

//  console.log(JSON.stringify(price, null, 2));
  console.log(p2);

  return p2;

}

/*
function jup_getQuote_a(){

const quoteResponse = await (
    await fetch(
        'https://lite-api.jup.ag/swap/v1/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=100000000&slippageBps=50&restrictIntermediateTokens=true'
    )
  ).json();
  
console.log(JSON.stringify(quoteResponse, null, 2));

}
*/


async function jup_getQuote(inpM, outM, am, xslip=100){

  var fetchstr = jp_Quote + "?inputMint=" + inpM + "&outputMint=" + outM + "&amount="+am + "&slippageBps="+xslip;

  var quoteResponse = await fetch( fetchstr); 

  var qr2 = await quoteResponse.json();

  //tk_quoteData.innerHTML = "Swap value: $" + qr2.swapUsdValue + "<br> ";

  console.log(qr2);

  return qr2;
}




async function jup_getSwap_a(qr, pubk, xpriority=1){


  var fetchOpt = {method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
    quoteResponse: qr,
    userPublicKey: pubk,
    
    dynamicComputeUnitLimit: true,
    dynamicSlippage: true,
    prioritizationFeeLamports: {
          priorityLevelWithMaxLamports: {maxLamports: 10000*xpriority, priorityLevel: "medium"}
        }
    })};

    // ADDITIONAL PARAMETERS TO OPTIMIZE FOR TRANSACTION LANDING
    // See next guide to optimize for transaction landing



  const swapResponse = await fetch('https://lite-api.jup.ag/swap/v1/swap', fetchOpt );

  var sr2 = await swapResponse.json();

  return sr2;
}


function deserialize_Tx(jpswap){

  var tx = sol.VersionedTransaction.deserialize(buffer.Buffer.from(jpswap.swapTransaction, 'base64'));

  return tx;

  }


async function sim_Tx(tx){

  var con = connect(xloc);

  await con.getRecentBlockhash("confirmed");

  var res = await con.simulateTransaction(tx, "");

  return res;

  }



async function send_Tx(tx, privkey){

  var con = connect(xloc);

  await con.getRecentBlockhash("confirmed");

  var res = await con.sendTransaction(tx, [privkey]);

  return res;

  }


async function send_Tx_serial(tx, privkey){

  tx.sign([privkey]);

  var tx_serial = tx.serialize();

  var con = connect(xloc);

  await con.getRecentBlockhash("confirmed");

  //var res = await con.sendTransaction(tx, [privkey]);

  var signature = await con.sendRawTransaction(tx_serial, {maxRetries: 2, skipPreflight: true});

  return signature;

  }




