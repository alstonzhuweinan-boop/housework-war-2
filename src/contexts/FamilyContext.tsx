import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { Chore, Family, Record } from '../types';
import { supabase, assertSupabaseConfigured } from '../supabase';

interface FamilyContextType {
  family: Family | null;
  chores: Chore[];
  records: Record[];
  loading: boolean;
  addChore: (chore: Omit<Chore, 'id' | 'familyId'>) => Promise<void>;
  editChore: (choreId: string, updates: Partial<Omit<Chore, 'id' | 'familyId'>>) => Promise<void>;
  deleteChore: (choreId: string) => Promise<void>;
  recordChore: (chore: Chore) => Promise<void>;
  deleteRecord: (recordId: string) => Promise<void>;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

function mapFamily(row: any): Family {
  return {
    id: row.id,
    name: row.name || '我们的家 🏡',
    createdAt: new Date(row.created_at || Date.now()),
  };
}

function mapChore(row: any): Chore {
  return {
    id: row.id,
    familyId: row.family_id,
    name: row.name,
    points: Number(row.points || 0),
    icon: row.icon || 'CheckCircle',
  };
}

function mapRecord(row: any): Record {
  return {
    id: row.id,
    familyId: row.family_id,
    choreId: row.chore_id || '',
    choreName: row.chore_name || '',
    points: Number(row.points || 0),
    userId: row.user_id || '',
    userName: row.user_name || '',
    timestamp: new Date(row.timestamp || row.created_at || Date.now()),
  };
}

export function FamilyProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [family, setFamily] = useState<Family | null>(null);
  const [chores, setChores] = useState<Chore[]>([]);
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);

  const familyId = useMemo(() => user?.familyId || 'family_dd_qq', [user?.familyId]);

  const refreshAll = async () => {
    if (!user) {
      setFamily(null);
      setChores([]);
      setRecords([]);
      setLoading(false);
      return;
    }

    assertSupabaseConfigured();
    setLoading(true);

    try {
      // Fetch family
      const { data: familyData } = await supabase
        .from('families')
        .select('*')
        .eq('id', familyId)
        .single();

      if (familyData) {
        setFamily(mapFamily(familyData));
      }

      // Fetch chores
      const { data: choresData } = await supabase
        .from('chores')
        .select('*')
        .eq('family_id', familyId);

      if (choresData) {
        setChores(choresData.map(mapChore));
      }

      // Fetch records (last 100)
      const { data: recordsData } = await supabase
        .from('records')
        .select('*')
        .eq('family_id', familyId)
        .order('timestamp', { ascending: false })
        .limit(100);

      if (recordsData) {
        setRecords(recordsData.map(mapRecord));
      }
    } catch (error) {
      console.error('Failed to load data from Supabase:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      await refreshAll();
    })();

    // Set up realtime subscriptions
    if (!user) return;

    const choresChannel = supabase
      .channel('chores-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chores', filter: `family_id=eq.${familyId}` },
        () => {
          if (!cancelled) refreshAll();
        }
      )
      .subscribe();

    const recordsChannel = supabase
      .channel('records-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'records', filter: `family_id=eq.${familyId}` },
        () => {
          if (!cancelled) refreshAll();
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(choresChannel);
      supabase.removeChannel(recordsChannel);
    };
  }, [user?.uid, familyId]);

  const addChore = async (chore: Omit<Chore, 'id' | 'familyId'>) => {
    if (!user) return;
    assertSupabaseConfigured();

    const { data } = await supabase.from('chores').insert({
      family_id: familyId,
      name: chore.name,
      points: chore.points,
      icon: chore.icon,
    }).select().single();

    if (data) {
      setChores((prev) => [...prev, mapChore(data)]);
    }
  };

  const editChore = async (choreId: string, updates: Partial<Omit<Chore, 'id' | 'familyId'>>) => {
    if (!user) return;
    assertSupabaseConfigured();

    await supabase
      .from('chores')
      .update({
        name: updates.name,
        points: updates.points,
        icon: updates.icon,
      })
      .eq('id', choreId);

    setChores((prev) =>
      prev.map((item) => (item.id === choreId ? { ...item, ...updates } : item))
    );
  };

  const deleteChore = async (choreId: string) => {
    if (!user) return;
    assertSupabaseConfigured();

    await supabase.from('chores').delete().eq('id', choreId);
    setChores((prev) => prev.filter((item) => item.id !== choreId));
    setRecords((prev) => prev.filter((item) => item.choreId !== choreId));
  };

  const recordChore = async (chore: Chore) => {
    if (!user) return;
    assertSupabaseConfigured();

    const { data } = await supabase.from('records').insert({
      family_id: familyId,
      chore_id: chore.id,
      chore_name: chore.name,
      points: chore.points,
      user_id: user.uid,
      user_name: user.displayName,
      timestamp: new Date().toISOString(),
    }).select().single();

    if (data) {
      setRecords((prev) => [mapRecord(data), ...prev]);
    }
  };

  const deleteRecord = async (recordId: string) => {
    if (!user) return;
    assertSupabaseConfigured();

    await supabase.from('records').delete().eq('id', recordId);
    setRecords((prev) => prev.filter((item) => item.id !== recordId));
  };

  return (
    <FamilyContext.Provider
      value={{ family, chores, records, loading, addChore, editChore, deleteChore, recordChore, deleteRecord }}
    >
      {children}
    </FamilyContext.Provider>
  );
}

export function useFamily() {
  const context = useContext(FamilyContext);
  if (context === undefined) {
    throw new Error('useFamily must be used within an FamilyProvider');
  }
  return context;
}
