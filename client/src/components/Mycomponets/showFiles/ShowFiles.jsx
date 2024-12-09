import useGetFoldersByDepartment from "@/hooks/useGetFoldersByDepartment";
import React, { useState } from "react";

// Sample file metadata
const fileData = [
  {
    fileName: "test_user.pdf",
    path: ["cse", "faculty_records", "test_user"],
    url: "https://example.com/test_user.pdf",
  },
  {
    fileName: "faculty_guidelines.docx",
    path: ["cse", "faculty_records"],
    url: "https://example.com/faculty_guidelines.docx",
  },
  {
    fileName: "exam_syllabus.docx",
    path: ["cse", "syllabus"],
    url: "https://example.com/exam_syllabus.docx",
  },
  {
    fileName: "project_details.txt",
    path: ["ece", "projects"],
    url: "https://example.com/project_details.txt",
  },
];

// Helper function to build a tree structure
const buildTree = (data) => {
  const tree = {};
  data.forEach(({ path, fileName, url }) => {
    let current = tree;
    path.forEach((folder, index) => {
      if (!current[folder]) {
        current[folder] = index === path.length - 1 ? [] : {};
      }
      current = current[folder];
    });
    if (Array.isArray(current)) {
      current.push({ fileName, url });
    }
  });
  return tree;
};

const ShowFiles = () => {
  const fileTree = buildTree(fileData);
  const [currentFolder, setCurrentFolder] = useState(fileTree);
  const [path, setPath] = useState([]);

  // const departments = getDepartmentsByBranch("CSE");
  const branchName = "CSE";
  const department = "Faculty_Records";
  const folders = useGetFoldersByDepartment(branchName, department);
  console.log("folders", folders);


  // Open folder
  const openFolder = (folderName) => {
    setPath([...path, folderName]);
    setCurrentFolder(currentFolder[folderName]);
  };

  // Go back to previous folder
  const goBack = () => {
    const newPath = [...path];
    newPath.pop();
    setPath(newPath);

    let newFolder = fileTree;
    newPath.forEach((folder) => {
      newFolder = newFolder[folder];
    });
    setCurrentFolder(newFolder);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-700 mb-4">
          File Explorer
        </h1>

        {/* Display Current Path */}
        <div className="text-gray-500 mb-6">
          <span className="font-semibold">Current Path:</span>{" "}
          {path.length > 0 ? path.join(" / ") : "Root"}
        </div>

        {/* Back Button */}
        {path.length > 0 && (
          <button
            onClick={goBack}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Go Back
          </button>
        )}

        {/* Folder and File List */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.keys(currentFolder).map((key) =>
            Array.isArray(currentFolder[key]) ? (
              // Display files
              currentFolder[key].map((file) => (
                <div
                  key={file.fileName}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col items-center hover:shadow-lg transition"
                >
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 font-medium truncate"
                  >
                    📄 {file.fileName}
                  </a>
                </div>
              ))
            ) : (
              // Display folders
              <div
                key={key}
                onClick={() => openFolder(key)}
                className="cursor-pointer bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col items-center hover:shadow-lg transition"
              >
                <span className="text-gray-700 font-medium">📁 {key}</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowFiles;
