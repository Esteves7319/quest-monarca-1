import Dexie, { Table } from 'dexie';
import type { Profile, Attributes, Quest, Badge, SyncQueueItem } from '@/types/models';

export class QuestMonarcaDB extends Dexie {
  profiles!: Table<Profile>;
  attributes!: Table<Attributes>;
  quests!: Table<Quest>;
  badges!: Table<Badge>;
  syncQueue!: Table<SyncQueueItem>;

  constructor() {
    super('quest_monarca_db');
    this.version(1).stores({
      profiles: 'id, username',
      attributes: 'id, user_id',
      quests: 'id, user_id, due_date, is_completed',
      badges: 'id, user_id',
      syncQueue: 'id, user_id, synced, created_at',
    });
  }
}

export const db = new QuestMonarcaDB();

// Profile operations
export const profileDb = {
  async get(userId: string) {
    return db.profiles.get(userId);
  },

  async put(profile: Profile) {
    return db.profiles.put(profile);
  },

  async update(userId: string, changes: Partial<Profile>) {
    return db.profiles.update(userId, changes);
  },

  async delete(userId: string) {
    return db.profiles.delete(userId);
  },
};

// Attributes operations
export const attributesDb = {
  async get(userId: string) {
    return db.attributes.where('user_id').equals(userId).first();
  },

  async put(attributes: Attributes) {
    return db.attributes.put(attributes);
  },

  async update(attributesId: string, changes: Partial<Attributes>) {
    return db.attributes.update(attributesId, changes);
  },
};

// Quests operations
export const questsDb = {
  async getAll(userId: string) {
    return db.quests.where('user_id').equals(userId).toArray();
  },

  async getIncomplete(userId: string) {
    return db.quests
      .where('user_id')
      .equals(userId)
      .and((quest) => !quest.is_completed)
      .toArray();
  },

  async getCompleted(userId: string) {
    return db.quests
      .where('user_id')
      .equals(userId)
      .and((quest) => quest.is_completed)
      .toArray();
  },

  async getDailyQuests(userId: string) {
    return db.quests
      .where('user_id')
      .equals(userId)
      .and((quest) => quest.is_daily)
      .toArray();
  },

  async getByDueDate(userId: string, startDate: Date, endDate: Date) {
    return db.quests
      .where('user_id')
      .equals(userId)
      .and((quest) => {
        const dueDate = new Date(quest.due_date);
        return dueDate >= startDate && dueDate <= endDate;
      })
      .toArray();
  },

  async put(quest: Quest) {
    return db.quests.put(quest);
  },

  async update(questId: string, changes: Partial<Quest>) {
    return db.quests.update(questId, changes);
  },

  async delete(questId: string) {
    return db.quests.delete(questId);
  },
};

// Badges operations
export const badgesDb = {
  async getAll(userId: string) {
    return db.badges.where('user_id').equals(userId).toArray();
  },

  async put(badge: Badge) {
    return db.badges.put(badge);
  },

  async delete(badgeId: string) {
    return db.badges.delete(badgeId);
  },
};

// Sync Queue operations
export const syncQueueDb = {
  async getAll() {
    return db.syncQueue.where('synced').equals(false).toArray();
  },

  async add(item: Omit<SyncQueueItem, 'id' | 'created_at'>) {
    return db.syncQueue.add({
      ...item,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    });
  },

  async markAsSynced(itemId: string) {
    return db.syncQueue.update(itemId, {
      synced: true,
      synced_at: new Date().toISOString(),
    });
  },

  async clear() {
    return db.syncQueue.where('synced').equals(true).delete();
  },
};
