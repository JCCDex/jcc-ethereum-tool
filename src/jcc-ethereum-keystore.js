const fs = require("fs");
const utils = require("jcc-ethereum-utils");
const Wallet = require("ethereumjs-wallet");
var readlineSync = require("readline-sync");
var ethUtil = require("ethereumjs-util");

var Writable = require("stream").Writable;

var mutableStdout = new Writable({
  write: function(chunk, encoding, callback) {
    if (!this.muted) {
      process.stdout.write(chunk, encoding);
      console.log("-");
    }
    callback();
  }
});
mutableStdout.muted = false;

function processCreateWallet() {
  var w = utils.Ethereum.createWallet();
  console.log(JSON.stringify(w, null, 2));

  process.exit(0);
}

function saveKeystore() {
  var w = Wallet.generate();
  var f = w.getV3Filename();

  var password = readlineSync.question("Password:", { hideEchoBack: true });

  fs.writeFileSync(f, JSON.stringify(w.toV3(password), null, 2), "utf-8");
  console.log("\n", f, "saved");
  return;
}

function importToKeystore() {
  var secret = readlineSync.question("MOAC wallet secret:", {
    hideEchoBack: true
  });
  if (secret.indexOf("0x") == -1) {
    secret = "0x" + secret;
  }
  if (!utils.Ethereum.isValidSecret(secret)) {
    console.log("secret invalid, abort.");
    return;
  }
  var w = Wallet.fromPrivateKey(ethUtil.toBuffer(secret));
  var f = w.getV3Filename();
  var password = readlineSync.question("Password:", { hideEchoBack: true });
  fs.writeFileSync(f, JSON.stringify(w.toV3(password), null, 2), "utf-8");
  console.log("\n", f, "saved");
  return;
}

function getWalletFromKeystore(_file, _password) {
  if (fs.existsSync(_file)) {
    try {
      var ks = JSON.parse(fs.readFileSync(_file, "utf-8"));
      var password;
      if (!_password) {
        password = readlineSync.question("Password:", { hideEchoBack: true });
      } else {
        password = _password;
      }

      var w = Wallet.fromV3(ks, password);
      // console.log(w.getAddressString(), w.getPrivateKeyString());
      return { address: w.getAddressString(), secret: w.getPrivateKeyString() };
    } catch (e) {
      console.log("Parse keystore file fail, check and correct it", e);
      process.exit();
    }
  } else {
    console.log("Can not find", _file, "abort!");
    process.exit();
  }
}
module.exports = {
  processCreateWallet,
  saveKeystore,
  importToKeystore,
  getWalletFromKeystore
};
