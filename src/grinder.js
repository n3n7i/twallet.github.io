
function batchKeys(n=10000){
  var k1 = [];
  var k2 = [];
  for (var i=0;i<n;i++){
    var kx = sol.Keypair.generate();
    k1.push(kx);
    k2.push(kx.publicKey);
    }
  return [k1,k2];
  }

function vanity_keygrind(keys, s_str){

  xstr = "";
  
  for (var i=0;i<keys.length; i++){
    xstr += keys[i].toBase58() + "-";}

  var id = xstr.toUpperCase().indexOf(s_str.toUpperCase());

  if (id>-1){
    console.log('Found an occurance');
    var xcount = xstr.slice(0,id + s_str.length).split('-').length;
    return xcount-1;
    }
  }

/*
generate 100,000 keys: ~37 sec [batch()]

search 100,000 keys: ~1.7 sec [grind()]
*/
