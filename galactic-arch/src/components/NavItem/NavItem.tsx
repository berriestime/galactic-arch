import styles from './NavItem.module.css';
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import type { ReactElement } from 'react';

type NavItemProps = {
  to: string;
  iconSrc: string;
  children: React.ReactNode;
}

const NavItem = ({ to, iconSrc, children }: NavItemProps): ReactElement => {
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: to === '/' });
  const isActive = !!match;

  return (
    <Link 
      className={`${styles.itemMenu} ${isActive ? styles.active : ''}`}
      to={to}
      aria-current={isActive ? "page" : undefined}
    >
      <img className={styles.imgMenu} src={iconSrc} alt="" aria-hidden="true" />
      <span className={styles.label}>{children}</span>
    </Link>
  );
};

export { NavItem };