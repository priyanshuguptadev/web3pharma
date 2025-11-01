import { useState, useEffect } from "react";
import SupplyChainABI from "./artifacts/contracts/SupplyChain.sol/SupplyChain.json";
import { ethers } from "ethers";

function OrderMedicine() {
  const [currentaccount, setCurrentaccount] = useState("");
  const [loader, setloader] = useState(true);
  const [SupplyChain, setSupplyChain] = useState<ethers.Contract | undefined>();
  const [MED, setMED] = useState<Record<number, any>>({});
  const [MedName, setMedName] = useState("");
  const [MedDes, setMedDes] = useState("");
  const [MedComs, setMedComs] = useState("");
  const [MedQuant, setMedQuant] = useState("");
  const [MedStage, setMedStage] = useState<any[]>([]);

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
      const med: any = {};
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
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-indigo-600 font-medium">Loading...</span>
      </div>
    );
  }

  const handlerChangeNameMED = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMedName(event.target.value);
  };
  const handlerChangeDesMED = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMedDes(event.target.value);
  };
  const handlerChangeComs = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMedComs(event.target.value);
  };
  const handlerChangeQuant = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMedQuant(event.target.value);
  };
  const handlerSubmitMED = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      console.log(SupplyChain);
      console.log(MedName, MedDes, MedComs, MedQuant, currentaccount);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      console.log(signer);
      const contract: any = SupplyChain!.connect(signer);
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
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
            Order Medicine
          </h2>
          <form
            onSubmit={handlerSubmitMED}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medicine Name
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                type="text"
                onChange={handlerChangeNameMED}
                placeholder="Medicine Name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                type="text"
                onChange={handlerChangeDesMED}
                placeholder="Description"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Composition
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                type="text"
                onChange={handlerChangeComs}
                placeholder="Composition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                type="text"
                onChange={handlerChangeQuant}
                placeholder="Quantity"
                required
              />
            </div>
            <div>
              <button
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                type="submit"
              >
                Add Order
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-600">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    ID
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
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Composition
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Current Stage
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(MED).map(function ([key]) {
                  return (
                    <tr key={key} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {MED[Number(key)]?.id?.toString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {MED[Number(key)]?.name?.length > 40
                          ? MED[Number(key)]?.name?.substring(0, 40) + "..."
                          : MED[Number(key)]?.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {MED[Number(key)]?.description}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {MED[Number(key)]?.composition}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {MED[Number(key)]?.quantity?.toString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {MedStage[Number(key)]}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderMedicine;
