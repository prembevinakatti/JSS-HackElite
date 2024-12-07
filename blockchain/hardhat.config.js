require("@nomicfoundation/hardhat-ethers");

module.exports = {
  solidity: "0.8.28",
  networks: {
    ganache: {
      url: "http://127.0.0.1:8545", // RPC URL of Ganache
      accounts: [
        "0x338bc4043d77f6b29215123cdfe35517d5024d01814a250380e6f38bdad1d2ac",
        "0xcb0409b7293dbe6c9fed7d1b8d5aae546e6908509cdd6ee7529060dcdde9e754",
        "0x990d68bdbdf3c9b65e0b9f609a8dd6977479114b51bf5b45fb4879af936797e4",
      ],
    },
  },
};
