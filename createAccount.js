const algosdk = require("algosdk");
const fs = require("fs");

const account = algosdk.generateAccount();
const addressObject = account.addr;
const publicKey = addressObject.publicKey;
const formattedAddress = algosdk.encodeAddress(publicKey);
const secretKey = account.sk;
const mnemonic = algosdk.secretKeyToMnemonic(secretKey);
const privateKey = Buffer.from(secretKey).toString("base64");

const algoAcccount = {
  address: formattedAddress,
  mnemonic: mnemonic,
  privateKey: privateKey,
};
fs.writeFileSync("account.json", JSON.stringify(algoAcccount, null, 2));

console.log("New Algorand Account created.");
console.log("Account Details saved to 'account.json'.");
