import { useEffect, useState, useCallback } from 'react';
import { supabaseAuth } from '@/lib/supabase';
import { profileDb } from '@/lib/db';
import type { Profile } from '@/types/models';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await supabaseAuth.getCurrentUser();
        setUser(currentUser);

        if (currentUser) {
          const userProfile = await profileDb.get(currentUser.id);
          setProfile(userProfile || null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Auth error');
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: authListener } = supabaseAuth.onAuthStateChange((newUser) => {
      setUser(newUser);
      if (!newUser) {
        setProfile(null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, displayName: string) => {
      try {
        setLoading(true);
        setError(null);
        await supabaseAuth.signUp(email, password, displayName);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Sign up failed';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { user: newUser } = await supabaseAuth.signIn(email, password);
      setUser(newUser);

      if (newUser) {
        const userProfile = await profileDb.get(newUser.id);
        setProfile(userProfile || null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await supabaseAuth.signOut();
      setUser(null);
      setProfile(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign out failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (changes: Partial<Profile>) => {
      if (!user) throw new Error('No user logged in');

      try {
        setLoading(true);
        await profileDb.update(user.id, changes);
        const updated = await profileDb.get(user.id);
        setProfile(updated || null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Update failed';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  return {
    user,
    profile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    updateProfile,
    isAuthenticated: !!user,
  };
}
