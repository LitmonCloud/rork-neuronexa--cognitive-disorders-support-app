import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { PhotoMemory } from '@/types/photoMemory';

const STORAGE_KEY = '@photo_memories';

export const [PhotoMemoryProvider, usePhotoMemory] = createContextHook(() => {
  const [photos, setPhotos] = useState<PhotoMemory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPhotos = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPhotos(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load photos:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  const addPhoto = useCallback(async (photo: Omit<PhotoMemory, 'id' | 'dateAdded'>) => {
    const newPhoto: PhotoMemory = {
      ...photo,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString(),
    };
    setPhotos(prev => {
      const updated = [...prev, newPhoto];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(console.error);
      return updated;
    });
  }, []);

  const updatePhoto = useCallback(async (id: string, updates: Partial<Omit<PhotoMemory, 'id' | 'dateAdded'>>) => {
    setPhotos(prev => {
      const updated = prev.map(photo =>
        photo.id === id ? { ...photo, ...updates } : photo
      );
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(console.error);
      return updated;
    });
  }, []);

  const deletePhoto = useCallback(async (id: string) => {
    setPhotos(prev => {
      const updated = prev.filter(photo => photo.id !== id);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(console.error);
      return updated;
    });
  }, []);

  return useMemo(() => ({
    photos,
    addPhoto,
    updatePhoto,
    deletePhoto,
    isLoading,
  }), [photos, addPhoto, updatePhoto, deletePhoto, isLoading]);
});
