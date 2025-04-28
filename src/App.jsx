import { useState, useEffect } from 'react';
import { connect, disconnect, isConnected, getLocalStorage, request } from '@stacks/connect';
import { Cl } from '@stacks/transactions';
import { StacksTestnet } from '@stacks/network';

export default function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [lockBlocks, setLockBlocks] = useState('');
  const [vaultInfo, setVaultInfo] = useState(null);
  const [blocksUntilUnlock, setBlocksUntilUnlock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const network = new StacksTestnet();
  const CONTRACT_ADDRESS = 'ST2WD8TKH9C3VKX4C355RGPPWFGYRAA9WT29SFQZY.time-vault';
  

  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (isConnected()) {
          const data = getLocalStorage();
          const stxAddress = data?.addresses?.stx?.[0]?.address || '';
          console.log("address:", stxAddress);
          if (stxAddress) {
            setWalletAddress(stxAddress);
            await fetchVaultInfo(stxAddress);
          }
        }
      } catch (err) {
        console.error('Connection check failed:', err);
        setError('Failed to check wallet connection');
      }
    };
    checkConnection();
  }, []);

  const handleConnect = async () => {
    try {
      setLoading(true);
      setError('');
      await connect();
      const data = getLocalStorage();
      const stxAddress = data?.addresses?.stx?.[0]?.address || '';
      setWalletAddress(stxAddress);
      await fetchVaultInfo(stxAddress);
      setSuccess('Wallet connected successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Connection failed:', error);
      setError('Wallet connection failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    try {
      disconnect();
      setWalletAddress('');
      setVaultInfo(null);
      setBlocksUntilUnlock(null);
      setSuccess('Wallet disconnected');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Disconnect failed:', err);
      setError('Failed to disconnect wallet');
    }
  };

  const depositSTX = async () => {
    if (!amount || !lockBlocks || Number(amount) <= 0 || Number(lockBlocks) <= 0) {
      setError('Please enter valid amount and lock period');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const amountMicroSTX = Math.floor(Number(amount) * 1000000);
      const blocks = Math.floor(Number(lockBlocks));

      console.log("Depositing:", {
        amountSTX: amount,
        amountMicroSTX,
        lockBlocks: blocks
      });

      console.log("amount:", amount * 1000000);
      const response = await request('stx_callContract', {
        contract: CONTRACT_ADDRESS,
        functionName: 'deposit',
        functionArgs: [
          Cl.uint(amountMicroSTX), // convert STX to micro-STX
          Cl.uint(blocks)
        ],
        
        network,
      });
      console.log("amount:", amount * 1000000);
      console.log('Deposit success:', response);
      setSuccess('Deposit transaction submitted');
      setTimeout(() => setSuccess(''), 3000);
      // Wait a few seconds then refresh vault info
      setTimeout(() => fetchVaultInfo(walletAddress), 5000);
    } catch (error) {
      console.error('Deposit failed:', error);
      setError('Deposit failed: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const withdrawSTX = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await request('stx_callContract', {
        contract: CONTRACT_ADDRESS,
        functionName: 'withdraw',
        functionArgs: [],
        network,
      });
      console.log('Withdraw success:', response);
      setSuccess('Withdrawal transaction submitted');
      setTimeout(() => setSuccess(''), 3000);
      // Wait a few seconds then refresh vault info
      setTimeout(() => fetchVaultInfo(walletAddress), 5000);
    } catch (error) {
      console.error('Withdraw failed:', error);
      setError('Withdrawal failed: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const fetchVaultInfo = async (address) => {
    try {
      setLoading(true);
      setError('');
      
      // Get vault info
      const infoResponse = await request('stx_callContract', {
        contract: CONTRACT_ADDRESS,
        functionName: 'get-vault-info',
        functionArgs: [Cl.principal(address)],
        network,
      });
      
      // Get blocks until unlock
      const blocksResponse = await request('stx_callContract', {
        contract: CONTRACT_ADDRESS,
        functionName: 'blocks-until-unlock',
        functionArgs: [Cl.principal(address)],
        network,
      });

      // Check if vault exists (response will be null if no vault)
      if (infoResponse.result === null) {
        setVaultInfo(null);
        setBlocksUntilUnlock(null);
      } else {
        setVaultInfo(infoResponse.result);
        setBlocksUntilUnlock(blocksResponse.result);
      }
    } catch (error) {
      console.error('Fetch Vault Info failed:', error);
      setError('Failed to fetch vault info');
    } finally {
      setLoading(false);
    }
  };

  const formatSTX = (microstx) => {
    return (microstx / 1000000).toFixed(6);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-indigo-600">STX Time Vault</h1>

        {/* Status messages */}
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded">
            {error}
            <button onClick={() => setError('')} className="float-right font-bold">
              ×
            </button>
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-100 text-green-700 rounded">
            {success}
            <button onClick={() => setSuccess('')} className="float-right font-bold">
              ×
            </button>
          </div>
        )}

        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-600">Processing...</p>
          </div>
        )}

        {!walletAddress ? (
          <button
            onClick={handleConnect}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:bg-indigo-300"
          >
            Connect Wallet
          </button>
        ) : (
          <>
            <div className="space-y-2">
              <p className="text-gray-700 text-sm break-words">Connected: {walletAddress}</p>
              <button
                onClick={handleDisconnect}
                disabled={loading}
                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:bg-red-300"
              >
                Disconnect
              </button>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Deposit STX</h2>
              <input
                type="number"
                placeholder="Amount (STX)"
                className="w-full p-2 border rounded"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
                min="0.000001"
                step="0.000001"
              />
              <input
                type="number"
                placeholder="Lock Blocks (1 block ≈ 10 minutes)"
                className="w-full p-2 border rounded"
                value={lockBlocks}
                onChange={(e) => setLockBlocks(e.target.value)}
                disabled={loading}
                min="1"
              />
              <button
                onClick={depositSTX}
                disabled={loading || !amount || !lockBlocks}
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:bg-green-300"
              >
                Deposit
              </button>
            </div>

            {vaultInfo ? (
              <div className="space-y-2 p-4 bg-gray-50 rounded">
                <h2 className="text-lg font-semibold text-gray-800">Vault Info</h2>
                <p>Amount Locked: {formatSTX(vaultInfo.amount)} STX</p>
                <p>Unlock Block Height: {vaultInfo['unlock-height']}</p>
                <p>Blocks Remaining: {blocksUntilUnlock}</p>
                <p className="text-sm text-gray-500">
                  Approx. {(blocksUntilUnlock * 10 / 60).toFixed(1)} hours remaining
                </p>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded text-center">
                <p className="text-gray-600">No active vault found for this address</p>
              </div>
            )}

            <button
              onClick={withdrawSTX}
              disabled={loading || !vaultInfo}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              Withdraw
            </button>
          </>
        )}
      </div>
    </div>
  );
}