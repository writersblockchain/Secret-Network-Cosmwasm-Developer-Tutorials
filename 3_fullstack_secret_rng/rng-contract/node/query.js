import { SecretNetworkClient, Wallet } from "secretjs";
import dotenv from "dotenv";
dotenv.config();

const wallet = new Wallet(process.env.MNEMONIC);

let contractAddress = process.env.CONTRACT_ADDRESS;
let contractCodeHash = process.env.CONTRACT_CODEHASH;

const secretjs = new SecretNetworkClient({
  chainId: "pulsar-3",
  url: "https://api.pulsar3.scrttestnet.com",
  wallet: wallet,
  walletAddress: wallet.address,
});

let query_flip = async () => {
    let flip_tx = await secretjs.query.compute.queryContract({
      contract_address: contractAddress,
      code_hash: contractCodeHash,
      query: {
        get_flip: {},
      },
    });
    console.log(flip_tx);
  };
  
  query_flip();
  
