import { useState, useCallback } from 'react';
import { localDB } from '@/lib/supabase';

export interface UploadedImage {
  id: string;
  url: string;
  name: string;
}

export function useImageUpload(manualId: string) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const compressImage = useCallback((file: File, maxWidth = 1200, quality = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Resize if needed
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to base64
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  const uploadImage = useCallback(async (file: File): Promise<UploadedImage | null> => {
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed');
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Compress image
      setUploadProgress(30);
      const compressedData = await compressImage(file);
      
      // Save to local storage
      setUploadProgress(70);
      const imageId = localDB.saveImage(manualId, compressedData);
      
      setUploadProgress(100);
      
      return {
        id: imageId,
        url: compressedData,
        name: file.name,
      };
    } catch (err) {
      console.error('Upload error:', err);
      throw err;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [manualId, compressImage]);

  const uploadMultiple = useCallback(async (files: File[]): Promise<UploadedImage[]> => {
    const results: UploadedImage[] = [];
    
    for (const file of files) {
      try {
        const uploaded = await uploadImage(file);
        if (uploaded) {
          results.push(uploaded);
        }
      } catch (err) {
        console.error(`Failed to upload ${file.name}:`, err);
      }
    }
    
    return results;
  }, [uploadImage]);

  const deleteImage = useCallback((imageId: string): boolean => {
    try {
      localDB.deleteImage(imageId);
      return true;
    } catch {
      return false;
    }
  }, []);

  const getImage = useCallback((imageId: string): string | null => {
    return localDB.getImage(imageId);
  }, []);

  return {
    uploadImage,
    uploadMultiple,
    deleteImage,
    getImage,
    isUploading,
    uploadProgress,
  };
}
