import { supabase } from './supabase';
import { db, syncQueueDb, questsDb, profileDb, attributesDb, badgesDb } from './db';
import type { SyncQueueItem, Quest, Profile, Attributes, Badge } from '@/types/models';

export class SyncManager {
  private isOnline = typeof window !== 'undefined' && navigator.onLine;
  private syncInProgress = false;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleOnline());
      window.addEventListener('offline', () => this.handleOffline());
    }
  }

  private handleOnline() {
    this.isOnline = true;
    this.syncAll();
  }

  private handleOffline() {
    this.isOnline = false;
  }

  async syncAll() {
    if (this.syncInProgress || !this.isOnline) return;

    this.syncInProgress = true;
    try {
      const queueItems = await syncQueueDb.getAll();
      
      for (const item of queueItems) {
        await this.syncItem(item);
      }

      // Fetch updates from Supabase
      await this.pullUpdates();
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  private async syncItem(item: SyncQueueItem) {
    try {
      const { action, table_name, record_id, payload } = item;

      switch (action) {
        case 'create':
          await this.syncCreate(table_name, payload);
          break;
        case 'update':
          await this.syncUpdate(table_name, record_id, payload);
          break;
        case 'delete':
          await this.syncDelete(table_name, record_id);
          break;
      }

      await syncQueueDb.markAsSynced(item.id);
    } catch (error) {
      console.error(`Sync error for ${item.table_name}:`, error);
      throw error;
    }
  }

  private async syncCreate(tableName: string, payload: Record<string, any>) {
    const { data, error } = await supabase
      .from(tableName)
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  private async syncUpdate(
    tableName: string,
    recordId: string,
    payload: Record<string, any>
  ) {
    const { data, error } = await supabase
      .from(tableName)
      .update(payload)
      .eq('id', recordId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  private async syncDelete(tableName: string, recordId: string) {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', recordId);

    if (error) throw error;
  }

  private async pullUpdates() {
    try {
      // Fetch all data from Supabase and update local DB
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      for (const profile of profiles || []) {
        await profileDb.put(profile as Profile);
      }

      const { data: quests, error: questsError } = await supabase
        .from('quests')
        .select('*');

      if (questsError) throw questsError;

      for (const quest of quests || []) {
        await questsDb.put(quest as Quest);
      }

      const { data: attributes, error: attributesError } = await supabase
        .from('attributes')
        .select('*');

      if (attributesError) throw attributesError;

      for (const attr of attributes || []) {
        await attributesDb.put(attr as Attributes);
      }

      const { data: badges, error: badgesError } = await supabase
        .from('badges')
        .select('*');

      if (badgesError) throw badgesError;

      for (const badge of badges || []) {
        await badgesDb.put(badge as Badge);
      }
    } catch (error) {
      console.error('Pull updates error:', error);
      throw error;
    }
  }

  async addToQueue(
    action: 'create' | 'update' | 'delete',
    tableName: string,
    recordId: string,
    payload: Record<string, any>,
    userId: string
  ) {
    await syncQueueDb.add({
      action,
      table_name: tableName,
      record_id: recordId,
      payload,
      user_id: userId,
      synced: false,
    });

    if (this.isOnline) {
      await this.syncAll();
    }
  }

  isOffline() {
    return !this.isOnline;
  }
}

export const syncManager = new SyncManager();
