import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import SupplyChainABI from "./artifacts/contracts/SupplyChain.sol/SupplyChain.json";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
function Supply() {
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
    console.log(account);

    const address = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    if (address) {
      const supplychain = new ethers.Contract(
        address,
        SupplyChainABI.abi,
        signer
      );
      console.log(supplychain);
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

  const handlerSubmitRMSsupply = async (event, ID) => {
    event.preventDefault();
    try {
      console.log(ID, SupplyChain);
      const tx = await SupplyChain.RMSsupply(ID);
      console.log(tx);
      const receipt = await tx.wait();
      if (receipt) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };

  const handlerSubmitManufacturing = async (event, ID) => {
    event.preventDefault();
    try {
      const tx = await SupplyChain.Manufacturing(ID);
      const receipt = await tx.wait();
      if (receipt) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };

  const handlerSubmitDistribute = async (event, ID) => {
    event.preventDefault();
    try {
      const tx = await SupplyChain.Distribute(ID);
      const receipt = await tx.wait();
      if (receipt) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };

  const handlerSubmitRetail = async (event, ID) => {
    event.preventDefault();
    try {
      const tx = await SupplyChain.Retail(ID);
      const receipt = await tx.wait();
      if (receipt) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };

  const handlerSubmitSold = async (event, ID) => {
    event.preventDefault();
    try {
      const tx = await SupplyChain.sold(ID);
      const receipt = await tx.wait();
      if (receipt) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };

  return (
    <>
      {/* <div className="m-20">
                <h6><b>Supply Chain Flow:</b>
                    <p>Medicine Order -&gt; Raw Material Supplier -&gt; Manufacturer -&gt; Distributor -&gt; Retailer -&gt; Consumer</p>
                </h6>
                <h5><b>Step 1: Supply Raw Materials</b>(Only a registered Raw Material Supplier can perform this step)</h5>
                <h5><b>Step 2: Manufacture</b>(Only a registered Manufacturer can perform this step)</h5>
                <h5><b>Step 3: Distribute</b>(Only a registered Distributor can perform this step)</h5>
                <h5><b>Step 4: Retail</b>(Only a registered Retailer can perform this step)</h5>
                <h5><b>Step 5: Mark as sold</b>(Only a registered Retailer can perform this step)</h5>
            </div> */}
      <div class="progressbar-wrapper m-20">
        <ul class="progressbar">
          <li class="active">Medicine Order</li>
          <li class="active">Raw Material Supplier</li>
          <li class="active">Manufacturer</li>
          <li class="active">Distributor</li>
          <li class="active">Retailer</li>
          <li class="active">Consumer</li>
        </ul>
      </div>
      <Table responsive="sm">
        <thead>
          <tr>
            <th>Medicine ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Composition</th>
            <th>Quantity</th>
            <th>Current Processing Stage</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(MED).map(function (key) {
            return (
              <tr key={key}>
                <td>{MED[key].id}</td>
                <td>
                  {MED[key]?.name?.length > 40
                    ? MED[key]?.name?.substring(1, 40) + "..."
                    : MED[key]?.name}
                </td>
                <td>
                  {MED[key]?.description?.length > 40
                    ? MED[key]?.description?.substring(1, 40) + "..."
                    : MED[key]?.description}
                </td>
                <td>
                  {MED[key]?.compositions?.length > 40
                    ? MED[key]?.compositions?.substring(1, 40) + "..."
                    : MED[key]?.compositions}
                </td>
                <td>{MED[key].quantity}</td>
                <td>{MedStage[key]}</td>
                <td>
                  {MedStage[key] === "Medicine Ordered" && (
                    <button
                      className="btn btn-outline-success btn-sm"
                      onClick={(event) =>
                        handlerSubmitRMSsupply(event, MED[key].id)
                      }
                    >
                      Supply
                    </button>
                  )}
                  {MedStage[key] === "Raw Material Supply Stage" && (
                    <button
                      className="btn btn-outline-success btn-sm"
                      onClick={(event) =>
                        handlerSubmitManufacturing(event, MED[key].id)
                      }
                    >
                      Manufacture
                    </button>
                  )}
                  {MedStage[key] === "Manufacturing Stage" && (
                    <button
                      className="btn btn-outline-success btn-sm"
                      onClick={(event) =>
                        handlerSubmitDistribute(event, MED[key].id)
                      }
                    >
                      Distribute
                    </button>
                  )}
                  {MedStage[key] === "Distribution Stage" && (
                    <button
                      className="btn btn-outline-success btn-sm"
                      onClick={(event) =>
                        handlerSubmitRetail(event, MED[key].id)
                      }
                    >
                      Retail
                    </button>
                  )}
                  {MedStage[key] === "Retail Stage" && (
                    <button
                      className="btn btn-outline-success btn-sm"
                      onClick={(event) => handlerSubmitSold(event, MED[key].id)}
                    >
                      Sell
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
}

export default Supply;
