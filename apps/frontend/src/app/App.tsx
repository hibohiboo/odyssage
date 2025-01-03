import { Provider } from 'react-redux';
import { LoginUser } from '@odyssage/frontend/entities/auth';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <LoginUser />
    </Provider>
  );
}

export default App;
