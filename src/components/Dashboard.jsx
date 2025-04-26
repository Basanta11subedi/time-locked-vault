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
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  if (!vaultInfo) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="bg-indigo-100 p-3 rounded-full mr-4">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">No Active Vault</h2>
        </div>
        <p className="text-gray-600 mb-4 leading-relaxed">
          You don't have any STX tokens locked in a vault yet. Use the form below to create one and start earning benefits from time-locked tokens.
        </p>
        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
          <p className="text-sm text-indigo-700 flex items-start">
            <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Time-locking your STX tokens shows long-term commitment to the network and can provide various benefits depending on your goals.</span>
          </p>
        </div>
      </div>
    );
  }

  // Calculate progress percentage
  const progressPercentage = Math.min(100, Math.max(0, ((currentBlockHeight / vaultInfo.unlock_height) * 100)));
  const formattedAmount = parseInt(vaultInfo.amount) / 1000000; // Convert microSTX to STX

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
      <div className="flex items-center mb-8">
        <div className="bg-purple-100 p-3 rounded-full mr-4">
          <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Your Vault Status</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 shadow-sm">
          <p className="text-sm font-medium text-indigo-600 mb-2 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Locked Amount
          </p>
          <div className="flex items-end">
            <p className="text-3xl font-bold text-gray-800">{formattedAmount.toLocaleString()}</p>
            <p className="ml-2 text-lg font-medium text-gray-500">STX</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 shadow-sm">
          <p className="text-sm font-medium text-indigo-600 mb-2 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            Unlock Height
          </p>
          <div className="flex flex-col">
            <p className="text-3xl font-bold text-gray-800">{vaultInfo.unlock_height.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-2 flex items-center">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Current height: {currentBlockHeight.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-gray-50 to-indigo-50 p-6 rounded-xl mb-8 border border-indigo-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div className="mb-2 md:mb-0">
            <p className="text-sm font-medium text-indigo-600 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Unlock Progress
            </p>
          </div>
          <span className={`text-sm font-medium px-3 py-1 rounded-full ${
            canWithdraw 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {canWithdraw ? 'Ready to withdraw' : timeRemaining}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div 
            className={`h-3 rounded-full ${canWithdraw ? 'bg-green-500' : 'bg-gradient-to-r from-indigo-500 to-purple-600'}`}
            style={{ width: `${canWithdraw ? 100 : progressPercentage}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
      
      <div className="text-center">
        <button
          onClick={handleWithdraw}
          disabled={!canWithdraw}
          className={`py-4 px-8 rounded-xl font-bold text-lg transition duration-300 shadow-md ${
            canWithdraw 
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {canWithdraw ? (
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Withdraw {formattedAmount.toLocaleString()} STX
            </div>
          ) : (
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              Locked
            </div>
          )}
        </button>
        
        {!canWithdraw && blocksUntilUnlock > 0 && (
          <p className="mt-6 text-gray-500 flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{blocksUntilUnlock.toLocaleString()} blocks remaining until withdrawal is possible</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
