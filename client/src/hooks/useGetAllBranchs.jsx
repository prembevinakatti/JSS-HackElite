import { useState, useEffect } from "react";
import { useContract } from "@/ContractContext/ContractContext";

const useGetAllBranches = () => {
  const { state } = useContract(); // Access contract instance
  const contract = state?.contract;

  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBranches = async () => {
      if (!contract) {
        setError("Smart contract instance is not available.");
        return;
      }

      setLoading(true);
      setError(null); // Reset error before fetching

      try {
        // Call the smart contract method
        const uniqueBranches = await contract.getAllBranches();

        if (Array.isArray(uniqueBranches)) {
          setBranches(uniqueBranches);
        } else {
          throw new Error("Unexpected data format from smart contract.");
        }
      } catch (err) {
        console.error("Error fetching branches:", err);
        setError(err.message || "An unknown error occurred.");
      } finally {
        setLoading(false); // Always set loading to false after the call
      }
    };

    fetchBranches();
  }, [contract]);

  return { branches, loading, error }; // Return data, loading, and error state
};

export default useGetAllBranches;
