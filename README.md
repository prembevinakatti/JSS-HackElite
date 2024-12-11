# Blockchain-Based Document Management System

A decentralized application (DApp) designed for managing documents securely and efficiently using blockchain technology. This system ensures document integrity, secure storage, and role-based access control for heads, admins, and staff members.

---

## Features

- **Decentralized Document Storage**: Store documents securely on the blockchain to ensure immutability and transparency.
- **Role-Based Access Control**:
  - **Head**: Approve or reject document view permission.
  - **Admin**: Add, retrieve, or delete documents uploaded by them.
  - **Staff**: Request documents by branch and department if file is private.
- **User-Specific Permissions**:
  - **File Deletion**: Users can delete only the files they have uploaded.
  - **File Viewing**: Users can view files they have uploaded. If viewing files uploaded by others, a notification is sent to the file uploader.
  - **Private Files**: Private files require explicit permission from the uploader to be viewed.
- **Search Functionality**: Fetch documents using filters like name, branch, or department.
- **Smart Contract Integration**: All operations are verified and logged on the blockchain.

---

## Technologies Used

### Frontend
- **React.js**: For building a responsive user interface.
- **Tailwind CSS**: For styling components.
- **ShadCN**: For enhanced UI components.

### Backend
- **Node.js** with **Express**: For API endpoints.

### Blockchain
- **Solidity**: Smart contract programming.
- **Ethereum**: Blockchain platform.
- **Ethers.js**: For blockchain interactions.
- **Remix IDE**: Smart contract development.

### Storage
- **IPFS (InterPlanetary File System)**: For decentralized file storage.

---

## Installation

### Prerequisites
Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Metamask](https://metamask.io/) browser extension for Ethereum wallet integration
- [IPFS CLI](https://docs.ipfs.io/install/) (optional for running a local IPFS node)

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/prembevinakatti/JSS-HackElite.git
   ```

2. **Compile and Deploy the Smart Contract**
   ```bash
   cd blockchain
   npm install
   npx hardhat compile
   npx hardhat run scripts/deploy.js
   npx hardhat run --network linea scripts/deploy.js
   ```

3. **Start Frontend Server**
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Start The Backend Server**
   ```bash
   cd server
   npm install
   npm run dev
   ```

---

## Smart Contract

### Deployment

1. Open [Remix IDE](https://remix.ethereum.org/).
2. Paste the smart contract code into a new file.
3. Compile the contract using the Solidity compiler.
4. Deploy the contract on your preferred Ethereum network (e.g., Rinkeby, Goerli).
5. Copy the deployed contract address and update the `.env` file.

---

## Usage

1. **Login with Metamask**:
   - Ensure you are connected to the same Ethereum network as the deployed contract.

2. **Head Actions**:
   - Approve or reject document view permission.

3. **Admin Actions**:
   - Add, retrieve, or delete documents uploaded by them.

4. **Staff Actions**:
   - Request documents based on branch and department if file is private .

5. **File Permissions**:
   - Delete only files uploaded by the user.
   - View own files without restrictions.
   - View files uploaded by others with notification sent to the uploader.
   - Request permission for viewing private files uploaded by others.

---

## Contact

For inquiries or support, contact:

- **Team Name**: Born2Code
- **Email**: onkarbevinakatti09@gmail.com
- **GitHub**: [PremBevinakatti](https://github.com/prembevinakatti)
