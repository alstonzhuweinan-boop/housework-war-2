import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc, serverTimestamp, orderBy, limit } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { Family, Chore, Record } from '../types';
import { handleFirestoreError, OperationType } from '../utils/errorHandling';

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

export function FamilyProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [family, setFamily] = useState<Family | null>(null);
  const [chores, setChores] = useState<Chore[]>([]);
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.familyId) {
      setFamily(null);
      setChores([]);
      setRecords([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    let unsubFamily: () => void;
    let unsubChores: () => void;
    let unsubRecords: () => void;

    // Listen to family
    unsubFamily = onSnapshot(doc(db, 'families', user.familyId), (docSnap) => {
      if (docSnap.exists()) {
        setFamily({ id: docSnap.id, ...docSnap.data() } as Family);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `families/${user.familyId}`);
    });

    // Listen to chores
    const choresQuery = query(collection(db, 'chores'), where('familyId', '==', user.familyId));
    unsubChores = onSnapshot(choresQuery, (snapshot) => {
      const choresData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Chore));
      setChores(choresData);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'chores');
    });

    // Listen to records (last 100 for now)
    const recordsQuery = query(
      collection(db, 'records'), 
      where('familyId', '==', user.familyId),
      orderBy('timestamp', 'desc'),
      limit(100)
    );
    unsubRecords = onSnapshot(recordsQuery, (snapshot) => {
      const recordsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate() || new Date(),
        } as Record;
      });
      setRecords(recordsData);
      setLoading(false);
    }, (error) => {
      setLoading(false);
      handleFirestoreError(error, OperationType.GET, 'records');
    });

    return () => {
      if (unsubFamily) unsubFamily();
      if (unsubChores) unsubChores();
      if (unsubRecords) unsubRecords();
    };
  }, [user?.familyId]);

  const addChore = async (chore: Omit<Chore, 'id' | 'familyId'>) => {
    if (!user?.familyId) {
      alert('无法获取家庭ID，请刷新页面重试');
      return;
    }
    try {
      await addDoc(collection(db, 'chores'), {
        ...chore,
        familyId: user.familyId,
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'chores');
    }
  };

  const editChore = async (choreId: string, updates: Partial<Omit<Chore, 'id' | 'familyId'>>) => {
    if (!user?.familyId) return;
    try {
      const choreRef = doc(db, 'chores', choreId);
      await updateDoc(choreRef, updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `chores/${choreId}`);
    }
  };

  const deleteChore = async (choreId: string) => {
    if (!user?.familyId) return;
    try {
      const choreRef = doc(db, 'chores', choreId);
      await deleteDoc(choreRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `chores/${choreId}`);
    }
  };

  const recordChore = async (chore: Chore) => {
    if (!user?.familyId) return;
    try {
      await addDoc(collection(db, 'records'), {
        familyId: user.familyId,
        choreId: chore.id,
        choreName: chore.name,
        points: chore.points,
        userId: user.uid,
        userName: user.displayName,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'records');
    }
  };

  const deleteRecord = async (recordId: string) => {
    if (!user?.familyId) return;
    try {
      await deleteDoc(doc(db, 'records', recordId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `records/${recordId}`);
    }
  };

  return (
    <FamilyContext.Provider value={{ family, chores, records, loading, addChore, editChore, deleteChore, recordChore, deleteRecord }}>
      {children}
    </FamilyContext.Provider>
  );
}

export function useFamily() {
  const context = useContext(FamilyContext);
  if (context === undefined) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
}
