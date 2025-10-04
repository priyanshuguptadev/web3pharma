import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import SupplyChainArtifact from "./artifacts/contracts/SupplyChain.sol/SupplyChain.json";
import deployments from "./artifacts/deployments.json";
import Card from "react-bootstrap/Card";
import CardGroup from "react-bootstrap/CardGroup";
import Table from "react-bootstrap/Table";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

function Register() {
  useEffect(() => {
    loadWeb3();
    loadBlockchaindata(false);
  }, []);

  const [currentaccount, setCurrentaccount] = useState("");
  const [loader, setloader] = useState(true);
  const [SupplyChain, setSupplyChain] = useState();
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [tableData, setTableData] = useState({});
  const [address, setAddress] = useState();
  const [name, setName] = useState();
  const [place, setPlace] = useState();
  const [addMethod, setAddMethod] = useState();
  const [subTitle, setSubTitle] = useState("");
  const [showMain, setShowMain] = useState(true);
  const [type, setType] = useState("");
  const [control, setControl] = useState("");

  const loadWeb3 = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } catch (error) {
        console.error("User denied account access");
      }
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  const loadBlockchaindata = async (have) => {
    setloader(true);

    if (!window.ethereum) {
      window.alert("Please install MetaMask");
      return;
    }

    const browserProvider = new ethers.BrowserProvider(window.ethereum);
    const userSigner = await browserProvider.getSigner();
    const account = await userSigner.getAddress();

    setCurrentaccount(account);
    setProvider(browserProvider);
    setSigner(userSigner);

    const network = await browserProvider.getNetwork();
    console.log(network, "network");
    const chainId = network.chainId.toString();
    console.log(chainId, "chainId");

    const address = deployments?.[chainId]?.SupplyChain;
    if (!address) {
      window.alert("The smart contract is not deployed to current network");
      setloader(false);
      return;
    }

    const supplychain = new ethers.Contract(
      address,
      SupplyChainArtifact.abi,
      userSigner
    );

    setSupplyChain(supplychain);

    if (have) {
      await cilickOnCard(control, type, addMethod, subTitle);
    }

    setloader(false);
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

  const cilickOnCard = async (ctrl, type, addMethod, title) => {
    setAddMethod(addMethod);
    setSubTitle(title);
    setShowMain(false);
    setType(type);
    setControl(ctrl);

    try {
      const controls = await SupplyChain[ctrl]();
      const controlsNumber = Number(controls);
      const records = {};

      for (let i = 0; i < controlsNumber; i++) {
        const record = await SupplyChain[type](i + 1);
        records[i] = {
          id: Number(record.id || record[0]),
          name: record.name || record[1],
          place: record.place || record[2],
          addr: record.addr || record[3],
        };
      }

      setTableData(records);
    } catch (error) {
      console.error("Error fetching data:", error);
      window.alert("Error loading data from blockchain");
    }
  };

  const handlerChangePlace = (event) => {
    setPlace(event.target.value);
  };

  const handlerChangeName = (event) => {
    setName(event.target.value);
  };

  const handlerChangeAddress = (event) => {
    setAddress(event.target.value);
  };

  const handlerSubmit = async (event) => {
    event.preventDefault();

    try {
      const tx = await SupplyChain[addMethod](address, name, place);
      await tx.wait();

      await loadBlockchaindata(true);
    } catch (err) {
      console.error("Transaction error:", err);
      alert("An error occurred!!!");
    }
  };

  return (
    <>
      {showMain ? (
        <CardGroup>
          <Card>
            <Card.Img
              variant="top"
              src="https://www.opscentre.com/wp-content/uploads/2017/11/bigstock-Supplyer-111025163.jpg"
            />
            <Card.Body>
              <Button
                onClick={() =>
                  cilickOnCard(
                    "rmsCtr",
                    "RMS",
                    "addRMS",
                    "Raw Material Suppliers"
                  )
                }
              >
                Add Raw Material Suppliers
              </Button>
            </Card.Body>
          </Card>
          <Card>
            <Card.Img
              variant="top"
              src="https://media.istockphoto.com/id/1184804468/photo/industrial-technology-concept-factory-automation-smart-factory-industry-4-0.jpg?s=612x612&w=0&k=20&c=1MaCUFJnqZmuugNhMyL5kt4q0BMwiNpzmnJbSggBE6I="
            />
            <Card.Body>
              <Button
                onClick={() =>
                  cilickOnCard(
                    "manCtr",
                    "MAN",
                    "addManufacturer",
                    "Manufacturers"
                  )
                }
              >
                Add Manufacturers
              </Button>
            </Card.Body>
          </Card>
          <Card>
            <Card.Img
              variant="top"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1osa1d35nNiqI7ry5kfRpP9d3GBmNXczgvchuEuD1UOGv8nz0Tr_J3PUQLRYxe9f6HYU&usqp=CAU"
            />
            <Card.Body>
              <Button
                onClick={() =>
                  cilickOnCard(
                    "disCtr",
                    "DIS",
                    "addDistributor",
                    "Distributors"
                  )
                }
              >
                Add Distributors
              </Button>
            </Card.Body>
          </Card>
          <Card>
            <Card.Img
              variant="top"
              src="https://topfranchise.com/upload/resize_cache/webp/upload/medialibrary/a63/a63b8282cd62a05600431d1c1992094d.webp"
            />
            <Card.Body>
              <Button
                onClick={() =>
                  cilickOnCard("retCtr", "RET", "addRetailer", "Retailers")
                }
              >
                Add Retailers
              </Button>
            </Card.Body>
          </Card>
        </CardGroup>
      ) : (
        <>
          <Breadcrumb>
            <Breadcrumb.Item onClick={() => setShowMain(true)}>
              List
            </Breadcrumb.Item>
            <Breadcrumb.Item active>{subTitle}</Breadcrumb.Item>
            <Breadcrumb.Item active>Add</Breadcrumb.Item>
          </Breadcrumb>
          <form onSubmit={handlerSubmit} className="m-20">
            <input
              className="form-control-sm m-r-15"
              type="text"
              onChange={handlerChangeAddress}
              placeholder="Ethereum Address"
              required
            />
            <input
              className="form-control-sm m-r-15"
              type="text"
              onChange={handlerChangeName}
              placeholder="Raw Material Supplier Name"
              required
            />
            <input
              className="form-control-sm m-r-15"
              type="text"
              onChange={handlerChangePlace}
              placeholder="Based In"
              required
            />
            <button className="btn btn-outline-success btn-sm" type="submit">
              Add
            </button>
          </form>
          <Table responsive="sm">
            <thead>
              <tr>
                <th>S. No</th>
                <th>Name</th>
                <th>Place</th>
                <th>Ethereum Address</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(tableData).map(function (key) {
                return (
                  <tr key={key}>
                    <td>{tableData[key]?.id}</td>
                    <td>{tableData[key]?.name}</td>
                    <td>{tableData[key]?.place}</td>
                    <td>{tableData[key]?.addr}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
}

export default Register;
