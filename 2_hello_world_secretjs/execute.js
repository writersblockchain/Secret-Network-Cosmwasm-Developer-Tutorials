import { SecretNetworkClient, Wallet} from "secretjs";
import dotenv from "dotenv"
dotenv.config()

const wallet = new Wallet(process.env.MNEMONIC);

const secretjs = new SecretNetworkClient({
  chainId: "pulsar-3",
  url: "https://lcd.testnet.secretsaturn.net",
  wallet: wallet,
  walletAddress: wallet.address,
});

let contractCodeHash =
 process.env.CONTRACT_CODE_HASH;

let contractAddress = process.env.CONTRACT_ADDRESS;


let try_execute = async () => {
  const tx = await secretjs.tx.compute.executeContract(
    {
      sender: wallet.address,
      contract_address: contractAddress,
      msg: {
        store_password: {
            password_key: "my_password",
            password_value: "password123"
        },
      },
      code_hash: contractCodeHash,
    },
    { gasLimit: 100_000 }
  );

  console.log(tx);
};
try_execute();