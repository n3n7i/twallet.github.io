

var h_api = "4f56103d-4ab3-4e8b-a5d3-25f8be82dbcc"

var j_api = "jup_d9f44363a5ce7bb72b85fbac167892dbd0526eed6523cf350eb82720814fcc3f";


async function readPrices_helius(){

//  const url = 'https://example.com';
//'Authorization': 'Bearer YOUR_TOKEN_HERE'

//  "method": "getAssetsByOwner",
  
  var url = "https://mainnet.helius-rpc.com/?api-key=" + h_api;

  var res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',

    },
    body: JSON.stringify( {  "jsonrpc": "2.0",
  "id": "1",
  "method": "getTokenAccounts",
  "params": {
    "owner": "2bHQiUSQzzbiJ28ZnuTVxAsajsscMc5QwagurqsjVCb8",
    "page": 1,
    "limit": 10,
     }
    })
    });
  
  return res;
  }
  
  
  /*
  
      "options": {
      "showUnverifiedCollections": false,
      "showCollectionMetadata": false,
      "showGrandTotal": false,
      "showFungible": false,
      "showNativeBalance": false,
      "showZeroBalance": false
      }
  
  */
  
  
async function readBalance_helius(wal){

  var url = "https://api.helius.xyz/v1/wallet/" + wal+ "/balances?page=1&limit=100&showNative=true&api-key="+h_api;
  
  var res = await fetch(url);
  
  return res;
  
  }
  

async function readPrice_jup(clist){  
  
  var n = Math.min(clist.length, 50);
  
  var cstr = "";
  cstr = cstr.concat(clist);
  
  const price = await (
    await fetch(
    'https://api.jup.ag/price/v3?ids='+cstr,
     {
      headers: {
        'x-api-key': j_api,
        },
     }
    )
  ).json();
  
  console.log(JSON.stringify(price, null, 2));
  
  }