"use client";

import { useState } from "react";


import { SecretNetworkClient } from "secretjs";
import dotenv from "dotenv";
dotenv.config();

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
  const [isSpinning, setIsSpinning] = useState(false); // State to control spinning

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const contractCodeHash = process.env.NEXT_PUBLIC_CONTRACT_CODE_HASH
  console.log(contractAddress, contractCodeHash);

  const connectWallet = async () => {
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

const url = "https://lcd.testnet.secretsaturn.net";

const secretjs = new SecretNetworkClient({
  url,
  chainId: CHAIN_ID,
  wallet: keplrOfflineSigner,
  walletAddress: myAddress,
  encryptionUtils: window.keplr.getEnigmaUtils(CHAIN_ID),
});

setSecretjs(secretjs);
setWalletAddress(myAddress);

  }

  // State to track the result of the coin flip: "heads", "tails", or null initially
  const [flipResult, setFlipResult] = useState<"heads" | "tails" | null>(null);
  
  // Function to handle the coin flip
  const handleFlip = () => {
    // If Math.random() <= 0.5 is true, it evaluates to "heads".
    const result = Math.random() <= 0.5 ? "heads" : "tails";

    setFlipResult(result); // Update the state with the flip result
  
    // Get the coin element by its ID
    const coin = document.getElementById("coin");
    
    if (coin) {
      // Remove any existing "heads" or "tails" class from the coin element
      coin.classList.remove("heads", "tails");
  
      // Add the new result class ("heads" or "tails") after a short delay
      setTimeout(() => {
        coin.classList.add(result);
      }, 100);
    }
  };

  let try_execute = async () => {

        // Start spinning the coin
        setIsSpinning(true);

    if (!secretjs) {
      console.error("SecretJS client is not initialized");
      return;
    }
    const tx = await secretjs.tx.compute.executeContract(
      {
        sender: walletAddress as unknown as string,
        contract_address: contractAddress as unknown as string,
        msg: {
          flip: {},
        },
        code_hash: contractCodeHash,
      },
      { gasLimit: 100_000 }
    );
  
    console.log(tx);

  };

  let try_query = async () => {

    if (!secretjs) {
      console.error("SecretJS client is not initialized");
      return;
    }
    let query = await secretjs.query.compute.queryContract({
      contract_address: contractAddress as unknown as string,
      code_hash: contractCodeHash,
      query: {
        get_flip: {},
      },
    }) as { flip: string };
    console.log(query.flip);
    
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div
        id="coin"
        className="relative w-24 h-24 cursor-pointer transform transition-transform duration-1000"
        onClick={handleFlip}
      >
        <div className="side-a absolute w-full h-full rounded-full bg-blue-500"></div>
        <div className="side-b absolute w-full h-full rounded-full bg-red-600 transform rotate-y-180"></div>
      </div>
      <h1 className="mt-6 text-center text-lg font-semibold">
        Click on the coin to flip
      </h1>
      <button onClick={connectWallet} className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md"> Connect Wallet </button>
      <button onClick={try_execute} className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md"> Execute Randomness </button>
      <button onClick={try_query} className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md"> Query Randomness </button>
    </div>
  );
}
