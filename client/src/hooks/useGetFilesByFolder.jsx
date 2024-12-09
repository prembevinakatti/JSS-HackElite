import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const useGetFilesByFolder = (contract, branchName, departmentName, folderName) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!branchName || !departmentName || !folderName) return;

        const fetchFiles = async () => {
            try {
                setLoading(true);
                const result = await contract.getFilesByFolder(branchName, departmentName, folderName);
                setFiles(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFiles();
    }, [branchName, departmentName, folderName, contract]);

    return { files, loading, error };
};

export default useGetFilesByFolder;
