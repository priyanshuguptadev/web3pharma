import { useState, useEffect } from "react";
import { ethers } from "ethers";
import SupplyChainABI from "./artifacts/contracts/SupplyChain.sol/SupplyChain.json";
import { FaIndustry, FaTruck, FaWarehouse, FaStore } from "react-icons/fa";
import type { JSX } from "react";

interface TableRecord {
  id: number;
  name: string;
  place: string;
  addr: string;
}

interface TableData {
  [key: number]: TableRecord;
}

interface CardData {
  title: string;
  control: string;
  type: string;
  addMethod: string;
  icon: JSX.Element;
  buttonText: string;
}

function Register() {
  const [currentaccount, setCurrentaccount] = useState<string>("");
  const [loader, setloader] = useState<boolean>(true);
  const [SupplyChain, setSupplyChain] = useState<ethers.Contract | undefined>();
  const [tableData, setTableData] = useState<TableData>({});
  const [address, setAddress] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [place, setPlace] = useState<string>("");
  const [addMethod, setAddMethod] = useState<string>("");
  const [subTitle, setSubTitle] = useState<string>("");
  const [showMain, setShowMain] = useState<boolean>(true);
  const [type, setType] = useState<string>("");
  const [control, setControl] = useState<string>("");

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        await loadWeb3();
        await loadBlockchaindata(false);
      } catch (err) {
        console.error("Error initializing web3:", err);
      }
    };

    initWeb3();
  }, []);

  const loadWeb3 = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } catch (error) {
        console.error("User denied account access", error);
      }
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  const loadBlockchaindata = async (have: boolean) => {
    setloader(true);

    if (!window.ethereum) {
      window.alert("Please install MetaMask");
      return;
    }

    const browserProvider = new ethers.BrowserProvider(window.ethereum);
    const userSigner = await browserProvider.getSigner();
    const account = await userSigner.getAddress();

    setCurrentaccount(account);

    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    if (!contractAddress) {
      window.alert("The smart contract is not deployed to current network");
      setloader(false);
      return;
    }

    const supplychain = new ethers.Contract(
      contractAddress,
      SupplyChainABI.abi,
      userSigner
    );

    setSupplyChain(supplychain);

    if (have) {
      await clickOnCard(control, type, addMethod, subTitle);
    }

    setloader(false);
  };

  const clickOnCard = async (
    ctrl: string,
    type: string,
    addMethod: string,
    title: string
  ) => {
    setAddMethod(addMethod);
    setSubTitle(title);
    setShowMain(false);
    setType(type);
    setControl(ctrl);

    try {
      if (!SupplyChain) return;

      const controls = await SupplyChain[ctrl]();
      const controlsNumber = Number(controls);
      const records: TableData = {};

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

  const handlerChangePlace = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlace(event.target.value);
  };

  const handlerChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handlerChangeAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const handlerSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (!SupplyChain) return;

      const tx = await SupplyChain[addMethod](address, name, place);
      await tx.wait();

      await loadBlockchaindata(true);

      setAddress("");
      setName("");
      setPlace("");
    } catch (err) {
      console.error("Transaction error:", err);
      alert("An error occurred!!!");
    }
  };

  const cards: CardData[] = [
    {
      title: "Raw Material Suppliers",
      control: "rmsCtr",
      type: "RMS",
      addMethod: "addRMS",
      icon: <FaIndustry />,
      buttonText: "Add Raw Material Suppliers",
    },
    {
      title: "Manufacturers",
      control: "manCtr",
      type: "MAN",
      addMethod: "addManufacturer",
      icon: <FaWarehouse />,
      buttonText: "Add Manufacturers",
    },
    {
      title: "Distributors",
      control: "disCtr",
      type: "DIS",
      addMethod: "addDistributor",
      icon: <FaTruck />,
      buttonText: "Add Distributors",
    },
    {
      title: "Retailers",
      control: "retCtr",
      type: "RET",
      addMethod: "addRetailer",
      icon: <FaStore />,
      buttonText: "Add Retailers",
    },
  ];

  if (loader) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-indigo-600 font-medium">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {showMain ? (
          <>
            <h1 className="text-4xl font-bold text-indigo-700 mb-8 text-center">
              Supply Chain Registration
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cards.map((card, index) => (
                <div
                  onClick={() =>
                    clickOnCard(
                      card.control,
                      card.type,
                      card.addMethod,
                      card.title
                    )
                  }
                  key={index}
                  className="bg-white rounded-lg shadow-sm overflow-hidden transform transition-all duration-300 hover:cursor-pointer"
                >
                  <div className="h-48 overflow-hidden">
                    <div className="flex flex-col items-center justify-center h-48 bg-white">
                      <span className="text-6xl text-indigo-600">
                        {card.icon}
                      </span>
                      <h3 className="text-md text-black mb-4">{card.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <nav className="flex mb-6" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <button
                    onClick={() => setShowMain(true)}
                    className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                    </svg>
                    List
                  </button>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                      {subTitle}
                    </span>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="ml-1 text-sm font-medium text-indigo-600 md:ml-2">
                      Add
                    </span>
                  </div>
                </li>
              </ol>
            </nav>

            {/* Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-3xl font-bold text-indigo-700 mb-6">
                Add {subTitle}
              </h2>
              <form onSubmit={handlerSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ethereum Address
                    </label>
                    <input
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      type="text"
                      value={address}
                      onChange={handlerChangeAddress}
                      placeholder="0x..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      type="text"
                      value={name}
                      onChange={handlerChangeName}
                      placeholder="Enter name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      type="text"
                      value={place}
                      onChange={handlerChangePlace}
                      placeholder="Based in"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                    type="submit"
                  >
                    Add {subTitle}
                  </button>
                </div>
              </form>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-indigo-600">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        S. No
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Location
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Ethereum Address
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.keys(tableData).length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-8 text-center text-gray-500"
                        >
                          No records found. Add a new {subTitle.toLowerCase()}{" "}
                          to get started.
                        </td>
                      </tr>
                    ) : (
                      Object.keys(tableData).map((key) => (
                        <tr key={key} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {tableData[Number(key)]?.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {tableData[Number(key)]?.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {tableData[Number(key)]?.place}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700 font-mono">
                            {tableData[Number(key)]?.addr}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Register;
