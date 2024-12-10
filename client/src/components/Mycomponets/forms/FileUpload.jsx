import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import axios from "axios"; // Using axios to interact with Pinata API
import { useContract } from "@/ContractContext/ContractContext";
import { FaFileImage } from "react-icons/fa";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { AiOutlineFilePdf } from "react-icons/ai"; // Added for PDF icon

const FileUpload = ({ onUploadComplete }) => {
  const [fileNames, setFileName] = useState([]); // Initialize as an array
  const [folderName, setFolderName] = useState("");
  const [branch, setBranch] = useState("");
  const [department, setDepartment] = useState("");
  const [isPrivate, setIsPrivate] = useState(true); // Changed to isPrivate
  const [path, setPath] = useState("");
  const [file, setFile] = useState(null);
  const [ipfsHash, setIpfsHash] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [uploadMode, setUploadMode] = useState("single"); // 'single' or 'bulk'
  const [singleFile, setSingleFile] = useState(null);
  const [bulkFiles, setBulkFiles] = useState([]);
  const [storagePath, setStoragePath] = useState("");
  const { state } = useContract();
  const contract = state.contract;

  useEffect(() => {
    if (!contract) {
      console.log("Contract is not initialized yet");
      return;
    }
  }, [contract]);

  // Pinata API endpoint and authentication
  const pinataApiUrl = "https://api.pinata.cloud/pinning/pinFileToIPFS";
  const pinataApiKey = import.meta.env.VITE_PINATA_API_KEY; // Store your Pinata API key in .env
  const pinataSecretApiKey = import.meta.env.VITE_PINATA_SECRET_API_KEY; // Store the secret API key in .env

  // Update path based on branch and department
  const updatePath = () => {
    const pathSegments = [branch, department, folderName].filter(Boolean);
    return pathSegments.join("/");
  };

  useEffect(() => {
    setPath(updatePath());
  }, [branch, department, folderName]);

  const handleSingleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setSingleFile(selectedFile);
    setFileName([selectedFile.name.split(".")[0]]); // Store single file name in an array
    setPath(updatePath()); // Update path
  };

  const handleBulkFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setBulkFiles(files);

    // Extract and store file names in an array
    const fileNamesArray = files.map((file) => file.name.split(".")[0]); // Store names without extensions
    setFileName(fileNamesArray); // Update fileName as an array
  };

  const handleUploadToIPFS = async () => {
    if (
      !folderName ||
      !branch ||
      !department ||
      (!singleFile && bulkFiles.length === 0)
    ) {
      alert("Please fill in all fields and select a file.");
      return;
    }

    // Update path before uploading
    const path = updatePath();
    setPath(path); // Make sure to update the state with the correct path

    setLoading(true); // Set loading state to true

    try {
      let ipfsHashes = [];

      if (singleFile) {
        // Single file upload
        console.log("Uploading single file:", singleFile.name);
        const formData = new FormData();
        formData.append("file", singleFile);
        formData.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));

        const headers = {
          "Content-Type": "multipart/form-data",
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        };

        const response = await axios.post(pinataApiUrl, formData, { headers });
        const fileHash = response.data.IpfsHash;
        ipfsHashes.push(fileHash);
        console.log("Uploaded single file hash:", fileHash);
      }

      if (bulkFiles.length > 0) {
        // Bulk file upload
        console.log("Uploading bulk files:");
        for (let i = 0; i < bulkFiles.length; i++) {
          console.log(`Uploading file ${i + 1}: ${bulkFiles[i].name}`);
          const formData = new FormData();
          formData.append("file", bulkFiles[i]);
          formData.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));

          const headers = {
            "Content-Type": "multipart/form-data",
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey,
          };

          const response = await axios.post(pinataApiUrl, formData, {
            headers,
          });
          const fileHash = response.data.IpfsHash;
          ipfsHashes.push(fileHash);
          console.log(`Uploaded bulk file ${i + 1} hash:`, fileHash);
        }
      }

      console.log("Form Data:");
      console.log("File Name:", fileNames);
      console.log("Folder Name:", folderName);
      console.log("Branch:", branch);
      console.log("Department:", department);
      console.log("Private:", isPrivate);
      console.log("Path:", path);
      console.log("files:", ipfsHashes);

      // Notify the parent component or trigger upload completion
      if (onUploadComplete) {
        onUploadComplete(ipfsHashes);
      }

      const uploadDocs = await contract.uploadFiles(
        fileNames,
        folderName,
        path,
        ipfsHashes,
        branch,
        department,
        isPrivate
      );

      await uploadDocs.wait();

      console.log("Upload to blockchain successfully");
    } catch (error) {
      console.error("Error uploading file to IPFS:", error);
      alert("Failed to upload file to IPFS.");
    } finally {
      setLoading(false); // Set loading state to false after upload completes
    }
  };

  const categories = {
    Administrative: [
      "Institutional Policies",
      "Employment Records",
      "Salary Records",
      "Annual Reports",
      "Government Correspondence",
    ],
    CSE: [
      "Curriculum_Syllabus",
      "Faculty_Records",
      "Course_Materials",
      "Lab_Records",
      "Student_Records",
      "Research_Projects",
      "Exam_Results",
    ],
    ECE: [
      "Curriculum_Syllabus",
      "Faculty_Records",
      "Course_Materials",
      "Lab_Records",
      "Student_Records",
      "Research_Projects",
      "Exam_Results",
    ],
    ME: [
      "Curriculum_Syllabus",
      "Faculty_Records",
      "Course_Materials",
      "Lab_Records",
      "Student_Records",
      "Research_Projects",
      "Exam_Results",
    ],
    CE: [
      "Curriculum_Syllabus",
      "Faculty_Records",
      "Course_Materials",
      "Lab_Records",
      "Student_Records",
      "Research_Projects",
      "Exam_Results",
    ],
    Fees_Finance: [
      "Fee_Structure",
      "Fee_Collection_Records",
      "Financial_Reports",
      "Scholarship_Records",
    ],
    Hostel: ["Allotment_Records", "Maintenance_Logs", "Fee_Records"],
    IT_Systems: [
      "Software_Licenses",
      "Network_Configuration",
      "Security_Reports",
    ],
    Events: ["Event_Approvals", "Cultural_Activities"],
  };

  return (
    <div className="max-w-2xl mx-auto p-6 border rounded-md shadow-md space-y-6">
      <h1 className="text-2xl font-bold text-center">File Upload with IPFS</h1>
      {/* Branch */}
      <div>
        <Label>Select Branch</Label>
        <Select
          onValueChange={(value) => {
            setBranch(value);
            setPath(updatePath()); // Update path on branch change
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.keys(categories).map((branch, index) => {
                return (
                  <SelectItem value={branch} key={index}>
                    {branch}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Department */}
      <div>
        <Label>Select Department</Label>
        <Select
          disabled={!branch}
          onValueChange={(value) => {
            setDepartment(value);
            setPath(updatePath()); // Update path on department change
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {categories[branch]?.map((departments, index) => (
                <SelectItem value={departments} key={index}>
                  {departments}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Folder Name */}
      <div>
        <Label htmlFor="folderName">Folder Name</Label>
        <Input
          disabled={!department}
          id="folderName"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="Enter folder name"
        />
      </div>
      <div>
        <Label htmlFor="fileName">File Name(s)</Label>
        {uploadMode === "bulk" ? (
          <Input
            id="fileName"
            value={fileNames.join(", ")} // Display file names as a comma-separated string
            readOnly
            disabled
            placeholder="Automatically Takes File Names From Uploaded Files"
          />
        ) : (
          <Input
            disabled
            id="fileName"
            value={fileNames[0] || ""} // Display the first file name for single upload
            readOnly
            placeholder="Automatically Takes File Names From Uploaded Files"
          />
        )}
      </div>

      {/* Path */}
      <div>
        <Label htmlFor="path">Path</Label>
        <Input
          id="path"
          value={path}
          disabled
          placeholder="Path auto-updates based on branch and department"
        />
      </div>

      {/* Access Type */}
      <div>
        <Label>Access Type</Label>
        <RadioGroup
          value={isPrivate ? "private" : "public"}
          onValueChange={(value) => setIsPrivate(value === "private")}
        >
          <div className="flex items-center space-x-4">
            <RadioGroupItem value="public" id="public" />
            <Label htmlFor="public">Public</Label>
            <RadioGroupItem value="private" id="private" />
            <Label htmlFor="private">Private</Label>
          </div>
        </RadioGroup>
      </div>

      {/* File Upload */}
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
            <h2 className="text-lg font-semibold">Single File Upload</h2>
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

      {/* Upload Button */}
      <Button
        onClick={handleUploadToIPFS}
        disabled={loading}
        variant="primary"
        className="w-full"
      >
        {loading ? "Uploading..." : "Upload to IPFS"}
      </Button>
    </div>
  );
};

export default FileUpload;
