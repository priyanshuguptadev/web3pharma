import { useState, useEffect } from "react";
import { ethers } from "ethers";
import SupplyChainABI from "./artifacts/contracts/SupplyChain.sol/SupplyChain.json";

interface Medicine {
  id: bigint;
  name: string;
  description: string;
  compositions: string;
  quantity: bigint;
}

interface MedicineData {
  [key: number]: Medicine;
}

interface StageData {
  [key: number]: string;
}

const stages = [
  "Medicine Order",
  "Raw Material Supplier",
  "Manufacturer",
  "Distributor",
  "Retailer",
  "Consumer",
];

const stageMapping: { [key: string]: number } = {
  "Medicine Ordered": 0,
  "Raw Material Supply Stage": 1,
  "Manufacturing Stage": 2,
  "Distribution Stage": 3,
  "Retail Stage": 4,
  Sold: 5,
};

function Supply() {
  const [currentaccount, setCurrentaccount] = useState<string>("");
  const [loader, setloader] = useState<boolean>(true);
  const [SupplyChain, setSupplyChain] = useState<ethers.Contract | undefined>();
  const [MED, setMED] = useState<MedicineData>({});
  const [MedStage, setMedStage] = useState<StageData>({});

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
      const med: MedicineData = {};
      const medStage: StageData = {};

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

  const handlerSubmitRMSsupply = async (
    event: React.MouseEvent<HTMLButtonElement>,
    ID: bigint
  ) => {
    event.preventDefault();
    try {
      if (!SupplyChain) return;
      console.log(ID, SupplyChain);
      const tx = await SupplyChain.RMSsupply(ID);
      console.log(tx);
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        loadBlockchaindata();
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred!!!");
    }
  };

  const handlerSubmitManufacturing = async (
    event: React.MouseEvent<HTMLButtonElement>,
    ID: bigint
  ) => {
    event.preventDefault();
    try {
      if (!SupplyChain) return;
      const tx = await SupplyChain.Manufacturing(ID);
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        loadBlockchaindata();
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred!!!");
    }
  };

  const handlerSubmitDistribute = async (
    event: React.MouseEvent<HTMLButtonElement>,
    ID: bigint
  ) => {
    event.preventDefault();
    try {
      if (!SupplyChain) return;
      const tx = await SupplyChain.Distribute(ID);
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        loadBlockchaindata();
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred!!!");
    }
  };

  const handlerSubmitRetail = async (
    event: React.MouseEvent<HTMLButtonElement>,
    ID: bigint
  ) => {
    event.preventDefault();
    try {
      if (!SupplyChain) return;
      const tx = await SupplyChain.Retail(ID);
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        loadBlockchaindata();
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred!!!");
    }
  };

  const handlerSubmitSold = async (
    event: React.MouseEvent<HTMLButtonElement>,
    ID: bigint
  ) => {
    event.preventDefault();
    try {
      if (!SupplyChain) return;
      const tx = await SupplyChain.sold(ID);
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        loadBlockchaindata();
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred!!!");
    }
  };

  const getStageColor = (stage: string): string => {
    const colorMap: { [key: string]: string } = {
      "Medicine Ordered": "bg-blue-100 text-blue-800",
      "Raw Material Supply Stage": "bg-purple-100 text-purple-800",
      "Manufacturing Stage": "bg-yellow-100 text-yellow-800",
      "Distribution Stage": "bg-orange-100 text-orange-800",
      "Retail Stage": "bg-pink-100 text-pink-800",
      Sold: "bg-green-100 text-green-800",
    };
    return colorMap[stage] || "bg-gray-100 text-gray-800";
  };

  const getCurrentStageIndex = (stage: string): number => {
    return stageMapping[stage] || 0;
  };

  if (loader) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-indigo-600 font-medium">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-indigo-700 mb-4 text-center">
            Supply Chain Management
          </h1>
          <p className="text-center text-gray-600 text-lg">
            Track and manage medicine through every stage of the supply chain
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Supply Chain Flow
          </h2>
          <div className="relative">
            <div className="flex justify-between mb-2">
              {stages.map((stage, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mb-2 ${
                      index <= 5 ? "bg-indigo-600" : "bg-gray-300"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-xs text-center text-gray-700 font-medium px-1">
                    {stage}
                  </span>
                </div>
              ))}
            </div>
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
              <div
                className="h-full bg-indigo-600 transition-all duration-500"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
            <div className="text-sm font-medium text-gray-600">Step 1</div>
            <div className="text-lg font-bold text-gray-800 mt-1">
              Supply Raw Materials
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Raw Material Supplier
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
            <div className="text-sm font-medium text-gray-600">Step 2</div>
            <div className="text-lg font-bold text-gray-800 mt-1">
              Manufacture
            </div>
            <div className="text-xs text-gray-500 mt-1">Manufacturer</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
            <div className="text-sm font-medium text-gray-600">Step 3</div>
            <div className="text-lg font-bold text-gray-800 mt-1">
              Distribute
            </div>
            <div className="text-xs text-gray-500 mt-1">Distributor</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
            <div className="text-sm font-medium text-gray-600">Step 4</div>
            <div className="text-lg font-bold text-gray-800 mt-1">Retail</div>
            <div className="text-xs text-gray-500 mt-1">Retailer</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
            <div className="text-sm font-medium text-gray-600">Step 5</div>
            <div className="text-lg font-bold text-gray-800 mt-1">
              Mark as Sold
            </div>
            <div className="text-xs text-gray-500 mt-1">Retailer</div>
          </div>
        </div>

        {/* Medicine Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Composition
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Current Stage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.keys(MED).length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No medicines found in the supply chain.
                    </td>
                  </tr>
                ) : (
                  Object.keys(MED).map((key) => {
                    const currentStage = MedStage[Number(key)];
                    const currentStageIndex =
                      getCurrentStageIndex(currentStage);

                    return (
                      <tr key={key} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {MED[Number(key)]?.id?.toString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {MED[Number(key)]?.name?.length > 40
                            ? MED[Number(key)]?.name?.substring(0, 40) + "..."
                            : MED[Number(key)]?.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                          {MED[Number(key)]?.description?.length > 40
                            ? MED[Number(key)]?.description?.substring(0, 40) +
                              "..."
                            : MED[Number(key)]?.description}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                          {MED[Number(key)]?.compositions?.length > 40
                            ? MED[Number(key)]?.compositions?.substring(0, 40) +
                              "..."
                            : MED[Number(key)]?.compositions}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {MED[Number(key)]?.quantity?.toString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex flex-col gap-2">
                            <span
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStageColor(
                                currentStage
                              )}`}
                            >
                              {currentStage}
                            </span>
                            {/* Mini progress bar */}
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
                                style={{
                                  width: `${(currentStageIndex / 5) * 100}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {currentStage === "Medicine Ordered" && (
                            <button
                              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                              onClick={(event) =>
                                handlerSubmitRMSsupply(
                                  event,
                                  MED[Number(key)].id
                                )
                              }
                            >
                              Supply
                            </button>
                          )}
                          {currentStage === "Raw Material Supply Stage" && (
                            <button
                              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                              onClick={(event) =>
                                handlerSubmitManufacturing(
                                  event,
                                  MED[Number(key)].id
                                )
                              }
                            >
                              Manufacture
                            </button>
                          )}
                          {currentStage === "Manufacturing Stage" && (
                            <button
                              className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                              onClick={(event) =>
                                handlerSubmitDistribute(
                                  event,
                                  MED[Number(key)].id
                                )
                              }
                            >
                              Distribute
                            </button>
                          )}
                          {currentStage === "Distribution Stage" && (
                            <button
                              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                              onClick={(event) =>
                                handlerSubmitRetail(event, MED[Number(key)].id)
                              }
                            >
                              Retail
                            </button>
                          )}
                          {currentStage === "Retail Stage" && (
                            <button
                              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                              onClick={(event) =>
                                handlerSubmitSold(event, MED[Number(key)].id)
                              }
                            >
                              Mark as Sold
                            </button>
                          )}
                          {currentStage === "Sold" && (
                            <span className="text-green-600 font-semibold">
                              ✓ Completed
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Supply;
