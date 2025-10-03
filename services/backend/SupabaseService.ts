import { createClient, SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '@/types/task';

class SupabaseService {
  private client: SupabaseClient | null = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
      console.warn('[Supabase] URL or anon key not configured. Cloud sync disabled.');
      return;
    }

    try {
      this.client = createClient(url, anonKey, {
        auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      });
      this.isInitialized = true;
      console.log('[Supabase] Initialized successfully');
    } catch (error) {
      console.error('[Supabase] Initialization failed:', error);
    }
  }

  async signInAnonymously() {
    if (!this.client) return null;

    try {
      const { data, error } = await this.client.auth.signInAnonymously();
      if (error) throw error;
      console.log('[Supabase] Anonymous sign-in successful');
      return data;
    } catch (error) {
      console.error('[Supabase] Anonymous sign-in failed:', error);
      return null;
    }
  }

  async getSession() {
    if (!this.client) return null;

    try {
      const { data, error } = await this.client.auth.getSession();
      if (error) throw error;
      return data.session;
    } catch (error) {
      console.error('[Supabase] Get session failed:', error);
      return null;
    }
  }

  async syncTasks(tasks: Task[]) {
    if (!this.client) return false;

    try {
      const session = await this.getSession();
      if (!session) {
        await this.signInAnonymously();
      }

      const { error } = await this.client
        .from('tasks')
        .upsert(tasks.map(task => ({
          ...task,
          user_id: session?.user.id,
          updated_at: new Date().toISOString(),
        })));

      if (error) throw error;
      console.log('[Supabase] Tasks synced successfully');
      return true;
    } catch (error) {
      console.error('[Supabase] Task sync failed:', error);
      return false;
    }
  }

  async fetchTasks(): Promise<Task[]> {
    if (!this.client) return [];

    try {
      const session = await this.getSession();
      if (!session) return [];

      const { data, error } = await this.client
        .from('tasks')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('[Supabase] Tasks fetched successfully:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('[Supabase] Task fetch failed:', error);
      return [];
    }
  }

  async signOut() {
    if (!this.client) return;

    try {
      await this.client.auth.signOut();
      console.log('[Supabase] Sign out successful');
    } catch (error) {
      console.error('[Supabase] Sign out failed:', error);
    }
  }
}

export const supabase = new SupabaseService();
