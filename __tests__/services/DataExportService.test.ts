import { dataExport } from '@/services/data/DataExportService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

jest.mock('@react-native-async-storage/async-storage');
jest.mock('expo-file-system');
jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn().mockResolvedValue(true),
  shareAsync: jest.fn().mockResolvedValue(undefined),
}));

describe('DataExportService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  it('should export all data', async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === 'tasks') return Promise.resolve(JSON.stringify([{ id: '1', title: 'Test' }]));
      return Promise.resolve(null);
    });

    const data = await dataExport.exportAllData();

    expect(data).toHaveProperty('exportDate');
    expect(data).toHaveProperty('appVersion');
    expect(data).toHaveProperty('userData');
    expect(data.userData.tasks).toHaveLength(1);
  });

  it('should export as JSON', async () => {
    (FileSystem.writeAsStringAsync as jest.Mock).mockResolvedValue(undefined);
    (FileSystem.documentDirectory as any) = '/documents/';

    const filePath = await dataExport.exportAsJSON();

    expect(filePath).toContain('nexa_export_');
    expect(filePath).toContain('.json');
    expect(FileSystem.writeAsStringAsync).toHaveBeenCalled();
  });

  it('should export as CSV', async () => {
    (FileSystem.writeAsStringAsync as jest.Mock).mockResolvedValue(undefined);
    (FileSystem.documentDirectory as any) = '/documents/';

    const filePath = await dataExport.exportAsCSV();

    expect(filePath).toContain('nexa_export_');
    expect(filePath).toContain('.csv');
    expect(FileSystem.writeAsStringAsync).toHaveBeenCalled();
  });

  it('should delete all data', async () => {
    (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue(['key1', 'key2']);
    (AsyncStorage.multiRemove as jest.Mock).mockResolvedValue(undefined);

    await dataExport.deleteAllData();

    expect(AsyncStorage.getAllKeys).toHaveBeenCalled();
    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(['key1', 'key2']);
  });
});
