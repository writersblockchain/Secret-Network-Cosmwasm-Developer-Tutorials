import { SecretNetworkClient, Wallet, coinsFromString } from "secretjs";
import * as fs from "fs";
// import dotenv from "dotenv";
// dotenv.config();

const wallet = new Wallet("desk pigeon hammer sleep only mistake stool december offer patrol once vacant");

const secretjs = new SecretNetworkClient({
    chainId: "pulsar-3",
    url: "https://pulsar.lcd.secretnodes.com",
    wallet: wallet,
    walletAddress: wallet.address,
  });
  
let contractAddress = "secret1l5ej8ljqnl78x2mu3t5dzgr588ypllusa9han7"
let contractCodeHash = "82b35f533630d1b40e43729dc173e0f0e762d718be5e76824fec2af3dca14c13"

let query_token_info = async () => {
    const tokenInfoQuery = await secretjs.query.compute.queryContract({
      contract_address: contractAddress,
      query: {
        balance: {
          address: wallet.address,
          key: "7d3098f8f5f17ab2b886c367478da3f5db8c1e695f472bc7a63884b3fe6d848f"
        },
      },
      code_hash: contractCodeHash,
    });
  
    console.log(tokenInfoQuery);
  };
  query_token_info();