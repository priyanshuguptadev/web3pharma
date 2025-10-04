# Web3Pharma 🧬

A decentralized application (dApp) for pharmaceutical management powered by **Ethereum** and **Hardhat**.

---

## 🚀 Getting Started

Follow these steps to set up the project locally and start running the dApp on your machine.

---

### 1. Install MetaMask

First, install the **MetaMask** browser extension from the [Chrome Web Store](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn).

---

### 2. Clone the Repository

```bash
git clone https://github.com/priyanshuguptadev/web3pharma
cd web3pharma
npm install
```

---

### 3. Start a Local Hardhat Node

Open a new terminal and run:

```bash
npx hardhat node
```

This command will start a local Ethereum network and generate several accounts, each preloaded with test Ether.

---

### 4. Connect MetaMask to Local Network

Use the **private key** of the **first wallet** shown in your Hardhat node terminal output and import it into MetaMask.

Then, in MetaMask, go to **Settings → Networks → Add Network** and enter the following details:

| Field               | Value                                          |
| ------------------- | ---------------------------------------------- |
| **Network Name**    | Localhost 8545                                 |
| **New RPC URL**     | [http://127.0.0.1:8545](http://127.0.0.1:8545) |
| **Chain ID**        | 1337                                           |
| **Currency Symbol** | ETH                                            |

Save the network and make sure MetaMask is connected to **Localhost 8545**.

---

### 5. Deploy Smart Contracts

Open another terminal window and run:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

This will compile and deploy your smart contracts to the local Hardhat network.

---

### 6. Start the Client

In a new terminal, navigate to the client folder and start the frontend:

```bash
cd client
npm install
npm run start
```

This will launch the React frontend on your local development server.

---

### 7. Connect MetaMask to the App

When the website opens, you’ll see a MetaMask connection popup.
Select the **imported account** you added earlier and approve the connection.

---

### 🎉 Done!

Your local Web3Pharma dApp should now be fully operational.
You can start exploring and interacting with the blockchain-based features.

---

### 🧩 Tech Stack

- **Frontend:** React, JavaScript
- **Blockchain:** Ethereum, Hardhat
- **Wallet Integration:** MetaMask
- **Node Environment:** Localhost (Hardhat Network)

---

### 🛠️ Troubleshooting Tips

- If MetaMask doesn’t connect, ensure your local Hardhat node (`npx hardhat node`) is still running.
- Clear browser cache or reset MetaMask network if RPC connection fails.
- Use Node.js ≥ 18.x for best compatibility.
