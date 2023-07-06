


function metadata_OldAddr(mint_addr){

  var xstr = "https://raw.githubusercontent.com/solana-labs/token-list/70844e3f4fa1c0e359ebefcd73fb6cc142b33476/assets/mainnet/"

  var xstr2 = xstr + mint_addr + "/logo.png";

  return xstr2;

  }

function metadata_Old(mint_addr){

  var xstr = "https://raw.githubusercontent.com/solana-labs/token-list/70844e3f4fa1c0e359ebefcd73fb6cc142b33476/assets/mainnet/"

  var xstr2 = xstr + mint_addr + "/logo.png";

//  var xcheck = await fetchCheck(xstr2);

//  console.log(" "+xcheck);

//  if (xcheck==200)

    return xstr2;

//  var xcheck2 = await fetchCheck(xstr2+".svg");

//  if (xcheck2==200)

//    return xstr2 + ".svg";

//  return "";

  }


async function fetchCheck(request){

  var response = await fetch(request, {method: "GET"});

  console.log(response);

  return response.status;
  }



function autoRun_fetch2(){

  var n = wallet_Tok.length;

  var w_addr = [];

  tx = "";

  for (var i=0;i<n;i++){

    w_addr[i] = metadata_Old(wallet_Tok[i].id);

    tx += "<img class=icon src='"+w_addr[i]+"'>";

    }

  xmain.innerHTML += tx;

  }

  

    