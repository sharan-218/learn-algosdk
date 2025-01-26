const algosdk = require("algosdk");
const fs = require("fs");
require("dotenv").config();
const algoToken = "";
const algoServer = "https://testnet-api.algonode.cloud";
const port = 443;
const algoClient = new algosdk.Algodv2(algoToken, algoServer, port);
// algoClient
//   .status()
//   .do()
//   .then((status) => console.log("Node Status: ", status.catchupTime))
//   .catch((err) => console.error("Failed To get Status: ", err));

// const accountData = JSON.parse(fs.readFileSync("account.json", "utf-8"));

async function createToken() {
  try {
    const suggestedParams = await algoClient.getTransactionParams().do();
    const address = process.env.address.trim();
    const privateKey = Buffer.from(process.env.private_key, "base64");

    console.log("address: ", address);
    console.log("Suggested params: ", suggestedParams);
    if (!algosdk.isValidAddress(address)) {
      console.error("Invalid address");
    }
    const tokenParams = {
      total: 1000000,
      decimals: 2,
      unitName: "TST",
      assetName: "Test",
      manager: address,
      reserve: address,
      freeze: address,
      clawback: address,
      defaultFrozen: false,
    };

    const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
      from: address,
      total: tokenParams.total,
      decimals: tokenParams.decimals,
      defaultFrozen: tokenParams.defaultFrozen,
      manager: tokenParams.manager,
      reserve: tokenParams.reserve,
      freeze: tokenParams.freeze,
      clawback: tokenParams.clawback,
      unitName: tokenParams.unitName,
      assetName: tokenParams.assetName,
      suggestedParams: suggestedParams,
    });

    console.log(txn);

    const signedTxn = txn.signTxn(privateKey);
    const txnID = txn.txID().toString();
    await algoClient.sendRawTransaction(signedTxn).do();
    console.log("Transaction submitted. ID: ", txnID);
  } catch (error) {
    console.log("Error creating Token: ", error);
  }
}
createToken();
