import { useContract } from "@/ContractContext/ContractContext";
import { useState, useEffect } from "react";

const useGetDepartmentsByBranch = (branchName) => {
  const { state } = useContract();
  const contract = state.contract;

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      if (!contract || !branchName) return;

      setLoading(true);
      setError(null);

      try {
        const result = await contract.getDepartmentsByBranch(branchName);
        console.log("Departments:", result);
        setDepartments(result);
      } catch (err) {
        console.error("Error fetching departments:", err);
        setError("Failed to fetch departments.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [contract, branchName]);

  return { departments, loading, error };
};

export default useGetDepartmentsByBranch;
