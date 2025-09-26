import type { AuthUser, UserAppData } from '../types';

const USERS_DB_KEY = 'addiction_support_users_db';
const SESSION_KEY = 'addiction_support_session';

// Helper to get the database from localStorage
const getDb = (): Record<string, any> => {
  try {
    const db = localStorage.getItem(USERS_DB_KEY);
    return db ? JSON.parse(db) : {};
  } catch (error) {
    console.error("Could not parse user DB from localStorage", error);
    return {};
  }
};

// Helper to save the database to localStorage
const saveDb = (db: Record<string, any>) => {
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
};

const defaultAppData: UserAppData = {
  selectedSubstance: null,
  userInfo: null,
  cravingLogs: [],
};

// --- Public API ---

export const mockAuthService = {
  // Signs up a new user
  signup: async (email: string, password: string): Promise<AuthUser> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const db = getDb();
        const normalizedEmail = email.toLowerCase();

        if (db[normalizedEmail]) {
          return reject(new Error('Użytkownik o tym adresie e-mail już istnieje.'));
        }

        const userId = `user_${Date.now()}`;
        db[normalizedEmail] = {
          id: userId,
          password, // In a real app, this would be hashed
          data: defaultAppData,
        };
        saveDb(db);
        
        const user: AuthUser = { id: userId, email: normalizedEmail };
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
        resolve(user);
      }, 500);
    });
  },

  // Logs in an existing user
  login: async (email: string, password: string): Promise<AuthUser> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const db = getDb();
        const normalizedEmail = email.toLowerCase();
        const userData = db[normalizedEmail];

        if (!userData || userData.password !== password) {
          return reject(new Error('Nieprawidłowy e-mail lub hasło.'));
        }
        
        const user: AuthUser = { id: userData.id, email: normalizedEmail };
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
        resolve(user);
      }, 500);
    });
  },

  // Logs out the current user
  logout: async (): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            localStorage.removeItem(SESSION_KEY);
            resolve();
        }, 200)
    });
  },

  // Checks for an existing session
  checkSession: async (): Promise<AuthUser | null> => {
     return new Promise((resolve) => {
        setTimeout(() => {
            const session = localStorage.getItem(SESSION_KEY);
            if(session){
                try {
                    resolve(JSON.parse(session));
                } catch {
                    resolve(null)
                }
            } else {
                resolve(null)
            }
        }, 200)
     });
  },

  // Loads data for a logged-in user
  loadUserData: async (user: AuthUser): Promise<UserAppData> => {
     return new Promise((resolve, reject) => {
        setTimeout(() => {
            const db = getDb();
            const userData = db[user.email];
            if (userData) {
                resolve(userData.data || defaultAppData);
            } else {
                reject(new Error('Nie znaleziono danych użytkownika.'));
            }
        }, 300);
    });
  },

  // Saves data for a logged-in user
  saveUserData: async (user: AuthUser, data: UserAppData): Promise<void> => {
     return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                const db = getDb();
                if(db[user.email]){
                    db[user.email].data = data;
                    saveDb(db);
                    resolve();
                } else {
                     reject(new Error('Nie znaleziono użytkownika do zapisu danych.'));
                }
            } catch (error) {
                 reject(error)
            }
        }, 300);
     });
  },
};