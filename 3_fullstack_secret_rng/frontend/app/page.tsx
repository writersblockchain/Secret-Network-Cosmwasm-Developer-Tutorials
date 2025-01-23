"use client";

import { useState } from "react";
import { useWallet } from "../context/WalletContext";
import ConnectWallet from "../components/ConnectWallet";
import dotenv from "dotenv";
dotenv.config();

export default function Home() {
  const [flipResult, setFlipResult] = useState<"heads" | "tails" | null>(null);
  const { walletAddress, secretjs } = useWallet();


  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const contractCodeHash = process.env.NEXT_PUBLIC_CODE_HASH;
  console.log(contractAddress, contractCodeHash);

  const handleFlip = async () => {
    
    if (!secretjs || !walletAddress || !contractAddress) {
      alert("Please connect your wallet and ensure contract address is set!");
      return;
    }

    try {
      const flip_tx = await secretjs.tx.compute.executeContract(
        {
          sender: walletAddress,
          contract_address: contractAddress,
          msg: { flip: {} },
          code_hash: contractCodeHash,
        },
        { gasLimit: 100_000 }
      );

      console.log("Flip transaction:", flip_tx);
    } catch (error) {
      console.error("Failed to execute flip:", error);
    }
  };

  const queryFlip = async () => {
    if (!secretjs || !contractAddress) {
      alert("Please connect your wallet and ensure contract address is set!");
      return;
    }

    try {
      const flip_query = await secretjs.query.compute.queryContract({
        contract_address: contractAddress,
        code_hash: contractCodeHash,
        query: { get_flip: {} },
      });

      console.log("Flip query result:", flip_query);
    } catch (error) {
      console.error("Failed to query flip:", error);
    }
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
      {flipResult && (
        <p className="mt-4 text-lg">
          The result is: <strong>{flipResult}</strong>
        </p>
      )}
      <ConnectWallet />
      <button
        onClick={queryFlip}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Query Flip Result
      </button>
    </div>
  );
}
