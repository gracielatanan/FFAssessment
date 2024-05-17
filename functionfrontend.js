const contractAddress = '0xb95d75c1f6E138025afF59478c8B5D8a7f3A6312'; 
const contractAbi = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "buyClothing",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "ClothingListed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			}
		],
		"name": "ClothingPurchased",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			}
		],
		"name": "listClothing",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "clothes",
		"outputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isAvailable",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

let contractInstance; 

async function initContract() {
    console.log('Initializing contract...');
    try {
        
        if (window.ethereum) {
            
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            
            contractInstance = new ethers.Contract(contractAddress, contractAbi, provider.getSigner());
            console.log('Contract initialized successfully.');
        } else {
            console.error('MetaMask not detected. Please install MetaMask extension.');
        }
    } catch (error) {
        console.error('Error initializing contract:', error);
    }
}



async function listClothing() {
    if (!contractInstance) {
        console.error('contractInstance is not defined. Please ensure it is properly initialized.');
        return;
    }

    const name = document.getElementById('name').value;
    const price = ethers.utils.parseEther(document.getElementById('price').value); 

    try {
        const tx = await contractInstance.listClothing(name, price);
        const receipt = await tx.wait();
        const event = receipt.events.find(event => event.event === 'ClothingListed'); 
        if (event) {
            const id = event.args.id.toNumber(); 
            const listedPrice = ethers.utils.formatEther(event.args.price); 
            document.getElementById('output').innerText = `Clothes listed successfully! ID: ${id}, Type of Clothes: ${name} Price: ${listedPrice} Ether`;
        } else {
            console.error('ClothingListed event not found in receipt.');
        }
    } catch (error) {
        console.error('Error listing clothes:', error);
    }
}

async function buyClothing() {
    
    if (!contractInstance) {
        console.error('contractInstance is not defined. Please ensure it is properly initialized.');
        return;
    }

    const id = document.getElementById('buyId').value;
    const price = ethers.utils.parseEther(document.getElementById('price').value);

    try {
        const tx = await contractInstance.buyClothing(id, { value: price });
        await tx.wait();
        document.getElementById('output').innerText = `Clothes purchased successfully!`;
    } catch (error) {
        console.error('Error buying clothes:', error);
    }
}

// Add event listener for page load
window.addEventListener('load', async () => {
    if (window.ethereum) {
        // MetaMask or other Ethereum-compatible browser extension detected
        window.web3 = new Web3(window.ethereum);
        try {
            // Request account access if needed
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('MetaMask or Ethereum-compatible browser extension detected.');
            // Once MetaMask is connected, initialize the contract
            await initContract();
        } catch (error) {
            // User denied account access...
            console.error("User denied account access or an error occurred while trying to connect to MetaMask.");
        }
    } else if (window.web3) {
        // Legacy dapp browsers detected (e.g., Mist/Meteor)
        window.web3 = new Web3(window.web3.currentProvider);
        console.log('Legacy dapp browser detected.');
        // Initialize the contract
        await initContract();
    } else {
        // Non-Ethereum browser detected
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask or another Ethereum-compatible browser extension!');
    }
});
