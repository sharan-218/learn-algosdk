const algosdk = require("algosdk");
const fs = require("fs");
const algoToken = "";
const algoServer = "https://node.testnet.algoexplorerapi.io";
const port = "";
const algoClient = new algosdk.Algodv2(algoToken, algoServer, port);

const accountData = JSON.parse(fs.readFileSync("account.json", "utf-8"));

const { address } = accountData;
const privateKey = Buffer.from(accountData.privateKey, "Base64");

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

async function createToken() {
  try {
    const suggestedParams = await algoClient.getTransactionParams().do();
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
    const signedTxn = txn.signTxn(privateKey);
    const txnID = txn.txID().toString();
    const confirmTxn = await algosdk.waitForConfirmation(algoClient, txnID, 4);
    console.log(confirmTxn);
    const assetIndex = confirmTxn["asset-index"];
    console.log(assetIndex);
    console.log("asset created");
  } catch (error) {
    console.log("Error creating Token: ", error);
  }
}
createToken();
