import { Outlet } from 'react-router-dom';
import { Header } from '../Header/Header';
import styles from './AppLayout.module.css';

const AppLayout = (): React.ReactElement => (
  <>
    <div className={styles.appLayout}>
      <Header />
      <main className={styles.appContent}>
        <Outlet />
      </main>
    </div>
  </>
);

export { AppLayout };
