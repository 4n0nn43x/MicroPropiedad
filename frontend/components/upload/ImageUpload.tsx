'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadImageToIPFS } from '@/lib/ipfs/pinata';

interface ImageUploadProps {
  onUploadComplete: (urls: string[]) => void;
  maxImages?: number;
  existingImages?: string[];
}

export default function ImageUpload({
  onUploadComplete,
  maxImages = 5,
  existingImages = []
}: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(existingImages);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    // Validate files
    const validFiles = filesToUpload.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB

      if (!isValidType) {
        alert(`${file.name} is not an image file`);
        return false;
      }
      if (!isValidSize) {
        alert(`${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(`Uploading ${validFiles.length} image(s) to IPFS...`);

    try {
      const uploadPromises = validFiles.map(async (file, index) => {
        setUploadProgress(`Uploading image ${index + 1}/${validFiles.length}...`);
        const result = await uploadImageToIPFS(file);
        return result.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const newImages = [...images, ...uploadedUrls];

      setImages(newImages);
      onUploadComplete(newImages);
      setUploadProgress('Upload complete!');

      setTimeout(() => setUploadProgress(''), 2000);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }

    // Reset input
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onUploadComplete(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          disabled={uploading || images.length >= maxImages}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className={`block border-2 border-dashed rounded-xl p-12 text-center transition cursor-pointer ${
            uploading || images.length >= maxImages
              ? 'border-gray-600 bg-gray-800/50 cursor-not-allowed'
              : 'border-dark-border hover:border-primary-500/50 bg-dark-card'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 size={48} className="mx-auto text-primary-500 mb-4 animate-spin" />
              <p className="text-white font-medium mb-1">{uploadProgress}</p>
              <p className="text-sm text-gray-500">Please wait...</p>
            </div>
          ) : (
            <>
              <Upload size={48} className="mx-auto text-gray-500 mb-4" />
              <p className="text-white font-medium mb-1">
                {images.length >= maxImages
                  ? `Maximum ${maxImages} images reached`
                  : 'Click to upload images'}
              </p>
              <p className="text-sm text-gray-500">
                PNG, JPG up to 10MB • {images.length}/{maxImages} uploaded
              </p>
            </>
          )}
        </label>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <div className="relative w-full h-32 rounded-lg overflow-hidden bg-dark-card">
                <Image
                  src={url}
                  alt={`Property image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                disabled={uploading}
              >
                <X size={14} className="text-white" />
              </button>
              <p className="text-xs text-gray-500 mt-1 text-center">Image {index + 1}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
