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

    /// @notice Function to upload a file
    /// @param _fileName The name of the file
    /// @param _folderName The name of the folder
    /// @param _path The path where the file is stored
    /// @param _ipfsHash The IPFS hash of the file
    /// @param _branch The branch of the department
    /// @param _department The department name
    /// @param _isPrivate Boolean indicating if the file is private
    function uploadFile(
        string memory _fileName,
        string memory _folderName, // Add folderName parameter
        string memory _path,
        string memory _ipfsHash,
        string memory _branch,
        string memory _department,
        bool _isPrivate
    ) external {
        // Increment file count to assign a unique ID
        fileCount++;

        // Create a new File object with the folderName included
        files[fileCount] = File({
            id: fileCount,
            fileName: _fileName,
            folderName: _folderName, // Store folder name
            path: _path,
            ipfsHash: _ipfsHash,
            branch: _branch,
            department: _department,
            uploader: msg.sender,
            isPrivate: _isPrivate
        });

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

        // Emit an event to log the file upload with folderName
        emit FileUploaded(
            fileCount,
            _fileName,
            _folderName, // Include folderName in the event
            _path,
            _ipfsHash,
            _branch,
            _department,
            msg.sender,
            _isPrivate
        );
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

    /// @notice Get all branches under all paths
    /// @return allBranches An array of all branch names
    function getAllBranches() external view returns (string[] memory) {
        uint256 totalBranches = 0;

        // Count the total number of branches across all paths
        for (uint256 i = 0; i < allPaths.length; i++) {
            totalBranches += branchesByPath[allPaths[i]].departments.length;
        }

        // Create an array to hold all branches
        string[] memory allBranches = new string[](totalBranches);
        uint256 index = 0;

        // Populate the array with branch names
        for (uint256 i = 0; i < allPaths.length; i++) {
            for (uint256 j = 0; j < branchesByPath[allPaths[i]].departments.length; j++) {
                allBranches[index] = branchesByPath[allPaths[i]].name;
                index++;
            }
        }

        return allBranches;
    }

    /// @notice Get departments by a specific branch under a given path
    /// @param _path The path where the branch exists
    /// @param _branch The branch name to fetch departments for
    /// @return departments An array of departments under the given branch
    function getDepartmentsByBranch(string memory _path, string memory _branch) external view returns (string[] memory departments) {
        require(keccak256(bytes(branchesByPath[_path].name)) == keccak256(bytes(_branch)), "Branch does not exist");

        departments = branchesByPath[_path].departments;
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

    /// @notice Get files by department under a given path and branch
    /// @param _path The path where the files are stored
    /// @param _branch The branch name where the department exists
    /// @param _department The department name to fetch files for
    /// @return fileDetails An array of files stored under the given department
    function getFilesByDepartment(
        string memory _path,
        string memory _branch,
        string memory _department
    ) external view returns (File[] memory fileDetails) {
        uint256 fileCountAtDepartment = 0;

        // First, count the number of files under the given path, branch, and department
        for (uint256 i = 1; i <= fileCount; i++) {
            if (
                keccak256(bytes(files[i].path)) == keccak256(bytes(_path)) &&
                keccak256(bytes(files[i].branch)) == keccak256(bytes(_branch)) &&
                keccak256(bytes(files[i].department)) == keccak256(bytes(_department))
            ) {
                fileCountAtDepartment++;
            }
        }

        // Create an array to hold the file details
        fileDetails = new File[](fileCountAtDepartment);
        uint256 index = 0;

        // Populate the array with files under the given path, branch, and department
        for (uint256 i = 1; i <= fileCount; i++) {
            if (
                keccak256(bytes(files[i].path)) == keccak256(bytes(_path)) &&
                keccak256(bytes(files[i].branch)) == keccak256(bytes(_branch)) &&
                keccak256(bytes(files[i].department)) == keccak256(bytes(_department))
            ) {
                fileDetails[index] = files[i];
                index++;
            }
        }
    }
}
