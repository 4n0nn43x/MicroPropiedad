'use client';

import { useState } from 'react';
import { Camera, Mail, Phone, MapPin, Globe, Save, Shield, Bell, Wallet } from 'lucide-react';
import { useWallet } from '@/lib/hooks/useWallet';

export default function ProfilePage() {
  const { address } = useWallet();
  const [activeTab, setActiveTab] = useState('general');

  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    bio: 'Real estate investor and technology enthusiast.',
    avatar: 'https://i.pravatar.cc/150?img=12',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newProperties: true,
    priceChanges: false,
    payouts: true,
    marketingEmails: false,
  });

  const tabs = [
    { id: 'general', label: 'General', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
  ];

  const handleSave = () => {
    console.log('Saving profile:', profileData);
    // Add save logic here
  };

  return (
    <div className="px-12 py-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
        <p className="text-gray-400">Manage your profile and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-dark-border">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition ${
                activeTab === tab.id
                  ? 'text-primary-400 border-b-2 border-primary-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* General Tab */}
      {activeTab === 'general' && (
        <div className="space-y-8">
          {/* Avatar Section */}
          <div className="glass-card p-8">
            <h2 className="text-xl font-bold text-white mb-6">Profile Picture</h2>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-primary-500 to-accent-purple">
                  <img
                    src={profileData.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center hover:bg-primary-600 transition">
                  <Camera size={16} className="text-white" />
                </button>
              </div>
              <div>
                <p className="text-white font-medium mb-1">Upload new picture</p>
                <p className="text-sm text-gray-500">JPG, PNG max 5MB</p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="glass-card p-8">
            <h2 className="text-xl font-bold text-white mb-6">Personal Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition"
            >
              <Save size={20} />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="glass-card p-8">
            <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>
            <div className="space-y-4">
              {[
                { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive email updates about your account' },
                { key: 'newProperties', label: 'New Properties', description: 'Get notified when new properties are listed' },
                { key: 'priceChanges', label: 'Price Changes', description: 'Alerts when property prices change' },
                { key: 'payouts', label: 'Payout Notifications', description: 'Notifications for monthly payouts' },
                { key: 'marketingEmails', label: 'Marketing Emails', description: 'Receive promotional content and offers' },
              ].map((setting) => (
                <div
                  key={setting.key}
                  className="flex items-center justify-between p-4 bg-dark-card/50 rounded-xl"
                >
                  <div>
                    <p className="text-white font-medium mb-1">{setting.label}</p>
                    <p className="text-sm text-gray-500">{setting.description}</p>
                  </div>
                  <button
                    onClick={() => setNotificationSettings({
                      ...notificationSettings,
                      [setting.key]: !notificationSettings[setting.key as keyof typeof notificationSettings]
                    })}
                    className={`relative w-12 h-6 rounded-full transition ${
                      notificationSettings[setting.key as keyof typeof notificationSettings]
                        ? 'bg-primary-500'
                        : 'bg-dark-border'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        notificationSettings[setting.key as keyof typeof notificationSettings]
                          ? 'translate-x-6'
                          : ''
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Wallet Tab */}
      {activeTab === 'wallet' && (
        <div className="space-y-6">
          <div className="glass-card p-8">
            <h2 className="text-xl font-bold text-white mb-6">Wallet Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Connected Wallet Address
                </label>
                <div className="flex items-center gap-3 p-4 bg-dark-card rounded-xl">
                  <Wallet size={20} className="text-primary-400" />
                  <code className="flex-1 text-white font-mono text-sm">
                    {address || 'No wallet connected'}
                  </code>
                  <button className="px-4 py-2 bg-dark-hover hover:bg-dark-border text-white rounded-lg text-sm transition">
                    Copy
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 bg-dark-card/50 rounded-xl">
                  <p className="text-sm text-gray-400 mb-1">Network</p>
                  <p className="text-lg font-bold text-white">Stacks Mainnet</p>
                </div>

                <div className="p-4 bg-dark-card/50 rounded-xl">
                  <p className="text-sm text-gray-400 mb-1">Balance</p>
                  <p className="text-lg font-bold text-white">1,250.45 STX</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition">
                  View in Explorer
                </button>
                <button className="flex-1 px-6 py-3 bg-dark-card hover:bg-dark-hover text-white rounded-xl font-medium transition">
                  Disconnect Wallet
                </button>
              </div>
            </div>
          </div>

          <div className="glass-card p-8">
            <h2 className="text-xl font-bold text-white mb-4">Security</h2>
            <p className="text-gray-400 text-sm mb-6">
              Your wallet is secured by your browser extension. We never have access to your private keys.
            </p>
            <div className="flex items-center gap-3 p-4 bg-accent-green/10 border border-accent-green/20 rounded-xl">
              <Shield size={20} className="text-accent-green" />
              <p className="text-sm text-accent-green font-medium">
                Your wallet is securely connected via Hiro Wallet
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
