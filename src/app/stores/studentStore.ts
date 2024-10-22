import { create } from 'zustand';

// Define interfaces
interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  description: string;
  role: string;
  email: string;
  universityName: string;
  address: string;
  rollNumber: string;
  imageData: string;
  uniImage: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
}

interface OngoingProject {
  id: string;
  title: string;
  description: string;
  expertName: string;
  status: string;
  endDate: string;
}

// Zustand store interface
interface AppState {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  logoutUser: () => void;

  ongoingProjects: OngoingProject[];
  setOngoingProjects: (projects: OngoingProject[]) => void;

  completedProjects: Project[];
  setCompletedProjects: (projects: Project[]) => void;
}

// Store creation using Zustand
const studentStore = create<AppState>((set) => ({
  userProfile: null,
  setUserProfile: (profile) => set({ userProfile: profile }),
  
  ongoingProjects: [],
  setOngoingProjects: (projects) => set({ ongoingProjects: projects }),

  completedProjects: [],
  setCompletedProjects: (projects) => set({ completedProjects: projects }),

  // Logout function to clear user profile
  logoutUser: () => set({ userProfile: null }),
}));

export default studentStore;
