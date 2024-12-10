import React, { useState, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { RiFolderShield2Fill } from "react-icons/ri";
import useGetAllBranches from "@/hooks/useGetAllBranchs";
import useGetDepartmentsByBranch from "@/hooks/useGetDepartmentsByBranch";
import useGetFoldersByDepartment from "@/hooks/useGetFoldersByDepartment";
import useGetFilesByFolder from "@/hooks/useGetFilesByFolder";
import { Button } from "@/components/ui/button";
import { FaFileImage } from "react-icons/fa";
import { FaRegFileLines } from "react-icons/fa6";
import axios from "axios";
import { AiOutlineFilePdf } from "react-icons/ai";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LuFileLock2 } from "react-icons/lu";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useContract } from "@/ContractContext/ContractContext";
function View() {
  const [breadcrumbs, setBreadcrumbs] = useState(["Home"]);
  const [folders, setFolders] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fetchFiles, setFetchFiles] = useState(false);
  const [uploadmodel, setuploadmodel] = useState(false);
  const [uploadMode, setUploadMode] = useState("single"); // 'single' or 'bulk'
  const [singleFile, setSingleFile] = useState(null);
  const [bulkFiles, setBulkFiles] = useState([]);
  const [isPrivate, setIsPrivate] = useState(true); // Changed to isPrivate
  const [fileNames, setFileName] = useState([]); // Initialize as an array
  const [isDeleting, setIsDeleting] = useState(false); // Track file deletion state
  const [loading, setloading] = useState();
  const { state } = useContract();
  const contract = state.contract;
  const handleKnowMoreClick = (file) => {
    setSelectedFile(file);
  };
  const hangleuploadmodel = () => {
    setuploadmodel(true);
  };
  const {
    branches,
    loading: branchesLoading,
    error: branchesError,
  } = useGetAllBranches();

  const {
    departments,
    loading: departmentsLoading,
    error: departmentsError,
  } = useGetDepartmentsByBranch(selectedBranch);

  const {
    folders: departmentFolders,
    loading: foldersLoading,
    error: foldersError,
  } = useGetFoldersByDepartment(selectedBranch, selectedDepartment);

  const {
    files,
    loading: filesLoading,
    error: filesError,
  } = useGetFilesByFolder({
    branch: selectedBranch,
    department: selectedDepartment,
    folderName: selectedFolder,
  });

  useEffect(() => {
    if (branches) {
      setFolders(branches);
    }
  }, [branches]);

  useEffect(() => {
    if (departments) {
      setFolders(departments);
    }
  }, [departments]);

  useEffect(() => {
    if (departmentFolders) {
      setFolders(departmentFolders);
    }
  }, [departmentFolders]);

  useEffect(() => {
    if (selectedFolder) {
      setFetchFiles(true); // Trigger file fetch only when a folder is selected
    }
  }, [selectedFolder]);

  function handleFolderClick(folderName) {
    if (branches.includes(folderName)) {
      setSelectedBranch(folderName);
      setSelectedDepartment(null);
      setSelectedFolder(null);
      setBreadcrumbs(["Home", folderName]);
      setFetchFiles(false); // Reset lazy load flag
    } else if (departments?.includes(folderName)) {
      setSelectedDepartment(folderName);
      setSelectedFolder(null);
      setBreadcrumbs(["Home", selectedBranch, folderName]);
      setFetchFiles(false); // Reset lazy load flag
    } else if (departmentFolders?.includes(folderName)) {
      setSelectedFolder(folderName);
      setBreadcrumbs(["Home", selectedBranch, selectedDepartment, folderName]);
    }
  }

  function handleBreadcrumbClick(index) {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);

    if (index === 0) {
      setSelectedBranch(null);
      setSelectedDepartment(null);
      setSelectedFolder(null);
      setFolders(branches);
      setFetchFiles(false); // Reset lazy load flag
    } else if (index === 1) {
      setSelectedDepartment(null);
      setSelectedFolder(null);
      setFolders(departments);
      setFetchFiles(false); // Reset lazy load flag
    } else if (index === 2) {
      setSelectedFolder(null);
      setFolders(departmentFolders);
      setFetchFiles(false); // Reset lazy load flag
    }
  }
  console.log(files);

  const handleSingleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setSingleFile(selectedFile);
    setFileName([selectedFile.name.split(".")[0]]); // Store single file name in an array
  };
  const handleBulkFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setBulkFiles(files);

    // Extract and store file names in an array
    const fileNamesArray = files.map((file) => file.name.split(".")[0]); // Store names without extensions
    setFileName(fileNamesArray); // Update fileName as an array
  };
  const handleuploadmodel = () => {
    setuploadmodel(true);
  };

  const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY; // Store your Pinata API key in .env
  const PINATA_API_SECRET = import.meta.env.VITE_PINATA_SECRET_API_KEY;

  const handleUploadToIPFS = async () => {
    console.log("Upload to IPFS initiated.");
    console.log("Upload mode:", uploadMode);
    console.log(
      "Files to upload:",
      uploadMode === "single" ? singleFile : bulkFiles
    );

    setloading(true); // Set loading state during the upload process

    const filesToUpload =
      uploadMode === "single" && singleFile
        ? [singleFile]
        : uploadMode === "bulk" && bulkFiles.length > 0
        ? bulkFiles
        : [];

    if (filesToUpload.length === 0) {
      console.error("No files selected for upload.");
      setloading(false);
      return;
    }

    try {
      const ipfsHashes = [];
      const fileNames = []; // Array to store file names

      for (const file of filesToUpload) {
        const formData = new FormData();
        formData.append("file", file);

        // Optionally, add metadata to the file
        const metadata = JSON.stringify({
          name: file.name,
          keyvalues: {
            branch: selectedBranch,
            department: selectedDepartment,
          },
        });
        formData.append("pinataMetadata", metadata);

        // Add Pinata options (optional)
        const options = JSON.stringify({
          cidVersion: 1,
        });
        formData.append("pinataOptions", options);

        const response = await axios.post(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              pinata_api_key: PINATA_API_KEY,
              pinata_secret_api_key: PINATA_API_SECRET,
            },
          }
        );

        console.log("File uploaded:", response.data);
        ipfsHashes.push(response.data.IpfsHash); // Save the hash
        fileNames.push(file.name); // Save the file name
      }

      // console.log("ipfsHashes:", ipfsHashes);
      // console.log("File Names:", fileNames); // Log the file names
      // console.log("Branch:", selectedBranch);
      // console.log("Department:", selectedDepartment);
      // console.log("Folder:", selectedFolder);
      // console.log(
      //   `Path: ${selectedBranch}/${selectedDepartment}/${selectedFolder}`
      // );
      // console.log("isPrivate:", isPrivate);

      const path = `${selectedBranch}/${selectedDepartment}/${selectedFolder}`;

      const result = await contract.uploadFiles(
        fileNames,
        selectedFolder,
        path,
        ipfsHashes,
        selectedBranch,
        selectedDepartment,
        isPrivate
      );

      setloading(false);
      setuploadmodel(false);
      setSingleFile(null); // Reset single file state
      setBulkFiles([]); // Reset bulk files state
      setFileName([]); // Clear file names

      return { ipfsHashes, fileNames }; // Return the array of ipfsHashes and file names
    } catch (error) {
      console.error("Error uploading files to IPFS:", error);
      setloading(false);
    }
  };

  if (branchesLoading || departmentsLoading || foldersLoading || filesLoading) {
    return <p>Loading...</p>;
  }

  if (branchesError || departmentsError || foldersError || filesError) {
    return (
      <p>
        Error: {branchesError || departmentsError || foldersError || filesError}
      </p>
    );
  }

  const handleDeleteFile = async (file) => {
    try {
      setIsDeleting(true); // Start the loader
      console.log("File: ", file);
      const response = await contract.deleteFile(file);
      console.log("File deleted: ", response);
    } catch (error) {
      console.log("Error deleting file in client: ", error.message);
    } finally {
      setIsDeleting(false); // Stop the loader
    }
  };

  return (
    <div className="min-h-screen p-3">
      <div className="max-w-5xl mx-auto drop-shadow-2xl rounded-lg p-1 shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Blockchain File Explorer</h1>

        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <BreadcrumbList className="flex flex-wrap mb-6">
            {breadcrumbs.map((crumb, index) => (
              <BreadcrumbItem key={index}>
                <BreadcrumbLink
                  onClick={() => handleBreadcrumbClick(index)}
                  className={`cursor-pointer ${
                    index === breadcrumbs.length - 1
                      ? "font-semibold"
                      : "hover:text-blue-500"
                  }`}
                >
                  {crumb}
                </BreadcrumbLink>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Folders */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {folders?.map((folder, index) => (
            <div
              key={index}
              onClick={() => handleFolderClick(folder)}
              className="cursor-pointer border rounded-lg p-4 flex flex-col items-center hover:shadow-lg transform transition duration-200 ease-in-out hover:scale-105"
            >
              <RiFolderShield2Fill
                size={60}
                className="mb-2 text-orange-500 "
              />
              <span className="font-medium truncate text-center">{folder}</span>
            </div>
          ))}
        </div>

        {/* Files in Selected Folder */}
        {selectedFolder && (
          <div>
            <h1 className="text-2xl mt-3 w-full text-center underline">
              All Files Of {selectedFolder}
            </h1>
            <div
              className="bg-primary rounded-full p-2 text-center text-white cursor-pointer w-fit mx-auto mt-3"
              onClick={handleuploadmodel}
            >
              Add File
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
              {files?.map((file, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 flex flex-col items-center hover:shadow-lg transform transition duration-200 ease-in-out hover:scale-105"
                >
                  {file.isPrivate ? (
                    <LuFileLock2 size={60} className="mb-2 text-red-500" />
                  ) : (
                    <FaRegFileLines size={60} className="mb-2 text-blue-500" />
                  )}
                  <a
                    href={file?.path || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-medium truncate text-center"
                  >
                    {file?.fileName}
                  </a>
                  <div className="flex gap-2">
                    <Button>View</Button>
                    <Button
                      onClick={() => handleDeleteFile(file?.id)}
                      variant={"destructive"}
                      disabled={isDeleting} // Disable while deleting
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                  <p
                    className="underline ml-2 mt-3 cursor-pointer"
                    onClick={() => handleKnowMoreClick(file)}
                  >
                    Know more
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        {selectedFile && (
          <Dialog
            open={selectedFile}
            onOpenChange={() => setSelectedFile(null)}
          >
            <DialogTrigger asChild>
              <Button variant="outline" className="hidden">
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>File Details</DialogTitle>
                <DialogDescription>
                  Here are the details for the file "{selectedFile?.fileName}
                  ".
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fileName" className="text-right">
                    File Name
                  </Label>
                  <Input
                    id="fileName"
                    defaultValue={selectedFile?.fileName}
                    className="col-span-3"
                    readOnly
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="branch" className="text-right">
                    Branch
                  </Label>
                  <Input
                    id="branch"
                    defaultValue={selectedFile?.branch}
                    className="col-span-3"
                    readOnly
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="department" className="text-right">
                    Department
                  </Label>
                  <Input
                    id="department"
                    defaultValue={selectedFile?.department}
                    className="col-span-3"
                    readOnly
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="uploader" className="text-right">
                    Uploader
                  </Label>
                  <Input
                    id="uploader"
                    defaultValue={selectedFile?.uploader}
                    className="col-span-3"
                    readOnly
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="ipfsHash" className="text-right">
                    IPFS Hash
                  </Label>
                  <Input
                    id="ipfsHash"
                    defaultValue={selectedFile?.ipfsHash}
                    className="col-span-3"
                    readOnly
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" onClick={() => setSelectedFile(null)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        {/* Upload Dialog */}
        {uploadmodel && (
          <Dialog open={uploadmodel} onOpenChange={() => setuploadmodel(false)}>
            <DialogTrigger asChild>
              <Button variant="outline" className="hidden">
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Upload Files</DialogTitle>
                <DialogDescription>
                  <Input disabled={true} value={breadcrumbs.join(" > ")} />
                  <div>
                    <Label>Access Type</Label>
                    <RadioGroup
                      value={isPrivate ? "private" : "public"}
                      onValueChange={(value) =>
                        setIsPrivate(value === "private")
                      }
                    >
                      <div className="flex items-center space-x-4">
                        <RadioGroupItem value="public" id="public" />
                        <Label htmlFor="public">Public</Label>
                        <RadioGroupItem value="private" id="private" />
                        <Label htmlFor="private">Private</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <div className="mb-4 flex justify-center gap-4">
                <Button
                  variant={uploadMode === "single" ? "secondary" : "primary"}
                  onClick={() => setUploadMode("single")}
                >
                  Single Upload
                </Button>
                <Button
                  variant={uploadMode === "bulk" ? "secondary" : "primary"}
                  onClick={() => setUploadMode("bulk")}
                >
                  Bulk Upload
                </Button>
              </div>
              {uploadMode === "single" && (
                <Card>
                  <CardHeader>
                    <h2 className="text-lg font-semibold">
                      Single File Upload
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <input
                      type="file"
                      onChange={handleSingleFileChange}
                      accept="image/*,application/pdf"
                    />
                    {singleFile && (
                      <div className="mt-2">
                        {singleFile.type.includes("pdf") ? (
                          <AiOutlineFilePdf size={25} />
                        ) : (
                          <FaFileImage size={25} />
                        )}
                        <span>{singleFile.name}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {uploadMode === "bulk" && (
                <Card>
                  <CardHeader>
                    <h2 className="text-lg font-semibold">Bulk File Upload</h2>
                  </CardHeader>
                  <CardContent>
                    <input
                      type="file"
                      multiple
                      onChange={handleBulkFilesChange}
                      accept="image/*,application/pdf"
                    />
                    {bulkFiles.length > 0 && (
                      <div className="mt-2">
                        {bulkFiles.map((file, index) => (
                          <div key={index} className="flex items-center gap-2">
                            {file.type.includes("pdf") ? (
                              <AiOutlineFilePdf size={25} />
                            ) : (
                              <FaFileImage size={25} />
                            )}
                            <span>{file.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <DialogFooter>
                <Button
                  onClick={handleUploadToIPFS}
                  disabled={loading}
                  variant="primary"
                  className="w-full"
                >
                  {loading ? "Uploading..." : "Upload to IPFS"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}

export default View;
