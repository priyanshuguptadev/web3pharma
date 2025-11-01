const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");
function saveFrontendFiles(contract, chainId) {
  const deploymentsDir = path.join(
    __dirname,
    "..",
    "frontend",
    "src",
    "artifacts"
  );
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const filePath = path.join(deploymentsDir, "deployments.json");
  let deployments = {};
  if (fs.existsSync(filePath)) {
    deployments = JSON.parse(fs.readFileSync(filePath, "utf8"));
  }

  deployments[chainId] = { SupplyChain: contract.address };
  fs.writeFileSync(filePath, JSON.stringify(deployments, null, 2));
}

async function main() {
  const SupplyChain = await ethers.getContractFactory("SupplyChain");
  const supplyChain = await SupplyChain.deploy();
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
  await supplyChain.deployed();
  console.log("SupplyChain deployed to:", supplyChain.address);

  const network = await supplyChain.provider.getNetwork();
  saveFrontendFiles(supplyChain, network.chainId.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
