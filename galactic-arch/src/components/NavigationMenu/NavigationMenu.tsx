import { NavItem } from '../NavItem/NavItem';
import styles from './NavigationMenu.module.css';

type MenuItem = {
  to: string;
  iconSrc: string;
  label: string;
};

type NavigationMenuProps = {
  items: MenuItem[];
};

const NavigationMenu = ({ items }: NavigationMenuProps): React.ReactElement => (
  <nav className={styles.menu} aria-label="Основное меню">
    {items.map((item) => (
      <NavItem key={item.to} to={item.to} iconSrc={item.iconSrc}>
        {item.label}
      </NavItem>
    ))}
  </nav>
);

export { NavigationMenu };
