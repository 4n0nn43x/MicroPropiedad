'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, ChevronDown, LogOut, Copy, ExternalLink, UserCircle } from 'lucide-react';
import { useWallet } from '@/lib/hooks/useWallet';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const { connected, address, disconnect } = useWallet();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      // Could add a toast notification here
      setDropdownOpen(false);
    }
  };

  const openExplorer = () => {
    if (address) {
      window.open(`https://explorer.hiro.so/address/${address}?chain=mainnet`, '_blank');
      setDropdownOpen(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="h-20 px-8 flex items-center justify-between border-b border-dark-border bg-dark-bg/50 backdrop-blur-xl">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search items, collections, accounts"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 bg-dark-card/50 border-0 rounded-xl text-sm text-white placeholder-gray-500 focus:bg-dark-card focus:ring-1 focus:ring-primary-500/30 transition"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative text-gray-400 hover:text-white transition">
          <Bell size={20} />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-accent-pink rounded-full" />
        </button>

        {/* User Profile */}
        {connected && address ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 hover:opacity-80 transition"
            >
              <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-primary-500 to-accent-purple">
                <img
                  src="https://i.pravatar.cc/150?img=12"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-medium text-white">{truncateAddress(address)}</span>
              <ChevronDown size={16} className={`text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-dark-card border border-dark-border rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="p-3 border-b border-dark-border">
                  <p className="text-xs text-gray-500 mb-1">Wallet Address</p>
                  <p className="text-sm text-white font-mono truncate">{address}</p>
                </div>

                <div className="py-2">
                  <Link
                    href={`/${locale}/profile`}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-dark-hover hover:text-white transition"
                  >
                    <UserCircle size={18} />
                    <span>My Profile</span>
                  </Link>

                  <button
                    onClick={copyAddress}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-dark-hover hover:text-white transition"
                  >
                    <Copy size={18} />
                    <span>Copy Address</span>
                  </button>

                  <button
                    onClick={openExplorer}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-dark-hover hover:text-white transition"
                  >
                    <ExternalLink size={18} />
                    <span>View in Explorer</span>
                  </button>
                </div>

                <div className="border-t border-dark-border py-2">
                  <button
                    onClick={handleDisconnect}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-dark-hover hover:text-red-300 transition"
                  >
                    <LogOut size={18} />
                    <span>Disconnect</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition">
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}
