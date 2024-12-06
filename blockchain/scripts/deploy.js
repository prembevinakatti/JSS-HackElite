const hre = require("hardhat");

async function main() {
  try {
    const Document = await hre.ethers.getContractFactory("DocumentManagementSystem");

    const document = await Document.deploy();

    await document.waitForDeployment();

    console.log(`Deployed Contract Address Is : ${document.target}`);
  } catch (error) {
    console.log("Error in deploying : ", error.message);
  }
}

main()
  .then(() => {
    console.log("Deployed Successfully");
  })
  .catch((error) => {
    console.log("Deploy failed: ", error.message);
  });
