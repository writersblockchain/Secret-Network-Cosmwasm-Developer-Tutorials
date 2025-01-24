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
  const [isSpinning, setIsSpinning] = useState(false);

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const contractCodeHash = process.env.NEXT_PUBLIC_CONTRACT_CODE_HASH;

  const connectWallet = async () => {
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    while (!window.keplr || !window.getEnigmaUtils || !window.getOfflineSigner) {
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
  };

  const handleFlipCoin = async () => {
    if (!secretjs) {
      console.error("SecretJS client is not initialized");
      return;
    }

    try {
      const coin = document.getElementById("coin");

      if (coin) {
        coin.classList.remove("blue", "red");
        coin.classList.add("spinning"); // Add spinning class to indicate ongoing flip
      }

      // Start spinning the coin
      setIsSpinning(true);

      // Execute the contract to flip the coin
      await secretjs.tx.compute.executeContract(
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

      // Query the result of the coin flip
      const query = (await secretjs.query.compute.queryContract({
        contract_address: contractAddress as unknown as string,
        code_hash: contractCodeHash,
        query: {
          get_flip: {},
        },
      })) as { flip: number };

      const result = query.flip === 1 ? "blue" : "red"; // Blue for 1, Red for 0
      console.log("Coin flip result:", query.flip);

      if (coin) {
        setTimeout(() => {
          coin.classList.remove("spinning");
          coin.classList.add(result);
          setIsSpinning(false); // Stop spinning after the flip is complete
        }, 100);
      }
    } catch (error) {
      console.error("Error flipping the coin:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div
        id="coin"
        className="relative w-24 h-24 cursor-pointer transform transition-transform duration-1000"
      >
        <div className="side-a absolute w-full h-full rounded-full bg-blue-500"></div>
        <div className="side-b absolute w-full h-full rounded-full bg-red-600 transform rotate-y-180"></div>
      </div>
      <h1 className="mt-6 text-center text-lg font-semibold">
        Flip the coin to see your result!
      </h1>
      <button
        onClick={connectWallet}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Connect Wallet
      </button>
      <button
        onClick={handleFlipCoin}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md"
        disabled={isSpinning}
      >
        Flip Coin
      </button>
    </div>
  );
}