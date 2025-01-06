import { useMemo } from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router';
import { createRouter } from './routes';
import { store } from './store';

function App() {
  const router = useMemo(() => createRouter(), []);

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
