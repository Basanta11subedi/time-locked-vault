# STX Time-Locked Vault

A frontend application for interacting with the Time-Locked STX Vault smart contract on the Stacks blockchain.

## Features

- Connect your Stacks wallet (supports both Testnet and Mainnet)
- Deposit STX tokens and lock them for a specified period
- View detailed information about your locked vault
- Track time remaining until funds can be withdrawn
- Withdraw funds once the lock period has ended

## Smart Contract Functionality

The application interacts with a Clarity smart contract that allows:

- Depositing STX and setting a lock period (in blocks)
- Automatic locking of funds until the specified block height is reached
- Withdrawing funds once the lock period has expired
- Viewing vault information (amount locked, unlock height, etc.)
- Checking if withdrawal is possible and blocks remaining

## Technical Stack

- **Frontend**: React, Vite, TailwindCSS
- **Blockchain Interaction**: Stacks.js (@stacks/connect, @stacks/transactions, @stacks/network)


## Setup

1. Clone the repository

```
git clone <repository-url>
cd my-vault-latest-again
```

2. Install dependencies

```
npm install
```

3. Run the development server

```
npm run dev
```

4. Build for production

```
npm run build
```

## Configuration

Before using the application, make sure to update the contract details in the `App.jsx` file:

```javascript
// Smart contract details
const CONTRACT_ADDRESS = 'ST2WD8TKH9C3VKX4C355RGPPWFGYRAA9WT29SFQZY'; 
const CONTRACT_NAME = 'time-vault3';  
```

## Usage

1. Connect your Stacks wallet using the "Connect Wallet" button
2. Select the network (Testnet or Mainnet)
3. To create a new vault:
   - Enter the amount of STX you want to lock
   - Specify the lock duration in blocks (or use the suggested presets)
   - Click "Deposit & Lock STX"
4. After creating a vault, you can:
   - View detailed vault information (amount, unlock height, time remaining)
   - Monitor the progress of your lock period
   - Withdraw funds once the lock period has ended

## Notes

- The application uses block height to determine lock periods
- The Stacks blockchain produces blocks approximately every 10 minutes
- Lock periods are limited to between 1 and 52,560 blocks (roughly 1 year maximum)
- Once funds are deposited, they cannot be withdrawn until the specified block height is reached