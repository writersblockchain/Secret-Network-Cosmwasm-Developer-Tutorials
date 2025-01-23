"use client";

import { useState } from "react";

export default function Home() {
  const [flipResult, setFlipResult] = useState<"heads" | "tails" | null>(null);

  const handleFlip = () => {
    const result = Math.random() <= 0.5 ? "heads" : "tails";
    setFlipResult(result);

    const coin = document.getElementById("coin");
    if (coin) {
      coin.classList.remove("heads", "tails");
    }
    setTimeout(() => {
      if (coin) {
        coin.classList.add(result);
      }
    }, 100);
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
    </div>
  );
}
