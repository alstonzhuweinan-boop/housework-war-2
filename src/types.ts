export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  familyId?: string;
}

export interface Family {
  id: string;
  name: string;
  createdAt: Date;
}

export interface Chore {
  id: string;
  familyId: string;
  name: string;
  points: number;
  icon: string;
}

export interface Record {
  id: string;
  familyId: string;
  choreId: string;
  choreName: string;
  points: number;
  userId: string;
  userName: string;
  timestamp: Date;
}
