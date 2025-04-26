// src/App.jsx
import { useState, useEffect } from 'react';
import { Connect } from "@stacks/connect-react";
import { StacksTestnet } from "@stacks/network";
import { 
  callReadOnlyFunction, 
  contractPrincipalCV, 
  uintCV, 
  cvToValue 
} from "@stacks/transactions";
import { userSession } from './auth';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import VaultForm from './components/VaultForm';
import ConnectWallet from './components/ConnectWallet';

// Contract details
const CONTRACT_ADDRESS = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"; // Replace with your deployment address
const CONTRACT_NAME = "stx-vault"; // Replace with your contract name

function App() {
  const [userData, setUserData] = useState(null);
  const [vaultInfo, setVaultInfo] = useState(null);
  const [canWithdraw, setCanWithdraw] = useState(false);
  const [blocksUntilUnlock, setBlocksUntilUnlock] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentBlockHeight, setCurrentBlockHeight] = useState(0);
  const [txStatus, setTxStatus] = useState(null);

  const network = new StacksTestnet();

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      setUserData(userData);
    }
  }, []);

  useEffect(() => {
    if (userData) {
      fetchVaultInfo();
      fetchBlockHeight();
      // Poll for updates every 30 seconds
      const interval = setInterval(() => {
        fetchVaultInfo();
        fetchBlockHeight();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [userData]);

  const fetchBlockHeight = async () => {
    try {
      const response = await fetch('https://stacks-node-api.testnet.stacks.co/v2/info');
      const data = await response.json();
      setCurrentBlockHeight(data.stacks_tip_height);
    } catch (error) {
      console.error('Error fetching block height:', error);
    }
  };

  const fetchVaultInfo = async () => {
    if (!userData) return;
    
    setLoading(true);
    try {
      // Get vault info
      const vaultInfoResponse = await callReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: "get-vault-info",
        functionArgs: [contractPrincipalCV(userData.profile.stxAddress.testnet, '')],
        network,
        senderAddress: userData.profile.stxAddress.testnet,
      });
      
      const vaultData = cvToValue(vaultInfoResponse);
      setVaultInfo(vaultData);
      
      // Check if can withdraw
      const canWithdrawResponse = await callReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: "can-withdraw",
        functionArgs: [contractPrincipalCV(userData.profile.stxAddress.testnet, '')],
        network,
        senderAddress: userData.profile.stxAddress.testnet,
      });
      
      setCanWithdraw(cvToValue(canWithdrawResponse));
      
      // Get blocks until unlock
      const blocksResponse = await callReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: "blocks-until-unlock",
        functionArgs: [contractPrincipalCV(userData.profile.stxAddress.testnet, '')],
        network,
        senderAddress: userData.profile.stxAddress.testnet,
      });
      
      setBlocksUntilUnlock(cvToValue(blocksResponse));
    } catch (error) {
      console.error('Error fetching vault info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (amount, lockBlocks) => {
    try {
      setTxStatus({ type: 'loading', message: 'Initiating deposit transaction...' });
      
      const options = {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'deposit',
        functionArgs: [uintCV(amount), uintCV(lockBlocks)],
        network,
        postConditionMode: 0x01, // allow
        onFinish: (data) => {
          setTxStatus({ 
            type: 'success', 
            message: 'Deposit transaction submitted! Transaction ID: ' + data.txId,
            txId: data.txId
          });
          setTimeout(() => fetchVaultInfo(), 3000);
        },
      };
      
      await userSession.openContractCall(options);
    } catch (error) {
      console.error('Error depositing:', error);
      setTxStatus({ type: 'error', message: 'Error depositing: ' + error.message });
    }
  };

  const handleWithdraw = async () => {
    try {
      setTxStatus({ type: 'loading', message: 'Initiating withdrawal transaction...' });
      
      const options = {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'withdraw',
        functionArgs: [],
        network,
        postConditionMode: 0x01, // allow
        onFinish: (data) => {
          setTxStatus({ 
            type: 'success', 
            message: 'Withdrawal transaction submitted! Transaction ID: ' + data.txId,
            txId: data.txId
          });
          setTimeout(() => fetchVaultInfo(), 3000);
        },
      };
      
      await userSession.openContractCall(options);
    } catch (error) {
      console.error('Error withdrawing:', error);
      setTxStatus({ type: 'error', message: 'Error withdrawing: ' + error.message });
    }
  };

  const handleAuthResponse = (data) => {
    if (data.authResponse) {
      setUserData(userSession.loadUserData());
    }
  };

  const disconnect = () => {
    userSession.signUserOut();
    setUserData(null);
    setVaultInfo(null);
    setCanWithdraw(false);
    setBlocksUntilUnlock(0);
  };

  return (
    <Connect authOptions={{
      appDetails: {
        name: 'STX Time-Locked Vault',
        icon: '/stx-logo.png',
      },
      onFinish: handleAuthResponse,
      userSession,
    }}>
      <div className="min-h-screen bg-gray-100">
        <Navbar 
          userData={userData} 
          disconnect={disconnect} 
        />
        
        <main className="container mx-auto px-4 py-8">
          {!userData ? (
            <ConnectWallet />
          ) : (
            <>
              <Dashboard 
                vaultInfo={vaultInfo} 
                canWithdraw={canWithdraw}
                blocksUntilUnlock={blocksUntilUnlock}
                currentBlockHeight={currentBlockHeight}
                handleWithdraw={handleWithdraw}
                loading={loading}
              />
              
              {vaultInfo === null && (
                <VaultForm handleDeposit={handleDeposit} />
              )}
              
              {txStatus && (
                <div className={`mt-6 p-4 rounded-lg ${
                  txStatus.type === 'loading' ? 'bg-blue-50 text-blue-700' :
                  txStatus.type === 'success' ? 'bg-green-50 text-green-700' :
                  'bg-red-50 text-red-700'
                }`}>
                  <p className="text-sm">{txStatus.message}</p>
                  {txStatus.txId && (
                    <a 
                      href={`https://explorer.stacks.co/txid/${txStatus.txId}?chain=testnet`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm underline"
                    >
                      View on Explorer
                    </a>
                  )}
                </div>
              )}
            </>
          )}
        </main>
        
        <footer className="py-6 text-center text-gray-500 text-sm">
          <p>STX Time-Locked Vault &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </Connect>
  );
}

export default App;