import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../components/AppLayout/AppLayout';
import { ErrorPage } from '../components/ErrorPage/ErrorPage';
import { AnalyticsPage } from '../pages/AnalyticsPage/AnalyticsPage';
import { HistoryPage } from '../pages/HistoryPage/HistoryPage';
import { GeneratorPage } from '../pages/GeneratorPage/GeneratorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <AnalyticsPage />,
      },
      {
        path: 'generator',
        element: <GeneratorPage />,
      },
      {
        path: 'history',
        element: <HistoryPage />,
      },
    ],
  },
]);

export { router };
