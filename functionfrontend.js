window.addEventListener('load', async () => {
    if (window.ethereum) {
        // MetaMask or other Ethereum-compatible browser extension detected
        window.web3 = new Web3(window.ethereum);
        try {
            // Request account access if needed
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('MetaMask or Ethereum-compatible browser extension detected.');
            // Once MetaMask is connected, initialize the contract
            initContract();
        } catch (error) {
            // User denied account access...
            console.error("User denied account access or an error occurred while trying to connect to MetaMask.");
        }
    } else if (window.web3) {
        // Legacy dapp browsers detected (e.g., Mist/Meteor)
        window.web3 = new Web3(window.web3.currentProvider);
        console.log('Legacy dapp browser detected.');
        // Initialize the contract
        initContract();
    } else {
        // Non-Ethereum browser detected
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask or another Ethereum-compatible browser extension!');
    }
});

const contractAddress = '0xe2d27891a79de5c29f784881078acd6f53ad0c6c'; 
const contractABI =[
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newValue",
				"type": "uint256"
			}
		],
		"name": "ValueChanged",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "getValue",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_newValue",
				"type": "uint256"
			}
		],
		"name": "setValue",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "value",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

function initContract() {
    console.log('Contract ABI:', contractABI);
    console.log('Contract Address:', contractAddress);

    const simpleContract = new window.web3.eth.Contract(contractABI, contractAddress);
    document.getElementById('setValueButton').addEventListener('click', async () => {
        if (!window.ethereum) {
            console.error('MetaMask or other Ethereum-compatible browser extension is not detected.');
            return;
        }
        
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const from = accounts[0];
            const newValue = document.getElementById('newValue').value;
            await simpleContract.methods.setValue(newValue).send({ from: from });
            console.log('Value set successfully.');
        } catch (error) {
            console.error("Error occurred while setting value:", error);
        }
    });
    
    document.getElementById('getValueButton').addEventListener('click', async () => {
        if (!window.ethereum) {
            console.error('MetaMask or other Ethereum-compatible browser extension is not detected.');
            return;
        }
        
        try {
            const value = await simpleContract.methods.getValue().call();
            document.getElementById('currentValue').innerText = `Current Value: ${value}`;
        } catch (error) {
            console.error("Error occurred while getting value:", error);
        }
    });
    
}
