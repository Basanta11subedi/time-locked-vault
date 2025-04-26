// src/components/Navbar.jsx
import { useState } from 'react';

const Navbar = ({ userData, disconnect }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <nav className="bg-gradient-to-r from-indigo-800 to-purple-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-white p-1 rounded-full shadow-md mr-3">
              <img src="/stx-logo.png" alt="STX Logo" className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">
              STX Time-Locked Vault
            </h1>
          </div>
          
          {userData ? (
            <div className="relative">
              <button 
                onClick={toggleDropdown}
                className="flex items-center px-4 py-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-300 backdrop-blur-sm border border-white border-opacity-20"
              >
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center mr-2">
                  <span className="text-xs font-bold">{userData.profile.stxAddress.testnet.substring(2, 4)}</span>
                </div>
                <span className="mr-2 text-sm font-medium">
                  {userData.profile.stxAddress.testnet.substring(0, 6)}...
                  {userData.profile.stxAddress.testnet.substring(userData.profile.stxAddress.testnet.length - 4)}
                </span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-1 z-20 border border-purple-100 animate-fadeIn">
                  <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                    <p className="font-semibold text-purple-800">Wallet Address</p>
                    <p className="text-xs break-all mt-1">{userData.profile.stxAddress.testnet}</p>
                  </div>
                  <button
                    onClick={disconnect}
                    className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-50 transition duration-150"
                  >
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                      </svg>
                      Disconnect Wallet
                    </div>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm py-2 px-4 rounded-md bg-white bg-opacity-20">
              Not Connected
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;