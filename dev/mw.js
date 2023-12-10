

function wallet_Obj(){

  var t = this;

  t.keypair = [];

  t.address = [];

  t.Balance = 0;

  t.Solprice = 0;

  t.tokens = [];

  t.tokenSelect = -1;

  }


function std_Sol(){

  var t = {};

  t.prog = {"AT" : 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'  , 
	    "Token": 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' ,
	    "Memo": 'Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo'  ,	};

  return t;

  }

var sol_Units = std_Sol();

function connect(xlo){
  var connection = new sol.Connection(xlo, "confirmed");
  return connection;
  }

function s_pk(addr){

  return new sol.PublicKey(addr);}

function std_connect(c, x, arg){

  if (x=="Balance")
    return c.getBalance(arg);

  if (x=="Account")
    return c.getParsedTokenAccountsByOwner(arg, {programId: s_pk(sol_Units.prog.Token),});

  if (x=="Block")
    return c.getRecentBlockhash();

  if (x=="Signatures")
    return c.getSignaturesForAddress(arg);

  if (x=="Status")
    return c.getSignatureStatus(arg);

  if (x=="Send")
    return c.getSignaturesForAddress(arg[0], arg[1]);


/*  var t={};

  t.xcall = {"Balance":	        c.getBalance,
	    "Accounts":	 	c.getParsedTokenAccountsByOwner,
            "Block":	 	c.getRecentBlockhash,
            "Signatures": 	c.getSignaturesForAddress,
            "Transactions": 	c.getParsedTransactions,
	    "Status":	  	c.getSignatureStatus,	 
	    "Send": 		c.sendTransaction,
	    	};

  return t.xcall[x](arg);
*/
  }

var xloc = "https://side-young-mountain.solana-mainnet.discover.quiknode.pro/cf23f5a294367ce0cf1b89a1a34d9c00039e069a/";

