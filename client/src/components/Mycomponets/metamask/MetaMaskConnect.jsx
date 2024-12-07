import React, { useState, useEffect } from "react";
import { FaEthereum } from "react-icons/fa";
import { Button } from "@/components/ui/button"; // ShadCN Button
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // ShadCN Card
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"; // ShadCN Alert
import axios from "axios";
import { useContract } from "@/ContractContext/ContractContext";

const MetaMaskConnect = () => {
  const [account, setAccount] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState(
    !!window.ethereum
  );
  const { contract, loading } = useContract(); // Access contract and loading state from context

  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const connectedAccount = accounts[0];
        setAccount(connectedAccount);
        setErrorMessage("");

        if (connectedAccount) {
          // Send the Metamask ID only if it exists
          const response = await axios.post(
            `http://localhost:3000/api/user/setMetamaskId`,
            { metamaskId: connectedAccount },
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );
          if (response.data.success) {
            console.log(response.data);
          }
        } else {
          setErrorMessage("Failed to retrieve account information.");
        }
      } catch (error) {
        console.log(error);
        setErrorMessage("Connection failed. Please try again.");
      }
    } else {
      setErrorMessage(
        "MetaMask is not installed. Please install it to continue."
      );
    }
  };

  useEffect(() => {
    if (contract && account) {
      // You can now interact with the contract
      console.log("Contract and account are ready", contract, account);
    }
  }, [contract, account]); // This will trigger when either contract or account changes

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <FaEthereum className="text-blue-500" size={24} />
            Connect to MetaMask
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isMetaMaskAvailable ? (
            <Alert className="mb-4" variant="warning">
              <AlertTitle>MetaMask Not Detected</AlertTitle>
              <AlertDescription>
                MetaMask is not installed on your browser. Please install
                MetaMask to proceed.
                <br />
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Click here to install MetaMask.
                </a>
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {errorMessage && (
                <Alert className="mb-4" variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
              {account ? (
                <div className="text-center">
                  <p className="text-sm text-gray-700">Connected Account:</p>
                  <p className="font-mono text-sm mt-2">{account}</p>
                </div>
              ) : (
                <Button onClick={connectMetaMask} className="w-full">
                  Connect MetaMask
                </Button>
              )}
            </>
          )}

          {!account && isMetaMaskAvailable && (
            <div className="mt-4 text-sm text-center text-gray-600">
              Don't have a MetaMask account?{" "}
              <a
                href="https://metamask.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Create one here.
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MetaMaskConnect;
