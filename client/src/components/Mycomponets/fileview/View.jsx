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
import { RiFileFill } from "react-icons/ri";
import { FaRegFileLines } from "react-icons/fa6";
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

function View() {
  const [breadcrumbs, setBreadcrumbs] = useState(["Home"]);
  const [folders, setFolders] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const handleKnowMoreClick = (file) => {
    setSelectedFile(file);
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

  function handleFolderClick(folderName) {
    if (branches.includes(folderName)) {
      setSelectedBranch(folderName);
      setSelectedDepartment(null);
      setSelectedFolder(null);
      setBreadcrumbs(["Home", folderName]);
    } else if (departments?.includes(folderName)) {
      setSelectedDepartment(folderName);
      setSelectedFolder(null);
      setBreadcrumbs(["Home", selectedBranch, folderName]);
    } else if (departmentFolders?.includes(folderName)) {
      setSelectedFolder(folderName);
      setBreadcrumbs([ "Home", selectedBranch, selectedDepartment, folderName ]);
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
    } else if (index === 1) {
      setSelectedDepartment(null);
      setSelectedFolder(null);
      setFolders(departments);
    } else if (index === 2) {
      setSelectedFolder(null);
      setFolders(departmentFolders);
    }
  }

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

  return (
    <div className="min-h-screen p-10">
      <div className="max-w-5xl mx-auto drop-shadow-2xl rounded-lg p-6 shadow-lg">
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
              <RiFolderShield2Fill size={60} className="mb-2 text-orange-500 " />
              <span className="font-medium truncate text-center">
                {folder}
              </span>
            </div>
          ))}
        </div>

        {/* Files in Selected Folder */}
        {selectedFolder && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
            {files?.map((file, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 flex flex-col items-center hover:shadow-lg transform transition duration-200 ease-in-out hover:scale-105"
              >
                <FaRegFileLines size={60} className="mb-2 text-blue-500" />
                <a
                  href={file?.path || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-medium truncate text-center"
                >
                  {file?.fileName}
                </a>
                <p className="text-xs mt-2">
                  <Button className="rounded px-3 py-1 hover:bg-blue-600 transition">
                    View file
                  </Button>
                </p>
                <p
                  className="underline ml-2 mt-3 cursor-pointer"
                  onClick={() => handleKnowMoreClick(file)}
                >
                  Know more
                </p>

                {/* Dialog for file details */}
                {selectedFile && (
                  <Dialog open={selectedFile === file} onOpenChange={() => setSelectedFile(null)}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="hidden">
                        Edit Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>File Details</DialogTitle>
                        <DialogDescription>
                          Here are the details for the file "{file?.fileName}".
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="fileName" className="text-right">
                            File Name
                          </Label>
                          <Input
                            id="fileName"
                            defaultValue={file?.fileName}
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
                            defaultValue={file?.branch}
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
                            defaultValue={file?.department}
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
                            defaultValue={file?.uploader}
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
                            defaultValue={file?.ipfsHash}
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default View;
