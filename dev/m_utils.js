


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



//sol transfer//

async function logMemoC(message, amount, to) {  

    var con = connect(xloc);

    var fromKeypair = loadkey;

    //var to = new sol.PublicKey("2bHQiUSQzzbiJ28ZnuTVxAsajsscMc5QwagurqsjVCb8");
    //var amount = 7 * 1000;

    // 1. Create Solana Transaction
    let tx = new sol.Transaction();

    // 2. Add Memo Instruction
    await tx.add(
        new sol.TransactionInstruction({
          keys: [{ pubkey: fromKeypair.publicKey, isSigner: true, isWritable: true }],
          data: Buffer.from(message, "utf-8"),
          programId: new sol.PublicKey("Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo"),
        })
      )
    // 2. Add Send Instruction
    await tx.add(
        sol.SystemProgram.transfer({

          fromPubkey: fromKeypair.publicKey,
          toPubkey: to,
          lamports: amount, }) 
        );

    // 3. Send Transaction
    let result = await sol.sendAndConfirmTransaction(con, tx, [fromKeypair]);
    // 4. Log Tx URL
    console.log("complete: ", `https://explorer.solana.com/tx/${result}`);
    return result;
}

// gettoken address //

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

// send tokens //

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


// create tokenacc //

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


// jupiter quote //

var quoteRes = [];

var JM_api4 = "https://quote-api.jup.ag/v4/quote"; 



async function dataReq_jup(t1, t2, am, exactOut=false, direct_Rt=true, direct_Slip=25){

  var rx = JM_api4 + "?inputMint=" + t1 + "&outputMint=" + t2 + "&amount="+am

  //var ex2 = document.getElementsByName("buyExact")[0].checked;

  //if (exactOut && ex2)

  if (exactOut)
    rx = rx + "&swapMode=ExactOut";

  if (direct_Rt) // && document.getElementsByName("r_direct")[0].checked)

    rx = rx + "&onlyDirectRoutes=true";

  if (direct_Slip !== 0){

    //direct_Slip = slipvals[document.getElementById("baseSlip").selectedIndex];

    rx = rx + "&slippageBps="+String(direct_Slip);}

  fetch(rx, {headers:{accept: 'application/json'}}).then((resp) => resp.json()).then((data) => {

	//res3 = data; 
	//jupdata.push({data: data}); 
	//showQuote({data:data});

        quoteRes = data;
	});

  }



function onCurve(x){

  return sol.publicKey.isOnCurve(x);

  }





