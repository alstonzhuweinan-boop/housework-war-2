import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp, addDoc, collection } from 'firebase/firestore';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInAs: (name: 'dd' | 'qq') => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Always require character selection on fresh launch
    setLoading(false);
  }, []);

  const signInAs = async (name: 'dd' | 'qq') => {
    const newUser: User = {
      uid: name,
      displayName: name,
      email: `${name}@family.local`,
      photoURL: '',
      familyId: 'family_dd_qq'
    };

    try {
      const userRef = doc(db, 'users', name);
      await setDoc(userRef, newUser, { merge: true });

      const familyRef = doc(db, 'families', 'family_dd_qq');
      const familySnap = await getDoc(familyRef);
      if (!familySnap.exists()) {
        await setDoc(familyRef, {
          name: '我们的家 🏡',
          createdAt: serverTimestamp()
        });
        
        const defaultChores = [
          { name: '扔垃圾 🗑️', points: 2, icon: 'Trash2' },
          { name: '刷碗 🍽️', points: 5, icon: 'Utensils' },
          { name: '拖地 🧹', points: 10, icon: 'Droplets' },
          { name: '洗衣服 👕', points: 5, icon: 'Shirt' },
          { name: '铲屎 🐈', points: 5, icon: 'Cat' },
          { name: '做饭 🍳', points: 15, icon: 'ChefHat' },
        ];

        for (const chore of defaultChores) {
          await addDoc(collection(db, 'chores'), {
            ...chore,
            familyId: 'family_dd_qq',
          });
        }
      }
      
      setUser(newUser);
    } catch (error) {
      console.error('Error syncing initial data to Firestore:', error);
      // Fallback to local login if offline
      setUser(newUser);
    }
  };

  const signOut = async () => {
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
