import { Pencil, Loader2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/Dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import placeholder from '@/assets/images/null_placeholder.jpg';

interface ImageUploadProps {
  initialImage?: string;
  onImageUpload?: (file: File) => Promise<void>;
}

export default function ImageUploadWithDialog({
  initialImage = '@/assets/images/null_placeholder.jpg',
  onImageUpload
}: ImageUploadProps) {
  const [image, setImage] = useState(initialImage);
  const [isHovered, setIsHovered] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsDialogOpen(true);
      setError(null);
    }
    // Reset input value to allow selecting the same file again
    event.target.value = '';
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile || !onImageUpload) return;

    try {
      setIsUploading(true);
      setError(null);
      await onImageUpload(selectedFile);
      setImage(URL.createObjectURL(selectedFile));
      setIsDialogOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
  };

  return (
    <>
      <div className="relative inline-block">
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}>
          {image == null || image == undefined ? (
            <>
              <img
                src={placeholder}
                alt="Upload preview"
                className="w-24 h-24 rounded-lg object-cover"
              />
            </>
          ) : (
            <>
              <img src={image} alt="Upload preview" className="w-24 h-24 rounded-lg object-cover" />
            </>
          )}

          <div
            className={`absolute inset-0 bg-black/50 rounded-lg transition-opacity duration-200 ${
              isHovered ? 'opacity-50 cursor-pointer' : 'opacity-0'
            }`}>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white hover:text-white hover:bg-transparent"
              onClick={handleImageClick}>
              <Pencil className="h-6 w-6" />
            </Button>
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Image Upload</DialogTitle>
            <DialogDescription>Please review the selected image before uploading</DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {previewUrl && (
            <div className="flex justify-center p-4">
              <img
                src={previewUrl}
                alt="Upload preview"
                className="max-h-[300px] w-auto object-contain rounded-lg"
              />
            </div>
          )}

          <DialogFooter className="flex space-x-2 sm:space-x-0 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleDialogClose}
              disabled={isUploading}>
              Cancel
            </Button>
            <Button type="button" onClick={handleConfirmUpload} disabled={isUploading}>
              {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
