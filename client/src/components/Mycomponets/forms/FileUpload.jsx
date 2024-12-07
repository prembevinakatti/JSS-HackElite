import React, { useState } from "react";
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

  const { state } = useContract();
  const contract = state.contract;
  console.log("contract", contract);

  // Pinata API endpoint and authentication
  const pinataApiUrl = "https://api.pinata.cloud/pinning/pinFileToIPFS";
  const pinataApiKey = import.meta.env.VITE_PINATA_API_KEY; // Store your Pinata API key in .env
  const pinataSecretApiKey = import.meta.env.VITE_PINATA_SECRET_API_KEY; // Store the secret API key in .env

  // Update path based on branch and department
  const updatePath = () => {
    if (branch && department) {
      return `${branch}/${department}`;
    }
    return "";
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
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

  return (
    <div className="max-w-2xl mx-auto p-6 border rounded-md shadow-md space-y-6">
      <h1 className="text-2xl font-bold text-center">File Upload with IPFS</h1>

      {/* File Name */}
      <div>
        <Label htmlFor="fileName">File Name</Label>
        <Input
          id="fileName"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="Enter file name"
        />
      </div>

      {/* Folder Name */}
      <div>
        <Label htmlFor="folderName">Folder Name</Label>
        <Input
          id="folderName"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="Enter folder name"
        />
      </div>

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
              <SelectItem value="CSE">CSE</SelectItem>
              <SelectItem value="ECE">ECE</SelectItem>
              <SelectItem value="ME">ME</SelectItem>
              <SelectItem value="CE">CE</SelectItem>
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
              <SelectItem value="test">Test</SelectItem>
              <SelectItem value="research">Research</SelectItem>
              <SelectItem value="administration">Administration</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
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
      <div>
        <Label htmlFor="file">Upload File</Label>
        <Input id="file" type="file" onChange={handleFileChange} />
      </div>

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
