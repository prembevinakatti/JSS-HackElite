require("@nomicfoundation/hardhat-ethers");

module.exports = {
  solidity: "0.8.28",
  networks: {
    ganache: {
      url: "http://127.0.0.1:8545", // RPC URL of Ganache
      accounts: [
        "0x29d6a479305c7032d908b57b881b48bffe3a19d292e076cb6696411cab7aa9d3",
        "0x728aa084957f637355abf35e118c5282604506a98e0c222ed29a84d091d986b7",
        "0x5e7c6b723a39e88f25d0f335f6146c492c850d85c17477235caf75cff12060cd",
      ],
    },
  },
};
