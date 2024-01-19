const hre = require("hardhat");

async function main() {
    const chatDapp = await hre.ethers.getContractFactory("chatDapp");
    const contract = await chatDapp.deploy(); // instance of the contract 
  
    await contract.waitForDeployment();
  
    console.log('Address of contract: ', contract.target);
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });