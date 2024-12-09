import { useState, useEffect } from "react";
import { useContract } from "@/ContractContext/ContractContext";

const useGetFilesByFolder = ({ branch, department, folderName }) => {
  const { state } = useContract();
  const contract = state?.contract;
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Exit early if parameters are invalid
    if (!branch || !department || !folderName) {
      setFiles([]);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchFiles = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await contract.getFilesByFolder(branch, department, folderName);

        const filesData = result.map((file) => ({
          id: file?.id.toString(),
          fileName: file?.fileName,
          folderName: file?.folderName,
          path: file?.path,
          ipfsHash: file?.ipfsHash,
          branch: file?.branch,
          department: file?.department,
          uploader: file?.uploader,
          isPrivate: file?.isPrivate,
        }));

        setFiles(filesData);
      } catch (err) {
        setError(err.message || "Error fetching files");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [branch, department, folderName, contract]);

  return { files, loading, error };
};

export default useGetFilesByFolder;
