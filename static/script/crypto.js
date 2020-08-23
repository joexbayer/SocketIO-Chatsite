function encryptMainPublic(data){
    //encrypt data with public key with sha256
    encrypted = publicKey.encrypt(data, "RSA-OAEP", {
            md: forge.md.sha256.create(),
            mgf1: forge.mgf1.create()
        });
    data_enc = forge.util.encode64(encrypted);
    return data_enc;
}

    /*
    https://stackoverflow.com/questions/30990129/encrypt-in-python-decrypt-in-javascript
    */

function decryptRoom(data){
    var base64ciphertextFromPython = data;
    var ciphertext = CryptoJS.enc.Base64.parse(base64ciphertextFromPython);

    // split iv and ciphertext
    var iv = ciphertext.clone();
    iv.sigBytes = 16;
    iv.clamp();
    ciphertext.words.splice(0, 4); // delete 4 words = 16 bytes
    ciphertext.sigBytes -= 16;

    var key = CryptoJS.enc.Utf8.parse(room_key);

    // decryption
    var decrypted = CryptoJS.AES.decrypt({ciphertext: ciphertext}, key, {
      iv: iv,
      mode: CryptoJS.mode.CFB
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}


function encryptRoom(s) {
        var key = CryptoJS.enc.Utf8.parse(room_key);
        var iv = CryptoJS.lib.WordArray.random(16);
        var e = CryptoJS.AES.encrypt(s, key, {iv: iv, mode: CryptoJS.mode.CFB})
        var r =  CryptoJS.enc.Utf8.parse("")
        r.concat(iv)
        r.concat(e.ciphertext)
        r = CryptoJS.enc.Base64.stringify(r)
        return r;
}