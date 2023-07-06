

function number_Encode(n, dec){

  var n2 = n* 10**dec;

  var k = 256;

  var j=0;

  var res = [];

  while(n2>0){

    res[j] = n2 % k;

    n2 = (n2 - res[j]) / 256;

    j++;

    }

  console.log(res);

  }



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

  return res;}




async function token_Transfer(Xthis){

  console.log(Xthis);

  var to = new sol.PublicKey(prompt("To address"));

  var checkStat = sol.PublicKey.isOnCurve(to);

  var checkAmount = Xthis.getAttribute("data-amount");

  if (checkAmount==0){

    console.log("Empty account?");

    confirm("close account?");}

  if (checkStat == false){

    console.log("Off-curve address?");

    confirm("sending to nested account!");

    }


  var fromMint = Xthis.getAttribute("data-mintid");

  var fromAcc = new sol.PublicKey(Xthis.getAttribute("data-acc"));

  var mintDec = Number(Xthis.getAttribute("data-dec"));


  console.log(to + " "+ fromMint + " "+ fromAcc + " "+ mintDec);

  //async function dataReq_ptok(con, owned){

  var con=connect(xloc);

  res3 = await con.getParsedTokenAccountsByOwner(to, {programId: tokenkey, mint: new sol.PublicKey(fromMint)});
//  return res3;

  if (res3.value){

    console.log(res3.value[0].pubkey.toBase58());

    var dest = res3.value[0].pubkey;

    var amount = Number(prompt("Amount"));

    var tx= await tokenTransferInst_2(fromAcc, dest, loadkey.publicKey, amount, mintDec);

    }
  console.log(res3);

  if(tx) {

    console.log(tx);

    var res = await con.simulateTransaction(tx, [loadkey], "confirmed");

    console.log(res);

    if (!res.value.err){

      if (confirm("ok to send?")){

        var res2 = await con.sendTransaction(tx, [loadkey], "confirmed");

        console.log(res2);

        }
      }
    }

  }



async function tokenTransferInst_2(s, d, o, amount, dec,xmode=true, tx2=null){

    // 1. Create Solana Transaction
    var tx = tx2;

    if (tx == null)

      tx = new sol.Transaction();

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


async function tokenTransferInst_3(s, d, o, amount, dec,xmode=true){


  var inst = await new sol.TransactionInstruction({
          keys: [{ pubkey: s, isSigner: false, isWritable: true }, 
                 { pubkey: d, isSigner: false, isWritable: true }, 
                 { pubkey: o, isSigner: xmode, isWritable: false }, ],
          data: Buffer.from(bignumber_Encode(amount, dec, 3)),
          programId: tokenkey,
        });

  return inst;
  }




function s_pk(x){

  return new sol.PublicKey(x);

  }


async function genTransfer_nested(){

  var src = s_pk(prompt("source?"));

  var dest = s_pk(prompt("dest?"));

  var own = s_pk(prompt("owner"));

  var amount = prompt("amount");

  var dec = prompt("dec");

  return await tokenTransferInst_2(src,dest,own,Number(amount),Number(dec), false);

  }


async function gen_nested(){

  var own = s_pk(prompt("owner"));

  var mint1 = s_pk(prompt("token mint"));

  var mint2 = s_pk(prompt("nest mint"));

  var ataID = new sol.PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

  var res= await sol.PublicKey.findProgramAddress(
	[own.toBuffer(),
	 tokenkey.toBuffer(),
	 mint2.toBuffer()],
	ataID);

  var stdAcc = res[0]; // owner sub-account

  var txs = await createTokenAccount_testB(stdAcc, mint1);

  return txs;
  
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


/*

function buildAssociatedTokenAccountInstruction(
    payer: PublicKey,
    associatedToken: PublicKey,
    owner: PublicKey,
    mint: PublicKey,
    instructionData: Buffer,
    programId = TOKEN_PROGRAM_ID,
    associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID
): TransactionInstruction {
    const keys = [
        { pubkey: payer, isSigner: true, isWritable: true },
        { pubkey: associatedToken, isSigner: false, isWritable: true },
        { pubkey: owner, isSigner: false, isWritable: false },
        { pubkey: mint, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: programId, isSigner: false, isWritable: false },
    ];

    return new TransactionInstruction({
        keys,
        programId: associatedTokenProgramId,
        data: instructionData,
    });
}

*/


// Test type B ?

async function createTokenAccount_testB(dest, mint){

  var ataID = new sol.PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

  var res= await sol.PublicKey.findProgramAddress(
	[dest.toBuffer(),
	 tokenkey.toBuffer(),
	 mint.toBuffer()],
	ataID);

  console.log("#1");

  console.log(res[0].toBase58());

   // 1. Create Solana Transaction
    var tx = await new sol.Transaction();

  var newAcc = new sol.PublicKey(res[0].toBase58());

  console.log("#1.3");

    // 2. Add Memo Instruction				 
//    await tx.add(

   var data = Buffer.from([1]);

   var keys = [
        { pubkey: loadpub, isSigner: true, isWritable: true }, 
        { pubkey: newAcc, isSigner: false, isWritable: true },
        { pubkey: dest, isSigner: false, isWritable: false },
        { pubkey: mint, isSigner: false, isWritable: false },
        { pubkey: sol.SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: tokenkey, isSigner: false, isWritable: false },
    ];

   await tx.add( new sol.TransactionInstruction({ keys: keys, programId: ataID, data: data }) );

  console.log("#2.3");

  var con = connect(xloc);

  var testres = await con.simulateTransaction(tx, [loadkey], "confirmed");

  return [testres, tx];

  }


async function sendXTransaction(){

  var con = connect(xloc);

  var sig = con.sendTransaction(t_tx, [loadkey], "confirmed");

  //var sig = sol.sendAndConfirmTransaction(con, t_tx, [loadkey], "confirmed");

  sig.then((x) => {console.log("Transaction Signature:"); console.log(x);});

  }


async function sendXTransaction_drop(){

  var con = connect(xloc);

  var sigs = [];

  for (var i=0;i<t_tx.length;i++){

    sigs.push(con.sendTransaction(t_tx[i], [loadkey], "confirmed"));}

  var res = await Promise.allSettled(sigs);

  xsend.log(res);

//  var sig = con.sendTransaction(t_tx, [loadkey], "confirmed");

  //var sig = sol.sendAndConfirmTransaction(con, t_tx, [loadkey], "confirmed");

//  sig.then((x) => {console.log("Transaction Signature:"); console.log(x);});

  }



async function simXTransaction(){

  var con = connect(xloc);

  if (lastReq == "mint4")

    var sig = con.simulateTransaction(t_tx, [loadkey, mintAuth], "confirmed");

  if (lastReq == "mint3")

    var sig = con.simulateTransaction(t_tx, [loadkey, mintPriv], "confirmed");


  //var sig = sol.sendAndConfirmTransaction(con, t_tx, [loadkey], "confirmed");

  sig.then((x) => {console.log("Transaction Signature:"); console.log(x);
    
      xsend.innerHTML += "<input type=button onclick='clearTx();' value='clear'></input></br>";

      xsend.innerHTML += "<p>"+JSON.stringify(x);

    if(!x.err){

      xsend.innerHTML += "<br><input type=button value='Mint3 go' onclick='sendXTransaction_mintAuth()'>";}
    
    });

  }

function clearTx(){

  xsend.innerHTML = "Transfer:";}


async function sendXTransaction_mintAuth(){

  var con = connect(xloc);

  var sig = con.sendTransaction(t_tx, [loadkey, (lastReq == "mint4")?mintAuth:mintPriv], "confirmed");

  sig.then((x) => {console.log("Transaction Signature:"); console.log(x);});

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




/*
async function close_NestedAcc(mint1, mint2, xtoken){

  var ataID = new sol.PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

    var tx = await new sol.Transaction();

    var data = Buffer.from([2]);

   var keys = [
        { pubkey: loadpub, isSigner: true, isWritable: true }, 
        { pubkey: mint1, isSigner: false, isWritable: false },
        { pubkey: mint2, isSigner: false, isWritable: false },
        { pubkey: xtoken, isSigner: false, isWritable: false },
    ];

   await tx.add( new sol.TransactionInstruction({ keys: keys, programId: ataID, data: data }) );

   return tx;

   }
*/


async function collectNst(){

  var src_pk = s_pk(prompt("Source Acc"));

  var mid_pk = s_pk(prompt("Mid Acc"));

  var dest_pk = s_pk(prompt("Dest Acc"));

  var sdmint = s_pk(prompt("Source/Dest Mint"));

  var midmint = s_pk(prompt("Mid Mint"));

  return await close_NestedAcc_Raw(midmint, sdmint, dest_pk, mid_pk, src_pk, tokenkey);

  }


async function close_NestedAcc_Raw(mint1_o, mint2_sd, addr1_d, addr2_o, addr3_n, xtoken){

  var ataID = new sol.PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

    var tx = await new sol.Transaction();

    var data = Buffer.from([2]);

   var keys = [
        { pubkey: addr3_n, isSigner: false, isWritable: true },
        { pubkey: mint2_sd, isSigner: false, isWritable: false },
        { pubkey: addr1_d, isSigner: false, isWritable: true },
        { pubkey: addr2_o, isSigner: false, isWritable: false },
        { pubkey: mint1_o, isSigner: false, isWritable: false },
        { pubkey: loadpub, isSigner: true, isWritable: true }, 
        { pubkey: xtoken, isSigner: false, isWritable: false },

    ];

   await tx.add( new sol.TransactionInstruction({ keys: keys, programId: ataID, data: data }) );

   return tx;

   }


async function tokenCloseInst2(s, o){

    // 1. Create Solana Transaction
    let tx = new sol.Transaction();

    //var s = new sol.PublicKey("5zQWQCutY3jAapHsKspntdWPZuNHecHPeHJifgsTF3uh");
    //var d = new sol.PublicKey("3xbQpBvgvRUQBXi2QQeTXNzdNZ5A1CGZwrVp9UK9kfJ9");
    //var m = new sol.PublicKey("kinXdEcpDQeHPEuQnqmUgtYykqKGVFq6CeVX5iAHJq6");
    //var o = new sol.PublicKey("75EL7ju4FZjRjbhSdeNdzZesSZZAN8wNBphCexUf9MfE");


    // 2. Add Memo Instruction
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

//    var s = new sol.PublicKey("5zQWQCutY3jAapHsKspntdWPZuNHecHPeHJifgsTF3uh");
//    var d = new sol.PublicKey("3xbQpBvgvRUQBXi2QQeTXNzdNZ5A1CGZwrVp9UK9kfJ9");
//    var m = new sol.PublicKey("kinXdEcpDQeHPEuQnqmUgtYykqKGVFq6CeVX5iAHJq6");
//    var o = new sol.PublicKey("75EL7ju4FZjRjbhSdeNdzZesSZZAN8wNBphCexUf9MfE");


    // 2. Add Memo Instruction
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


async function collectAppr(){

  var src = s_pk(prompt("source?"));

  var del = s_pk(prompt("delegate?"));

  var own = loadpub;

  var amount = Number(prompt("Amount"));

  var dec = Number(prompt("decimals?"));

  return await tokenApproveInst2(src, del, own, amount, dec);

}


async function tokenApproveInst2(s, d, o, amount, dec){

    // 1. Create Solana Transaction
    let tx = new sol.Transaction();

//    var s = new sol.PublicKey("5zQWQCutY3jAapHsKspntdWPZuNHecHPeHJifgsTF3uh");
//    var d = new sol.PublicKey("3xbQpBvgvRUQBXi2QQeTXNzdNZ5A1CGZwrVp9UK9kfJ9");
//    var m = new sol.PublicKey("kinXdEcpDQeHPEuQnqmUgtYykqKGVFq6CeVX5iAHJq6");
//    var o = new sol.PublicKey("75EL7ju4FZjRjbhSdeNdzZesSZZAN8wNBphCexUf9MfE");


    // 2. Add Memo Instruction
    await tx.add(
        new sol.TransactionInstruction({
          keys: [{ pubkey: s, isSigner: false, isWritable: true },  
                 { pubkey: d, isSigner: false, isWritable: false },              
                 { pubkey: o, isSigner: true, isWritable: false }, ],
          data: Buffer.from(bignumber_Encode(amount, dec, 4)),
          programId: tokenkey,
        })
	);

    return tx;
}



async function collectRevoke(){

  var src = s_pk(prompt("source?"));

//  var del = s_pk(prompt("delegate?"));

  var own = loadpub;

//  var amount = Number(prompt("Amount"));

//  var dec = Number(prompt("decimals?"));

  return await tokenRevokeInst2(src, own);

}


async function tokenRevokeInst2(s, o){

    // 1. Create Solana Transaction
    let tx = new sol.Transaction();

//    var s = new sol.PublicKey("5zQWQCutY3jAapHsKspntdWPZuNHecHPeHJifgsTF3uh");
//    var d = new sol.PublicKey("3xbQpBvgvRUQBXi2QQeTXNzdNZ5A1CGZwrVp9UK9kfJ9");
//    var m = new sol.PublicKey("kinXdEcpDQeHPEuQnqmUgtYykqKGVFq6CeVX5iAHJq6");
//    var o = new sol.PublicKey("75EL7ju4FZjRjbhSdeNdzZesSZZAN8wNBphCexUf9MfE");


    // 2. Add Memo Instruction
    await tx.add(
        new sol.TransactionInstruction({
          keys: [{ pubkey: s, isSigner: false, isWritable: true },  
                 { pubkey: o, isSigner: true, isWritable: false }, ],
          data: Buffer.from([5]),
          programId: tokenkey,
        })
	);

    return tx;
}

