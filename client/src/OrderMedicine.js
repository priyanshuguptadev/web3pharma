import React, { useState, useEffect } from "react";
import SupplyChainABI from "./artifacts/contracts/SupplyChain.sol/SupplyChain.json";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { ethers } from "ethers";

function OrderMedicine() {
  useEffect(() => {
    const initWeb3 = async () => {
      try {
        await loadWeb3();
        await loadBlockchaindata();
      } catch (err) {
        console.error("Error initializing web3:", err);
      }
    };

    initWeb3();
  }, []);

  const [currentaccount, setCurrentaccount] = useState("");
  const [loader, setloader] = useState(true);
  const [SupplyChain, setSupplyChain] = useState();
  const [MED, setMED] = useState();
  const [MedName, setMedName] = useState();
  const [MedDes, setMedDes] = useState();
  const [MedComs, setMedComs] = useState();
  const [MedQuant, setMedQuant] = useState();
  const [MedStage, setMedStage] = useState();
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
      }
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  const loadBlockchaindata = async () => {
    setloader(true);
    const provider = window.ethersProvider;
    const signer = await provider.getSigner();
    const account = await signer.getAddress();
    setCurrentaccount(account);
    console.log(currentaccount);

    const address = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    if (address) {
      const supplychain = new ethers.Contract(
        address,
        SupplyChainABI.abi,
        provider
      );
      setSupplyChain(supplychain);

      const medCtr = await supplychain.medicineCtr();
      const med = {};
      const medStage = [];

      for (let i = 0; i < medCtr; i++) {
        med[i] = await supplychain.MedicineStock(i + 1);
        medStage[i] = await supplychain.showStage(i + 1);
      }

      setMED(med);
      setMedStage(medStage);
      setloader(false);
    } else {
      window.alert("The smart contract is not deployed to current network");
    }
  };

  if (loader) {
    return (
      <div className="spinner-button">
        <Button variant="primary" disabled>
          <Spinner
            as="span"
            animation="grow"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          Loading...
        </Button>
      </div>
    );
  }

  const handlerChangeNameMED = (event) => {
    setMedName(event.target.value);
  };
  const handlerChangeDesMED = (event) => {
    setMedDes(event.target.value);
  };
  const handlerChangeComs = (event) => {
    setMedComs(event.target.value);
  };
  const handlerChangeQuant = (event) => {
    setMedQuant(event.target.value);
  };
  const handlerSubmitMED = async (event) => {
    event.preventDefault();
    try {
      console.log(SupplyChain);
      console.log(MedName, MedDes, MedComs, MedQuant, currentaccount);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      console.log(signer);
      const contract = SupplyChain.connect(signer);
      console.log(contract);
      const tx = await contract["addMedicine"](
        MedName,
        MedDes,
        MedComs,
        MedQuant
      );
      console.log(tx);
      console.log("Transaction sent:", tx.hash);
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);

      if (receipt.status === 1) {
        loadBlockchaindata();
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred!!!");
    }
  };

  return (
    <div>
      <form onSubmit={handlerSubmitMED} className="m-20">
        <input
          className="form-control-sm m-r-15"
          type="text"
          onChange={handlerChangeNameMED}
          placeholder="Medicine Name"
          required
        />
        <input
          className="form-control-sm m-r-15"
          type="text"
          onChange={handlerChangeDesMED}
          placeholder="Medicine Description"
          required
        />
        <input
          className="form-control-sm m-r-15"
          type="text"
          onChange={handlerChangeComs}
          placeholder="Medicine Composition"
          required
        />
        <input
          className="form-control-sm m-r-15"
          type="text"
          onChange={handlerChangeQuant}
          placeholder="Medicine Quantity"
          required
        />
        <button
          className="btn btn-outline-success btn-sm"
          onSubmit={handlerSubmitMED}
        >
          Add Order
        </button>
      </form>
      <Table responsive="sm">
        <thead>
          <tr>
            <th style={{ width: "10%" }}>ID</th>
            <th style={{ width: "10%" }}>Name</th>
            <th style={{ width: "10%" }}>Description</th>
            <th style={{ width: "10%" }}>Composition</th>
            <th style={{ width: "10%" }}>Quantity</th>
            <th style={{ width: "10%" }}>Current Stage</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(MED).map(function ([key, value]) {
            return (
              <tr key={key}>
                <td style={{ width: "10%" }}>{MED[key]?.id}</td>
                <td style={{ width: "10%" }}>
                  {MED[key]?.name?.length > 40
                    ? MED[key]?.name?.substring(1, 40) + "..."
                    : MED[key]?.name}
                </td>
                <td style={{ width: "10%" }}>
                  {MED[key]?.description?.length > 40
                    ? MED[key]?.description?.substring(1, 40) + "..."
                    : MED[key]?.description}
                </td>
                <td style={{ width: "10%" }}>
                  {MED[key]?.compositions?.length > 40
                    ? MED[key]?.compositions?.substring(1, 40) + "..."
                    : MED[key]?.compositions}
                </td>
                <td style={{ width: "10%" }}>{MED[key]?.quantity}</td>
                <td style={{ width: "10%" }}>{MedStage[key]}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}

export default OrderMedicine;
