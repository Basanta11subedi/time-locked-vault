import { useState } from 'react';

const VaultForm = ({ handleDeposit }) => {
  const [amount, setAmount] = useState('');
  const [lockPeriod, setLockPeriod] = useState('');
  const [lockBlocks, setLockBlocks] = useState(0);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);
    
    const amountValue = parseInt(amount);
    
    if (!amountValue || amountValue <= 0) {
      setFormError('Please enter a valid amount');
      setIsSubmitting(false);
      return;
    }
    
    if (lockBlocks <= 0 || lockBlocks > 52560) {
      setFormError('Lock period must be between 1 and 52560 blocks');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Convert amount to microSTX (1 STX = 1,000,000 microSTX)
      const microStxAmount = amountValue * 1000000;
      await handleDeposit(microStxAmount, lockBlocks);
      // Reset form after successful submission
      setAmount('');
      setLockPeriod('');
      setLockBlocks(0);
    } catch (error) {
      setFormError(error.message || 'Failed to create vault. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Calculate human-readable time from blocks
  const calculateTimeFromBlocks = (blocks) => {
    const minutes = blocks * blockTimeMinutes;
    if (minutes < 60) return `${minutes} minutes`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)} hours, ${minutes % 60} minutes`;
    return `${Math.floor(minutes / 1440)} days, ${Math.floor((minutes % 1440) / 60)} hours`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create a New Vault</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="amount">
            Amount (STX)
          </label>
          <div className="relative">
            <input
              type="number"
              id="amount"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 shadow-sm"
              placeholder="Enter STX amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="1"
              step="1"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500">STX</span>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-3">
            Lock Period
          </label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { value: 'day', label: '1 Day', blocks: 144 },
              { value: 'week', label: '1 Week', blocks: 1008 },
              { value: 'month', label: '1 Month', blocks: 4320 },
              { value: 'custom', label: 'Custom', blocks: null }
            ].map((option) => (
              <label 
                key={option.value}
                className={`flex items-center justify-center px-4 py-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  lockPeriod === option.value
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50'
                }`}
              >
                <input
                  type="radio"
                  name="lockPeriod"
                  value={option.value}
                  checked={lockPeriod === option.value}
                  onChange={handlePeriodChange}
                  className="sr-only"
                />
                <div className="text-center">
                  <div className="font-medium">{option.label}</div>
                  {option.blocks && (
                    <div className="text-xs text-gray-500">~{option.blocks} blocks</div>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
        
        {lockPeriod === 'custom' && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="customBlocks">
              Custom Lock Period
            </label>
            <input
              type="number"
              id="customBlocks"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 shadow-sm"
              placeholder="Enter number of blocks"
              value={lockBlocks || ''}
              onChange={handleCustomBlocksChange}
              required
              min="1"
              max="52560"
              step="1"
            />
            <div className="mt-3 flex items-center">
              <div className="h-1 flex-grow bg-gray-200 rounded-full">
                <div 
                  className="h-1 bg-purple-500 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(100, (lockBlocks / 52560) * 100)}%` }}
                ></div>
              </div>
              <span className="ml-2 text-xs text-gray-500 w-16 text-right">
                {Math.round((lockBlocks / 52560) * 100)}%
              </span>
            </div>
            {lockBlocks > 0 && (
              <div className="mt-3 flex items-center text-sm text-gray-600 bg-purple-50 p-2 rounded-md">
                <svg className="w-4 h-4 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Approximately {calculateTimeFromBlocks(lockBlocks)}</span>
              </div>
            )}
          </div>
        )}
        
        {formError && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-md text-red-700 text-sm flex items-start">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{formError}</span>
          </div>
        )}
        
        <div className="pt-2">
          <button
            type="submit"
            className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-200 ${
              !amount || lockBlocks <= 0 || isSubmitting
                ? 'bg-purple-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg'
            }`}
            disabled={!amount || lockBlocks <= 0 || isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Vault...
              </div>
            ) : (
              'Create Vault'
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-8 pt-4 border-t border-gray-100 text-xs text-gray-500">
        <p className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Vault funds will be locked for the specified time period and cannot be withdrawn early.
        </p>
      </div>
    </div>
  );
};

export default VaultForm;