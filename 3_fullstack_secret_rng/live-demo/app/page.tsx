"use client"

import { SecretNetworkClient } from "secretjs";;
import { useState } from "react";

// Extend the Window interface to include keplr
declare global {
  interface Window {
    keplr: any;
    getEnigmaUtils: any;
    getOfflineSigner: any;
  }
}

export default function Home() {
  const [secretjs, setSecretjs] = useState<SecretNetworkClient | null>(null);
  const [walletAddress, setWalletAddress] = useState(null);

  let contractAddress = "secret19q7dduwwdkn46nt9exhqw07yvsa38esj4ztj27"
  let contractCodeHash= "28f9661b0b73b39ac827b4236678e52b3c4385872d42130f641600503f585541"


  let connect_to_keplr = async () => {

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

while (
  !window.keplr ||
  !window.getEnigmaUtils ||
  !window.getOfflineSigner
) {
  await sleep(50);
}

const CHAIN_ID = "pulsar-3";

await window.keplr.enable(CHAIN_ID);

const keplrOfflineSigner = window.keplr.getOfflineSigner(CHAIN_ID);
const [{ address: myAddress }] = await keplrOfflineSigner.getAccounts();

const url = "https://pulsar.lcd.secretnodes.com";

const secretjs = new SecretNetworkClient({
  url,
  chainId: CHAIN_ID,
  wallet: keplrOfflineSigner,
  walletAddress: myAddress,
  encryptionUtils: window.keplr.getEnigmaUtils(CHAIN_ID),
});

setSecretjs(secretjs);
setWalletAddress(myAddress);
console.log(secretjs)
console.log(myAddress)

  }

  let try_flip = async () => {
    if (!secretjs) {
      console.error("SecretJS client is not initialized");
      return;
    }

    const flip_tx = await secretjs.tx.compute.executeContract(
      {
        sender: walletAddress as unknown as string, 
        contract_address: contractAddress,
        msg: {
          flip: {},
        },
        code_hash: contractCodeHash,
      },
      { gasLimit: 100_000 }
    );
  
    console.log(flip_tx);
  };


let query_flip = async () => {
  if (!secretjs) {
    console.error("SecretJS client is not initialized");
    return;
  }
  let flip_tx = await secretjs.query.compute.queryContract({
    contract_address: contractAddress,
    code_hash: contractCodeHash,
    query: {
      get_flip: {},
    },
  });
  console.log(flip_tx);
};



  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    <h1>I LOVE SECRET</h1>
    <button onClick={connect_to_keplr}>Connect to Keplr</button>
    <button onClick={try_flip}>Flip</button>
    <button onClick={query_flip}>Query Flip</button>
    </div>
  );
}
