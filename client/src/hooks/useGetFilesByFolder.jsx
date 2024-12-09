import { useState, useEffect } from "react";
import { useContract } from "@/ContractContext/ContractContext";

const useGetFilesByFolder = ({ branch, department, folderName }) => {
  const { state } = useContract();
  const contract = state?.contract;
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("files :", files);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const result = await contract.getFilesByFolder(
          "CSE",
          "Faculty_Records",
          "test"
        );

        console.log("result",result);
        

        // Mapping the result to the files array
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
  }, [branch, department, folderName]);

  return { files, loading, error };
};

export default useGetFilesByFolder;
