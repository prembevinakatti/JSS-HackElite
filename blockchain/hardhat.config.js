require("@nomicfoundation/hardhat-ethers");

module.exports = {
  solidity: "0.8.28",
  networks: {
    ganache: {
      url: "http://127.0.0.1:8545", // RPC URL of Ganache
      accounts: [
        "0x794830567522f20c171bc69acc8dec74a1c4088e7f43d07b3b8e940456b5cddf",
        "0x0217a464c77f65b9f73d9b2ee171a009519df47d5a5760d9303931053d2b567a",
        "0xfa4334095127ed2d298e21245aa3f533cb1a5a5dfb6274a4b75f26ba2782264e",
      ],
    },
  },
};
