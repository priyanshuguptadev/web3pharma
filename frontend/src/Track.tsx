import { useState, useEffect } from "react";
import { ethers } from "ethers";
import SupplyChainABI from "./artifacts/contracts/SupplyChain.sol/SupplyChain.json";

interface Medicine {
  id: bigint;
  name: string;
  description: string;
  compositions: string;
  quantity: bigint;
  stage: number;
  RMSid: bigint;
  MANid: bigint;
  DISid: bigint;
  RETid: bigint;
}

interface MedicineData {
  [key: number]: Medicine;
}

interface StageData {
  [key: number]: string;
}

interface Participant {
  id: bigint;
  name: string;
  place: string;
  addr: string;
}

interface ParticipantData {
  [key: number]: Participant;
}

const stageColors = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-yellow-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-green-500",
];

const stageIcons = ["📦", "🏭", "⚙️", "🚚", "🏪", "✅"];

function Track() {
  const [showMain, setShowMain] = useState<boolean>(true);
  const [selectedRec, setSelectedRec] = useState<Medicine | null>(null);
  const [loader, setloader] = useState<boolean>(true);
  const [SupplyChain, setSupplyChain] = useState<ethers.Contract | undefined>();
  const [MED, setMED] = useState<MedicineData>({});
  const [MedStage, setMedStage] = useState<StageData>({});
  const [ID, setID] = useState<number | null>(null);
  const [RMS, setRMS] = useState<ParticipantData>({});
  const [MAN, setMAN] = useState<ParticipantData>({});
  const [DIS, setDIS] = useState<ParticipantData>({});
  const [RET, setRET] = useState<ParticipantData>({});

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
      const med: MedicineData = {};
      const medStage: StageData = {};
      for (let i = 0; i < medCtr; i++) {
        med[i + 1] = await supplychain.MedicineStock(i + 1);
        medStage[i + 1] = await supplychain.showStage(i + 1);
      }
      setMED(med);
      setMedStage(medStage);

      const rmsCtr = await supplychain.rmsCtr();
      const rms: ParticipantData = {};
      for (let i = 0; i < rmsCtr; i++) {
        rms[i + 1] = await supplychain.RMS(i + 1);
      }
      setRMS(rms);

      const manCtr = await supplychain.manCtr();
      const man: ParticipantData = {};
      for (let i = 0; i < manCtr; i++) {
        man[i + 1] = await supplychain.MAN(i + 1);
      }
      setMAN(man);

      const disCtr = await supplychain.disCtr();
      const dis: ParticipantData = {};
      for (let i = 0; i < disCtr; i++) {
        dis[i + 1] = await supplychain.DIS(i + 1);
      }
      setDIS(dis);

      const retCtr = await supplychain.retCtr();
      const ret: ParticipantData = {};
      for (let i = 0; i < retCtr; i++) {
        ret[i + 1] = await supplychain.RET(i + 1);
      }
      setRET(ret);

      setloader(false);
    } else {
      window.alert("The smart contract is not deployed to current network");
    }
  };

  const trackDetails = async (
    event: React.MouseEvent<HTMLButtonElement>,
    ID: number,
    obj: Medicine
  ) => {
    event.preventDefault();
    console.log("Tracking details for ID:", ID, obj);
    setID(ID);
    setSelectedRec(obj);
    setShowMain(false);
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
        {showMain ? (
          <>
            <h1 className="text-4xl font-bold text-indigo-700 mb-8 text-center">
              Track Medicine Orders
            </h1>
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
                          No medicines found to track.
                        </td>
                      </tr>
                    ) : (
                      Object.keys(MED).map((key) => (
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
                              ? MED[Number(key)]?.description?.substring(
                                  0,
                                  40
                                ) + "..."
                              : MED[Number(key)]?.description}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                            {MED[Number(key)]?.compositions?.length > 40
                              ? MED[Number(key)]?.compositions?.substring(
                                  0,
                                  40
                                ) + "..."
                              : MED[Number(key)]?.compositions}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {MED[Number(key)]?.quantity?.toString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                              {MedStage[Number(key)]}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                              onClick={(event) =>
                                trackDetails(
                                  event,
                                  Number(MED[Number(key)]?.id),
                                  MED[Number(key)]
                                )
                              }
                            >
                              Track Order
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Breadcrumb */}
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
                      {selectedRec?.name}
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
                      Track Details
                    </span>
                  </div>
                </li>
              </ol>
            </nav>

            {/* Medicine Details Card */}
            {ID && MED[ID] && (
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <h2 className="text-3xl font-bold text-indigo-700 mb-6 flex items-center">
                  <span className="text-4xl mr-3">💊</span>
                  Medicine Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <span className="font-semibold text-gray-700 w-40">
                        Medicine ID:
                      </span>
                      <span className="text-gray-900 bg-indigo-50 px-3 py-1 rounded-lg">
                        {MED[ID]?.id?.toString()}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-semibold text-gray-700 w-40">
                        Name:
                      </span>
                      <span className="text-gray-900">{MED[ID]?.name}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-semibold text-gray-700 w-40">
                        Description:
                      </span>
                      <span className="text-gray-900">
                        {MED[ID]?.description}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <span className="font-semibold text-gray-700 w-40">
                        Composition:
                      </span>
                      <span className="text-gray-900">
                        {MED[ID]?.compositions}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-semibold text-gray-700 w-40">
                        Quantity:
                      </span>
                      <span className="text-gray-900 bg-blue-50 px-3 py-1 rounded-lg">
                        {MED[ID]?.quantity?.toString()}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-semibold text-gray-700 w-40">
                        Current Stage:
                      </span>
                      <span className="text-gray-900 bg-green-50 px-3 py-1 rounded-lg text-green-700 font-semibold">
                        {MedStage[ID]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Progress Timeline */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-indigo-700 mb-8">
                Supply Chain Progress
              </h2>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200"></div>
                <div
                  className="absolute left-8 top-0 w-1 bg-indigo-600 transition-all duration-500"
                  style={{
                    height: `100%`,
                  }}
                ></div>

                {/* Timeline items */}
                <div className="space-y-8">
                  {/* Stage 0 - Medicine Order */}
                  <div className="relative flex items-start ml-16">
                    <div
                      className={`absolute -left-[2.25rem] w-8 h-8 rounded-full flex items-center justify-center ${
                        (selectedRec?.stage ?? 0) >= 0
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-300 text-gray-500"
                      }`}
                    >
                      {stageIcons[0]}
                    </div>
                    <div
                      className={`flex-1 p-6 rounded-lg ${
                        (selectedRec?.stage ?? 0) >= 0
                          ? "bg-indigo-50 border-l-4 border-indigo-600"
                          : "bg-gray-50"
                      }`}
                    >
                      <h3 className="text-lg font-semibold text-gray-900">
                        Medicine Ordered
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Order has been placed in the system
                      </p>
                    </div>
                  </div>

                  {/* Stage 1 - Raw Material Supplier */}
                  {(selectedRec?.stage ?? 0) >= 1 && ID && MED[ID] && (
                    <div className="relative flex items-start ml-16">
                      <div className="absolute -left-[2.25rem] w-8 h-8 rounded-full flex items-center justify-center bg-purple-600 text-white">
                        {stageIcons[1]}
                      </div>
                      <div className="flex-1 p-6 rounded-lg bg-purple-50 border-l-4 border-purple-600">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Raw Material Supply Stage
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Raw materials supplied by{" "}
                          <strong className="text-purple-700">
                            {RMS[Number(MED[ID]?.RMSid)]?.name}
                          </strong>{" "}
                          from{" "}
                          <strong className="text-purple-700">
                            {RMS[Number(MED[ID]?.RMSid)]?.place}
                          </strong>
                        </p>
                        <div className="mt-3 text-xs text-gray-500">
                          Supplier ID:{" "}
                          <span className="font-mono bg-white px-2 py-1 rounded">
                            {RMS[Number(MED[ID]?.RMSid)]?.id?.toString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stage 2 - Manufacturer */}
                  {(selectedRec?.stage ?? 0) >= 2 && ID && MED[ID] && (
                    <div className="relative flex items-start ml-16">
                      <div className="absolute -left-[2.25rem] w-8 h-8 rounded-full flex items-center justify-center bg-yellow-600 text-white">
                        {stageIcons[2]}
                      </div>
                      <div className="flex-1 p-6 rounded-lg bg-yellow-50 border-l-4 border-yellow-600">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Manufacturing Stage
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Manufactured by{" "}
                          <strong className="text-yellow-700">
                            {MAN[Number(MED[ID]?.MANid)]?.name}
                          </strong>{" "}
                          from{" "}
                          <strong className="text-yellow-700">
                            {MAN[Number(MED[ID]?.MANid)]?.place}
                          </strong>
                        </p>
                        <div className="mt-3 text-xs text-gray-500">
                          Manufacturer ID:{" "}
                          <span className="font-mono bg-white px-2 py-1 rounded">
                            {MAN[Number(MED[ID]?.MANid)]?.id?.toString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stage 3 - Distributor */}
                  {(selectedRec?.stage ?? 0) >= 3 && ID && MED[ID] && (
                    <div className="relative flex items-start ml-16">
                      <div className="absolute -left-[2.25rem] w-8 h-8 rounded-full flex items-center justify-center bg-orange-600 text-white">
                        {stageIcons[3]}
                      </div>
                      <div className="flex-1 p-6 rounded-lg bg-orange-50 border-l-4 border-orange-600">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Distribution Stage
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Distributed by{" "}
                          <strong className="text-orange-700">
                            {DIS[Number(MED[ID]?.DISid)]?.name}
                          </strong>{" "}
                          from{" "}
                          <strong className="text-orange-700">
                            {DIS[Number(MED[ID]?.DISid)]?.place}
                          </strong>
                        </p>
                        <div className="mt-3 text-xs text-gray-500">
                          Distributor ID:{" "}
                          <span className="font-mono bg-white px-2 py-1 rounded">
                            {DIS[Number(MED[ID]?.DISid)]?.id?.toString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stage 4 - Retailer */}
                  {(selectedRec?.stage ?? 0) >= 4 && ID && MED[ID] && (
                    <div className="relative flex items-start ml-16">
                      <div className="absolute -left-[2.25rem] w-8 h-8 rounded-full flex items-center justify-center bg-pink-600 text-white">
                        {stageIcons[4]}
                      </div>
                      <div className="flex-1 p-6 rounded-lg bg-pink-50 border-l-4 border-pink-600">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Retail Stage
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Retailed by{" "}
                          <strong className="text-pink-700">
                            {RET[Number(MED[ID]?.RETid)]?.name}
                          </strong>{" "}
                          from{" "}
                          <strong className="text-pink-700">
                            {RET[Number(MED[ID]?.RETid)]?.place}
                          </strong>
                        </p>
                        <div className="mt-3 text-xs text-gray-500">
                          Retailer ID:{" "}
                          <span className="font-mono bg-white px-2 py-1 rounded">
                            {RET[Number(MED[ID]?.RETid)]?.id?.toString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stage 5 - Sold/Consumer */}
                  {(selectedRec?.stage ?? 0) >= 5 && ID && MED[ID] && (
                    <div className="relative flex items-start ml-16">
                      <div className="absolute -left-[2.25rem] w-8 h-8 rounded-full flex items-center justify-center bg-green-600 text-white">
                        {stageIcons[5]}
                      </div>
                      <div className="flex-1 p-6 rounded-lg bg-green-50 border-l-4 border-green-600">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Sold to Consumer
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Medicine successfully sold by{" "}
                          <strong className="text-green-700">
                            {RET[Number(MED[ID]?.RETid)]?.name}
                          </strong>{" "}
                          from{" "}
                          <strong className="text-green-700">
                            {RET[Number(MED[ID]?.RETid)]?.place}
                          </strong>
                        </p>
                        <div className="mt-3 text-xs text-gray-500">
                          Retailer ID:{" "}
                          <span className="font-mono bg-white px-2 py-1 rounded">
                            {RET[Number(MED[ID]?.RETid)]?.id?.toString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Track;
