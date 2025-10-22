'use client';

import { useState } from 'react';
import { Camera, Mail, Phone, MapPin, Globe, Save, Shield, Bell, Wallet } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useWallet } from '@/lib/hooks/useWallet';

export default function ProfilePage() {
  const t = useTranslations('profile');
  const { connected, address, connect } = useWallet();
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
    { id: 'general', label: t('tabs.general'), icon: Shield },
    { id: 'notifications', label: t('tabs.notifications'), icon: Bell },
    { id: 'wallet', label: t('tabs.wallet'), icon: Wallet },
  ];

  const handleSave = () => {
    console.log('Saving profile:', profileData);
    // Add save logic here
  };

  // Wallet connection guard
  if (!connected) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <Wallet size={64} className="mx-auto mb-4 text-gray-600" />
          <h2 className="text-2xl font-bold text-white mb-2">{t('wallet.connectTitle')}</h2>
          <p className="text-gray-400 mb-6">{t('wallet.connectDescription')}</p>
          <button
            onClick={connect}
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition"
          >
            {t('wallet.connectButton')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-12 py-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{t('header.title')}</h1>
        <p className="text-gray-400">{t('header.description')}</p>
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
            <h2 className="text-xl font-bold text-white mb-6">{t('general.profilePicture.title')}</h2>
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
                <p className="text-white font-medium mb-1">{t('general.profilePicture.uploadNew')}</p>
                <p className="text-sm text-gray-500">{t('general.profilePicture.fileTypes')}</p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="glass-card p-8">
            <h2 className="text-xl font-bold text-white mb-6">{t('general.personalInfo.title')}</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('general.personalInfo.fullName')}
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
                  {t('general.personalInfo.email')}
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
                  {t('general.personalInfo.phone')}
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
                  {t('general.personalInfo.location')}
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
                {t('general.personalInfo.bio')}
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
              <span>{t('general.saveButton')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="glass-card p-8">
            <h2 className="text-xl font-bold text-white mb-6">{t('notifications.title')}</h2>
            <div className="space-y-4">
              {[
                { key: 'emailNotifications', label: t('notifications.emailNotifications.label'), description: t('notifications.emailNotifications.description') },
                { key: 'newProperties', label: t('notifications.newProperties.label'), description: t('notifications.newProperties.description') },
                { key: 'priceChanges', label: t('notifications.priceChanges.label'), description: t('notifications.priceChanges.description') },
                { key: 'payouts', label: t('notifications.payouts.label'), description: t('notifications.payouts.description') },
                { key: 'marketingEmails', label: t('notifications.marketingEmails.label'), description: t('notifications.marketingEmails.description') },
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
            <h2 className="text-xl font-bold text-white mb-6">{t('walletTab.title')}</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('walletTab.address')}
                </label>
                <div className="flex items-center gap-3 p-4 bg-dark-card rounded-xl">
                  <Wallet size={20} className="text-primary-400" />
                  <code className="flex-1 text-white font-mono text-sm">
                    {address || t('walletTab.noWallet')}
                  </code>
                  <button className="px-4 py-2 bg-dark-hover hover:bg-dark-border text-white rounded-lg text-sm transition">
                    {t('walletTab.copyButton')}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 bg-dark-card/50 rounded-xl">
                  <p className="text-sm text-gray-400 mb-1">{t('walletTab.network')}</p>
                  <p className="text-lg font-bold text-white">{t('walletTab.networkValue')}</p>
                </div>

                <div className="p-4 bg-dark-card/50 rounded-xl">
                  <p className="text-sm text-gray-400 mb-1">{t('walletTab.balance')}</p>
                  <p className="text-lg font-bold text-white">1,250.45 STX</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition">
                  {t('walletTab.explorerButton')}
                </button>
                <button className="flex-1 px-6 py-3 bg-dark-card hover:bg-dark-hover text-white rounded-xl font-medium transition">
                  {t('walletTab.disconnectButton')}
                </button>
              </div>
            </div>
          </div>

          <div className="glass-card p-8">
            <h2 className="text-xl font-bold text-white mb-4">{t('walletTab.security.title')}</h2>
            <p className="text-gray-400 text-sm mb-6">
              {t('walletTab.security.description')}
            </p>
            <div className="flex items-center gap-3 p-4 bg-accent-green/10 border border-accent-green/20 rounded-xl">
              <Shield size={20} className="text-accent-green" />
              <p className="text-sm text-accent-green font-medium">
                {t('walletTab.security.secured')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
