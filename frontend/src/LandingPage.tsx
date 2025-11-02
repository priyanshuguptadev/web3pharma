import { useState, useEffect } from "react";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
    ethersProvider?: any;
  }
}

function LandingPage() {
  const [currentaccount, setCurrentaccount] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        setLoading(true);
        setError("");
        await loadWeb3();
        await loadBlockchaindata();
      } catch (err: any) {
        console.error("Error initializing web3:", err);
        setError(err.message || "Failed to connect to wallet");
      } finally {
        setLoading(false);
      }
    };

    initWeb3();
  }, []);

  const loadWeb3 = async () => {
    console.log("loadWeb3");
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        console.log(provider);
        await provider.send("eth_requestAccounts", []);
        window.ethersProvider = provider;
      } catch (error) {
        console.error("User denied account access", error);
        throw new Error("User denied account access");
      }
    } else {
      throw new Error(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  const loadBlockchaindata = async () => {
    if (!window.ethersProvider) {
      throw new Error("Provider not initialized");
    }

    const provider = window.ethersProvider;
    console.log(provider);
    const signer = await provider.getSigner();
    const account = await signer.getAddress();
    console.log(account);
    setCurrentaccount(account);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Wallet Connection
              </h2>
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            </div>

            <div className="mt-6">
              <p className="text-gray-600 font-medium">
                Current Account Address:
              </p>
              <div className="mt-2 p-4 bg-white rounded-lg border border-gray-300 break-all">
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-t-2 border-indigo-600 rounded-full animate-spin mr-2"></div>
                    <span className="text-gray-500">
                      Connecting to wallet...
                    </span>
                  </div>
                ) : error ? (
                  <span className="text-red-500 font-medium">{error}</span>
                ) : currentaccount ? (
                  <span className="text-indigo-600 font-mono">
                    {currentaccount}
                  </span>
                ) : (
                  <span className="text-gray-400">No account connected</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
