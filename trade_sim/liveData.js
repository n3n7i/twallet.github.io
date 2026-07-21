

var coin_targets = ["JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN", "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3", "jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL"]



function patch_addr(x){

  var res = "https://api.coingecko.com/api/v3/simple/token_price/solana?contract_addresses=";
  res = res + x;
  res = res + "&vs_currencies=usd";
  return res;
  }


async function getData(x) {
  try {
    const response = await fetch(patch_addr(x));
    
    // Explicitly handle HTTP errors (like 404 or 500)
    if (!response.ok) {
      console.log("web err!");
      //throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json(); // Parses response body as JSON
    console.log(data);
    if (data.hasOwnProperty(x)){
      return await data;
      }
    
  } catch (error) {
    console.log('Network or parsing error:', error);
    var res = {};
    res[x] = {usd: 0};
    console.log(res);
    return res; //?
  }

    console.log("coin not recognized // other err?");
    var res = {};
    res[x] = {usd: 0};
    console.log(res);
    return res; //?
}

//getData(gecko3);


var xres = [];

var xprices = []


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


async function readPrices(xcoin_targets){

  var i=0;
  
  xres=[];
  xprices=[];

  var n=xcoin_targets.length;

  for (i=0; i<n; i++){

    xres.push(await getData(xcoin_targets[i]));
    
    await delay(500);

    }

  for (i=0; i<n; i++){

    xprices.push(xres[i][xcoin_targets[i]].usd);

    }

  }

