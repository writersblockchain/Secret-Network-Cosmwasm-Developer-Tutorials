"use client"

import React, { createContext, useContext, useState } from "react";

// Extend the Window interface to include Keplr properties
declare global {
  interface Window {
    keplr: any;
    getEnigmaUtils: any;
    getOfflineSigner: any;
  }
}
import { SecretNetworkClient } from "secretjs";

export interface WalletContextProps {
  walletAddress: string | null;
  secretjs: SecretNetworkClient | null;
  connectWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [secretjs, setSecretjs] = useState<SecretNetworkClient | null>(null);

  const connectWallet = async () => {
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    // Wait for Keplr to be injected
    while (!window.keplr || !window.getEnigmaUtils || !window.getOfflineSigner) {
      await sleep(50);
    }

    const CHAIN_ID = "pulsar-3";

    try {
      // Enable Keplr for the specified chain
      await window.keplr.enable(CHAIN_ID);

      // Get the Keplr offline signer and accounts
      const keplrOfflineSigner = window.keplr.getOfflineSigner(CHAIN_ID);
      const [{ address: myAddress }] = await keplrOfflineSigner.getAccounts();

      // Initialize the SecretNetworkClient
      const url = "https://api.pulsar3.scrttestnet.com";
      const secretNetworkClient = new SecretNetworkClient({
        url,
        chainId: CHAIN_ID,
        wallet: keplrOfflineSigner,
        walletAddress: myAddress,
        encryptionUtils: window.keplr.getEnigmaUtils(CHAIN_ID),
      });

      setWalletAddress(myAddress);
      setSecretjs(secretNetworkClient);

      console.log("Connected to wallet:", myAddress);
      console.log("SecretNetworkClient initialized:", secretNetworkClient);
    } catch (error) {
      console.error("Failed to connect to wallet:", error);
    }
  };

  return (
    <WalletContext.Provider value={{ walletAddress, secretjs, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
