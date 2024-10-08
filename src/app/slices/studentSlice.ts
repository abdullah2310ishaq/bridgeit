// src/app/slices/studentSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  userId: string;
  imageData?: string;
}

interface ProfileState {
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  userProfile: null,
  loading: false,
  error: null,
};

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await fetch('https://localhost:7053/api/auth/authorized-user-info', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      return (await response.json()) as UserProfile;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userProfile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default profileSlice.reducer; // Ensure this is the default export
