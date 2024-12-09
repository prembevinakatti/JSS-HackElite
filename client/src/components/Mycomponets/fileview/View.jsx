import React, { useState, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { RiFolderShield2Fill, RiFileFill } from "react-icons/ri";
import useGetAllBranches from "@/hooks/useGetAllBranchs";
import useGetDepartmentsByBranch from "@/hooks/useGetDepartmentsByBranch";
import useGetFoldersByDepartment from "@/hooks/useGetFoldersByDepartment";
import useGetFilesByFolder from "@/hooks/useGetFilesByFolder";

function View() {
  const [breadcrumbs, setBreadcrumbs] = useState(["Home"]);
  const [folders, setFolders] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);

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
      setBreadcrumbs([
        "Home",
        selectedBranch,
        selectedDepartment,
        folderName,
      ]);
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
          <BreadcrumbList className="flex flex-wrap text-gray-700 dark:text-gray-300 mb-6">
            {breadcrumbs.map((crumb, index) => (
              <BreadcrumbItem key={index}>
                <BreadcrumbLink
                  onClick={() => handleBreadcrumbClick(index)}
                  className={`cursor-pointer ${
                    index === breadcrumbs.length - 1
                      ? "text-gray-900 dark:text-gray-100 font-semibold"
                      : "hover:text-blue-500 dark:hover:text-blue-400"
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
              className="cursor-pointer bg-gray-100 dark:bg-gray-800 border border-gray-800 dark:border-gray-800 rounded-lg p-4 flex flex-col items-center hover:shadow-lg transition"
            >
              <RiFolderShield2Fill size={60} className="text-yellow-500 mb-2" />
              <span className="text-gray-800 dark:text-gray-200 font-medium truncate text-center">
                {folder}
              </span>
            </div>
          ))}
        </div>

        {/* Files in Selected Folder */}
        {selectedFolder && (
          <div className="mt-6">
            <h2 className="text-xl font-bold">Files in {selectedFolder}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
              {files?.map((file, index) => (
                <div
                  key={index}
                  className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-800 rounded-lg p-4 flex flex-col items-center hover:shadow-lg transition"
                >
                  <RiFileFill size={60} className="text-blue-500 mb-2" />
                  <a
                    href={file?.path || "#"} // Replace with actual file URL
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 font-medium truncate text-center"
                  >
                    {file?.fileName}
                  </a>
                  <p className="text-gray-600 dark:text-gray-400 text-xs mt-2">
                    Uploaded by: {file?.uploader}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default View;
