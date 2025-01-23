import React from "react";
import { useWallet } from "../context/WalletContext";

export default function ConnectWallet() {
  const { walletAddress, connectWallet } = useWallet();

  return (
    <div>
      <button
        onClick={connectWallet}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {walletAddress ? "Wallet Connected" : "Connect Wallet"}
      </button>
    </div>
  );
}
