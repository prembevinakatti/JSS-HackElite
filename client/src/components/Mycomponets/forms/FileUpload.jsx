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
const FileUpload = ({ onUploadComplete }) => {
  const [fileName, setFileName] = useState("");
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
    const pathSegments = [branch, department, folderName, fileName].filter(
      Boolean
    );
    return pathSegments.join("/");
  };

  useEffect(() => {
    setPath(updatePath());
  }, [branch, department, folderName, file]);

  const handleSingleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPath(updatePath()); // Ensure path updates when file changes
  };

  const handleBulkFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setBulkFiles(files);
  };

  const handleUploadToIPFS = async () => {
    if (!fileName || !folderName || !branch || !department || !file) {
      alert("Please fill in all fields and select a file.");
      return;
    }

    // Update path before uploading
    const path = updatePath();
    setPath(path); // Make sure to update the state with the correct path

    setLoading(true); // Set loading state to true

    try {
      // Create FormData to send file to Pinata
      const formData = new FormData();
      formData.append("file", file);
      formData.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));

      // Set headers with Pinata authentication keys
      const headers = {
        "Content-Type": "multipart/form-data",
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey,
      };

      // Upload file to Pinata
      const response = await axios.post(pinataApiUrl, formData, { headers });

      // Log the response from Pinata
      console.log("Pinata Response:", response.data);

      const fileHash = response.data.IpfsHash; // IPFS hash returned by Pinata

      // Log all field values after successful upload
      console.log("Uploaded File Details:");
      console.log("File Name:", fileName);
      console.log("Folder Name:", folderName);
      console.log("Branch:", branch);
      console.log("Department:", department);
      console.log("Access (Private):", isPrivate); // Updated to isPrivate
      console.log("Path:", path); // Log updated path
      console.log("File Hash:", fileHash);

      setIpfsHash(fileHash);

      // Notify the parent component or trigger upload completion
      if (onUploadComplete) {
        onUploadComplete(fileHash);
      }

      const uploadDocs = await contract.uploadFile(
        fileName,
        folderName,
        path,
        ipfsHash,
        branch,
        department,
        isPrivate
      );

      await uploadDocs.wait();
      console.log("File uploaded to blockchain :", uploadDocs);
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

      {/* Path */}
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
        <Label htmlFor="fileName">File Name</Label>
        <Input
          disabled={!folderName}
          id="fileName"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="Enter file name"
        />
      </div>

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
            <h2 className="text-lg font-medium">Single File Upload</h2>
          </CardHeader>
          <CardContent>
            <label className="flex items-center gap-2 cursor-pointer text-blue-600">
              <AiOutlineCloudUpload size={30} />
              <span>Choose File</span>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={handleSingleFileChange}
                hidden
              />
            </label>
            {singleFile && (
              <div className="mt-2 flex items-center gap-2">
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
            <h2 className="text-lg font-medium">Bulk File Upload</h2>
          </CardHeader>
          <CardContent>
            <label className="flex items-center gap-2 cursor-pointer text-blue-600">
              <AiOutlineCloudUpload size={30} />
              <span>Choose Files</span>
              <input
                type="file"
                accept=".pdf,image/*"
                multiple
                onChange={handleBulkFilesChange}
                hidden
              />
            </label>
            {bulkFiles.length > 0 && (
              <div className="mt-2">
                <h3 className="text-sm font-medium">Selected Files:</h3>
                <ul className="list-disc list-inside">
                  {bulkFiles.map((file, index) => (
                    <li key={index} className="flex items-center gap-2">
                      {file.type.includes("pdf") ? (
                        <AiOutlineFilePdf size={20} />
                      ) : (
                        <FaFileImage size={20} />
                      )}
                      <span>{file.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Separator className="my-4" />

      {/* Upload Button */}
      <Button
        variant="secondary"
        className="w-full"
        onClick={handleUploadToIPFS}
        disabled={loading} // Disable button when uploading
      >
        {loading ? "Uploading..." : "Upload to IPFS"}
      </Button>

      {/* IPFS Hash */}
      {ipfsHash && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium">File Uploaded to IPFS</h2>
          </CardHeader>
          <CardContent>
            <p>
              <strong>IPFS Hash:</strong> {ipfsHash}
            </p>
            <p>
              <a
                href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View File on IPFS
              </a>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileUpload;
