import { useState, useEffect } from "react";
import { useContract } from "@/ContractContext/ContractContext";

const useGetFoldersByDepartment = (branchName, departmentName) => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { state } = useContract();
  const contract = state?.contract;

  useEffect(() => {
    // Check if inputs are valid
    if (!branchName || !departmentName || !contract) {
      setFolders([]);
      return;
    }

    const fetchFolders = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await contract.getFoldersByDepartment(branchName, departmentName);
        setFolders(result || []); // Ensure fallback to empty array
      } catch (err) {
        setError(err.message);
        setFolders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  }, [branchName, departmentName, contract]);

  return { folders, loading, error };
};

export default useGetFoldersByDepartment;
