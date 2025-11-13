import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

interface ExportData {
  exportDate: string;
  appVersion: string;
  platform: string;
  userData: {
    tasks: any[];
    settings: any;
    accessibility: any;
    subscription: any;
    caregivers: any[];
    notifications: any[];
    profile: any;
  };
}

class DataExportService {
  async exportAllData(): Promise<ExportData> {
    try {
      const [
        tasks,
        settings,
        accessibility,
        subscription,
        caregivers,
        notifications,
        profile,
      ] = await Promise.all([
        this.getStorageItem('tasks', []),
        this.getStorageItem('settings', {}),
        this.getStorageItem('accessibility_settings', {}),
        this.getStorageItem('subscription', {}),
        this.getStorageItem('caregivers', []),
        this.getStorageItem('notifications', []),
        this.getStorageItem('user_profile', {}),
      ]);

      const exportData: ExportData = {
        exportDate: new Date().toISOString(),
        appVersion: '1.0.0',
        platform: Platform.OS,
        userData: {
          tasks,
          settings,
          accessibility,
          subscription,
          caregivers,
          notifications,
          profile,
        },
      };

      console.log('[DataExport] Data exported successfully');
      return exportData;
    } catch (error) {
      console.error('[DataExport] Export failed:', error);
      throw error;
    }
  }

  async exportAsJSON(): Promise<string> {
    try {
      const data = await this.exportAllData();
      const json = JSON.stringify(data, null, 2);
      
      const fileName = `nexa_export_${Date.now()}.json`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;
      
      await FileSystem.writeAsStringAsync(filePath, json);
      
      console.log('[DataExport] JSON file created:', filePath);
      return filePath;
    } catch (error) {
      console.error('[DataExport] JSON export failed:', error);
      throw error;
    }
  }

  async exportAsCSV(): Promise<string> {
    try {
      const data = await this.exportAllData();
      
      const csvLines: string[] = [];
      csvLines.push('Category,Key,Value');
      
      Object.entries(data.userData).forEach(([category, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            const itemStr = JSON.stringify(item).replace(/"/g, '""');
            csvLines.push(`${category},Item ${index + 1},"${itemStr}"`);
          });
        } else if (typeof value === 'object') {
          Object.entries(value).forEach(([key, val]) => {
            const valStr = JSON.stringify(val).replace(/"/g, '""');
            csvLines.push(`${category},${key},"${valStr}"`);
          });
        }
      });
      
      const csv = csvLines.join('\n');
      const fileName = `nexa_export_${Date.now()}.csv`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;
      
      await FileSystem.writeAsStringAsync(filePath, csv);
      
      console.log('[DataExport] CSV file created:', filePath);
      return filePath;
    } catch (error) {
      console.error('[DataExport] CSV export failed:', error);
      throw error;
    }
  }

  async shareData(format: 'json' | 'csv' = 'json'): Promise<void> {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (!isAvailable) {
        console.warn('[DataExport] Sharing not available on this platform');
        return;
      }

      const filePath = format === 'json' 
        ? await this.exportAsJSON()
        : await this.exportAsCSV();

      await Sharing.shareAsync(filePath, {
        mimeType: format === 'json' ? 'application/json' : 'text/csv',
        dialogTitle: 'Export Your Nexa Data',
      });

      console.log('[DataExport] Data shared successfully');
    } catch (error) {
      console.error('[DataExport] Share failed:', error);
      throw error;
    }
  }

  async deleteAllData(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys);
      
      console.log('[DataExport] All data deleted');
    } catch (error) {
      console.error('[DataExport] Delete failed:', error);
      throw error;
    }
  }

  private async getStorageItem(key: string, defaultValue: any): Promise<any> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
      console.warn(`[DataExport] Failed to get ${key}:`, error);
      return defaultValue;
    }
  }
}

export const dataExport = new DataExportService();
