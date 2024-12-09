// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DocumentManagementSystem {
    // Structure to represent a file
    struct File {
        uint256 id; // Unique file ID
        string fileName; // Name of the file
        string folderName; // Name of the folder where the file is stored
        string path; // Path where the file is stored
        string ipfsHash; // IPFS hash of the file
        string branch; // Branch of the department
        string department; // Department name
        address uploader; // Address of the uploader
        bool isPrivate; // Visibility of the file (true for private)
    }

    // Structure to represent a branch
    struct Branch {
        string name;
        string[] departments;
    }

    // Mapping to store files by their unique IDs
    mapping(uint256 => File) public files;

    // Mapping to store branches by path
    mapping(string => Branch) public branchesByPath;

    // Array to store all paths
    string[] public allPaths;

    // Counter for file IDs
    uint256 public fileCount;

    // Events
    event FileUploaded(
        uint256 id,
        string fileName,
        string folderName, // Add folderName to event
        string path,
        string ipfsHash,
        string branch,
        string department,
        address uploader,
        bool isPrivate
    );

    event BranchAdded(string path, string branch);

    /// @notice Function to upload multiple files
/// @param _fileNames Array of file names to upload
/// @param _folderName The name of the folder
/// @param _path The path where the files are stored
/// @param _ipfsHashes Array of IPFS hashes for the files
/// @param _branch The branch of the department
/// @param _department The department name
/// @param _isPrivate Boolean indicating if the files are private
function uploadFiles(
    string[] memory _fileNames,
    string memory _folderName,
    string memory _path,
    string[] memory _ipfsHashes,
    string memory _branch,
    string memory _department,
    bool _isPrivate
) external {
    require(
        _fileNames.length == _ipfsHashes.length,
        "File names and IPFS hashes arrays must have the same length"
    );

    for (uint256 i = 0; i < _fileNames.length; i++) {
        // Increment file count to assign a unique ID
        fileCount++;

        // Create a new File object
        files[fileCount] = File({
            id: fileCount,
            fileName: _fileNames[i],
            folderName: _folderName,
            path: _path,
            ipfsHash: _ipfsHashes[i],
            branch: _branch,
            department: _department,
            uploader: msg.sender,
            isPrivate: _isPrivate
        });

        // Emit an event to log each file upload
        emit FileUploaded(
            fileCount,
            _fileNames[i],
            _folderName,
            _path,
            _ipfsHashes[i],
            _branch,
            _department,
            msg.sender,
            _isPrivate
        );
    }

    // Add path to allPaths if it doesn't exist
    bool pathExists = false;
    for (uint256 i = 0; i < allPaths.length; i++) {
        if (keccak256(bytes(allPaths[i])) == keccak256(bytes(_path))) {
            pathExists = true;
            break;
        }
    }

    if (!pathExists) {
        allPaths.push(_path);
    }

    // Add branch if not already added
    if (branchesByPath[_path].departments.length == 0 || !_branchExists(_path, _branch)) {
        branchesByPath[_path].name = _branch;
        branchesByPath[_path].departments.push(_department);
        emit BranchAdded(_path, _branch);
    }
}


    /// @notice Check if a branch exists under a specific path
    /// @param _path The path
    /// @param _branch The branch name
    /// @return bool indicating if the branch exists
    function _branchExists(string memory _path, string memory _branch) internal view returns (bool) {
        for (uint256 i = 0; i < branchesByPath[_path].departments.length; i++) {
            if (keccak256(bytes(branchesByPath[_path].name)) == keccak256(bytes(_branch))) {
                return true;
            }
        }
        return false;
    }

    /// @notice Get all unique branches under all paths
/// @return uniqueBranches An array of all unique branch names
function getAllBranches() external view returns (string[] memory) {
    // Temporarily store branch names to check uniqueness
    string[] memory tempBranches = new string[](allPaths.length);
    uint256 branchCount = 0;

    for (uint256 i = 0; i < allPaths.length; i++) {
        string memory branchName = branchesByPath[allPaths[i]].name;

        // Check if the branch is already added
        bool branchExists = false;
        for (uint256 j = 0; j < branchCount; j++) {
            if (keccak256(bytes(tempBranches[j])) == keccak256(bytes(branchName))) {
                branchExists = true;
                break;
            }
        }

        // If the branch does not exist, add it to the array
        if (!branchExists) {
            tempBranches[branchCount] = branchName;
            branchCount++;
        }
    }

    // Create a new array with the exact size of unique branches
    string[] memory uniqueBranches = new string[](branchCount);
    for (uint256 i = 0; i < branchCount; i++) {
        uniqueBranches[i] = tempBranches[i];
    }

    return uniqueBranches;
}

/// @notice Delete a file by its ID
/// @param _fileId The ID of the file to delete
function deleteFile(uint256 _fileId) external {
    // Ensure the file exists
    require(files[_fileId].id != 0, "File does not exist");

    // Ensure the caller is the uploader of the file
    require(
        files[_fileId].uploader == msg.sender,
        "Only the uploader can delete this file"
    );

    // Delete the file
    delete files[_fileId];

    emit FileUploaded(_fileId, "", "", "", "", "", "", address(0), false);
}



   /// @notice Get all departments by a specific branch across all paths
/// @param _branch The branch name to fetch departments for
/// @return departments An array of unique departments under the given branch
function getDepartmentsByBranch(string memory _branch) external view returns (string[] memory departments) {
    // Temporarily store department names to ensure uniqueness
    string[] memory tempDepartments = new string[](fileCount);
    uint256 departmentCount = 0;

    // Iterate through all paths to find the given branch and its departments
    for (uint256 i = 0; i < allPaths.length; i++) {
        string memory currentBranch = branchesByPath[allPaths[i]].name;

        if (keccak256(bytes(currentBranch)) == keccak256(bytes(_branch))) {
            // Get departments for this branch under the current path
            string[] memory branchDepartments = branchesByPath[allPaths[i]].departments;

            // Add departments to the temp array if not already added
            for (uint256 j = 0; j < branchDepartments.length; j++) {
                bool departmentExists = false;
                for (uint256 k = 0; k < departmentCount; k++) {
                    if (keccak256(bytes(tempDepartments[k])) == keccak256(bytes(branchDepartments[j]))) {
                        departmentExists = true;
                        break;
                    }
                }

                if (!departmentExists) {
                    tempDepartments[departmentCount] = branchDepartments[j];
                    departmentCount++;
                }
            }
        }
    }

    // Create an array with the exact size of unique departments
    departments = new string[](departmentCount);
    for (uint256 i = 0; i < departmentCount; i++) {
        departments[i] = tempDepartments[i];
    }

    return departments;
}


    /// @notice Get files by a specific path
    /// @param _path The path where the files are stored
    /// @return fileDetails An array of files stored under the given path
    function getFilesByPath(string memory _path) external view returns (File[] memory fileDetails) {
        uint256 fileCountAtPath = 0;

        // First, count the number of files under the given path
        for (uint256 i = 1; i <= fileCount; i++) {
            if (keccak256(bytes(files[i].path)) == keccak256(bytes(_path))) {
                fileCountAtPath++;
            }
        }

        // Create an array to hold the file details
        fileDetails = new File[](fileCountAtPath);
        uint256 index = 0;

        // Populate the array with files under the given path
        for (uint256 i = 1; i <= fileCount; i++) {
            if (keccak256(bytes(files[i].path)) == keccak256(bytes(_path))) {
                fileDetails[index] = files[i];
                index++;
            }
        }
    }

/// @notice Get files by department and folder under a given branch across all paths
/// @param _branch The branch name where the department exists
/// @param _department The department name to fetch files for
/// @param _folderName The folder name to filter files within the department
/// @return fileDetails An array of files stored under the given department and folder
function getFilesByFolder(
    string memory _branch,
    string memory _department,
    string memory _folderName
) external view returns (File[] memory fileDetails) {
    uint256 fileCountAtFolder = 0;

    // First, count the number of files under the given branch, department, and folder
    for (uint256 i = 1; i <= fileCount; i++) {
        if (
            keccak256(bytes(files[i].branch)) == keccak256(bytes(_branch)) &&
            keccak256(bytes(files[i].department)) == keccak256(bytes(_department)) &&
            keccak256(bytes(files[i].folderName)) == keccak256(bytes(_folderName))
        ) {
            fileCountAtFolder++;
        }
    }

    // Create an array to hold the file details
    fileDetails = new File[](fileCountAtFolder);
    uint256 index = 0;

    // Populate the array with files under the given branch, department, and folder
    for (uint256 i = 1; i <= fileCount; i++) {
        if (
            keccak256(bytes(files[i].branch)) == keccak256(bytes(_branch)) &&
            keccak256(bytes(files[i].department)) == keccak256(bytes(_department)) &&
            keccak256(bytes(files[i].folderName)) == keccak256(bytes(_folderName))
        ) {
            fileDetails[index] = files[i];
            index++;
        }
    }

    return fileDetails;
}


/// @notice Get all folders by department under a specific branch
/// @param _branch The branch name
/// @param _department The department name
/// @return folders An array of folder names under the given department
function getFoldersByDepartment(
    string memory _branch,
    string memory _department
) external view returns (string[] memory folders) {
    // Temporarily store folder names to check uniqueness
    string[] memory tempFolders = new string[](fileCount);
    uint256 folderCount = 0;

    // Loop through all files and check if they match the specified branch and department
    for (uint256 i = 1; i <= fileCount; i++) {
        if (
            keccak256(bytes(files[i].branch)) == keccak256(bytes(_branch)) &&
            keccak256(bytes(files[i].department)) == keccak256(bytes(_department))
        ) {
            // Check if the folder is already added
            bool folderExists = false;
            for (uint256 j = 0; j < folderCount; j++) {
                if (keccak256(bytes(tempFolders[j])) == keccak256(bytes(files[i].folderName))) {
                    folderExists = true;
                    break;
                }
            }

            // If the folder does not exist, add it to the array
            if (!folderExists) {
                tempFolders[folderCount] = files[i].folderName;
                folderCount++;
            }
        }
    }

    // Create a new array with the exact size of unique folders
    folders = new string[](folderCount);
    for (uint256 i = 0; i < folderCount; i++) {
        folders[i] = tempFolders[i];
    }

    return folders;
}


}
