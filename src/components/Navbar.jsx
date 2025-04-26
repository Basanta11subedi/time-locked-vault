// src/components/Navbar.jsx
import { useState } from 'react';

const Navbar = ({ userData, disconnect }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img src="/stx-logo.png" alt="STX Logo" className="h-8 w-8 mr-2" />
            <h1 className="text-xl font-bold">STX Time-Locked Vault</h1>
          </div>
          
          {userData && (
            <div className="relative">
              <button 
                onClick={toggleDropdown}
                className="flex items-center px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
              >
                <span className="mr-2 text-sm">
                  {userData.profile.stxAddress.testnet.substring(0, 6)}...
                  {userData.profile.stxAddress.testnet.substring(userData.profile.stxAddress.testnet.length - 4)}
                </span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <p className="font-semibold">Wallet Address</p>
                    <p className="text-xs break-all">{userData.profile.stxAddress.testnet}</p>
                  </div>
                  <button
                    onClick={disconnect}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;