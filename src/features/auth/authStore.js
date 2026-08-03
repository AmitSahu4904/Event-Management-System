import { create } from 'zustand';
import { storageAdapter, sessionStorageAdapter } from '@/shared/utils/storageAdapter';

const ADMIN_AUTH_KEY = 'dei_v3_admin_session';
const PARTICIPANT_AUTH_KEY = 'dei_v3_participant_session';

const DEFAULT_ADMIN = {
  id: 'usr_admin',
  email: 'admin@botivate.com',
  name: 'System Admin',
  role: 'admin',
  phone: '9999999999'
};

export const useAuthStore = create((set, get) => ({
  // Admin Session (Persistent in localStorage, completely isolated)
  adminUser: storageAdapter.get(ADMIN_AUTH_KEY, DEFAULT_ADMIN),
  isAdminAuthenticated: true,

  // Participant Session (Isolated PER BROWSER TAB via sessionStorage)
  user: sessionStorageAdapter.get(PARTICIPANT_AUTH_KEY, null),
  isAuthenticated: true,
  isLoading: false,

  login: (email, password, requestedRole = 'user') => {
    set({ isLoading: true });
    const cleanEmail = email.trim().toLowerCase();
    
    // Admin login
    if (requestedRole === 'admin') {
      if (cleanEmail === 'admin@botivate.com' && password === 'Password123') {
        storageAdapter.set(ADMIN_AUTH_KEY, DEFAULT_ADMIN);
        set({ adminUser: DEFAULT_ADMIN, isAdminAuthenticated: true, isLoading: false });
        return { success: true, user: DEFAULT_ADMIN };
      }
      set({ isLoading: false });
      return { success: false, message: 'Invalid Admin credentials (Use: admin@botivate.com / Password123)' };
    }

    // User / Participant Login
    const activeUser = {
      id: `usr_${Date.now()}`,
      email: cleanEmail,
      name: cleanEmail.split('@')[0],
      role: 'user',
      phone: '9876543210'
    };

    sessionStorageAdapter.set(PARTICIPANT_AUTH_KEY, activeUser);
    set({ user: activeUser, isAuthenticated: true, isLoading: false });
    return { success: true, user: activeUser };
  },

  selfRegisterUser: (name, phone, email) => {
    const newUser = {
      id: `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      email: email || `${phone}@botivate.com`,
      name: name.trim(),
      phone: phone.trim(),
      role: 'user'
    };

    sessionStorageAdapter.set(PARTICIPANT_AUTH_KEY, newUser);
    set({ user: newUser, isAuthenticated: true });
    return { success: true, user: newUser };
  },

  logout: () => {
    storageAdapter.remove(ADMIN_AUTH_KEY);
    set({ adminUser: null, isAdminAuthenticated: false });
  },

  logoutParticipant: () => {
    sessionStorageAdapter.remove(PARTICIPANT_AUTH_KEY);
    set({ user: null });
  }
}));
