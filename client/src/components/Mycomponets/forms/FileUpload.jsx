import React, { useState } from "react";
import { AiOutlineFilePdf, AiOutlineCloudUpload } from "react-icons/ai";
import { FaFileImage } from "react-icons/fa";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FileUpload = () => {
  const [uploadMode, setUploadMode] = useState("single"); // 'single' or 'bulk'
  const [singleFile, setSingleFile] = useState(null);
  const [bulkFiles, setBulkFiles] = useState([]);
  const [storagePath, setStoragePath] = useState("");
  const [branch, setBranch] = useState("");
  const [department, setDepartment] = useState("");
  const [folderStructure, setFolderStructure] = useState({});
  const [fileMode, setFileMode] = useState("create");
  const [folderName, setFolderName] = useState("");
  const [existingFolderPath, setExistingFolderPath] = useState("");

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

  const handleSingleFileChange = (e) => {
    setSingleFile(e.target.files[0]);
  };

  const handleBulkFilesChange = (e) => {
    setBulkFiles(Array.from(e.target.files));
  };

  const updateStoragePath = () => {
    if (fileMode === "create") {
      const path = `${branch}/${department}${
        folderName ? `/${folderName}` : ""
      }`;
      setStoragePath(path);
    } else if (fileMode === "update") {
      setStoragePath(existingFolderPath);
    }
  };

  const handleUpload = () => {
    if (!storagePath) {
      alert("Please specify a storage path.");
      return;
    }

    if (fileMode === "create") {
      const pathSegments = storagePath.split("/");
      let current = folderStructure;

      pathSegments.forEach((segment, index) => {
        if (!current[segment]) {
          current[segment] = index === pathSegments.length - 1 ? [] : {};
        }
        current = current[segment];
      });

      if (uploadMode === "single" && singleFile) {
        current.push(singleFile.name);
      } else if (uploadMode === "bulk" && bulkFiles.length) {
        bulkFiles.forEach((file) => current.push(file.name));
      }

      alert(`Folder and files added successfully to: ${storagePath}`);
    } else if (fileMode === "update") {
      const pathSegments = existingFolderPath.split("/");
      let current = folderStructure;

      pathSegments.forEach((segment) => {
        if (current[segment]) {
          current = current[segment];
        } else {
          alert("Invalid folder path!");
          return;
        }
      });

      if (uploadMode === "single" && singleFile) {
        current.push(singleFile.name);
      } else if (uploadMode === "bulk" && bulkFiles.length) {
        bulkFiles.forEach((file) => current.push(file.name));
      }

      alert(`Files uploaded successfully to: ${existingFolderPath}`);
    }

    console.log("Updated Folder Structure:", folderStructure);
    setSingleFile(null);
    setBulkFiles([]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 border rounded-md shadow-md space-y-6">
      <h1 className="text-2xl font-bold text-center">File Upload</h1>

      {/* Storage Path */}
      <div>
        <Label htmlFor="storagePath">Storage Path:</Label>
        <Input
          id="storagePath"
          value={storagePath}
          placeholder="Select branch, department, and folder"
          disabled
        />
      </div>

      <Separator className="my-4" />

      {/* Branch Selection */}
      <div>
        <Label>Select the Branch</Label>
        <Select
          onValueChange={(value) => {
            setBranch(value);
            setDepartment("");
            setFolderName("");
            setExistingFolderPath("");
            setStoragePath("");
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.keys(categories).map((key, index) => (
                <SelectItem key={index} value={key}>
                  {key}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Department Selection */}
      <div>
        <Label>Select the Department</Label>
        <Select
          disabled={!branch}
          onValueChange={(value) => {
            setDepartment(value);
            updateStoragePath();
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {categories[branch]?.map((dep, index) => (
                <SelectItem key={index} value={dep}>
                  {dep}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Separator className="my-4" />

      {/* File Mode */}
      <div>
        <div className="mb-4 flex justify-center gap-4">
          <Button
            variant={fileMode === "create" ? "secondary" : "primary"}
            onClick={() => setFileMode("create")}
          >
            Create Folder
          </Button>
          <Button
            variant={fileMode === "update" ? "secondary" : "primary"}
            onClick={() => setFileMode("update")}
          >
            Add to Existing Folder
          </Button>
        </div>

        {fileMode === "create" && (
          <div>
            <Label>Enter Folder Name</Label>
            <Input
              type="text"
              value={folderName}
              onChange={(e) => {
                setFolderName(e.target.value);
                updateStoragePath();
              }}
              placeholder="Enter folder name"
            />
          </div>
        )}

        {fileMode === "update" && (
          <div>
            <Label>Enter Existing Folder Path</Label>
            <Input
              type="text"
              value={existingFolderPath}
              onChange={(e) => {
                setExistingFolderPath(e.target.value);
                updateStoragePath();
              }}
              placeholder="Enter folder path"
            />
          </div>
        )}
      </div>

      <Separator className="my-4" />

      {/* Upload Mode */}
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

      {/* File Upload */}
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
                <ul>
                  {bulkFiles.map((file, index) => (
                    <li key={index} className="flex items-center gap-2">
                      {file.type.includes("pdf") ? (
                        <AiOutlineFilePdf size={25} />
                      ) : (
                        <FaFileImage size={25} />
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

      <Button variant="secondary" className="w-full" onClick={handleUpload}>
        Upload Files
      </Button>
    </div>
  );
};

export default FileUpload;
