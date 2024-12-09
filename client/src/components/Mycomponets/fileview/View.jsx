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

function View() {
  const [breadcrumbs, setBreadcrumbs] = useState(["Home"]);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null); // For dynamic branch selection

  const { branches, loading: branchesLoading, error: branchesError } = useGetAllBranches();
  const { departments, loading: departmentsLoading, error: departmentsError } =
    useGetDepartmentsByBranch(selectedBranch); // Fetch departments dynamically based on branch

  useEffect(() => {
    if (!branchesLoading && !branchesError) {
      // Initial load for the "Home" view
      setFolders(branches);
      setFiles([]);
    }
  }, [branches, branchesLoading, branchesError]);

  useEffect(() => {
    // Update folders when departments are loaded for a selected branch
    if (!departmentsLoading && selectedBranch) {
      setFolders(departments);
      setFiles([]); // No files at the branch level
    }
  }, [departments, departmentsLoading, selectedBranch]);

  async function retrieveData(folderName) {
    // Check if the clicked folder is a branch
    if (branches.includes(folderName)) {
      setSelectedBranch(folderName); // Trigger fetching departments
      return { folders: departments, files: [] }; // Use departments from the hook
    }

    // Placeholder for other folder types
    return { folders: [], files: [] };
  }

  async function updateView(folderName) {
    const data = await retrieveData(folderName);
    setFolders(data.folders);
    setFiles(data.files);
  }

  function handleFolderClick(folderName) {
    const newBreadcrumbs = [...breadcrumbs, folderName];
    setBreadcrumbs(newBreadcrumbs);
    updateView(folderName);
  }

  function handleBreadcrumbClick(index) {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);
    updateView(newBreadcrumbs[newBreadcrumbs.length - 1]);
  }

  if (branchesLoading || departmentsLoading) return <p>Loading...</p>;
  if (branchesError || departmentsError) return <p>Error: {branchesError || departmentsError}</p>;

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

        {/* Folders and Files */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {folders.map((folder, index) => (
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

          {files.map((file, index) => (
            <div
              key={index}
              className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-800 rounded-lg p-4 flex flex-col items-center hover:shadow-lg transition"
            >
              <RiFileFill size={60} className="text-blue-500 mb-2" />
              <a
                href={`#`} // Replace with actual file URL
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 font-medium truncate text-center"
              >
                {file}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default View;
