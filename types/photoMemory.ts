export interface PhotoMemory {
  id: string;
  uri: string;
  name: string;
  relationship?: string;
  dateAdded: string;
  notes?: string;
}

export interface PhotoMemoryContextType {
  photos: PhotoMemory[];
  addPhoto: (photo: Omit<PhotoMemory, 'id' | 'dateAdded'>) => Promise<void>;
  updatePhoto: (id: string, updates: Partial<Omit<PhotoMemory, 'id' | 'dateAdded'>>) => Promise<void>;
  deletePhoto: (id: string) => Promise<void>;
  isLoading: boolean;
}
