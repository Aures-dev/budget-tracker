import React, { useRef, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, Loader2 } from 'lucide-react';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  username: string;
  onAvatarChange: (file: File) => Promise<void>;
}

export function AvatarUpload({ currentAvatarUrl, username, onAvatarChange }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentAvatarUrl);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      // Créer une URL de prévisualisation
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
      
      // Envoyer le fichier au parent
      await onAvatarChange(file);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      // En cas d'erreur, revenir à l'ancienne image
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
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <Avatar className="h-24 w-24">
          <AvatarImage src={previewUrl} alt={username} />
          <AvatarFallback className="text-lg bg-purple-100 text-purple-700">
            {getFallbackInitials(username)}
          </AvatarFallback>
        </Avatar>
        <Button
          variant="secondary"
          size="icon"
          className="absolute bottom-0 right-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </Button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
      />
    </div>
  );
} 