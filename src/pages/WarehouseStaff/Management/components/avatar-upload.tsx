'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function AvatarUpload({ onUpload, isLoading }) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (avatarFile) {
      onUpload(avatarFile);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="w-32 h-32">
        <AvatarImage src={avatarPreview || undefined} alt="Avatar" />
        <AvatarFallback>Avatar</AvatarFallback>
      </Avatar>
      <input type="file" accept="image/*" onChange={handleFileChange} id="avatar-upload" />
      <label htmlFor="avatar-upload">
        <Button as="span" disabled={isLoading}>
          Choose Avatar
        </Button>
      </label>
      <Button onClick={handleUpload} disabled={!avatarFile || isLoading}>
        {isLoading ? 'Uploading...' : 'Finish'}
      </Button>
    </div>
  );
}
