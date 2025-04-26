// src/components/VaultForm.jsx
import { useState } from 'react';

const VaultForm = ({ handleDeposit }) => {
  const [amount, setAmount] = useState('');
  const [lockPeriod, setLockPeriod] = useState('');
  const [lockBlocks, setLockBlocks] = useState(0);
  const [formError, setFormError] = useState('');
  
  const blockTimeMinutes = 10; // 10 minutes per block on average
  
  const handlePeriodChange = (e) => {
    const value = e.target.value;
    setLockPeriod(value);
    
    // Calculate blocks based on period (assuming 10 min block time)
    let blocks = 0;
    if (value) {
      if (value === 'day') blocks = 144; // ~1 day (144 blocks)
      else if (value === 'week') blocks = 1008; // ~1 week (1008 blocks)
      else if (value === 'month') blocks = 4320; // ~1 month (4320 blocks)
      else if (value === 'custom') blocks = 0;
    }
    
    setLockBlocks(blocks);
  };
  
  const handleCustomBlocksChange = (e) => {
    const value = parseInt(e.target.value);
    setLockBlocks(isNaN(value) ? 0 : value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    
    const amountValue = parseInt(amount);
    
    if (!amountValue || amountValue <= 0) {
      setFormError('Please enter a valid amount');
      return;
    }
    
    if (lockBlocks <= 0 || lockBlocks > 52560) {
      setFormError('Lock period must be between 1 and 52560 blocks');
      return;
    }
    
    // Convert amount to microSTX (1 STX = 1,000,000 microSTX)
    const microStxAmount = amountValue * 1000000;
    handleDeposit(microStxAmount, lockBlocks);
  };
  
  // Calculate human-readable time from blocks
  const calculateTimeFromBlocks = (blocks) => {
    const minutes = blocks * blockTimeMinutes;
    if (minutes < 60) return `${minutes} minutes`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)} hours, ${minutes % 60} minutes`;
    return `${Math.floor(minutes / 1440)} days, ${Math.floor((minutes % 1440) / 60)} hours`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Create a New Vault</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
            Amount (STX)
          </label>
          <input
            type="number"
            id="amount"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter STX amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="1"
            step="1"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Lock Period
          </label>
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="lockPeriod"
                value="day"
                checked={lockPeriod === 'day'}
                onChange={handlePeriodChange}
                className="form-radio"
              />
              <span className="ml-2">1 Day (~144 blocks)</span>
            </label>
            
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="lockPeriod"
                value="week"
                checked={lockPeriod === 'week'}
                onChange={handlePeriodChange}
                className="form-radio"
              />
              <span className="ml-2">1 Week (~1008 blocks)</span>
            </label>
            
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="lockPeriod"
                value="month"
                checked={lockPeriod === 'month'}
                onChange={handlePeriodChange}
                className="form-radio"
              />
              <span className="ml-2">1 Month (~4320 blocks)</span>
            </label>
            
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="lockPeriod"
                value="custom"
                checked={lockPeriod === 'custom'}
                onChange={handlePeriodChange}
                className="form-radio"
              />
              <span className="ml-2">Custom</span>
            </label>
          </div>
        </div>
        
        {lockPeriod === 'custom' && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customBlocks">
              Custom Lock Period (blocks)
            </label>
            <input
              type="number"
              id="customBlocks"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter number of blocks"
              value={lockBlocks || ''}
              onChange={handleCustomBlocksChange}
              required
              min="1"
              max="52560"
              step="1"
            />
            {lockBlocks > 0 && (
              <p className="mt-1 text-sm text-gray-500">
                Approximately {calculateTimeFromBlocks(lockBlocks)}
              </p>
            )}
          </div>
        )}
        
        {formError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {formError}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            disabled={!amount || lockBlocks <= 0}
          >
            Create Vault
          </button>
        </div>
      </form>
    </div>
  );
};

export default VaultForm;