import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { supabase, assertSupabaseConfigured } from '../supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInAs: (name: 'dd' | 'qq') => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const FAMILY_ID = 'family_dd_qq';

const defaultChores = [
  { name: '扔垃圾 🗑️', points: 2, icon: 'Trash2' },
  { name: '刷碗 🍽️', points: 5, icon: 'Utensils' },
  { name: '拖地 🧹', points: 10, icon: 'Droplets' },
  { name: '洗衣服 👕', points: 5, icon: 'Shirt' },
  { name: '铲屎 🐈', points: 5, icon: 'Cat' },
  { name: '做饭 🍳', points: 15, icon: 'ChefHat' },
];

async function ensureSeedData() {
  assertSupabaseConfigured();

  // Check if family exists
  const { data: family } = await supabase
    .from('families')
    .select('id')
    .eq('id', FAMILY_ID)
    .single();

  if (!family) {
    await supabase.from('families').insert({
      id: FAMILY_ID,
      name: '我们的家 🏡',
      created_at: new Date().toISOString(),
    });

    // Insert default chores
    for (const chore of defaultChores) {
      await supabase.from('chores').insert({
        family_id: FAMILY_ID,
        name: chore.name,
        points: chore.points,
        icon: chore.icon,
      });
    }
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session
    const stored = localStorage.getItem('housework-war:user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('housework-war:user');
      }
    }
    setLoading(false);
  }, []);

  const signInAs = async (name: 'dd' | 'qq') => {
    assertSupabaseConfigured();

    const newUser: User = {
      uid: name,
      displayName: name,
      email: `${name}@family.local`,
      photoURL: '',
      familyId: FAMILY_ID,
    };

    await ensureSeedData();
    localStorage.setItem('housework-war:user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const signOut = async () => {
    localStorage.removeItem('housework-war:user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInAs, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
