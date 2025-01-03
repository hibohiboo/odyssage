import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  uid: string | null;
  displayName: string | null;
}

const initialState: AuthState = {
  uid: null,
  displayName: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(
      state,
      action: PayloadAction<{ uid: string | null; displayName: string | null }>,
    ) {
      state.uid = action.payload.uid;
      state.displayName = action.payload.displayName;
    },
  },
});

export const { setUser } = authSlice.actions;

const stateSelector = (state: RootState) => state[authSlice.reducerPath];

export const userDisplayNameSelector = createSelector(
  stateSelector,
  (c) => c.displayName,
);
export const uidSelector = createSelector(stateSelector, (c) => c.uid);