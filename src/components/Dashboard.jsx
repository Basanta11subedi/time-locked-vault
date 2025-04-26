// src/components/Dashboard.jsx
import { useState, useEffect } from 'react';

const Dashboard = ({ 
  vaultInfo, 
  canWithdraw, 
  blocksUntilUnlock, 
  currentBlockHeight,
  handleWithdraw, 
  loading 
}) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  
  useEffect(() => {
    if (vaultInfo && blocksUntilUnlock > 0) {
      // Approximate time based on 10 minute block times
      const minutesRemaining = blocksUntilUnlock * 10;
      
      if (minutesRemaining < 60) {
        setTimeRemaining(`${minutesRemaining} minutes`);
      } else if (minutesRemaining < 1440) {
        const hours = Math.floor(minutesRemaining / 60);
        const mins = minutesRemaining % 60;
        setTimeRemaining(`${hours} hours, ${mins} minutes`);
      } else {
        const days = Math.floor(minutesRemaining / 1440);
        const hours = Math.floor((minutesRemaining % 1440) / 60);
        setTimeRemaining(`${days} days, ${hours} hours`);
      }
    } else {
      setTimeRemaining('');
    }
  }, [vaultInfo, blocksUntilUnlock]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!vaultInfo) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">No Active Vault</h2>
        <p className="text-gray-600">
          You don't have any STX tokens locked in a vault yet. Use the form below to create one.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Your Vault Status</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Locked Amount</p>
          <p className="text-2xl font-bold">{vaultInfo.amount} STX</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Unlock Height</p>
          <p className="text-2xl font-bold">{vaultInfo.unlock_height}</p>
          <p className="text-sm text-gray-500">Current height: {currentBlockHeight}</p>
        </div>
      </div>
      
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">Unlock Progress</span>
          <span className="text-sm font-medium">
            {canWithdraw ? 'Ready to withdraw' : timeRemaining}
          </span>
        </div>
        
        {vaultInfo.unlock_height > currentBlockHeight ? (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-purple-600 h-2.5 rounded-full" 
              style={{ 
                width: `${Math.min(100, Math.max(0, (currentBlockHeight / vaultInfo.unlock_height) * 100))}%` 
              }}
            ></div>
          </div>
        ) : (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-green-500 h-2.5 rounded-full w-full"></div>
          </div>
        )}
      </div>
      
      <div className="mt-6">
        <button
          onClick={handleWithdraw}
          disabled={!canWithdraw}
          className={`w-full py-3 px-4 rounded-lg font-bold transition duration-300 
            ${canWithdraw 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          {canWithdraw ? 'Withdraw STX' : 'Locked'}
        </button>
      </div>
      
      {!canWithdraw && blocksUntilUnlock > 0 && (
        <p className="mt-4 text-sm text-gray-500 text-center">
          {blocksUntilUnlock} blocks remaining until withdrawal is possible
        </p>
      )}
    </div>
  );
};

export default Dashboard;