import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useContract } from "@/ContractContext/ContractContext";

const useGetFoldersByDepartment = (branchName, departmentName) => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { state } = useContract();
  const contract = state.contract;

  useEffect(() => {
    if (!branchName || !departmentName) return;

    const fetchFolders = async () => {
      try {
        setLoading(true);
        const result = await contract.getFoldersByDepartment(
          branchName,
          departmentName
        );
        setFolders(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  }, [branchName, departmentName, contract]);

  return { folders, loading, error };
};

export default useGetFoldersByDepartment;
