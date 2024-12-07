require("@nomicfoundation/hardhat-ethers");

module.exports = {
  solidity: "0.8.28",
  networks: {
    ganache: {
      url: "http://127.0.0.1:8545", // RPC URL of Ganache
      accounts: [
        "0x92f7c24bd206471a22019ad4512f0b6e98c74d6ac94ce4e4422d83ff2e7020dd",
        "0x3c09012026b1ba2fc8e457d712d9beb724bca3390f47333d063b40fa02251f39",
        "0x44ad49364bad3347e8df68561b0eff84adc701cbaa6c20a307783da868a2e66b",
      ],
    },
  },
};
