

var Buffer = buffer.Buffer;


function bignumber_Encode(n, dec, i){

  var x = n%1;

  var x2 = x * (10**dec);

  var n2 = (BigInt(n|0)* BigInt(10**dec)) + BigInt(x2|0);

  console.log(n2);

  var k = BigInt(256);

  var j=0;

  var res = [];

  res[0] = i;

  j++;

  while(n2>0){

    res[j] =  Number(n2 % k); //Number();

    n2 = (n2 - BigInt(res[j])) / BigInt(256);

    j++;

    }

  while(j<9) res[j++] =0;

  console.log(res);

  return res;

  }


function shortInst_Encode(xtype){

  res = [];

  if (xtype == "closeAccount"){

    res[0] = 9;}

  if (xtype == "openAccount"){

    res[0] = 1;}

  return res;
  }


function s_pk(addr){

  return new sol.PublicKey(addr);
  }



async function det_ATAaddr(dest, mint){

  var ataID = new sol.PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

  var res= await sol.PublicKey.findProgramAddress(
	[dest.toBuffer(),
	 tokenkey.toBuffer(),
	 mint.toBuffer()],
	ataID);

  console.log("#1");

  return res;

  }


async function sendXTransaction(t_tx){

  var con = connect(xloc);

  var sig = con.sendTransaction(t_tx, [loadkey], "confirmed");

  //var sig = sol.sendAndConfirmTransaction(con, t_tx, [loadkey], "confirmed");

  sig.then((x) => {console.log("Transaction Signature:"); console.log(x);});

  }


// Test type A ?

async function createTokenAccount(dest, mint){

  var res= await sol.PublicKey.findProgramAddress(
	[dest.toBuffer(),
	 tokenkey.toBuffer(),
	 mint.toBuffer()],
	tokenkey);

  console.log("#1");

  console.log(res);


  var spaceX = 165;

  var lamports = 2039280;

  var resAcc = new sol.PublicKey(res[0].toBase58());

  console.log(resAcc.toBase58());

  // getminrent?

    // 1. Create Solana Transaction
    var tx = await new sol.Transaction();

  console.log("#1.3");

    // 2. Add Memo Instruction				 
    await tx.add(
	sol.SystemProgram.createAccount({                             
            fromPubkey: loadpub,
            newAccountPubkey: resAcc,
            space: spaceX,
            lamports: lamports,
            programId: tokenkey} ));

  console.log("#2");

    var keys = [
        { pubkey: resAcc, isSigner: true, isWritable: true },
        { pubkey: mint, isSigner: false, isWritable: false },
        { pubkey: dest, isSigner: false, isWritable: false },
        { pubkey: sol.SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    ];

    var data = shortInst_Encode("openAccount");

    var progid = tokenkey;

    await tx.add(
	new sol.TransactionInstruction({ keys: keys, programId: progid, data: data }) );
    
  console.log("#3");

    return tx;
  }



async function tokenTransferInst_2(s, d, o, amount, dec, defLamp=500, xmode=true, tx2=null){

    // 1. Create Solana Transaction
    var tx = tx2;

    if (tx == null){

      tx = new sol.Transaction();

      var xlamp = defLamp * (1000000 / 10000);

      if (defLamp>0){
        tx.add(sol.ComputeBudgetProgram.setComputeUnitPrice({ microLamports: Math.floor(xlamp) }));
        tx.add(sol.ComputeBudgetProgram.setComputeUnitLimit({ units: 10000 }));
        }

      }

    // 2. Add Memo Instruction
    await tx.add(
        new sol.TransactionInstruction({
          keys: [{ pubkey: s, isSigner: false, isWritable: true }, 
                 { pubkey: d, isSigner: false, isWritable: true }, 
                 { pubkey: o, isSigner: xmode, isWritable: false }, ],
          data: Buffer.from(bignumber_Encode(amount, dec, 3)),
          programId: tokenkey,
        })
	);

    return tx;
  }


async function tokenCloseInst2(s, o){

    // 1. Create Solana Transaction
    let tx = new sol.Transaction();

    // 2. Ad Instruction
    await tx.add(
        new sol.TransactionInstruction({
          keys: [{ pubkey: s, isSigner: false, isWritable: true },  
                 { pubkey: o, isSigner: false, isWritable: true },              
                 { pubkey: o, isSigner: true, isWritable: false }, ],
          data: Buffer.from(shortInst_Encode("closeAccount")),
          programId: tokenkey,
        })
	);

    return tx;
}



async function tokenBurnInst2(s, m, o, amount, dec){

    // 1. Create Solana Transaction
    let tx = new sol.Transaction();


    // 2. Add Instruction
    await tx.add(
        new sol.TransactionInstruction({
          keys: [{ pubkey: s, isSigner: false, isWritable: true },  
                 { pubkey: m, isSigner: false, isWritable: true },              
                 { pubkey: o, isSigner: true, isWritable: false }, ],
          data: Buffer.from(bignumber_Encode(amount, dec, 8)),
          programId: tokenkey,
        })
	);

    return tx;
}




