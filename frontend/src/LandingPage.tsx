import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Services from "./components/Services";
import Testimonials from "./components/Testimonials";
import EducationCTA from "./components/EducationCTA";
import Hero from "./components/Hero";

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
    <>
      <Hero currentAddress={currentaccount} />
      <Services />
      <Testimonials />
      <EducationCTA currentAddress={currentaccount} />
    </>
  );
}

export default LandingPage;
