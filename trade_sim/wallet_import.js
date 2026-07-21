

var wi_mints = [];
var wi_quants = [];

function checkImport(){

  if (localStorage.getItem("expWallet")==null) return false;
  return true;

  }


function walletData(){

  if (checkImport()==false) return ;

  var res = JSON.parse(localStorage.expWallet);
  
  var mints = res.map(x=>x.id);
  var quants = res.map(x=>x.amount);
  
  wi_mints = mints;
  wi_quants = quants;

  }