import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

// 以下の２つの型は`types/app.d.ts`を経て、暗黙的に `share/store/index.ts` などで利用される : https://feature-sliced.design/docs/guides/examples/types
/* same content as in the code block before… */
// tsconfigで strict: false にするとRootStateがanyになる
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
