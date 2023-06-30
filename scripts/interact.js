const { ethers } = require("ethers");
 // Connect to the local Hardhat network
 const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
  
 // Set up the signer (account) with a balance on the local network
 const privateKey = "SIGNER_PRIVATE_KEY"; // Replace with a private key from a local account
 const signer = new ethers.Wallet(privateKey, provider);
 
 // Set up the contract instance
 const contractAddress = "CONTRACT_ADDRESS"; // Replace with the address of the deployed contract
 const contractABI = [
   {
       "inputs": [],
       "stateMutability": "nonpayable",
       "type": "constructor"
   },
   {
       "inputs": [
           {
               "internalType": "uint256",
               "name": "daiAmount",
               "type": "uint256"
           }
       ],
       "name": "convertEthToDai",
       "outputs": [],
       "stateMutability": "payable",
       "type": "function"
   },
   {
       "inputs": [
           {
               "internalType": "uint256",
               "name": "daiAmount",
               "type": "uint256"
           }
       ],
       "name": "getEstimatedETHforDAI",
       "outputs": [
           {
               "internalType": "uint256[]",
               "name": "",
               "type": "uint256[]"
           }
       ],
       "stateMutability": "view",
       "type": "function"
   },
   {
       "inputs": [],
       "name": "uniswapRouter",
       "outputs": [
           {
               "internalType": "contract IUniswapV2Router02",
               "name": "",
               "type": "address"
           }
       ],
       "stateMutability": "view",
       "type": "function"
   },
   {
       "stateMutability": "payable",
       "type": "receive"
   }
   ];
 const contract = new ethers.Contract(contractAddress, contractABI, signer);
 
 // Interact with the contract
async function interactWithContract() {
  // Interact with the contract
  const result = await contract.getEstimatedETHforDAI(500);
  console.log("Estimated ETH amount:", result[0].toString());
};

async function sendTransactionToContract() {
    const daiAmount = 112; // Set the desired DAI amount
  
    // Specify the transaction parameters
    const overrides = {
      value: ethers.parseEther("1"), // Set the amount of ETH to send
    };
  
    // Send the transaction
    const tx = await contract.convertEthToDai(daiAmount, overrides);
  
    // Wait for the transaction to be mined
    await tx.wait();
    console.log(tx);
    console.log("Transaction complete");
  };
  
interactWithContract();
sendTransactionToContract();

