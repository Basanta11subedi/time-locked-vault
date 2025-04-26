// src/components/ConnectWallet.jsx
import { useConnect } from "@stacks/connect-react";

const ConnectWallet = () => {
  const { doOpenAuth } = useConnect();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <img src="/stx-logo.png" alt="STX Logo" className="h-16 w-16 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Welcome to STX Time-Locked Vault</h2>
        <p className="text-gray-600 mb-6">
          Securely lock your STX tokens for a specified time period with our smart contract vault.
        </p>
        <button
          onClick={doOpenAuth}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center"
        >
          <span>Connect Wallet</span>
        </button>
      </div>
    </div>
  );
};

export default ConnectWallet;