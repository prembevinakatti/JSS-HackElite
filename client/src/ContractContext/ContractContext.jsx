import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../ContractABI/DocumentManagementSystem.json";

const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });

  const contractAddress = "0xf787Bb709Bd2C2471553f7Ef4bAed9d4127ed1D2";
  const contractABI = abi.abi;

  useEffect(() => {
    const getWalletAddress = async () => {
      
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );
          setState({ provider, signer, contract });
          console.log("Contract initialized:", contract);
        } else {
          console.log("No accounts found! Please connect your wallet.");
        }
      } else {
        console.log("MetaMask not detected!");
      }
    };

    getWalletAddress();
  }, []);

  return (
    <ContractContext.Provider value={{ walletAddress, state }}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => {
  return useContext(ContractContext);
};
