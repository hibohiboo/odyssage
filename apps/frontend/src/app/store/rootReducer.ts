import { combineReducers, UnknownAction } from '@reduxjs/toolkit';
import { authSlice } from '@odyssage/frontend/shared/auth';

const combinedReducer = combineReducers({
  [authSlice.reducerPath]: authSlice.reducer,
});

type CombinedState = ReturnType<typeof combinedReducer>;

export const rootReducer = (
  state: CombinedState | undefined,
  action: UnknownAction,
) => combinedReducer(state, action);

export type RootReducer = typeof rootReducer;
