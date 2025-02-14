import { SecretNetworkClient, Wallet, coinsFromString } from "secretjs";
import dotenv from "dotenv"
dotenv.config()

const wallet = new Wallet(process.env.MNEMONIC);

const secretjs = new SecretNetworkClient({
  chainId: "pulsar-3",
  url: "https://pulsar.lcd.secretnodes.com",
  wallet: wallet,
  walletAddress: wallet.address,
});

let contractCodeHash =
 process.env.CONTRACT_CODE_HASH;

let contractAddress = process.env.CONTRACT_ADDRESS;

let try_query = async () => {
    let my_query = await secretjs.query.compute.queryContract({
      contract_address: contractAddress,
      code_hash: contractCodeHash,
      query: { get_password: {
        password_key: "my_pasword"
      } },
    });
    console.log("password: ", my_query);
  };
  try_query();