import React, { useState } from "react";
import { Wallet } from "lucide-react";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WalletButtonProps {
  currentAddress?: string;
  fullWidth?: boolean;
  variant?: "primary" | "secondary";
}

const WalletButton: React.FC<WalletButtonProps> = ({
  currentAddress,
  fullWidth = false,
  variant = "primary",
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState("");

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        setAccount(address);
        setIsConnected(true);
      } else {
        alert(
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  if (currentAddress) {
    return (
      <button
        className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all text-sm
          bg-medical-50 text-medical-700 border border-medical-200 cursor-default
          ${fullWidth ? "w-full" : ""}`}
      >
        <div className="w-2 h-2 rounded-full bg-medical-500 animate-pulse" />
        {currentAddress.slice(0, 6)}...{currentAddress.slice(-4)}
      </button>
    );
  }

  const baseStyles =
    "flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all transform active:scale-95 text-sm";
  const primaryStyles =
    "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200 hover:shadow-xl";
  const secondaryStyles =
    "bg-white text-slate-900 border border-slate-200 hover:border-medical-500 hover:text-medical-600";

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className={`${baseStyles} ${
        variant === "primary" ? primaryStyles : secondaryStyles
      } ${fullWidth ? "w-full" : ""}`}
    >
      {isConnecting ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </>
      )}
    </button>
  );
};

export default WalletButton;
