

// keyGenerator ------------ //

const sol = solanaWeb3;

function gen_newKey(){

  var newkey = sol.Keypair.generate();

/*  var pub_nk = newkey.publicKey;
  var pub_nkStr = newkey.publicKey.toBase58();

  //var key2 = sol.Keypair.fromSecretKey(newkey.secretKey);
  //console.log(pub_nk, "\n", key2.publicKey.toBase58());
  // wallet export

  var keydata = "["+newkey.secretKey.toString()+"]";

  if (cryptRead){
    keydata = "[" + xorBytes(newkey.secretKey, hshKey).toString() + "]";
    cryptRead = false;
    }
  
  var a = new Blob([keydata], {type: "text/html"});
  var u = URL.createObjectURL(a);

  xpubkey.log("<a href='"+u+"'>Secret key</a> for address "+pub_nkStr.slice(0,8)+"...");

  */

  return newkey;

  }


async function check_Storage(){
  var x = await navigator.storage.estimate();
  console.log(x);

  var d = await navigator.storage.getDirectory();

  var fileIds = [];

  for await (let [name, handle] of d.entries()) {
    console.log("entries", name);
    }

  //for await (let [name, handle] of directoryHandle.entries()) {}
  
  for await (let handle of d.values()) { 
    console.log("values", handle);
    }

  for await (let name of d.keys()) {
    console.log("keys", name);
    fileIds.push(name);
    }
  
  if (fileIds.length == 0){
    var fileHandle = await d.getFileHandle("keyfile1.txt", {create: true});
    console.log("create file ", fileIds[0]);
    }

  if (fileIds.length > 0 ){
    var fileHandle = await d.getFileHandle(fileIds[0], {create: false});
    console.log("loaded file ", fileIds[0]);
    }

  return [d, fileHandle, fileIds];
  }


async function get_Storage(data){

  var blobx = await data[1].getFile();

  var keydata = await blobx.arrayBuffer();

  return keydata;

  }


async function put_Storage(filename, keydata){

  var d = await navigator.storage.getDirectory();

  var blobx = await d.getFileHandle(filename, {create: true});

//async function writeFile(fileHandle, contents) {
  // Create a FileSystemWritableFileStream to write to.
  
  var writable = await blobx.createWritable();

  // Write the contents of the file to the stream.
  await writable.write(keydata);

  // Close the file and write the contents to disk.
  await writable.close();

  }


async function firstload(){

  var x = await check_Storage();

  var readdata;

  var newkey;

  if (x[2].length > 0)

    readdata = await get_Storage(x);

  if (x[2].length == 0 || readdata.byteLength==0){

    newkey = gen_newKey();

    put_Storage("keyfile1.txt", newkey.secretKey);

    }

  console.log(readdata, newkey);

  var key = sol.Keypair.fromSecretKey(buffer.Buffer(readdata));

  console.log(key.publicKey.toBase58());

  return key;

  }

