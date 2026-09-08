import { useEffect, useState, useCallback } from 'react';
import { questsDb, syncQueueDb } from '@/lib/db';
import { syncManager } from '@/lib/sync';
import type { Quest } from '@/types/models';
import { v4 as uuidv4 } from 'uuid';

export function useQuests(userId: string | undefined) {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [incompleteQuests, setIncompleteQuests] = useState<Quest[]>([]);
  const [dailyQuests, setDailyQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load quests from Dexie
  const loadQuests = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const allQuests = await questsDb.getAll(userId);
      setQuests(allQuests);

      const incomplete = await questsDb.getIncomplete(userId);
      setIncompleteQuests(incomplete);

      const daily = await questsDb.getDailyQuests(userId);
      setDailyQuests(daily);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load quests';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadQuests();
  }, [loadQuests]);

  const createQuest = useCallback(
    async (questData: Omit<Quest, 'id' | 'created_at' | 'updated_at'>) => {
      if (!userId) throw new Error('No user logged in');

      try {
        const newQuest: Quest = {
          ...questData,
          id: uuidv4(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Add to local DB
        await questsDb.put(newQuest);

        // Add to sync queue
        await syncQueueDb.add({
          action: 'create',
          table_name: 'quests',
          record_id: newQuest.id,
          payload: newQuest,
          user_id: userId,
          synced: false,
        });

        // Reload quests
        await loadQuests();

        // Trigger sync if online
        if (!syncManager.isOffline()) {
          await syncManager.syncAll();
        }

        return newQuest;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create quest';
        setError(message);
        throw err;
      }
    },
    [userId, loadQuests]
  );

  const updateQuest = useCallback(
    async (questId: string, changes: Partial<Quest>) => {
      if (!userId) throw new Error('No user logged in');

      try {
        const updatedQuest = {
          ...changes,
          updated_at: new Date().toISOString(),
        };

        // Update local DB
        await questsDb.update(questId, updatedQuest);

        // Add to sync queue
        await syncQueueDb.add({
          action: 'update',
          table_name: 'quests',
          record_id: questId,
          payload: updatedQuest,
          user_id: userId,
          synced: false,
        });

        // Reload quests
        await loadQuests();

        // Trigger sync if online
        if (!syncManager.isOffline()) {
          await syncManager.syncAll();
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update quest';
        setError(message);
        throw err;
      }
    },
    [userId, loadQuests]
  );

  const completeQuest = useCallback(
    async (questId: string) => {
      await updateQuest(questId, {
        is_completed: true,
        completed_at: new Date().toISOString(),
      });
    },
    [updateQuest]
  );

  const deleteQuest = useCallback(
    async (questId: string) => {
      if (!userId) throw new Error('No user logged in');

      try {
        // Delete from local DB
        await questsDb.delete(questId);

        // Add to sync queue
        await syncQueueDb.add({
          action: 'delete',
          table_name: 'quests',
          record_id: questId,
          payload: {},
          user_id: userId,
          synced: false,
        });

        // Reload quests
        await loadQuests();

        // Trigger sync if online
        if (!syncManager.isOffline()) {
          await syncManager.syncAll();
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete quest';
        setError(message);
        throw err;
      }
    },
    [userId, loadQuests]
  );

  return {
    quests,
    incompleteQuests,
    dailyQuests,
    loading,
    error,
    createQuest,
    updateQuest,
    completeQuest,
    deleteQuest,
    reload: loadQuests,
  };
}
