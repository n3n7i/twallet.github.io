
const sol = solanaWeb3;

console.log("Wallet.js init!");


function logthis(t){
  this.innerHTML = t+"<br>"+ this.innerHTML;
  if (t=="/clear") this.innerHTML= "";
  }

function printthis(t){
  this.innerHTML = t;
  }

var xmain = document.getElementById("main");
xmain.log = printthis;

var xpubkey = document.getElementById("pubkey");
xpubkey.log = printthis;

var xcons = document.getElementById("xcons");
xcons.log = logthis;

//var xmain = document.getElementById("main");
xsend.log = printthis;




var jupApi = "";

var rpcUrl = "";

var xloc = "https://side-young-mountain.solana-mainnet.discover.quiknode.pro/cf23f5a294367ce0cf1b89a1a34d9c00039e069a/"

var xloc3 = "https://rpc.ankr.com/solana";

var tokenkey =  new sol.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");



function connect(xlo, xtype="confirmed"){
  var connection = new sol.Connection(xlo, xtype);
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


async function dataReq_sBal(con, owned){

  res3 = await con.getBalance(owned, "confirmed");

  //res3.then((res) => RecentBal = res);

  return res3;
  }



function file_readx(z){
  var f = z.files[0];

  console.log(f);

  }
