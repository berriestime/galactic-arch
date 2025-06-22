import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './variables.css';
import './App.css';

const App = (): React.ReactElement => {
  return <RouterProvider router={router} />;
};

export { App };
