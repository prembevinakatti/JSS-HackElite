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
      // Check if current[folder] exists
      if (!current[folder]) {
        // Create an object if it's a folder, or an array if it's the last level
        current[folder] = index === path.length - 1 ? [] : {};
      }
      current = current[folder]; // Move deeper into the structure
    });

    // At the final level, add the file
    if (Array.isArray(current)) {
      current.push({ fileName, url });
    }
  });
  return tree;
};

const ShowFiles = () => {
  const fileTree = buildTree(fileData);
  const [currentFolder, setCurrentFolder] = useState(fileTree);
  const [path, setPath] = useState([]); // To track the current navigation path

  // Handle folder click
  const openFolder = (folderName) => {
    setPath([...path, folderName]);
    setCurrentFolder(currentFolder[folderName]);
  };

  // Handle going back to the previous folder
  const goBack = () => {
    const newPath = [...path];
    newPath.pop();
    setPath(newPath);

    // Navigate to the parent folder
    let newFolder = fileTree;
    newPath.forEach((folder) => {
      newFolder = newFolder[folder];
    });
    setCurrentFolder(newFolder);
  };

  return (
    <div>
      <h1>File Explorer</h1>

      {/* Display Current Path */}
      <div style={{ marginBottom: "10px" }}>
        <strong>Current Path:</strong>{" "}
        {path.length > 0 ? path.join(" > ") : "Root"}
      </div>

      {/* Back Button */}
      {path.length > 0 && (
        <button onClick={goBack} style={{ marginBottom: "10px" }}>
          Go Back
        </button>
      )}

      {/* Display Folders and Files */}
      <ul>
        {Object.keys(currentFolder).map((key) =>
          Array.isArray(currentFolder[key]) ? (
            // Display files
            currentFolder[key].map((file) => (
              <li key={file.fileName}>
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  {file.fileName}
                </a>
              </li>
            ))
          ) : (
            // Display folders
            <li
              key={key}
              onClick={() => openFolder(key)}
              style={{ cursor: "pointer", color: "blue" }}
            >
              📁 {key}
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default ShowFiles;
