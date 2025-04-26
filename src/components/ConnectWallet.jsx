import { useConnect } from "@stacks/connect-react";

const ConnectWallet = () => {
  const { doOpenAuth } = useConnect();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="bg-white rounded-xl shadow-xl p-10 max-w-md w-full text-center border-t-4 border-purple-600">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-4 rounded-full shadow-lg">
            <img src="/stx-logo.png" alt="STX Logo" className="h-16 w-16" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Welcome to STX Vault</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Securely lock your STX tokens for a specified time period with our smart contract vault. Connect your wallet to get started.
        </p>
        <button
          onClick={doOpenAuth}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:from-indigo-700 hover:to-purple-800 transition duration-300 flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
          <span>Connect Wallet</span>
        </button>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <p className="text-xs text-gray-500">Secure</p>
            </div>
            <div className="text-center">
              <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <p className="text-xs text-gray-500">Time-Locked</p>
            </div>
            <div className="text-center">
              <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <p className="text-xs text-gray-500">Trustless</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectWallet;