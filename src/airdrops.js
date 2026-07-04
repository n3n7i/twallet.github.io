
async function ad_tokenTransferInst_2(s, d, o, amount, dec, defLamp=500, xmode=true, tx2=null){

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


async function ad_burstDrop(acclist, pubtoken,amount=0, dec=0){

  var tx = await ad_tokenTransferInst_2(s_pk(pubtoken), s_pk(acclist[0]), loadpub, amount, dec);

  var n = Math.min(acclist.length, 20);

  for(var i=1;i<n;i++){

    tx = await ad_tokenTransferInst_2(s_pk(pubtoken), s_pk(acclist[i]), loadpub, amount, dec, true, tx);

    }

  return tx;

  }


async function ad_sendXTransaction(){

  var con = connect(xloc);

  var sig = con.sendTransaction(t_tx, [loadkey], "confirmed");

  //var sig = await sol.sendAndConfirmTransaction(con, t_tx, [loadkey], "confirmed");

  sig.then((x) => {console.log("Transaction Signature:"); console.log(x);});

  }


