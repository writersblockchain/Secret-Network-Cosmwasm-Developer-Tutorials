import { SecretNetworkClient, Wallet, coinsFromString } from "secretjs";
import * as fs from "fs";
// import dotenv from "dotenv";
// dotenv.config();

const wallet = new Wallet("desk pigeon hammer sleep only mistake stool december offer patrol once vacant");

const contract_wasm = fs.readFileSync(
  "../optimized-wasm/snip20_reference_impl.wasm.gz"
);

const secretjs = new SecretNetworkClient({
  chainId: "pulsar-3",
  url: "https://pulsar.lcd.secretnodes.com",
  wallet: wallet,
  walletAddress: wallet.address,
});

// Declare global variables
let codeId;
let contractCodeHash;
let contractAddress;

let upload_contract = async () => {
  console.log("Starting deployment…");

  let tx = await secretjs.tx.compute.storeCode(
    {
      sender: wallet.address,
      wasm_byte_code: contract_wasm,
      source: "",
      builder: "",
    },
    {
      gasLimit: 4_000_000,
    }
  );

  codeId = Number(
    tx.arrayLog.find((log) => log.type === "message" && log.key === "code_id")
      .value
  );
  console.log("codeId: ", codeId);

  contractCodeHash = (
    await secretjs.query.compute.codeHashByCodeId({ code_id: codeId })
  ).code_hash;
  console.log(`Contract hash: ${contractCodeHash}`);
};

let instantiate_contract = async () => {
  if (!codeId || !contractCodeHash) {
    throw new Error("codeId or contractCodeHash is not set.");
  }
  console.log("Instantiating contract…");

  let init = {
    name: "TUTORIAL",
    symbol: "TUT",
    decimals: 6,
    prng_seed: Buffer.from("Something really random").toString("base64"),
    admin: wallet.address,
    initial_balances: [
      {
        address: wallet.address,
        amount: "1000000000",
      },
    ],
  };

  let config = {
    /// Indicates whether deposit functionality should be enabled
    /// default: False
    enable_deposit: true,
    /// Indicates whether redeem functionality should be enabled
    /// default: False
    enable_redeem: true,
    /// Indicates whether mint functionality should be enabled
    /// default: False
    enable_mint: true,
    /// Indicates whether burn functionality should be enabled
    /// default: False
    enable_burn: true,
    /// Indicated whether an admin can modify supported denoms
    /// default: False
    can_modify_denoms: true,
  };
  let tx = await secretjs.tx.compute.instantiateContract(
    {
      code_id: codeId,
      sender: wallet.address,
      code_hash: contractCodeHash,
      init_msg: init,
      label: "Tutorial Meme Coin " + Math.ceil(Math.random() * 10000),
      config: config,
      admin: wallet.address,
    },
    {
      gasLimit: 400_000,
    }
  );

  //Find the contract_address in the logs
  const contractAddress = tx.arrayLog.find(
    (log) => log.type === "message" && log.key === "contract_address"
  ).value;

  console.log("contract address: ", contractAddress);
};

// Chain the execution using promises
upload_contract()
  .then(() => {
    instantiate_contract();
  })
  .catch((error) => {
    console.error("Error:", error);
  });