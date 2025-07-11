'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    username: 'shadcn',
    email: '',
    bio: 'I own a computer.',
    urls: ['https://shadcn.com', 'http://twitter.com/shadcn'],
  });

  const [activeTab, setActiveTab] = useState('profile');

  const handleAddUrl = () => {
    setFormData(prev => ({
      ...prev,
      urls: [...prev.urls, ''],
    }));
  };

  const handleUrlChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      urls: prev.urls.map((url, i) => (i === index ? value : url)),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your API
  };

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'account', label: 'Account' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'display', label: 'Display' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1446px] mx-auto px-4 sm:px-8 lg:px-14 py-8 lg:py-14">
        {/* Header Section */}
        <div className="mb-10">
          <div className="mb-2">
            <h1 className="text-2xl font-semibold text-zinc-950 leading-8">
              Settings
            </h1>
          </div>
          <div className="max-w-[441px]">
            <p className="text-base text-zinc-500 leading-6">
              Manage your account settings and set e-mail preferences.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-[250.8px] lg:flex-shrink-0">
            <div className="flex lg:flex-col space-x-1 lg:space-x-0 lg:space-y-1 overflow-x-auto lg:overflow-x-visible">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 lg:w-full h-9 px-4 py-2 rounded-md text-left text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-zinc-100 text-zinc-950'
                      : 'text-zinc-950 hover:bg-zinc-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 max-w-[947px]">
            <div className="border border-zinc-200 rounded-xl p-4 sm:p-6">
              {activeTab === 'profile' && (
                <div>
                  {/* Profile Header */}
                  <div className="mb-6">
                    <div className="mb-6">
                      <h2 className="text-lg font-medium text-zinc-950 leading-7 mb-1">
                        Profile
                      </h2>
                      <p className="text-sm text-zinc-500 leading-5">
                        This is how others will see you on the site.
                      </p>
                    </div>
                    {/* Divider */}
                    <div className="h-6 w-full border-b border-zinc-200"></div>
                  </div>

                  {/* Profile Form */}
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Username Field */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="username"
                        className="text-sm font-medium text-zinc-950"
                      >
                        Username
                      </Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={e =>
                          setFormData(prev => ({
                            ...prev,
                            username: e.target.value,
                          }))
                        }
                        className="w-full"
                      />
                      <p className="text-sm text-zinc-500 leading-5">
                        This is your public display name. It can be your real
                        name or a pseudonym. You can only change this once every
                        30 days.
                      </p>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-sm font-medium text-zinc-950"
                      >
                        Email
                      </Label>
                      <Select
                        value={formData.email}
                        onValueChange={value =>
                          setFormData(prev => ({ ...prev, email: value }))
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a verified email to display" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email1@example.com">
                            email1@example.com
                          </SelectItem>
                          <SelectItem value="email2@example.com">
                            email2@example.com
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-zinc-500 leading-5">
                        You can manage verified email addresses in your email
                        settings.
                      </p>
                    </div>

                    {/* Bio Field */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="bio"
                        className="text-sm font-medium text-zinc-950"
                      >
                        Bio
                      </Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={e =>
                          setFormData(prev => ({
                            ...prev,
                            bio: e.target.value,
                          }))
                        }
                        className="w-full min-h-[60px]"
                      />
                      <p className="text-sm text-zinc-500 leading-5">
                        You can @mention other users and organizations to link
                        to them.
                      </p>
                    </div>

                    {/* URLs Field */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-zinc-950">
                        URLs
                      </Label>
                      <p className="text-sm text-zinc-500 leading-5">
                        Add links to your website, blog, or social media
                        profiles.
                      </p>
                      <div className="space-y-2">
                        {formData.urls.map((url, index) => (
                          <Input
                            key={index}
                            value={url}
                            onChange={e =>
                              handleUrlChange(index, e.target.value)
                            }
                            placeholder="https://example.com"
                            className="w-full"
                          />
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleAddUrl}
                          className="w-fit text-xs"
                        >
                          Add URL
                        </Button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-0">
                      <Button
                        type="submit"
                        className="bg-zinc-900 text-white hover:bg-zinc-800"
                      >
                        Update profile
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Placeholder content for other tabs */}
              {activeTab !== 'profile' && (
                <div className="py-8">
                  <h2 className="text-lg font-medium text-zinc-950 mb-2 capitalize">
                    {activeTab}
                  </h2>
                  <p className="text-sm text-zinc-500">
                    This section is coming soon.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
