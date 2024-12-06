// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DocumentManagementSystem {
    struct Document {
        uint256 id;
        string name;
        string ipfsHash;
        string branch;
        string department;
        address uploader;
        bool approved;
        bool isPrivate;
    }

    mapping(uint256 => Document) public documents;
    uint256 public documentCount;

    event DocumentUploaded(uint256 documentId, string name, address uploader);
    event DocumentEdited(uint256 documentId, string name);
    event DocumentDeleted(uint256 documentId, address deletedBy);

    // Upload a document
    function uploadDocument(
        string memory name,
        string memory ipfsHash,
        string memory branch,
        string memory department,
        bool isPrivate
    ) external {
        documentCount++;
        documents[documentCount] = Document({
            id: documentCount,
            name: name,
            ipfsHash: ipfsHash,
            branch: branch,
            department: department,
            uploader: msg.sender,
            approved: false,
            isPrivate: isPrivate
        });
        emit DocumentUploaded(documentCount, name, msg.sender);
    }

    // Edit a document
    function editDocument(
        uint256 documentId,
        string memory name,
        string memory ipfsHash
    ) external {
        require(
            documentId > 0 && documentId <= documentCount,
            "Invalid document ID"
        );
        Document storage doc = documents[documentId];
        doc.name = name;
        doc.ipfsHash = ipfsHash;
        emit DocumentEdited(documentId, name);
    }

    // Delete a document
    function deleteDocument(uint256 documentId) external {
        require(
            documentId > 0 && documentId <= documentCount,
            "Invalid document ID"
        );
        delete documents[documentId];
        emit DocumentDeleted(documentId, msg.sender);
    }

    // Get documents by one filter
    function getDocumentsByFilter(
        string memory filterType, // "branch", "department", or "name"
        string memory filterValue // The value to filter by
    ) external view returns (Document[] memory) {
        uint256 count = 0;

        for (uint256 i = 1; i <= documentCount; i++) {
            Document memory doc = documents[i];
            if (
                (keccak256(abi.encodePacked(filterType)) ==
                    keccak256(abi.encodePacked("branch")) &&
                    keccak256(abi.encodePacked(doc.branch)) ==
                    keccak256(abi.encodePacked(filterValue))) ||
                (keccak256(abi.encodePacked(filterType)) ==
                    keccak256(abi.encodePacked("department")) &&
                    keccak256(abi.encodePacked(doc.department)) ==
                    keccak256(abi.encodePacked(filterValue))) ||
                (keccak256(abi.encodePacked(filterType)) ==
                    keccak256(abi.encodePacked("name")) &&
                    keccak256(abi.encodePacked(doc.name)) ==
                    keccak256(abi.encodePacked(filterValue)))
            ) {
                count++;
            }
        }

        Document[] memory result = new Document[](count);
        uint256 index = 0;

        for (uint256 i = 1; i <= documentCount; i++) {
            Document memory doc = documents[i];
            if (
                (keccak256(abi.encodePacked(filterType)) ==
                    keccak256(abi.encodePacked("branch")) &&
                    keccak256(abi.encodePacked(doc.branch)) ==
                    keccak256(abi.encodePacked(filterValue))) ||
                (keccak256(abi.encodePacked(filterType)) ==
                    keccak256(abi.encodePacked("department")) &&
                    keccak256(abi.encodePacked(doc.department)) ==
                    keccak256(abi.encodePacked(filterValue))) ||
                (keccak256(abi.encodePacked(filterType)) ==
                    keccak256(abi.encodePacked("name")) &&
                    keccak256(abi.encodePacked(doc.name)) ==
                    keccak256(abi.encodePacked(filterValue)))
            ) {
                result[index] = doc;
                index++;
            }
        }

        return result;
    }

    // Get a document by ID
    function getDocumentById(
        uint256 documentId
    ) external view returns (Document memory) {
        require(
            documentId > 0 && documentId <= documentCount,
            "Invalid document ID"
        );
        return documents[documentId];
    }
}
