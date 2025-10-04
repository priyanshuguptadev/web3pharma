import React, { useState, useEffect } from "react";
import SupplyChainABI from "./artifacts/contracts/SupplyChain.sol/SupplyChain.json";
import Table from "react-bootstrap/Table";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { ethers } from "ethers";

function Track() {
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
  const [showMain, setShowMain] = useState(true);
  const [selectedRed, setSelectedRec] = useState({});
  const [loader, setloader] = useState(true);
  const [SupplyChain, setSupplyChain] = useState();
  const [MED, setMED] = useState();
  const [MedStage, setMedStage] = useState();
  const [ID, setID] = useState();
  const [RMS, setRMS] = useState();
  const [MAN, setMAN] = useState();
  const [DIS, setDIS] = useState();
  const [RET, setRET] = useState();
  const loadWeb3 = async () => {
    console.log("loadWeb3");
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        console.log(provider);
        await provider.send("eth_requestAccounts", []);
        window.ethersProvider = provider;
        console.log(window.ethersProvider);
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
        med[i + 1] = await supplychain.MedicineStock(i + 1);
        medStage[i + 1] = await supplychain.showStage(i + 1);
      }
      setMED(med);
      setMedStage(medStage);

      const rmsCtr = await supplychain.rmsCtr();
      const rms = {};
      for (let i = 0; i < rmsCtr; i++) {
        rms[i + 1] = await supplychain.RMS(i + 1);
      }
      setRMS(rms);

      const manCtr = await supplychain.manCtr();
      const man = {};
      for (let i = 0; i < manCtr; i++) {
        man[i + 1] = await supplychain.MAN(i + 1);
      }
      setMAN(man);

      const disCtr = await supplychain.disCtr();
      const dis = {};
      for (let i = 0; i < disCtr; i++) {
        dis[i + 1] = await supplychain.DIS(i + 1);
      }
      setDIS(dis);

      const retCtr = await supplychain.retCtr();
      const ret = {};
      for (let i = 0; i < retCtr; i++) {
        ret[i + 1] = await supplychain.RET(i + 1);
      }
      setRET(ret);

      setloader(false);
    } else {
      window.alert("The smart contract is not deployed to current network");
    }
  };

  if (loader)
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

  const trackDetails = async (event, ID, obj) => {
    event.preventDefault();
    setID(ID);
    setSelectedRec(obj);
    setShowMain(false);
    var ctr = await SupplyChain.methods.medicineCtr().call();
    if (!(ID > 0 && ID <= ctr)) alert("Invalid Medicine ID!!!");
  };

  return (
    <>
      {showMain ? (
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
                    {" "}
                    <button
                      className="btn btn-outline-success btn-sm"
                      onClick={(event) =>
                        trackDetails(event, MED[key]?.id, MED[key])
                      }
                    >
                      Track Order
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : (
        <>
          {" "}
          <Breadcrumb>
            <Breadcrumb.Item onClick={() => setShowMain(true)}>
              List
            </Breadcrumb.Item>
            <Breadcrumb.Item active>{selectedRed?.name}</Breadcrumb.Item>
            <Breadcrumb.Item active>{selectedRed?.id}</Breadcrumb.Item>
            <Breadcrumb.Item active>Track Details</Breadcrumb.Item>
          </Breadcrumb>
          {ID && (
            <div className="container-xl">
              <h3>
                <b>
                  <u> Medicine: </u>
                </b>
              </h3>
              <span>
                <b> Medicine ID: </b>
                {MED[ID]?.id}
              </span>
              <br />
              <span>
                <b> Name: </b> {MED[ID]?.name}
              </span>
              <br />
              <span>
                <b> Description: </b>
                {MED[ID]?.description}
              </span>
              <br />
              <span>
                <b> Composition: </b>
                {MED[ID]?.compositions}
              </span>
              <br />
              <span>
                <b> Quantity: </b>
                {MED[ID]?.quantity}
              </span>
              <br />
              <span>
                <b> Current stage: </b>
                {MedStage[ID]}
              </span>
            </div>
          )}
          <div className="progressbar-wrapper m-20">
            <ul className="progressbar">
              <li className={selectedRed?.stage >= "0" ? "active" : ""}>
                Medicine Order
              </li>
              <li className={selectedRed?.stage >= "1" ? "active" : ""}>
                Raw Material Supplier
              </li>
              <li className={selectedRed?.stage >= "2" ? "active" : ""}>
                Manufacturer
              </li>
              <li className={selectedRed?.stage >= "3" ? "active" : ""}>
                Distributor
              </li>
              <li className={selectedRed?.stage >= "4" ? "active" : ""}>
                Retailer
              </li>
              <li className={selectedRed?.stage >= "5" ? "active" : ""}>
                Consumer
              </li>
            </ul>
          </div>
          <div className="page-content page-container" id="page-content">
            <div className="padding">
              <div className="row container d-flex justify-content-center">
                <div className="col-xl-12">
                  <div className="card proj-progress-card">
                    <div className="card-block">
                      <div className="row">
                        {MED[ID]?.stage >= "1" && (
                          <div className="col-xl-3 col-md-6">
                            <h6>
                              Raw Materials Supplied by{" "}
                              <strong>{RMS[MED[ID]?.RMSid].name}</strong> from{" "}
                              <strong>{RMS[MED[ID]?.RMSid].place}</strong>
                            </h6>
                            <h5 className="m-b-30 f-w-700">
                              Supplier ID
                              <span className="text-c-green m-l-10">
                                {RMS[MED[ID]?.RMSid].id}
                              </span>
                            </h5>
                            <div className="progress">
                              <div
                                className="progress-bar bg-c-red"
                                style={{ width: "100%" }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {MED[ID]?.stage >= "2" && (
                          <div className="col-xl-3 col-md-6">
                            <h6>
                              Manufactured by{" "}
                              <strong>{MAN[MED[ID]?.MANid].name}</strong> from{" "}
                              <strong>{MAN[MED[ID]?.MANid].place}</strong>
                            </h6>
                            <h5 className="m-b-30 f-w-700">
                              Manufacturer ID
                              <span className="text-c-red m-l-10">
                                {MAN[MED[ID]?.MANid].id}
                              </span>
                            </h5>
                            <div className="progress">
                              <div
                                className="progress-bar bg-c-blue"
                                style={{ width: "100%" }}
                              ></div>
                            </div>
                          </div>
                        )}
                        {MED[ID]?.stage >= "3" && (
                          <div className="col-xl-3 col-md-6">
                            <h6>
                              Distributed by{" "}
                              <strong>{DIS[MED[ID]?.DISid].name}</strong> from{" "}
                              <strong>{DIS[MED[ID]?.DISid].place}</strong>
                            </h6>
                            <h5 className="m-b-30 f-w-700">
                              Distributor ID
                              <span className="text-c-red m-l-10">
                                {DIS[MED[ID]?.DISid].id}
                              </span>
                            </h5>
                            <div className="progress">
                              <div
                                className="progress-bar bg-c-blue"
                                style={{ width: "100%" }}
                              ></div>
                            </div>
                          </div>
                        )}
                        {MED[ID]?.stage >= "4" && (
                          <div className="col-xl-3 col-md-6">
                            <h6>
                              Retailed by{" "}
                              <strong>{RET[MED[ID]?.RETid].name}</strong> from{" "}
                              <strong>{RET[MED[ID]?.RETid].place}</strong>
                            </h6>
                            <h5 className="m-b-30 f-w-700">
                              Retailer ID
                              <span className="text-c-red m-l-10">
                                {RET[MED[ID]?.RETid].id}
                              </span>
                            </h5>
                            <div className="progress">
                              <div
                                className="progress-bar bg-c-blue"
                                style={{ width: "100%" }}
                              ></div>
                            </div>
                          </div>
                        )}
                        {MED[ID]?.stage >= "5" && (
                          <div className="col-xl-3 col-md-6">
                            <h6>
                              Sold by{" "}
                              <strong>{RET[MED[ID]?.RETid].name}</strong> from{" "}
                              <strong>{RET[MED[ID]?.RETid].place}</strong>
                            </h6>
                            <h5 className="m-b-30 f-w-700">
                              Retailer ID
                              <span className="text-c-red m-l-10">
                                {RET[MED[ID]?.RETid].id}
                              </span>
                            </h5>
                            <div className="progress">
                              <div
                                className="progress-bar bg-c-blue"
                                style={{ width: "100%" }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Track;
