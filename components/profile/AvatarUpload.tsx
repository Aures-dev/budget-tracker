import React, { useRef, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  username: string;
  onAvatarChange: (file: File) => Promise<void>;
  disabled?: boolean;
}

export function AvatarUpload({ currentAvatarUrl, username, onAvatarChange, disabled }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentAvatarUrl);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
      await onAvatarChange(file);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setPreviewUrl(currentAvatarUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const getFallbackInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center gap-4"
    >
      <div className="relative group">
        <Avatar className="h-24 w-24 border-2 border-purple-200 dark:border-purple-800 rounded-full shadow-md">
          <AvatarImage src={previewUrl} alt={username} />
          <AvatarFallback className="text-lg bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900 dark:to-indigo-900 text-purple-700 dark:text-purple-300">
            {getFallbackInitials(username)}
          </AvatarFallback>
        </Avatar>
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            variant="default"
            size="icon"
            className="absolute bottom-0 right-0 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || disabled}
            aria-label={isUploading ? 'Téléchargement en cours' : 'Changer la photo de profil'}
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </Button>
        </motion.div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading || disabled}
        aria-hidden="true"
      />
    </motion.div>
  );
}