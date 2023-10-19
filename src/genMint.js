
/*
var mintpub;
var mintPriv;


var mintA_pub;
var mintAuth;

var mintRead=0;

*/

function Mint_encoding(k1, k2, dec, k2bool){ //? [u8,u8,k,u8,k]

  var ax = new Array(64+3);

  ax.fill(0);

  for (var i=0;i<32; i++){

    ax[i+2] = k1[i];

    if (k2bool) ax[i+32+3] = k2[i];

    }

  ax[0] = 0;

  ax[1] = dec;

  ax[34] = k2bool;

  return ax;

  }



async function CreateAccount_mint(fromPub, mintPub, mintAuth, dec){


/*    var keys = [
        { pubkey: mint, isSigner: false, isWritable: true },
        { pubkey: sol.SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    ];*/

  var inst1 = sol.SystemProgram.createAccount({lamports:1461600, space:82, fromPubkey:fromPub, newAccountPubkey:mintPub, programId:tokenkey});

  var inst2 =  new sol.TransactionInstruction({
          keys: [{ pubkey: mintPub, isSigner: false, isWritable: true },                  
	        { pubkey: sol.SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false }, ],
          data: Buffer.from(Mint_encoding(mintAuth.toBuffer(), (new sol.PublicKey(0)).toBuffer(), dec, 0)),
          programId: tokenkey,
        });

//  return [inst1, inst2];

  var tx = new sol.Transaction();

  await tx.add(inst1);

  await tx.add(inst2);

  return tx;

  }


async function Mintto_Inst(mintPub, mintAuth, destPub, amount, dec){

  var destP = await det_ATAaddr(destPub, mintPub);


  var inst3 =  new sol.TransactionInstruction({
          keys: [{ pubkey: mintPub, isSigner: false, isWritable: true },                  
	        { pubkey:  destP[0], isSigner: false, isWritable: true }, 
	        { pubkey:  mintAuth, isSigner: true, isWritable: false }, 
		{ pubkey:  loadpub, isSigner: true, isWritable: true }, ],

          data: Buffer.from(bignumber_Encode(amount, dec, 7)),
          programId: tokenkey,
        });

  var tx = await new sol.Transaction();

  tx.add(inst3); //sign [feepayer, mintauth]

  return tx;

  }


function checkMint_keys(){

  if(mintPriv && !mintpub)

    mintpub = mintPriv.publicKey;

  if(mintAuth && !mintA_pub)

    mintA_pub = mintAuth.publicKey;

  }


async function create_Meta(){

  var deepKey = s_pk("7JpBK6XLoNjn9VoM8YwZBTKRcWmwSiUZipPpynf8ppzi");
  var sigkey_meta = s_pk("2FmTasvr5hHn1XmkJSUbdxCdNTEXJur6LgVGQuPQ651B");

  var obj1 = {	name: document.getElementById("metaN").value,
		symbol: document.getElementById("metaS").value,
                image: document.getElementById("metaI").value  };

  var obj2 = {	mint: document.getElementById("metaM").value,
		"min-data": "",
                metadata: true};

  var str1 = JSON.stringify(obj1);

  xcons.log(str1.length);

  console.log(str1);

  if (confirm("Write to blockChain?")){

    var tx1 = logMemoC(str1, 0, deepKey);

    tx1.then((x)=> {

        obj2["min-data"] = x;

        var str2 = JSON.stringify(obj2);

        var tx2 = logMemoC(str2, 0, sigkey_meta);

        tx2.then((r) => {

        console.log("Signature 2:" +r);})


	});

    }
   
  }


  /*

    mint: PublicKey,
    decimals: number,
    mintAuthority: PublicKey,
    freezeAuthority: PublicKey | null,
    programId = TOKEN_PROGRAM_ID
): TransactionInstruction {
    const keys = [
        { pubkey: mint, isSigner: false, isWritable: true },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    ];

    const data = Buffer.alloc(initializeMintInstructionData.span);
    initializeMintInstructionData.encode(
        {
            instruction: TokenInstruction.InitializeMint,
            decimals,
            mintAuthority,
            freezeAuthorityOption: freezeAuthority ? 1 : 0,
            freezeAuthority: freezeAuthority || new PublicKey(0),
        },
        data
    );

    return new TransactionInstruction({ keys, programId, data });
}

*/


/*

export async function mintTo(
    connection: Connection,
    payer: Signer,
    mint: PublicKey,
    destination: PublicKey,
    authority: Signer | PublicKey,
    amount: number | bigint,
    multiSigners: Signer[] = [],
    confirmOptions?: ConfirmOptions,
    programId = TOKEN_PROGRAM_ID
): Promise<TransactionSignature> {
    const [authorityPublicKey, signers] = getSigners(authority, multiSigners);

    const transaction = new Transaction().add(
        createMintToInstruction(mint, destination, authorityPublicKey, amount, multiSigners, programId)
    );

    return await sendAndConfirmTransaction(connection, transaction, [payer, ...signers], confirmOptions);
}


    mint: PublicKey,
    destination: PublicKey,
    authority: PublicKey,
    amount: number | bigint,
    multiSigners: (Signer | PublicKey)[] = [],
    programId = TOKEN_PROGRAM_ID
): TransactionInstruction {
    const keys = addSigners(
        [
            { pubkey: mint, isSigner: false, isWritable: true },
            { pubkey: destination, isSigner: false, isWritable: true },
        ],
        authority,
        multiSigners
    );

    const data = Buffer.alloc(mintToInstructionData.span);
    mintToInstructionData.encode(
        {
            instruction: TokenInstruction.MintTo,
            amount: BigInt(amount),
        },
        data
    );



*/